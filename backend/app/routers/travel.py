from fastapi import APIRouter, Query
from app.services.travel_service import get_travel_deals, get_mood_travel

router = APIRouter()

@router.get("/deals")
async def deals(from_city: str = Query("Ahmedabad"), budget: str = Query(None)):
    data = await get_travel_deals(from_city, budget)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/suggestions")
async def suggestions(mood: str = Query("chill")):
    data = await get_mood_travel(mood)
    return {"status": "success", "data": data, "count": len(data)}
