import random

def get_domain_correlations():
    return {
        "cricket_food_correlation": {
            "description": "When India plays cricket, food delivery orders increase by 35%",
            "correlation": 0.78,
            "data_points": 50,
        },
        "rain_ott_correlation": {
            "description": "Rainy days increase OTT streaming by 45% and decrease restaurant visits by 25%",
            "correlation": 0.82,
            "data_points": 120,
        },
        "weekend_spike": {
            "description": "Weekend activity spike: all domains see 40% increase on Saturday-Sunday",
            "correlation": 0.91,
            "data_points": 200,
        },
        "evening_peak": {
            "description": "6-9 PM is peak activity window across all domains",
            "correlation": 0.87,
            "data_points": 300,
        },
        "ipl_social": {
            "description": "During IPL matches, social gathering at restaurants increases by 50%",
            "correlation": 0.73,
            "data_points": 60,
        },
    }

def get_day_of_week_patterns():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    data = []
    for day in days:
        is_weekend = day in ("Sat", "Sun")
        is_friday = day == "Fri"
        base = 70 if is_weekend else (60 if is_friday else 45)
        data.append({
            "day": day,
            "entertainment": base + random.randint(-5, 10),
            "food": base + random.randint(-3, 12),
            "sports": (base + 10) if day in ("Sat", "Sun", "Fri") else base + random.randint(-10, 5),
            "travel": (base + 15) if is_weekend else base + random.randint(-15, 0),
            "events": (base + 10) if is_weekend else base + random.randint(-10, 5),
        })
    return data

def get_time_of_day_heatmap():
    times = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"]
    domains = ["Entertainment", "Food", "Sports", "Travel", "Events"]
    data = []
    for time in times:
        entry = {"time": time}
        for domain in domains:
            if time in ("6PM", "9PM"):
                entry[domain] = random.randint(60, 100)
            elif time == "12AM":
                entry[domain] = random.randint(20, 50) if domain != "Entertainment" else random.randint(40, 70)
            elif time == "6AM":
                entry[domain] = random.randint(5, 20)
            else:
                entry[domain] = random.randint(25, 60)
        data.append(entry)
    return data

def get_cross_domain_insights():
    return [
        "Key Insight: Saturday shows the highest combined activity score across all domains.",
        "Food orders increase by 35% during live IPL matches, especially during evening games.",
        "Rainy days boost OTT streaming by 45% while reducing outdoor event attendance by 30%.",
        "The 7-9 PM window accounts for 40% of all daily entertainment consumption.",
        "Weekend travel searches peak on Thursday evenings, suggesting planning behavior.",
        "Romantic mood users spend 2x more on restaurants compared to other moods.",
    ]
