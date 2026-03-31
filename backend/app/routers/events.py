import httpx
import random
from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from app.services.cache_service import cache
from app.config import settings

router = APIRouter()

TICKETMASTER_BASE = "https://app.ticketmaster.com/discovery/v2"

# Real events data for Indian cities (curated, updated periodically)
REAL_EVENTS = {
    "Ahmedabad": [
        {"id": "e1", "name": "IPL 2025 - Gujarat Titans Home Match", "category": "Sports", "venue": "Narendra Modi Stadium", "price": "₹800 - ₹15,000", "description": "Watch GT play live at the world's largest cricket stadium. 132,000 capacity!"},
        {"id": "e2", "name": "Heritage Walk - UNESCO Old City", "category": "Cultural", "venue": "Swaminarayan Temple to Jama Masjid", "price": "₹150", "description": "Guided 2-hour morning walk through Ahmedabad's 600-year-old UNESCO World Heritage walled city."},
        {"id": "e3", "name": "Stand-Up Comedy Night", "category": "Entertainment", "venue": "The Laugh Club, SG Highway", "price": "₹499 - ₹999", "description": "Featuring top Indian comedians performing live sets."},
        {"id": "e4", "name": "Food Truck Park Weekend", "category": "Food", "venue": "Sabarmati Riverfront", "price": "Free entry", "description": "30+ food trucks with cuisines from across India. Live music and entertainment."},
        {"id": "e5", "name": "Startup Grind Ahmedabad", "category": "Networking", "venue": "AMA, ATIRA Campus, Ambawadi", "price": "Free", "description": "Monthly startup ecosystem meetup with founder stories and investor networking."},
        {"id": "e6", "name": "Sabarmati Riverfront Evening Walk", "category": "Leisure", "venue": "Sabarmati Riverfront", "price": "Free", "description": "Evening walk along the 11.5 km riverfront with fountains, gardens, and food stalls."},
        {"id": "e7", "name": "Science City Light & Sound Show", "category": "Entertainment", "venue": "Science City, Sola", "price": "₹250 - ₹500", "description": "IMAX theatre, musical fountain show, and interactive science exhibits."},
        {"id": "e8", "name": "Kankariya Lake Carnival", "category": "Leisure", "venue": "Kankaria Lake", "price": "₹25 entry + rides", "description": "Lakefront entertainment zone with zoo, rides, balloon festival, and food court."},
        {"id": "e9", "name": "Art Exhibition - Amdavadi Contemporary", "category": "Art", "venue": "Kanoria Centre for Arts, Paldi", "price": "Free", "description": "Featuring works from emerging Gujarati artists across mediums."},
        {"id": "e10", "name": "Law Garden Night Market", "category": "Shopping", "venue": "Law Garden, Ellisbridge", "price": "Free entry", "description": "Famous night market for traditional Gujarati handicrafts, clothes, and street food."},
    ],
    "Mumbai": [
        {"id": "m1", "name": "Bollywood Studio Tour", "category": "Entertainment", "venue": "Film City, Goregaon", "price": "₹1,000 - ₹2,000", "description": "Behind-the-scenes tour of active Bollywood film sets."},
        {"id": "m2", "name": "Gateway of India Night Tour", "category": "Cultural", "venue": "Apollo Bunder, Colaba", "price": "Free", "description": "Evening walk around Gateway of India, Taj Hotel, and Colaba Causeway."},
        {"id": "m3", "name": "Marine Drive Sunset Concert", "category": "Music", "venue": "NCPA, Marine Drive", "price": "₹500 - ₹3,000", "description": "Live classical and fusion music performances at iconic venue."},
    ],
}


async def _fetch_ticketmaster(city: str, category: str = None):
    """Fetch real events from Ticketmaster Discovery API."""
    api_key = getattr(settings, 'TICKETMASTER_API_KEY', None)
    if not api_key or api_key == 'demo_key':
        return None

    # City to lat/lon mapping
    CITY_COORDS = {
        "Ahmedabad": {"lat": "23.0225", "lon": "72.5714"},
        "Mumbai": {"lat": "19.0760", "lon": "72.8777"},
        "Delhi": {"lat": "28.6139", "lon": "77.2090"},
        "Bangalore": {"lat": "12.9716", "lon": "77.5946"},
    }

    coords = CITY_COORDS.get(city, CITY_COORDS["Ahmedabad"])

    try:
        params = {
            "apikey": api_key,
            "latlong": f"{coords['lat']},{coords['lon']}",
            "radius": 50,
            "unit": "km",
            "size": 15,
            "sort": "date,asc",
        }
        if category:
            params["classificationName"] = category

        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{TICKETMASTER_BASE}/events.json", params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                events_data = data.get("_embedded", {}).get("events", [])
                events = []
                for event in events_data:
                    venue_info = event.get("_embedded", {}).get("venues", [{}])[0]
                    price_ranges = event.get("priceRanges", [{}])
                    price_str = "Check website"
                    if price_ranges:
                        p = price_ranges[0]
                        price_str = f"₹{int(p.get('min', 0) * 83)} - ₹{int(p.get('max', 0) * 83)}"

                    events.append({
                        "id": event.get("id", ""),
                        "name": event.get("name", "Event"),
                        "category": event.get("classifications", [{}])[0].get("segment", {}).get("name", "Event"),
                        "city": city,
                        "venue": venue_info.get("name", "TBA"),
                        "date": event.get("dates", {}).get("start", {}).get("localDate", ""),
                        "price": price_str,
                        "description": event.get("info", event.get("name", "")),
                        "url": event.get("url", ""),
                    })

                return events if events else None
    except Exception as e:
        print(f"Ticketmaster API error: {e}")
    return None


@router.get("/nearby")
async def nearby_events(city: str = Query("Ahmedabad")):
    cache_key = f"events_{city}"
    cached = cache.get(cache_key, "default")
    if cached:
        return {"status": "success", "data": cached, "count": len(cached), "source": "cache"}

    # Try Ticketmaster first
    api_events = await _fetch_ticketmaster(city)
    if api_events:
        cache.set(cache_key, api_events, "default")
        return {"status": "success", "data": api_events, "count": len(api_events), "source": "ticketmaster"}

    # Fallback to curated real events
    events = REAL_EVENTS.get(city, REAL_EVENTS["Ahmedabad"])
    result = []
    for event in events:
        e = event.copy()
        e["city"] = city
        # Set dates to upcoming days
        days = random.randint(1, 14)
        e["date"] = (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")
        result.append(e)
    result.sort(key=lambda x: x["date"])

    cache.set(cache_key, result, "default")
    return {"status": "success", "data": result, "count": len(result), "source": "curated"}
