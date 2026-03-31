from fastapi import APIRouter, Query
from app.services.tmdb_service import get_trending, search_entertainment, get_mood_recommendations
from app.services.spotify_service import get_mood_playlist

router = APIRouter()

@router.get("/trending")
async def trending():
    data = await get_trending()
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/search")
async def search(q: str = Query(..., min_length=1)):
    data = await search_entertainment(q)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/recommendations")
async def mood_recommendations(mood: str = Query("chill")):
    entertainment = await get_mood_recommendations(mood)
    music = await get_mood_playlist(mood)
    return {"status": "success", "entertainment": entertainment, "music": music}
