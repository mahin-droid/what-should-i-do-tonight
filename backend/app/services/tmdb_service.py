import httpx
import random
from app.config import settings
from app.services.cache_service import cache

MOCK_MOVIES = [
    {"id": 1, "title": "Sikandar", "type": "movie", "rating": 7.5, "poster_url": None, "overview": "Salman Khan returns in an action-packed thriller directed by AR Murugadoss.", "release_date": "2025-03-30", "genres": ["Action", "Thriller"], "trending_score": 96},
    {"id": 2, "title": "Daredevil: Born Again", "type": "movie", "rating": 8.2, "poster_url": None, "overview": "Matt Murdock returns as the Devil of Hell's Kitchen in this Marvel series.", "release_date": "2025-03-04", "genres": ["Action", "Drama"], "trending_score": 94},
    {"id": 3, "title": "Snow White", "type": "movie", "rating": 5.8, "poster_url": None, "overview": "Disney's live-action retelling of the classic fairy tale.", "release_date": "2025-03-21", "genres": ["Fantasy", "Musical"], "trending_score": 85},
    {"id": 4, "title": "Thunderbolts*", "type": "movie", "rating": 7.8, "poster_url": None, "overview": "Marvel's team of antiheroes assembled for dangerous missions.", "release_date": "2025-05-02", "genres": ["Action", "Sci-Fi"], "trending_score": 93},
    {"id": 5, "title": "Raid 2", "type": "movie", "rating": 7.0, "poster_url": None, "overview": "The sequel to Ajay Devgn's hit action franchise.", "release_date": "2025-02-21", "genres": ["Action", "Crime"], "trending_score": 88},
    {"id": 6, "title": "De De Pyaar De 2", "type": "movie", "rating": 6.8, "poster_url": None, "overview": "Ajay Devgn and Rakul Preet Singh return in this romantic comedy sequel.", "release_date": "2025-05-01", "genres": ["Comedy", "Romance"], "trending_score": 82},
    {"id": 7, "title": "Sinners", "type": "movie", "rating": 8.0, "poster_url": None, "overview": "Ryan Coogler's horror thriller starring Michael B. Jordan in dual roles.", "release_date": "2025-04-18", "genres": ["Horror", "Thriller"], "trending_score": 91},
    {"id": 8, "title": "Mission Impossible: The Final Reckoning", "type": "movie", "rating": 8.5, "poster_url": None, "overview": "Tom Cruise's final mission as Ethan Hunt in the franchise finale.", "release_date": "2025-05-23", "genres": ["Action", "Thriller"], "trending_score": 97},
]

MOCK_TV = [
    {"id": 101, "title": "Panchayat Season 4", "type": "tv", "rating": 9.0, "poster_url": None, "overview": "Abhishek returns as Sachiv Ji in the beloved rural comedy-drama.", "release_date": "2025-06-01", "genres": ["Comedy", "Drama"], "trending_score": 98},
    {"id": 102, "title": "Daredevil: Born Again", "type": "tv", "rating": 8.2, "poster_url": None, "overview": "Charlie Cox returns as Matt Murdock in the Marvel Disney+ series.", "release_date": "2025-03-04", "genres": ["Action", "Crime"], "trending_score": 95},
    {"id": 103, "title": "The White Lotus Season 3", "type": "tv", "rating": 8.5, "poster_url": None, "overview": "The acclaimed HBO anthology series moves to Thailand.", "release_date": "2025-02-16", "genres": ["Drama", "Comedy"], "trending_score": 93},
    {"id": 104, "title": "Adolescence", "type": "tv", "rating": 9.2, "poster_url": None, "overview": "A gripping British miniseries exploring a family in crisis after a shocking event.", "release_date": "2025-03-13", "genres": ["Drama", "Thriller"], "trending_score": 96},
    {"id": 105, "title": "Black Mirror Season 7", "type": "tv", "rating": 8.0, "poster_url": None, "overview": "Charlie Brooker's dystopian anthology returns with new tech nightmares.", "release_date": "2025-04-10", "genres": ["Sci-Fi", "Thriller"], "trending_score": 90},
    {"id": 106, "title": "Stranger Things Season 5", "type": "tv", "rating": 8.8, "poster_url": None, "overview": "The final season of the Hawkins saga on Netflix.", "release_date": "2025-10-01", "genres": ["Sci-Fi", "Horror"], "trending_score": 97},
]

