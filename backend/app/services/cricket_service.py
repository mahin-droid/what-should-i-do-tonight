import httpx
import random
from datetime import datetime, timedelta
from app.services.cache_service import cache
from app.config import settings

# Primary: CricketData.org free tier (100 req/day)
# Fallback: Mock data based on real IPL teams

CRICAPI_BASE = "https://api.cricketdata.org"

IPL_TEAMS = [
    "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
    "Kolkata Knight Riders", "Delhi Capitals", "Rajasthan Royals",
    "Punjab Kings", "Sunrisers Hyderabad", "Gujarat Titans", "Lucknow Super Giants"
]

VENUES = [
    "Narendra Modi Stadium, Ahmedabad", "Wankhede Stadium, Mumbai",
    "Eden Gardens, Kolkata", "M. Chinnaswamy Stadium, Bangalore",
    "MA Chidambaram Stadium, Chennai", "Arun Jaitley Stadium, Delhi",
]


async def _fetch_cricapi(endpoint: str, params: dict = None):
    """Fetch data from CricketData.org free tier."""
    api_key = getattr(settings, 'CRICKET_API_KEY', None) or 'demo_key'
    if api_key == 'demo_key':
        return None

    try:
        headers = {"apikey": api_key}
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{CRICAPI_BASE}/{endpoint}",
                headers=headers,
                params=params or {},
                timeout=10,
            )
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return data.get("data", [])
                # cricketdata.org sometimes returns data directly
                if isinstance(data, list):
                    return data
                if data.get("data"):
                    return data["data"]
    except Exception as e:
        print(f"CricketData API error: {e}")
    return None


async def get_live_matches():
    cached = cache.get("cricket_live", "sports")
    if cached:
        return cached

    # Try CricketData.org first
    api_data = await _fetch_cricapi("currentMatches", {"apikey": settings.CRICKET_API_KEY})
    if api_data:
        matches = []
        for match in api_data[:5]:
            if not match.get("matchStarted", False):
                continue

            teams = []
            score_data = {}
            for info in match.get("teamInfo", []):
                teams.append(info.get("name", "Unknown"))

            for s in match.get("score", []):
                score_data[s.get("inning", "")] = {
                    "runs": s.get("r", 0),
                    "wickets": s.get("w", 0),
                    "overs": s.get("o", 0),
                }

            if len(teams) < 2:
                teams = match.get("name", "Team A vs Team B").split(" vs ")[:2]

            first_score = list(score_data.values())[0] if score_data else {}
            excitement = 50
            if first_score.get("wickets", 0) >= 5:
                excitement = 75
            if first_score.get("overs", 0) > 15:
                excitement = max(excitement, 70)

            matches.append({
                "match_id": match.get("id", f"cricket_{random.randint(1000,9999)}"),
                "sport": "cricket",
                "teams": teams[:2],
                "score": {
                    "batting_team": teams[0] if teams else "Unknown",
                    "runs": first_score.get("runs", 0),
                    "wickets": first_score.get("wickets", 0),
                    "overs": first_score.get("overs", 0),
                    "run_rate": round(first_score.get("runs", 0) / max(first_score.get("overs", 1), 0.1), 2),
                    "target": None,
                    "innings": len(score_data),
                },
                "status": "live" if match.get("matchStarted") and not match.get("matchEnded") else "completed",
                "venue": match.get("venue", "Unknown"),
                "league": match.get("matchType", "T20").upper(),
                "start_time": match.get("dateTimeGMT", datetime.now().isoformat()),
                "excitement_score": excitement,
            })

        if matches:
            cache.set("cricket_live", matches, "sports")
            return matches

    # Fallback: Generate realistic current-state mock
    return _generate_mock_live()


