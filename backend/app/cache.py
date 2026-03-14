import json
import logging

import redis

from app.config import settings

logger = logging.getLogger(__name__)

_client: redis.Redis | None = None


def get_redis() -> redis.Redis | None:
    global _client
    if _client is None:
        try:
            # rediss:// (SSL) is used by Azure Redis Cache
            ssl = settings.redis_url.startswith("rediss://")
            _client = redis.from_url(
                settings.redis_url,
                decode_responses=True,
                ssl_cert_reqs=None if ssl else None,
            )
            _client.ping()
        except Exception as e:
            logger.warning("Redis not available: %s", e)
            _client = None
    return _client


def get_cache(key: str):
    client = get_redis()
    if client is None:
        return None
    try:
        value = client.get(key)
        return json.loads(value) if value else None
    except Exception as e:
        logger.warning("Cache get error for key %s: %s", key, e)
        return None


def set_cache(key: str, value, ttl: int = 300):
    client = get_redis()
    if client is None:
        return
    try:
        client.setex(key, ttl, json.dumps(value))
    except Exception as e:
        logger.warning("Cache set error for key %s: %s", key, e)


def delete_cache(key: str):
    client = get_redis()
    if client is None:
        return
    try:
        client.delete(key)
    except Exception as e:
        logger.warning("Cache delete error for key %s: %s", key, e)
