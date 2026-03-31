from fastapi import APIRouter, Query
from app.ai.recommendation_engine import get_recommendations

router = APIRouter()

@router.get("")
async def recommend(
    mood: str = Query("chill"),
    weather: str = Query(None),
    time: str = Query(None),
    budget: str = Query(None),
    city: str = Query("Ahmedabad"),
):
    result = await get_recommendations(mood, weather, time, budget, city)
    return {"status": "success", "data": result}
