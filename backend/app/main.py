from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import http_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import Base, engine
from app.limiter import limiter
import app.models  
from app.routes.search import router as search_router
from app.routes.articles import router as article_router
from app.routes.auth import router as auth_router

PREFIX = "/api/v1"

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wikipedia Knowledge Explorer", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return await http_exception_handler(request, exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(auth_router, prefix=PREFIX)
app.include_router(search_router, prefix=PREFIX)
app.include_router(article_router, prefix=PREFIX)
