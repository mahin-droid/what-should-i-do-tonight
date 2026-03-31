import httpx
from app.services.cache_service import cache

# Open-Meteo geocoding + weather API - completely free, no key needed
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

# WMO Weather interpretation codes
WMO_CODES = {
    0: {"condition": "Clear", "icon": "01d", "description": "clear sky"},
    1: {"condition": "Mainly Clear", "icon": "02d", "description": "mainly clear"},
    2: {"condition": "Partly Cloudy", "icon": "03d", "description": "partly cloudy"},
    3: {"condition": "Overcast", "icon": "04d", "description": "overcast"},
    45: {"condition": "Fog", "icon": "50d", "description": "fog"},
    48: {"condition": "Rime Fog", "icon": "50d", "description": "depositing rime fog"},
    51: {"condition": "Light Drizzle", "icon": "09d", "description": "light drizzle"},
    53: {"condition": "Drizzle", "icon": "09d", "description": "moderate drizzle"},
    55: {"condition": "Dense Drizzle", "icon": "09d", "description": "dense drizzle"},
    61: {"condition": "Light Rain", "icon": "10d", "description": "slight rain"},
    63: {"condition": "Rain", "icon": "10d", "description": "moderate rain"},
    65: {"condition": "Heavy Rain", "icon": "10d", "description": "heavy rain"},
    71: {"condition": "Light Snow", "icon": "13d", "description": "slight snow fall"},
    73: {"condition": "Snow", "icon": "13d", "description": "moderate snow fall"},
    75: {"condition": "Heavy Snow", "icon": "13d", "description": "heavy snow fall"},
    80: {"condition": "Light Showers", "icon": "09d", "description": "slight rain showers"},
    81: {"condition": "Showers", "icon": "09d", "description": "moderate rain showers"},
    82: {"condition": "Heavy Showers", "icon": "09d", "description": "violent rain showers"},
    85: {"condition": "Snow Showers", "icon": "13d", "description": "slight snow showers"},
    86: {"condition": "Heavy Snow Showers", "icon": "13d", "description": "heavy snow showers"},
    95: {"condition": "Thunderstorm", "icon": "11d", "description": "thunderstorm"},
    96: {"condition": "Thunderstorm + Hail", "icon": "11d", "description": "thunderstorm with slight hail"},
    99: {"condition": "Thunderstorm + Heavy Hail", "icon": "11d", "description": "thunderstorm with heavy hail"},
}

async def _geocode(city: str):
    """Get latitude and longitude for a city using Open-Meteo geocoding."""
    cached = cache.get(f"geo_{city}", "weather")
    if cached:
        return cached

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(GEOCODING_URL, params={"name": city, "count": 1, "language": "en"}, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("results"):
                    result = data["results"][0]
                    geo = {"lat": result["latitude"], "lon": result["longitude"], "name": result.get("name", city)}
                    cache.set(f"geo_{city}", geo, "weather")
                    return geo
    except Exception:
        pass

    # Fallback coordinates for Indian cities
    FALLBACK = {
        "ahmedabad": {"lat": 23.0225, "lon": 72.5714, "name": "Ahmedabad"},
        "mumbai": {"lat": 19.0760, "lon": 72.8777, "name": "Mumbai"},
        "delhi": {"lat": 28.6139, "lon": 77.2090, "name": "Delhi"},
        "bangalore": {"lat": 12.9716, "lon": 77.5946, "name": "Bangalore"},
        "chennai": {"lat": 13.0827, "lon": 80.2707, "name": "Chennai"},
        "kolkata": {"lat": 22.5726, "lon": 88.3639, "name": "Kolkata"},
        "pune": {"lat": 18.5204, "lon": 73.8567, "name": "Pune"},
        "jaipur": {"lat": 26.9124, "lon": 75.7873, "name": "Jaipur"},
        "hyderabad": {"lat": 17.3850, "lon": 78.4867, "name": "Hyderabad"},
        "goa": {"lat": 15.2993, "lon": 74.1240, "name": "Goa"},
    }
    return FALLBACK.get(city.lower(), {"lat": 23.0225, "lon": 72.5714, "name": city})


def _parse_weather_code(code: int):
    return WMO_CODES.get(code, {"condition": "Unknown", "icon": "03d", "description": "unknown"})


async def get_current_weather(city: str = "Ahmedabad"):
    cached = cache.get(f"weather_{city}", "weather")
    if cached:
        return cached

    try:
        geo = await _geocode(city)
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                WEATHER_URL,
                params={
                    "latitude": geo["lat"],
                    "longitude": geo["lon"],
                    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                    "timezone": "auto",
                },
                timeout=10,
            )
            if resp.status_code == 200:
                data = resp.json()
                current = data["current"]
                weather_info = _parse_weather_code(current.get("weather_code", 0))
                result = {
                    "city": geo["name"],
                    "temperature": current["temperature_2m"],
                    "feels_like": current["apparent_temperature"],
                    "humidity": current["relative_humidity_2m"],
                    "condition": weather_info["condition"],
                    "icon": weather_info["icon"],
                    "wind_speed": current["wind_speed_10m"],
                    "description": weather_info["description"],
                }
                cache.set(f"weather_{city}", result, "weather")
                return result
    except Exception as e:
        print(f"Weather API error: {e}")

    return {
        "city": city, "temperature": 0, "feels_like": 0, "humidity": 0,
        "condition": "Unavailable", "icon": "03d", "wind_speed": 0, "description": "Data unavailable",
    }


async def get_forecast(city: str = "Ahmedabad"):
    cached = cache.get(f"forecast_{city}", "weather")
    if cached:
        return cached

    try:
        geo = await _geocode(city)
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                WEATHER_URL,
                params={
                    "latitude": geo["lat"],
                    "longitude": geo["lon"],
                    "hourly": "temperature_2m,weather_code,relative_humidity_2m",
                    "forecast_days": 2,
                    "timezone": "auto",
                },
                timeout=10,
            )
            if resp.status_code == 200:
                data = resp.json()
                hourly = data["hourly"]
                forecasts = []
                # Get next 8 time slots (every 3 hours)
                for i in range(0, min(24, len(hourly["time"])), 3):
                    weather_info = _parse_weather_code(hourly["weather_code"][i])
                    forecasts.append({
                        "datetime": hourly["time"][i],
                        "temperature": hourly["temperature_2m"][i],
                        "condition": weather_info["condition"],
                        "icon": weather_info["icon"],
                        "humidity": hourly["relative_humidity_2m"][i],
                    })
                result = {"city": geo["name"], "forecasts": forecasts[:8]}
                cache.set(f"forecast_{city}", result, "weather")
                return result
    except Exception as e:
        print(f"Forecast API error: {e}")

    return {"city": city, "forecasts": []}
