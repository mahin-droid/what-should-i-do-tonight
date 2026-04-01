import httpx
import random
from datetime import datetime, timedelta
from app.services.cache_service import cache
from app.config import settings

AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"
AMADEUS_FLIGHTS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers"
AMADEUS_ACTIVITIES_URL = "https://test.api.amadeus.com/v1/shopping/activities"

# Real IATA codes for Indian cities
CITY_IATA = {
    "Ahmedabad": "AMD", "Mumbai": "BOM", "Delhi": "DEL", "Bangalore": "BLR",
    "Chennai": "MAA", "Kolkata": "CCU", "Pune": "PNQ", "Jaipur": "JAI",
    "Hyderabad": "HYD", "Goa": "GOI", "Udaipur": "UDR", "Kochi": "COK",
    "Lucknow": "LKO", "Varanasi": "VNS", "Srinagar": "SXR",
}

# Real destination data with accurate details
DESTINATIONS_FROM_AHMEDABAD = [
    {
        "destination": "Udaipur", "distance_km": 260, "transport_options": ["Bus (₹400-800)", "Car (5 hrs)", "Train (₹300-1200)"],
        "best_time": "October - March", "category": "heritage",
        "highlights": ["Lake Pichola boat ride", "City Palace (₹300 entry)", "Sajjangarh Monsoon Palace", "Jagdish Temple", "Fateh Sagar Lake"],
        "budget_range": "₹3,000 - ₹8,000 per person (2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,500-4,000/night", "food_avg": "₹500-1,000/day"},
    },
    {
        "destination": "Mount Abu", "distance_km": 220, "transport_options": ["Bus (₹350-600)", "Car (4 hrs)"],
        "best_time": "November - February", "category": "hill_station",
        "highlights": ["Nakki Lake boating", "Dilwara Jain Temples", "Sunset Point", "Guru Shikhar (highest peak)", "Wildlife Sanctuary"],
        "budget_range": "₹2,500 - ₹6,000 per person (2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,200-3,500/night", "food_avg": "₹400-800/day"},
    },
    {
        "destination": "Goa", "distance_km": 950, "transport_options": ["Flight (₹3,000-7,000)", "Train (₹800-2,500, 12 hrs)", "Bus (₹800-1,500)"],
        "best_time": "November - February", "category": "beach",
        "highlights": ["Baga Beach", "Basilica of Bom Jesus (UNESCO)", "Dudhsagar Falls", "Fort Aguada", "Night markets at Arpora"],
        "budget_range": "₹5,000 - ₹15,000 per person (3 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,500-6,000/night", "food_avg": "₹600-1,500/day"},
    },
    {
        "destination": "Kutch (Rann of Kutch)", "distance_km": 400, "transport_options": ["Bus (₹500-900)", "Car (6 hrs)", "Train to Bhuj (₹400-1,500)"],
        "best_time": "November - February (Rann Utsav)", "category": "desert",
        "highlights": ["White Rann full-moon experience", "Kalo Dungar viewpoint", "Kutch Museum", "Aina Mahal", "Local handicraft villages"],
        "budget_range": "₹3,000 - ₹7,000 per person (2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,000-3,000/night", "food_avg": "₹400-700/day"},
    },
    {
        "destination": "Diu", "distance_km": 370, "transport_options": ["Bus (₹400-700)", "Car (6 hrs)"],
        "best_time": "October - May", "category": "beach",
        "highlights": ["Nagoa Beach", "Diu Fort (Portuguese era)", "Gangeshwar Temple", "INS Khukri Memorial", "Naida Caves"],
        "budget_range": "₹2,000 - ₹5,000 per person (2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹800-2,500/night", "food_avg": "₹400-800/day"},
    },
    {
        "destination": "Statue of Unity (Kevadia)", "distance_km": 200, "transport_options": ["Bus (₹300-500)", "Car (3.5 hrs)", "Train to Kevadia"],
        "best_time": "October - March", "category": "landmark",
        "highlights": ["Statue of Unity (₹350 entry)", "Valley of Flowers", "Sardar Sarovar Dam", "Jungle Safari (₹200)", "Unity Glow Garden"],
        "budget_range": "₹2,000 - ₹5,000 per person (1-2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,500-4,000/night", "food_avg": "₹400-700/day"},
    },
    {
        "destination": "Jaipur", "distance_km": 670, "transport_options": ["Train (₹500-2,000, 9 hrs)", "Flight (₹3,000-6,000)", "Bus (₹700-1,200)"],
        "best_time": "October - March", "category": "heritage",
        "highlights": ["Amber Fort (₹500)", "Hawa Mahal", "City Palace", "Jantar Mantar (UNESCO)", "Nahargarh Fort sunset"],
        "budget_range": "₹4,000 - ₹10,000 per person (2-3 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,500-5,000/night", "food_avg": "₹500-1,000/day"},
    },
    {
        "destination": "Mumbai", "distance_km": 530, "transport_options": ["Train (₹500-1,800, 7 hrs)", "Flight (₹2,500-6,000)", "Bus (₹600-1,200)"],
        "best_time": "November - February", "category": "city",
        "highlights": ["Gateway of India", "Marine Drive sunset", "Elephanta Caves (UNESCO)", "Crawford Market", "Dharavi street food trail"],
        "budget_range": "₹3,000 - ₹12,000 per person (2-3 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹2,000-7,000/night", "food_avg": "₹600-1,500/day"},
    },
    {
        "destination": "Dwarka & Somnath", "distance_km": 440, "transport_options": ["Bus (₹500-800)", "Car (7 hrs)", "Train (₹400-1,500)"],
        "best_time": "October - March", "category": "pilgrimage",
        "highlights": ["Dwarkadhish Temple", "Somnath Temple (light show ₹25)", "Bet Dwarka", "Nageshwar Jyotirlinga", "Rukmini Devi Temple"],
        "budget_range": "₹3,000 - ₹7,000 per person (2-3 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹800-2,500/night", "food_avg": "₹350-600/day"},
    },
    {
        "destination": "Saputara", "distance_km": 400, "transport_options": ["Bus (₹400-600)", "Car (6 hrs)"],
        "best_time": "Monsoon (Jul-Sep) & Winter (Oct-Feb)", "category": "hill_station",
        "highlights": ["Saputara Lake boating", "Sunset Point", "Artist Village", "Gira Waterfalls (monsoon)", "Table Top Point"],
        "budget_range": "₹2,000 - ₹5,000 per person (2 days)",
        "image_url": None,
        "real_info": {"avg_hotel": "₹1,000-3,000/night", "food_avg": "₹350-600/day"},
    },
]

