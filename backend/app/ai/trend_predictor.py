import random
from datetime import datetime, timedelta

def predict_genre_trends():
    genres = ["Action", "Comedy", "Romance", "Thriller", "Sci-Fi", "Drama", "Horror"]
    predictions = []
    for genre in genres:
        current = random.randint(50, 90)
        predicted = current + random.randint(-10, 15)
        predictions.append({
            "genre": genre,
            "current_score": current,
            "predicted_score": min(100, max(0, predicted)),
            "trend": "rising" if predicted > current else ("falling" if predicted < current else "stable"),
            "confidence": round(random.uniform(0.6, 0.95), 2),
        })
    return predictions

def predict_food_patterns():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    patterns = []
    for day in days:
        is_weekend = day in ("Friday", "Saturday", "Sunday")
        base_orders = 70 if is_weekend else 50
        patterns.append({
            "day": day,
            "predicted_orders": base_orders + random.randint(-5, 15),
            "peak_hour": "8:00 PM" if not is_weekend else "9:00 PM",
            "top_cuisine": random.choice(["Gujarati", "Biryani", "Chinese", "Pizza", "Street Food"]),
        })
    return patterns

def predict_match_excitement(team1: str, team2: str):
    rivalry_pairs = [
        ("Mumbai Indians", "Chennai Super Kings"),
        ("India", "Pakistan"),
        ("India", "Australia"),
        ("Real Madrid", "Barcelona"),
        ("Arsenal", "Tottenham"),
        ("Mohun Bagan SG", "East Bengal FC"),
    ]
    is_rivalry = (team1, team2) in rivalry_pairs or (team2, team1) in rivalry_pairs
    base = 70 if is_rivalry else 50
    excitement = min(100, base + random.randint(0, 30))
    return {
        "team1": team1,
        "team2": team2,
        "predicted_excitement": excitement,
        "is_rivalry": is_rivalry,
        "factors": ["rivalry" if is_rivalry else "regular", "form", "venue"],
        "confidence": round(random.uniform(0.65, 0.9), 2),
    }

def get_trending_predictions():
    return {
        "genre_trends": predict_genre_trends(),
        "food_patterns": predict_food_patterns(),
        "generated_at": datetime.now().isoformat(),
    }
