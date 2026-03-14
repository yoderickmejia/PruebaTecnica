from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.article import SavedArticle
from app.schemas.article import SavedArticleCreate, SavedArticleResponse
from app.services.wikipedia import get_article
from app.services.text import analyze_text
from app.utils.utils import get_current_user
from app.models.user import User
from app.schemas.article import ArticleDetailResponse
from app.tasks.article_tasks import enrich_saved_article

router = APIRouter(tags=["Articles"])

@router.get("/articles/{article_id}", response_model=ArticleDetailResponse)
async def get_article_detail(article_id: str, current_user: User = Depends(get_current_user)):
    article = await get_article(article_id)
    analysis = analyze_text(article["content"])

    return {
        "title": article["title"],
        "summary": analysis["summary"],
        "word_count": analysis["word_count"],
        "top_words": analysis["top_words"],
        "wikipedia_url": article["wikipedia_url"]
    }

@router.post("/saved_articles", response_model=SavedArticleResponse)
def save_article(article: SavedArticleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_article = SavedArticle(
        title=article.title,
        wikipedia_id=article.wikipedia_id,
        url=article.url,
        summary=article.summary,
        user_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)

    enrich_saved_article.delay(db_article.id)

    return db_article

@router.get("/saved_articles", response_model=list[SavedArticleResponse])
def list_articles(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SavedArticle).filter(SavedArticle.user_id == current_user.id).offset(skip).limit(limit).all()

@router.delete("/saved_articles/{id}")
def delete_article(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    article = db.query(SavedArticle).filter(
        SavedArticle.id == id,
        SavedArticle.user_id == current_user.id
    ).first()
    if not article:
        raise HTTPException(status_code=404, detail="Artículo no encontrado")
    db.delete(article)
    db.commit()
    return {"message": "Artículo eliminado"}