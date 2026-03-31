import random
from datetime import datetime
from app.utils.helpers import get_time_of_day, get_day_type
from app.services.tmdb_service import get_mood_recommendations
from app.services.food_service import get_nearby_restaurants
from app.services.travel_service import get_mood_travel
from app.services.sports_service import get_live_matches

MOOD_WEIGHTS = {
    "chill": {"entertainment": 0.35, "food": 0.25, "music": 0.20, "travel": 0.10, "events": 0.10},
    "excited": {"entertainment": 0.20, "sports": 0.30, "food": 0.20, "events": 0.20, "travel": 0.10},
    "bored": {"entertainment": 0.30, "food": 0.20, "events": 0.25, "sports": 0.15, "travel": 0.10},
    "social": {"events": 0.30, "food": 0.30, "entertainment": 0.20, "sports": 0.10, "travel": 0.10},
    "romantic": {"food": 0.30, "entertainment": 0.25, "travel": 0.20, "music": 0.15, "events": 0.10},
    "hungry": {"food": 0.50, "entertainment": 0.20, "events": 0.15, "music": 0.10, "travel": 0.05},
}

WEATHER_ADJUSTMENTS = {
    "Rain": {"entertainment": 0.15, "food": 0.05, "travel": -0.15, "events": -0.10, "sports": 0.05},
    "Thunderstorm": {"entertainment": 0.20, "food": 0.10, "travel": -0.20, "events": -0.15, "sports": -0.05},
    "Clear": {"travel": 0.10, "events": 0.10, "food": -0.05, "entertainment": -0.10, "sports": 0.05},
    "Clouds": {"entertainment": 0.05, "food": 0.05},
    "Haze": {"entertainment": 0.10, "travel": -0.10, "events": -0.05},
}

TIME_ADJUSTMENTS = {
    "morning": {"travel": 0.15, "food": 0.10, "entertainment": -0.10},
    "afternoon": {"food": 0.10, "entertainment": 0.05, "events": 0.05},
    "evening": {"entertainment": 0.10, "food": 0.10, "events": 0.10, "sports": 0.10},
    "night": {"entertainment": 0.20, "food": 0.15, "travel": -0.15, "events": -0.10},
}

def _calculate_scores(mood, weather, time_of_day, day_type):
    base = MOOD_WEIGHTS.get(mood.lower(), MOOD_WEIGHTS["chill"]).copy()

    # Weather adjustments
    if weather:
        adjustments = WEATHER_ADJUSTMENTS.get(weather, {})
        for cat, adj in adjustments.items():
            if cat in base:
                base[cat] = max(0, min(1, base[cat] + adj))

    # Time adjustments
    time_adj = TIME_ADJUSTMENTS.get(time_of_day, {})
    for cat, adj in time_adj.items():
        if cat in base:
            base[cat] = max(0, min(1, base[cat] + adj))

    # Weekend boost
    if day_type == "weekend":
        for cat in ["travel", "events", "food"]:
            if cat in base:
                base[cat] = min(1, base[cat] + 0.10)

    # Normalize
    total = sum(base.values())
    if total > 0:
        base = {k: round(v / total, 3) for k, v in base.items()}

    return base

async def get_recommendations(mood: str, weather: str = None, time: str = None, budget: str = None, city: str = "Ahmedabad"):
    time_of_day = time or get_time_of_day()
    day_type = get_day_type()

    scores = _calculate_scores(mood, weather, time_of_day, day_type)
    sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    steps = []
    step_num = 1

    # Get live sports to check if there are matches
    live_sports = await get_live_matches()
    has_live_sports = len(live_sports) > 0

    for category, score in sorted_categories[:4]:
        if score < 0.05:
            continue

        if category == "entertainment":
            items = await get_mood_recommendations(mood)
            if items:
                top = items[0]
                steps.append({
                    "step": step_num,
                    "category": "entertainment",
                    "title": f"Watch: {top['title']}",
                    "description": top.get("overview", "Trending entertainment pick for your mood."),
                    "details": {"rating": top["rating"], "type": top["type"], "genres": top.get("genres", [])},
                    "confidence": round(score * 100),
                })
                step_num += 1

        elif category == "food":
            restaurants = await get_nearby_restaurants(mood=mood, city=city)
            if restaurants:
                top = restaurants[0]
                price_text = "₹" * top.get("price_level", 2)
                steps.append({
                    "step": step_num,
                    "category": "food",
                    "title": f"Eat at: {top['name']}",
                    "description": top.get("top_review", f"Great {', '.join(top.get('cuisine', []))} restaurant."),
                    "details": {"rating": top["rating"], "cuisine": top.get("cuisine", []), "price": price_text},
                    "confidence": round(score * 100),
                })
                step_num += 1

        elif category == "sports" and has_live_sports:
            match = live_sports[0]
            teams = " vs ".join(match["teams"])
            steps.append({
                "step": step_num,
                "category": "sports",
                "title": f"Watch Live: {teams}",
                "description": f"{match['league']} - Excitement Score: {match['excitement_score']}/100",
                "details": {"sport": match["sport"], "venue": match.get("venue"), "score": match.get("score")},
                "confidence": round(score * 100),
            })
            step_num += 1

        elif category == "travel":
            destinations = await get_mood_travel(mood)
            if destinations:
                top = destinations[0]
                steps.append({
                    "step": step_num,
                    "category": "travel",
                    "title": f"Plan a trip to: {top['destination']}",
                    "description": f"Budget: {top['budget_range']} | Highlights: {', '.join(top['highlights'][:3])}",
                    "details": {"distance": top["distance_km"], "transport": top["transport_options"]},
                    "confidence": round(score * 100),
                })
                step_num += 1

        elif category == "events":
            steps.append({
                "step": step_num,
                "category": "events",
                "title": "Check out local events",
                "description": f"Explore what's happening in {city} tonight!",
                "details": {},
                "confidence": round(score * 100),
            })
            step_num += 1

        elif category == "music":
            steps.append({
                "step": step_num,
                "category": "music",
                "title": f"Listen to: {mood.capitalize()} Vibes Playlist",
                "description": f"Curated {mood} music to match your mood tonight.",
                "details": {"mood": mood},
                "confidence": round(score * 100),
            })
            step_num += 1

    plan_titles = {
        "chill": "Your Chill Night Plan",
        "excited": "Your Action-Packed Evening",
        "bored": "Beat the Boredom Tonight",
        "social": "Your Social Night Out",
        "romantic": "Your Romantic Evening",
        "hungry": "Your Foodie Adventure Tonight",
    }

    return {
        "plan_title": plan_titles.get(mood.lower(), "Your Perfect Evening Plan"),
        "steps": steps,
        "categories": [s["category"] for s in steps],
        "confidence": round(sum(s["confidence"] for s in steps) / max(len(steps), 1)),
        "mood": mood,
        "weather": weather,
        "time_of_day": time_of_day,
        "day_type": day_type,
    }
