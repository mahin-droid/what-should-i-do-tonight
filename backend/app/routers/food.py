from fastapi import APIRouter, Query
from app.services.food_service import get_nearby_restaurants, get_trending_cuisines

router = APIRouter()

@router.get("/nearby")
async def nearby(lat: float = Query(23.0225), lon: float = Query(72.5714), mood: str = Query(None), city: str = Query("Ahmedabad")):
    data = await get_nearby_restaurants(lat, lon, mood, city)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/trending")
async def trending(city: str = Query("Ahmedabad")):
    data = await get_trending_cuisines(city)
    return {"status": "success", "data": data}
