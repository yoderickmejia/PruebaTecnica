from celery import Celery

from app.config import settings


_ssl = settings.redis_url.startswith("rediss://")
_broker_transport_opts = {"ssl_cert_reqs": None} if _ssl else {}

celery_app = Celery(
    "wikipedia_worker",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.article_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    broker_transport_options=_broker_transport_opts,
    redis_backend_transport_options=_broker_transport_opts,
)
