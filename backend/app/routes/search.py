from fastapi import APIRouter, HTTPException
from app.services.wikipedia import search_articles

router = APIRouter(tags=["Search"])

@router.get("/search")
async def search(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query no puede estar vacío")
    
    results = await search_articles(q)
    return results