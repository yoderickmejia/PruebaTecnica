import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException

from app.services.wikipedia import search_articles, get_article


def make_mock_client(json_data):
    mock_response = MagicMock()
    mock_response.json.return_value = json_data
    mock_response.raise_for_status = MagicMock()

    mock_client = MagicMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=False)
    mock_client.get = AsyncMock(return_value=mock_response)
    return mock_client


@pytest.mark.asyncio
async def test_search_articles_returns_results():
    mock_data = {
        "query": {
            "search": [
                {"pageid": 123, "title": "Python", "snippet": "A programming language"},
                {"pageid": 456, "title": "Python (snake)", "snippet": "A reptile"},
            ]
        }
    }
    with patch("httpx.AsyncClient", return_value=make_mock_client(mock_data)):
        results = await search_articles("python")
    assert len(results) == 2
    assert results[0]["title"] == "Python"
    assert results[0]["id"] == "123"


@pytest.mark.asyncio
async def test_search_articles_empty_results():
    mock_data = {"query": {"search": []}}
    with patch("httpx.AsyncClient", return_value=make_mock_client(mock_data)):
        results = await search_articles("xyznotfound")
    assert results == []


@pytest.mark.asyncio
async def test_get_article_success():
    mock_data = {
        "query": {
            "pages": {
                "123": {
                    "title": "Python",
                    "extract": "Python is a high-level language.",
                    "fullurl": "https://en.wikipedia.org/wiki/Python"
                }
            }
        }
    }
    with patch("httpx.AsyncClient", return_value=make_mock_client(mock_data)):
        result = await get_article("123")
    assert result["title"] == "Python"
    assert result["content"] == "Python is a high-level language."
    assert "wikipedia.org" in result["wikipedia_url"]


@pytest.mark.asyncio
async def test_get_article_not_found():
    mock_data = {
        "query": {
            "pages": {
                "-1": {"missing": True, "title": ""}
            }
        }
    }
    with patch("httpx.AsyncClient", return_value=make_mock_client(mock_data)):
        with pytest.raises(HTTPException) as exc_info:
            await get_article("99999")
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_search_articles_wikipedia_down():
    import httpx
    mock_client = MagicMock()
    mock_client.__aenter__ = AsyncMock(side_effect=httpx.ConnectError("connection refused"))
    mock_client.__aexit__ = AsyncMock(return_value=False)

    with patch("httpx.AsyncClient", return_value=mock_client):
        with pytest.raises(HTTPException) as exc_info:
            await search_articles("python")
    assert exc_info.value.status_code == 503
