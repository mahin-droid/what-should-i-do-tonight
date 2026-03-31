import httpx
import random
from datetime import datetime, timedelta
from app.services.cache_service import cache
from app.config import settings

FOOTBALL_API_BASE = "https://api.football-data.org/v4"

ISL_TEAMS = ["Mumbai City FC", "Mohun Bagan SG", "Bengaluru FC", "Kerala Blasters", "Goa FC", "Chennaiyin FC", "Hyderabad FC", "East Bengal FC", "Odisha FC", "Jamshedpur FC"]


async def _fetch_football_api(endpoint: str, params: dict = None):
    """Fetch from football-data.org free tier."""
    api_key = settings.FOOTBALL_API_KEY
    if not api_key or api_key == "demo_key":
        return None

    try:
        headers = {"X-Auth-Token": api_key}
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{FOOTBALL_API_BASE}/{endpoint}",
                headers=headers,
                params=params or {},
                timeout=10,
            )
            if resp.status_code == 200:
                return resp.json()
    except Exception as e:
        print(f"Football API error: {e}")
    return None


async def get_live_matches():
    cached = cache.get("football_live", "sports")
    if cached:
        return cached

    # Try football-data.org - get today's matches
    data = await _fetch_football_api("matches", {"status": "LIVE,IN_PLAY,PAUSED"})
    if data and data.get("matches"):
        matches = []
        for match in data["matches"][:5]:
            home = match.get("homeTeam", {}).get("shortName") or match.get("homeTeam", {}).get("name", "Home")
            away = match.get("awayTeam", {}).get("shortName") or match.get("awayTeam", {}).get("name", "Away")
            score = match.get("score", {})
            ft = score.get("fullTime", {}) or {}
            ht = score.get("halfTime", {}) or {}
            home_goals = ft.get("home") or ht.get("home") or 0
            away_goals = ft.get("away") or ht.get("away") or 0
            minute = match.get("minute", 0) or 0

            competition = match.get("competition", {}).get("name", "Unknown League")

            excitement = 50
            if abs(home_goals - away_goals) <= 1 and minute > 70:
                excitement = 90
            elif home_goals + away_goals >= 4:
                excitement = 80
            elif minute > 80:
                excitement = 75
            else:
                excitement = random.randint(50, 65)

            matches.append({
                "match_id": str(match.get("id", random.randint(1000, 9999))),
                "sport": "football",
                "teams": [home, away],
                "score": {"home": home_goals, "away": away_goals, "minute": minute},
                "status": "live",
                "venue": match.get("venue", "Unknown"),
                "league": competition,
                "start_time": match.get("utcDate", datetime.now().isoformat()),
                "excitement_score": excitement,
            })

        if matches:
            cache.set("football_live", matches, "sports")
            return matches

    # Also try to get today's scheduled/finished matches
    data = await _fetch_football_api("matches", {"dateFrom": datetime.now().strftime("%Y-%m-%d"), "dateTo": datetime.now().strftime("%Y-%m-%d")})
    if data and data.get("matches"):
        matches = []
        for match in data["matches"][:5]:
            home = match.get("homeTeam", {}).get("shortName") or match.get("homeTeam", {}).get("name", "Home")
            away = match.get("awayTeam", {}).get("shortName") or match.get("awayTeam", {}).get("name", "Away")
            status_raw = match.get("status", "SCHEDULED")

            status = "upcoming"
            score_data = None
            if status_raw in ("FINISHED",):
                status = "completed"
                ft = match.get("score", {}).get("fullTime", {}) or {}
                score_data = {"home": ft.get("home", 0), "away": ft.get("away", 0), "minute": 90}
            elif status_raw in ("IN_PLAY", "LIVE", "PAUSED"):
                status = "live"
                ft = match.get("score", {}).get("fullTime", {}) or {}
                score_data = {"home": ft.get("home", 0), "away": ft.get("away", 0), "minute": match.get("minute", 0)}

            matches.append({
                "match_id": str(match.get("id", random.randint(1000, 9999))),
                "sport": "football",
                "teams": [home, away],
                "score": score_data,
                "status": status,
                "venue": match.get("venue", ""),
                "league": match.get("competition", {}).get("name", ""),
                "start_time": match.get("utcDate", ""),
                "excitement_score": random.randint(50, 80),
            })

        if matches:
            cache.set("football_live", matches, "sports")
            return matches

    # Fallback mock
    return _mock_live()


def _mock_live():
    matches = []
    LEAGUES = [
        {"teams": ["Arsenal", "Man City", "Liverpool", "Chelsea", "Man United", "Tottenham"], "name": "Premier League"},
        {"teams": ["Real Madrid", "Barcelona", "Atletico Madrid", "Real Sociedad"], "name": "La Liga"},
    ]
    league = random.choice(LEAGUES)
    teams = random.sample(league["teams"], 2)
    minute = random.randint(1, 90)
    matches.append({
        "match_id": f"football_{random.randint(1000,9999)}",
        "sport": "football",
        "teams": teams,
        "score": {"home": random.randint(0, 3), "away": random.randint(0, 3), "minute": minute},
        "status": "live",
        "venue": f"{teams[0]} Stadium",
        "league": league["name"],
        "start_time": (datetime.now() - timedelta(minutes=minute)).isoformat(),
        "excitement_score": random.randint(50, 85),
    })
    cache.set("football_live", matches, "sports")
    return matches


async def get_upcoming_matches():
    cached = cache.get("football_upcoming", "sports")
    if cached:
        return cached

    # Try API for upcoming matches (next 7 days)
    date_from = datetime.now().strftime("%Y-%m-%d")
    date_to = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    data = await _fetch_football_api("matches", {"dateFrom": date_from, "dateTo": date_to, "status": "SCHEDULED,TIMED"})

    if data and data.get("matches"):
        matches = []
        for match in data["matches"][:10]:
            home = match.get("homeTeam", {}).get("shortName") or match.get("homeTeam", {}).get("name", "Home")
            away = match.get("awayTeam", {}).get("shortName") or match.get("awayTeam", {}).get("name", "Away")
            matches.append({
                "match_id": str(match.get("id", random.randint(1000, 9999))),
                "sport": "football",
                "teams": [home, away],
                "score": None,
                "status": "upcoming",
                "venue": match.get("venue", ""),
                "league": match.get("competition", {}).get("name", ""),
                "start_time": match.get("utcDate", ""),
                "excitement_score": random.randint(50, 80),
            })

        if matches:
            cache.set("football_upcoming", matches, "sports")
            return matches

    # Fallback
    matches = []
    for i in range(5):
        teams = random.sample(["Arsenal", "Man City", "Liverpool", "Chelsea", "Real Madrid", "Barcelona"], 2)
        start = datetime.now() + timedelta(days=i+1, hours=random.choice([17, 19, 21]))
        matches.append({
            "match_id": f"football_up_{random.randint(1000,9999)}",
            "sport": "football",
            "teams": teams,
            "score": None,
            "status": "upcoming",
            "venue": f"{teams[0]} Stadium",
            "league": random.choice(["Premier League", "La Liga", "Champions League"]),
            "start_time": start.isoformat(),
            "excitement_score": random.randint(50, 80),
        })
    cache.set("football_upcoming", matches, "sports")
    return matches