def _generate_mock_live():
    """Generate realistic mock live data based on actual IPL schedule patterns."""
    matches = []
    # Simulate 1-2 live matches
    num = random.randint(1, 2)
    used_teams = set()
    for _ in range(num):
        available = [t for t in IPL_TEAMS if t not in used_teams]
        if len(available) < 2:
            break
        teams = random.sample(available, 2)
        used_teams.update(teams)

        overs = round(random.uniform(5, 19.5), 1)
        wickets = random.randint(0, min(7, int(overs / 2.5)))
        run_rate = round(random.uniform(7, 11), 2)
        runs = int(run_rate * overs)

        target = None
        innings = 1
        if random.random() > 0.5:
            innings = 2
            target = random.randint(155, 210)

        excitement = 50
        if target and abs(target - runs) < 30 and overs > 15:
            excitement = 90
        elif wickets >= 5:
            excitement = 75
        elif run_rate > 9.5:
            excitement = 70
        else:
            excitement = random.randint(45, 65)

        matches.append({
            "match_id": f"cricket_{random.randint(1000,9999)}",
            "sport": "cricket",
            "teams": teams,
            "score": {
                "batting_team": teams[0],
                "runs": runs,
                "wickets": wickets,
                "overs": overs,
                "run_rate": run_rate,
                "target": target,
                "innings": innings,
            },
            "status": "live",
            "venue": random.choice(VENUES),
            "league": "IPL 2025",
            "start_time": (datetime.now() - timedelta(hours=random.randint(1, 3))).isoformat(),
            "excitement_score": excitement,
        })
    cache.set("cricket_live", matches, "sports")
    return matches


async def get_upcoming_matches():
    cached = cache.get("cricket_upcoming", "sports")
    if cached:
        return cached

    # Try CricAPI
    api_data = await _fetch_cricapi("matches", {"apikey": settings.CRICKET_API_KEY, "offset": 0})
    if api_data:
        matches = []
        for match in api_data:
            if match.get("matchStarted"):
                continue
            teams = []
            for info in match.get("teamInfo", []):
                teams.append(info.get("name", "Unknown"))
            if len(teams) < 2:
                teams = match.get("name", "TBA vs TBA").split(" vs ")[:2]

            matches.append({
                "match_id": match.get("id", f"cricket_up_{random.randint(1000,9999)}"),
                "sport": "cricket",
                "teams": teams[:2],
                "score": None,
                "status": "upcoming",
                "venue": match.get("venue", "TBA"),
                "league": match.get("matchType", "T20").upper(),
                "start_time": match.get("dateTimeGMT", ""),
                "excitement_score": random.randint(50, 85),
            })

        if matches:
            matches = matches[:8]
            cache.set("cricket_upcoming", matches, "sports")
            return matches

    # Fallback mock
    matches = []
    for i in range(5):
        teams = random.sample(IPL_TEAMS, 2)
        start = datetime.now() + timedelta(days=i+1, hours=random.choice([14, 15, 19]))
        matches.append({
            "match_id": f"cricket_up_{random.randint(1000,9999)}",
            "sport": "cricket",
            "teams": teams,
            "score": None,
            "status": "upcoming",
            "venue": random.choice(VENUES),
            "league": "IPL 2025",
            "start_time": start.isoformat(),
            "excitement_score": random.randint(50, 85),
        })
    cache.set("cricket_upcoming", matches, "sports")
    return matches


async def get_recent_results():
    api_data = await _fetch_cricapi("matches", {"apikey": settings.CRICKET_API_KEY, "offset": 0})
    if api_data:
        results = []
        for match in api_data:
            if not match.get("matchEnded"):
                continue
            teams = []
            for info in match.get("teamInfo", []):
                teams.append(info.get("name", "Unknown"))
            if len(teams) < 2:
                teams = match.get("name", "Team A vs Team B").split(" vs ")[:2]

            results.append({
                "match_id": match.get("id", ""),
                "sport": "cricket",
                "teams": teams[:2],
                "score": match.get("score", {}),
                "status": "completed",
                "result": match.get("status", "Result unknown"),
                "venue": match.get("venue", "Unknown"),
                "league": match.get("matchType", "T20").upper(),
                "start_time": match.get("dateTimeGMT", ""),
                "excitement_score": random.randint(40, 90),
            })

        if results:
            return results[:5]

    # Fallback
    results = []
    for i in range(5):
        teams = random.sample(IPL_TEAMS, 2)
        winner = random.choice(teams)
        margin = f"{random.randint(5, 60)} runs" if random.random() > 0.5 else f"{random.randint(1, 7)} wickets"
        results.append({
            "match_id": f"cricket_res_{random.randint(1000,9999)}",
            "sport": "cricket",
            "teams": teams,
            "score": {},
            "status": "completed",
            "result": f"{winner} won by {margin}",
            "venue": random.choice(VENUES),
            "league": "IPL 2025",
            "start_time": (datetime.now() - timedelta(days=i+1)).isoformat(),
            "excitement_score": random.randint(40, 90),
        })
    return results
