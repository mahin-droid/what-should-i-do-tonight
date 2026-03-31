from fastapi import APIRouter, Query
from app.services.weather_service import get_current_weather, get_forecast

router = APIRouter()

@router.get("/current")
async def current(city: str = Query("Ahmedabad")):
    data = await get_current_weather(city)
    return {"status": "success", "data": data}

@router.get("/forecast")
async def forecast(city: str = Query("Ahmedabad")):
    data = await get_forecast(city)
    return {"status": "success", "data": data}
