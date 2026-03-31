import httpx
import random
from datetime import datetime, timedelta
from app.services.cache_service import cache

# TheSportsDB - completely FREE, no API key needed (use "3" as test key)
BASE_URL = "https://www.thesportsdb.com/api/v1/json/3"

# League IDs for TheSportsDB
LEAGUES = {
    "cricket": [
        {"id": "4707", "name": "Indian Premier League", "sport": "cricket"},
    ],
    "football": [
        {"id": "4328", "name": "English Premier League", "sport": "football"},
        {"id": "4335", "name": "Spanish La Liga", "sport": "football"},
        {"id": "4480", "name": "Indian Super League", "sport": "football"},
        {"id": "4581", "name": "UEFA Champions League", "sport": "football"},
    ],
    "basketball": [
        {"id": "4387", "name": "NBA", "sport": "basketball"},
    ],
    "tennis": [
        {"id": "4596", "name": "ATP Tour", "sport": "tennis"},
    ],
    "hockey": [
        {"id": "4380", "name": "NHL", "sport": "hockey"},
    ],
    "badminton": [
        {"id": "4746", "name": "BWF World Tour", "sport": "badminton"},
    ],
    "baseball": [
        {"id": "4424", "name": "MLB", "sport": "baseball"},
    ],
}

ALL_SPORTS = list(LEAGUES.keys())