MOOD_TRAVEL_MAP = {
    "chill": ["hill_station", "beach"],
    "excited": ["city", "heritage", "desert"],
    "bored": ["beach", "city", "landmark"],
    "social": ["city", "beach"],
    "romantic": ["hill_station", "beach", "heritage"],
    "hungry": ["city"],
}


async def _get_amadeus_token():
    """Get OAuth token from Amadeus test API."""
    client_id = getattr(settings, 'AMADEUS_CLIENT_ID', None)
    client_secret = getattr(settings, 'AMADEUS_CLIENT_SECRET', None)
    if not client_id or client_id == 'demo_key':
        return None

    cached_token = cache.get("amadeus_token", "travel")
    if cached_token:
        return cached_token

    try:
        async with httpx.AsyncClient(verify=False) as client:
            resp = await client.post(
                AMADEUS_AUTH_URL,
                data={"grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret},
                timeout=10,
            )
            if resp.status_code == 200:
                token = resp.json().get("access_token")
                cache.set("amadeus_token", token, "travel")
                return token
    except Exception as e:
        print(f"Amadeus auth error: {e}")
    return None


async def get_flight_prices(from_city: str = "Ahmedabad", to_city: str = "Goa", date: str = None):
    """Get real flight prices from Amadeus test API."""
    token = await _get_amadeus_token()
    if not token:
        return None

    origin = CITY_IATA.get(from_city, "AMD")
    destination = CITY_IATA.get(to_city, "GOI")
    travel_date = date or (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")

    try:
        async with httpx.AsyncClient(verify=False) as client:
            resp = await client.get(
                AMADEUS_FLIGHTS_URL,
                headers={"Authorization": f"Bearer {token}"},
                params={
                    "originLocationCode": origin,
                    "destinationLocationCode": destination,
                    "departureDate": travel_date,
                    "adults": 1,
                    "max": 5,
                    "currencyCode": "INR",
                },
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                flights = []
                for offer in data.get("data", []):
                    price = offer.get("price", {})
                    itinerary = offer.get("itineraries", [{}])[0]
                    segments = itinerary.get("segments", [])
                    flights.append({
                        "price": f"₹{price.get('total', 'N/A')}",
                        "currency": price.get("currency", "INR"),
                        "airline": segments[0].get("carrierCode", "N/A") if segments else "N/A",
                        "departure": segments[0].get("departure", {}).get("at", "") if segments else "",
                        "arrival": segments[-1].get("arrival", {}).get("at", "") if segments else "",
                        "duration": itinerary.get("duration", "N/A"),
                        "stops": len(segments) - 1,
                    })
                return flights
    except Exception as e:
        print(f"Amadeus flights error: {e}")
    return None


async def get_travel_deals(from_city: str = "Ahmedabad", budget: str = None):
    cache_key = f"travel_{from_city}_{budget}"
    cached = cache.get(cache_key, "travel")
    if cached:
        return cached

    destinations = [d.copy() for d in DESTINATIONS_FROM_AHMEDABAD]

    # Try to get real flight prices for each destination
    for dest in destinations:
        flights = await get_flight_prices(from_city, dest["destination"])
        if flights:
            dest["real_flights"] = flights
            dest["cheapest_flight"] = flights[0]["price"] if flights else None

    if budget:
        budget_val = {"low": 5000, "medium": 8000, "high": 15000}.get(budget.lower(), 10000)
        destinations = [d for d in destinations if int(d["budget_range"].split("-")[0].replace("₹", "").replace(",", "").strip()) <= budget_val]

    cache.set(cache_key, destinations, "travel")
    return destinations


async def get_mood_travel(mood: str):
    categories = MOOD_TRAVEL_MAP.get(mood.lower(), ["beach", "city"])
    destinations = [d.copy() for d in DESTINATIONS_FROM_AHMEDABAD if d.get("category") in categories]
    if not destinations:
        destinations = [d.copy() for d in DESTINATIONS_FROM_AHMEDABAD[:5]]
    return destinations