MOOD_GENRE_MAP = {
    "chill": ["Comedy", "Drama", "Romance"],
    "excited": ["Action", "Adventure", "Sci-Fi"],
    "bored": ["Thriller", "Mystery", "Horror"],
    "social": ["Comedy", "Drama", "Musical"],
    "romantic": ["Romance", "Drama", "Musical"],
    "hungry": ["Comedy", "Drama"],
}

async def get_trending():
    cached = cache.get("trending_entertainment", "entertainment")
    if cached:
        return cached

    try:
        if settings.TMDB_API_KEY and settings.TMDB_API_KEY != "demo_key":
            async with httpx.AsyncClient(verify=False) as client:
                resp = await client.get(
                    "https://api.themoviedb.org/3/trending/all/day",
                    params={"api_key": settings.TMDB_API_KEY},
                    timeout=10,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = []
                    for item in data.get("results", [])[:12]:
                        results.append({
                            "id": item["id"],
                            "title": item.get("title") or item.get("name", "Unknown"),
                            "type": item.get("media_type", "movie"),
                            "rating": round(item.get("vote_average", 0), 1),
                            "poster_url": f"https://image.tmdb.org/t/p/w500{item['poster_path']}" if item.get("poster_path") else None,
                            "overview": item.get("overview", ""),
                            "release_date": item.get("release_date") or item.get("first_air_date", ""),
                            "genres": [],
                            "trending_score": round(item.get("popularity", 0), 1),
                        })
                    cache.set("trending_entertainment", results, "entertainment")
                    return results
    except Exception:
        pass

    results = MOCK_MOVIES + MOCK_TV
    results.sort(key=lambda x: x["trending_score"], reverse=True)
    cache.set("trending_entertainment", results, "entertainment")
    return results

async def search_entertainment(query: str):
    cached = cache.get(f"search_{query}", "entertainment")
    if cached:
        return cached

    try:
        if settings.TMDB_API_KEY and settings.TMDB_API_KEY != "demo_key":
            async with httpx.AsyncClient(verify=False) as client:
                resp = await client.get(
                    "https://api.themoviedb.org/3/search/multi",
                    params={"api_key": settings.TMDB_API_KEY, "query": query},
                    timeout=10,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = []
                    for item in data.get("results", [])[:10]:
                        if item.get("media_type") in ("movie", "tv"):
                            results.append({
                                "id": item["id"],
                                "title": item.get("title") or item.get("name", "Unknown"),
                                "type": item.get("media_type", "movie"),
                                "rating": round(item.get("vote_average", 0), 1),
                                "poster_url": f"https://image.tmdb.org/t/p/w500{item['poster_path']}" if item.get("poster_path") else None,
                                "overview": item.get("overview", ""),
                                "release_date": item.get("release_date") or item.get("first_air_date", ""),
                                "genres": [],
                                "trending_score": round(item.get("popularity", 0), 1),
                            })
                    cache.set(f"search_{query}", results, "entertainment")
                    return results
    except Exception:
        pass

    q = query.lower()
    all_items = MOCK_MOVIES + MOCK_TV
    results = [i for i in all_items if q in i["title"].lower() or any(q in g.lower() for g in i["genres"])]
    if not results:
        results = random.sample(all_items, min(5, len(all_items)))
    cache.set(f"search_{query}", results, "entertainment")
    return results

async def get_mood_recommendations(mood: str):
    genres = MOOD_GENRE_MAP.get(mood.lower(), ["Comedy", "Drama"])
    all_items = MOCK_MOVIES + MOCK_TV
    results = [i for i in all_items if any(g in i["genres"] for g in genres)]
    results.sort(key=lambda x: x["trending_score"], reverse=True)
    return results[:8]
