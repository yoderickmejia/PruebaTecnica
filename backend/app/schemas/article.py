from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class SavedArticleCreate(BaseModel):
    title: str
    wikipedia_id: str
    url: str
    summary: Optional[str] = None

class SavedArticleResponse(SavedArticleCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleDetailResponse(BaseModel):
    title: str
    summary: str
    word_count: int
    top_words: List[str]
    wikipedia_url: str


