import random
from datetime import datetime, timedelta

def get_mood_frequency():
    moods = ["Chill", "Excited", "Bored", "Social", "Romantic", "Hungry"]
    data = []
    total = 100
    remaining = total
    for i, mood in enumerate(moods):
        if i == len(moods) - 1:
            value = remaining
        else:
            value = random.randint(8, 25)
            remaining -= value
        data.append({"mood": mood, "count": max(5, value), "percentage": max(5, value)})
    return data

def get_category_preferences():
    categories = ["Entertainment", "Food", "Sports", "Travel", "Events", "Music"]
    return [{"category": cat, "engagement_score": random.randint(40, 95)} for cat in categories]

def get_search_history_patterns():
    hours = list(range(24))
    data = []
    for hour in hours:
        if 18 <= hour <= 22:
            searches = random.randint(15, 30)
        elif 12 <= hour <= 14:
            searches = random.randint(8, 15)
        elif 6 <= hour <= 9:
            searches = random.randint(3, 8)
        else:
            searches = random.randint(1, 5)
        data.append({"hour": f"{hour:02d}:00", "searches": searches})
    return data

def get_recommendation_acceptance_rate():
    categories = ["Entertainment", "Food", "Sports", "Travel", "Events"]
    data = []
    for cat in categories:
        shown = random.randint(50, 150)
        accepted = random.randint(int(shown * 0.3), int(shown * 0.8))
        data.append({
            "category": cat,
            "shown": shown,
            "accepted": accepted,
            "rate": round(accepted / shown * 100, 1),
        })
    return data