async def _fetch_api(endpoint: str, params: dict = None):
    """Fetch from TheSportsDB free API."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{BASE_URL}/{endpoint}", params=params or {}, timeout=10)
            if resp.status_code == 200:
                return resp.json()
    except Exception as e:
        print(f"TheSportsDB error: {e}")
    return None


def _parse_event(event: dict, sport: str):
    """Parse a TheSportsDB event into our standard format."""
    home = event.get("strHomeTeam", "Home")
    away = event.get("strAwayTeam", "Away")
    home_score = event.get("intHomeScore")
    away_score = event.get("intAwayScore")

    # Determine status
    status = "upcoming"
    score_data = None
    event_date = event.get("dateEvent", "")
    event_time = event.get("strTime", "")

    if home_score is not None and away_score is not None and home_score != "" and away_score != "":
        try:
            home_score = int(home_score)
            away_score = int(away_score)
            status = "completed"
            score_data = _format_score(sport, home, away, home_score, away_score, event)
        except (ValueError, TypeError):
            pass

    # Check if match is today and potentially live
    try:
        match_date = datetime.strptime(event_date, "%Y-%m-%d").date()
        today = datetime.now().date()
        if match_date == today and status == "upcoming":
            # Could be live - check time
            if event_time:
                try:
                    match_time = datetime.strptime(event_time.split("+")[0].strip(), "%H:%M:%S").time()
                    now = datetime.utcnow().time()
                    # If match started within last 3 hours, mark as potentially live
                    match_dt = datetime.combine(today, match_time)
                    now_dt = datetime.combine(today, now)
                    diff = (now_dt - match_dt).total_seconds() / 3600
                    if 0 < diff < 3:
                        status = "live"
                except (ValueError, TypeError):
                    pass
    except (ValueError, TypeError):
        pass

    # Calculate excitement
    excitement = _calc_excitement(sport, home_score, away_score, status, event)

    league = event.get("strLeague", "")

    start_time = event_date
    if event_time:
        start_time = f"{event_date}T{event_time}"

    return {
        "match_id": str(event.get("idEvent", random.randint(10000, 99999))),
        "sport": sport,
        "teams": [home, away],
        "score": score_data,
        "status": status,
        "venue": event.get("strVenue", ""),
        "league": league,
        "start_time": start_time,
        "excitement_score": excitement,
        "thumbnail": event.get("strThumb", None),
        "round": event.get("intRound", ""),
    }


def _format_score(sport, home, away, home_score, away_score, event):
    """Format score based on sport type."""
    if sport == "cricket":
        return {
            "batting_team": home,
            "runs": home_score,
            "wickets": 0,
            "overs": 0,
            "run_rate": 0,
            "target": away_score if away_score else None,
            "innings": 1,
            "display": f"{home}: {home_score} | {away}: {away_score}",
        }
    elif sport == "football":
        return {"home": home_score, "away": away_score, "minute": 90, "display": f"{home_score} - {away_score}"}
    elif sport == "basketball":
        return {"home": home_score, "away": away_score, "quarter": 4, "display": f"{home_score} - {away_score}"}
    elif sport == "tennis":
        return {"home": home_score, "away": away_score, "display": f"{home_score} - {away_score}"}
    else:
        return {"home": home_score, "away": away_score, "display": f"{home_score} - {away_score}"}


def _calc_excitement(sport, home_score, away_score, status, event):
    """Calculate excitement score."""
    excitement = 50
    if home_score is not None and away_score is not None:
        try:
            h, a = int(home_score), int(away_score)
            diff = abs(h - a)
            if sport in ("football", "hockey"):
                if diff <= 1:
                    excitement = 85
                elif diff == 2:
                    excitement = 65
            elif sport == "basketball":
                if diff <= 5:
                    excitement = 90
                elif diff <= 10:
                    excitement = 75
            elif sport == "cricket":
                if diff <= 20:
                    excitement = 88
            elif sport == "tennis":
                excitement = 70
        except (ValueError, TypeError):
            pass

    if status == "live":
        excitement = min(100, excitement + 15)

    # Rivalry boost
    league = event.get("strLeague", "").lower()
    if "ipl" in league or "premier" in league or "champions" in league:
        excitement = min(100, excitement + 5)

    return excitement


def _generate_fallback_matches(sport_filter=None):
    """Generate realistic fallback matches when API returns nothing."""
    import random
    from datetime import timedelta

    matches = []
    now = datetime.now()

    if not sport_filter or sport_filter == "cricket":
        ipl_teams = [("Mumbai Indians", "Chennai Super Kings"), ("Royal Challengers Bangalore", "Delhi Capitals"),
                     ("Gujarat Titans", "Rajasthan Royals"), ("Kolkata Knight Riders", "Sunrisers Hyderabad")]
        for i, (t1, t2) in enumerate(ipl_teams[:2]):
            matches.append({
                "match_id": f"ipl_{i}", "sport": "cricket", "teams": [t1, t2],
                "score": None, "status": "upcoming",
                "venue": ["Narendra Modi Stadium", "Wankhede Stadium", "Eden Gardens"][i % 3],
                "league": "Indian Premier League", "start_time": (now + timedelta(days=i+1, hours=19)).isoformat(),
                "excitement_score": random.randint(70, 95), "thumbnail": None, "round": "",
            })

    if not sport_filter or sport_filter == "football":
        epl_teams = [("Arsenal", "Manchester City"), ("Liverpool", "Chelsea")]
        for i, (t1, t2) in enumerate(epl_teams):
            matches.append({
                "match_id": f"epl_{i}", "sport": "football", "teams": [t1, t2],
                "score": None, "status": "upcoming",
                "venue": f"{t1} Stadium", "league": "English Premier League",
                "start_time": (now + timedelta(days=i+2, hours=20)).isoformat(),
                "excitement_score": random.randint(65, 90), "thumbnail": None, "round": "",
            })

    if not sport_filter or sport_filter == "basketball":
        matches.append({
            "match_id": "nba_0", "sport": "basketball", "teams": ["LA Lakers", "Boston Celtics"],
            "score": None, "status": "upcoming", "venue": "Crypto.com Arena",
            "league": "NBA", "start_time": (now + timedelta(days=1, hours=9)).isoformat(),
            "excitement_score": 85, "thumbnail": None, "round": "",
        })

    if not sport_filter or sport_filter == "tennis":
        matches.append({
            "match_id": "atp_0", "sport": "tennis", "teams": ["Carlos Alcaraz", "Jannik Sinner"],
            "score": None, "status": "upcoming", "venue": "Roland Garros",
            "league": "ATP Tour", "start_time": (now + timedelta(days=3, hours=15)).isoformat(),
            "excitement_score": 88, "thumbnail": None, "round": "",
        })

    return matches


async def get_live_matches(sport_filter: str = None):
    """Get today's matches across all sports (or filtered by sport)."""
    cache_key = f"sports_live_{sport_filter or 'all'}"
    cached = cache.get(cache_key, "sports")
    if cached:
        return cached

    all_matches = []
    today = datetime.now().strftime("%Y-%m-%d")

    # Get today's events
    data = await _fetch_api("eventsday.php", {"d": today})
    if data and data.get("events"):
        for event in data["events"]:
            sport_name = (event.get("strSport", "")).lower()
            # Map sport names
            sport_mapped = _map_sport(sport_name)
            if sport_filter and sport_mapped != sport_filter.lower():
                continue
            parsed = _parse_event(event, sport_mapped)
            all_matches.append(parsed)

    # If no events from today's endpoint, fetch from each league
    if not all_matches:
        sports_to_fetch = [sport_filter.lower()] if sport_filter else ALL_SPORTS
        for sport in sports_to_fetch:
            if sport not in LEAGUES:
                continue
            for league in LEAGUES[sport]:
                data = await _fetch_api("eventsnextleague.php", {"id": league["id"]})
                if data and data.get("events"):
                    for event in data["events"][:3]:
                        parsed = _parse_event(event, sport)
                        all_matches.append(parsed)

                # Also get recent past events
                data = await _fetch_api("eventspastleague.php", {"id": league["id"]})
                if data and data.get("events"):
                    for event in data["events"][:2]:
                        parsed = _parse_event(event, sport)
                        all_matches.append(parsed)

    # Sort: live first, then upcoming, then completed
    status_order = {"live": 0, "upcoming": 1, "completed": 2}
    all_matches.sort(key=lambda m: (status_order.get(m["status"], 3), -m["excitement_score"]))

    # If still empty, generate realistic upcoming data
    if not all_matches:
        all_matches = _generate_fallback_matches(sport_filter)

    cache.set(cache_key, all_matches, "sports")
    return all_matches


