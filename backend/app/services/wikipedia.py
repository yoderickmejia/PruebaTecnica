import httpx
from fastapi import HTTPException
from app.config import settings
from app.cache import get_cache, set_cache

HEADERS = {
    "User-Agent": settings.wikipedia_user_agent
}

SEARCH_TTL = 300   # 5 minutes
ARTICLE_TTL = 600  # 10 minutes


async def search_articles(query: str):
    cache_key = f"search:{query.lower().strip()}"
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "utf8": 1,
        "srlimit": 10
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.wikipedia_api_url, params=params, headers=HEADERS)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Error al conectar con Wikipedia")

    results = []
    for item in data["query"]["search"]:
        results.append({
            "id": str(item["pageid"]),
            "title": item["title"],
            "snippet": item["snippet"]
        })

    set_cache(cache_key, results, ttl=SEARCH_TTL)
    return results


async def get_article(article_id: str):
    cache_key = f"article:{article_id}"
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    params = {
        "action": "query",
        "pageids": article_id,
        "prop": "extracts|info",
        "exintro": False,
        "inprop": "url",
        "format": "json",
        "utf8": 1
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.wikipedia_api_url, params=params, headers=HEADERS)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Error al conectar con Wikipedia")

    pages = data["query"]["pages"]
    page = pages.get(article_id) or pages.get("-1")

    if not page or "missing" in page:
        raise HTTPException(status_code=404, detail="Artículo no encontrado en Wikipedia")

    result = {
        "title": page["title"],
        "content": page.get("extract", ""),
        "wikipedia_url": page.get("fullurl", "")
    }
    set_cache(cache_key, result, ttl=ARTICLE_TTL)
    return result
