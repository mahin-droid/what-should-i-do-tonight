import random

def get_price_vs_rating():
    data = []
    restaurants = [
        ("Das Khaman House", 1, 4.5), ("Manek Chowk", 1, 4.5), ("Gopi Dining", 1, 4.3),
        ("Lucky Restaurant", 2, 4.6), ("Honest Restaurant", 2, 4.1), ("Sankalp", 2, 4.1),
        ("Tomato's", 2, 4.0), ("Havmor", 2, 4.0),
        ("Agashiye", 3, 4.7), ("Patang Hotel", 3, 4.4), ("Grand Bhagwati", 3, 4.2),
        ("Barbeque Nation", 3, 4.1), ("SkyHigh Cafe", 3, 4.2),
    ]
    for name, price, rating in restaurants:
        data.append({
            "name": name,
            "price_level": price,
            "rating": rating + round(random.uniform(-0.2, 0.2), 1),
            "reviews_count": random.randint(50, 500),
        })
    return data

def get_cuisine_trends():
    months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    cuisines = ["Gujarati", "Street Food", "Biryani", "Chinese", "Italian", "Cafe"]
    data = []
    for month in months:
        entry = {"month": month}
        for cuisine in cuisines:
            entry[cuisine] = random.randint(30, 95)
        data.append(entry)
    return data

def get_review_sentiment_breakdown():
    return {
        "food_quality": {"positive": 72, "neutral": 18, "negative": 10},
        "service": {"positive": 58, "neutral": 25, "negative": 17},
        "ambience": {"positive": 65, "neutral": 22, "negative": 13},
        "hygiene": {"positive": 70, "neutral": 20, "negative": 10},
        "value_for_money": {"positive": 62, "neutral": 23, "negative": 15},
    }