async def get_upcoming_matches(sport_filter: str = None):
    """Get upcoming matches from all leagues."""
    cache_key = f"sports_upcoming_{sport_filter or 'all'}"
    cached = cache.get(cache_key, "sports")
    if cached:
        return cached

    all_matches = []
    sports_to_fetch = [sport_filter.lower()] if sport_filter else ALL_SPORTS

    for sport in sports_to_fetch:
        if sport not in LEAGUES:
            continue
        for league in LEAGUES[sport]:
            data = await _fetch_api("eventsnextleague.php", {"id": league["id"]})
            if data and data.get("events"):
                for event in data["events"]:
                    parsed = _parse_event(event, sport)
                    if parsed["status"] == "upcoming":
                        all_matches.append(parsed)

    all_matches.sort(key=lambda m: m.get("start_time", ""))
    cache.set(cache_key, all_matches, "sports")
    return all_matches


async def get_recent_results(sport_filter: str = None):
    """Get recent match results."""
    cache_key = f"sports_results_{sport_filter or 'all'}"
    cached = cache.get(cache_key, "sports")
    if cached:
        return cached

    all_results = []
    sports_to_fetch = [sport_filter.lower()] if sport_filter else ALL_SPORTS

    for sport in sports_to_fetch:
        if sport not in LEAGUES:
            continue
        for league in LEAGUES[sport]:
            data = await _fetch_api("eventspastleague.php", {"id": league["id"]})
            if data and data.get("events"):
                for event in data["events"][:5]:
                    parsed = _parse_event(event, sport)
                    all_results.append(parsed)

    all_results.sort(key=lambda m: m.get("start_time", ""), reverse=True)
    cache.set(cache_key, all_results, "sports")
    return all_results


def _map_sport(sport_name: str) -> str:
    """Map TheSportsDB sport names to our standard names."""
    mapping = {
        "soccer": "football",
        "football": "football",
        "cricket": "cricket",
        "basketball": "basketball",
        "tennis": "tennis",
        "ice hockey": "hockey",
        "hockey": "hockey",
        "badminton": "badminton",
        "baseball": "baseball",
        "motorsport": "motorsport",
        "golf": "golf",
        "rugby": "rugby",
        "volleyball": "volleyball",
        "boxing": "boxing",
        "mma": "mma",
    }
    return mapping.get(sport_name.lower(), sport_name.lower())


def get_available_sports():
    """Return list of available sports with icons."""
    return [
        {"id": "all", "name": "All Sports", "icon": "\U0001f3c6"},
        {"id": "cricket", "name": "Cricket", "icon": "\U0001f3cf"},
        {"id": "football", "name": "Football", "icon": "\u26bd"},
        {"id": "basketball", "name": "Basketball", "icon": "\U0001f3c0"},
        {"id": "tennis", "name": "Tennis", "icon": "\U0001f3be"},
        {"id": "hockey", "name": "Hockey", "icon": "\U0001f3d2"},
        {"id": "badminton", "name": "Badminton", "icon": "\U0001f3f8"},
        {"id": "baseball", "name": "Baseball", "icon": "\u26be"},
    ]
