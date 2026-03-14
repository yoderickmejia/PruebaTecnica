import asyncio
import logging

from app.worker import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="enrich_saved_article", bind=True, max_retries=3)
def enrich_saved_article(self, db_article_id: int):
    """
    Fetches full Wikipedia content for a saved article and updates its summary
    with a richer analysis-based version.
    """
    from app.database import SessionLocal
    from app.models.article import SavedArticle
    from app.services.wikipedia import get_article
    from app.services.text import analyze_text
    from fastapi import HTTPException

    db = SessionLocal()
    try:
        article = db.query(SavedArticle).filter(SavedArticle.id == db_article_id).first()
        if not article:
            logger.warning("SavedArticle %s not found, skipping enrichment", db_article_id)
            return

        wiki_data = asyncio.run(get_article(article.wikipedia_id))
        analysis = analyze_text(wiki_data["content"])

        article.summary = analysis["summary"]
        db.commit()
        logger.info("Enriched article %s (saved_id=%s)", article.title, db_article_id)

    except HTTPException as exc:
        logger.warning(
            "Wikipedia error enriching article %s: %s", db_article_id, exc.detail
        )
    except Exception as exc:
        logger.error("Unexpected error enriching article %s: %s", db_article_id, exc)
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()
