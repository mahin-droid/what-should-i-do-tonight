import random
from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/genre-trends")
async def genre_trends():
    months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    genres = ["Action", "Comedy", "Romance", "Thriller", "Sci-Fi", "Drama"]
    data = []
    for month in months:
        entry = {"month": month}
        for genre in genres:
            base = random.randint(40, 80)
            entry[genre] = base + random.randint(-10, 10)
        data.append(entry)
    return {
        "status": "success",
        "chart_type": "line",
        "title": "Genre Popularity Trends",
        "subtitle": "Last 6 months trending score by genre",
        "data": data,
        "insights": [
            "Action genre shows consistent upward trend, driven by blockbuster releases.",
            "Comedy peaks during holiday seasons (December-January).",
            "Sci-Fi gaining popularity with new franchise releases.",
        ],
    }

@router.get("/activity-heatmap")
async def activity_heatmap():
    categories = ["Entertainment", "Food", "Sports", "Travel", "Events"]
    times = ["Morning", "Afternoon", "Evening", "Night", "Late Night"]
    data = []
    for time in times:
        entry = {"time": time}
        for cat in categories:
            if time == "Evening":
                entry[cat] = random.randint(60, 100)
            elif time == "Night":
                entry[cat] = random.randint(50, 90)
            elif time == "Morning":
                entry[cat] = random.randint(10, 40)
            else:
                entry[cat] = random.randint(30, 70)
        data.append(entry)
    return {
        "status": "success",
        "chart_type": "heatmap",
        "title": "Activity Intensity by Time of Day",
        "subtitle": "When people are most active across categories",
        "data": data,
        "insights": [
            "Evening (6-9 PM) is the peak activity window across all categories.",
            "Food ordering spikes during Night hours, especially on weekends.",
            "Sports viewership peaks during Evening for live matches.",
        ],
    }

@router.get("/cuisine-distribution")
async def cuisine_distribution(city: str = Query("Ahmedabad")):
    data = [
        {"name": "Gujarati", "value": 28, "color": "#378ADD"},
        {"name": "Street Food", "value": 22, "color": "#7F77DD"},
        {"name": "North Indian", "value": 15, "color": "#1D9E75"},
        {"name": "South Indian", "value": 12, "color": "#EF9F27"},
        {"name": "Chinese", "value": 10, "color": "#E24B4A"},
        {"name": "Italian", "value": 7, "color": "#FF6B9D"},
        {"name": "Cafe/Bakery", "value": 6, "color": "#4ECDC4"},
    ]
    return {
        "status": "success",
        "chart_type": "donut",
        "title": f"Cuisine Distribution in {city}",
        "subtitle": "Percentage of restaurants by cuisine type",
        "data": data,
        "insights": [
            f"Gujarati cuisine dominates {city} with 28% of restaurants.",
            "Street food culture is thriving with 22% share.",
            "Italian and cafe culture is growing rapidly in urban areas.",
        ],
    }

@router.get("/price-rating")
async def price_rating():
    data = [
        {"category": "Budget (₹)", "rating": 4.1, "count": 45, "color": "#1D9E75"},
        {"category": "Mid-Range (₹₹)", "rating": 4.0, "count": 38, "color": "#378ADD"},
        {"category": "Premium (₹₹₹)", "rating": 4.3, "count": 22, "color": "#EF9F27"},
        {"category": "Luxury (₹₹₹₹)", "rating": 4.5, "count": 8, "color": "#7F77DD"},
    ]
    return {
        "status": "success",
        "chart_type": "bar",
        "title": "Price vs Rating Analysis",
        "subtitle": "Average restaurant rating by price tier",
        "data": data,
        "insights": [
            "Budget restaurants maintain high ratings (4.1) despite lower prices.",
            "Luxury restaurants lead in ratings but represent only 8% of options.",
            "Best value: Mid-range restaurants offer 4.0 rating at accessible prices.",
        ],
    }

@router.get("/cross-domain")
async def cross_domain():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    data = []
    for day in days:
        is_weekend = day in ("Saturday", "Sunday")
        base = 70 if is_weekend else 50
        data.append({
            "day": day,
            "OTT Streaming": base + random.randint(-5, 15),
            "Food Orders": base + random.randint(-10, 20),
            "Sports Viewers": (base + 20) if day in ("Saturday", "Sunday", "Friday") else (base + random.randint(-15, 10)),
            "Outings": (base + 25) if is_weekend else (base + random.randint(-20, 5)),
        })
    return {
        "status": "success",
        "chart_type": "grouped_bar",
        "title": "Cross-Domain Activity Patterns",
        "subtitle": "Activity levels across domains by day of week",
        "data": data,
        "insights": [
            "Weekends show 40% higher activity across all domains.",
            "Friday evenings show a spike in food orders and OTT streaming.",
            "Sports viewership peaks on weekends, especially during IPL season.",
            "Key insight: Saturday shows the highest combined activity score.",
        ],
    }

@router.get("/sports-stats")
async def sports_stats():
    matches = []
    for i in range(10):
        excitement = random.randint(30, 100)
        matches.append({
            "match": f"Match {i+1}",
            "excitement_score": excitement,
            "runs_scored": random.randint(280, 420),
            "wickets": random.randint(10, 20),
            "close_finish": excitement > 75,
        })
    return {
        "status": "success",
        "chart_type": "bar",
        "title": "Match Excitement Analysis",
        "subtitle": "Excitement scores for recent IPL matches",
        "data": matches,
        "insights": [
            "40% of recent matches ended in close finishes (excitement > 75).",
            "Average excitement score: " + str(round(sum(m["excitement_score"] for m in matches) / len(matches))),
            "High-scoring matches correlate with higher excitement levels.",
        ],
    }
