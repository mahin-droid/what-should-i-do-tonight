import random

def get_team_performance():
    teams = ["MI", "CSK", "RCB", "KKR", "DC", "RR", "PBKS", "SRH", "GT", "LSG"]
    performance = []
    for team in teams:
        wins = random.randint(4, 10)
        losses = 14 - wins
        home_wins = random.randint(2, min(wins, 7))
        performance.append({
            "team": team,
            "played": 14,
            "wins": wins,
            "losses": losses,
            "home_wins": home_wins,
            "away_wins": wins - home_wins,
            "nrr": round(random.uniform(-1.5, 1.5), 3),
            "points": wins * 2,
        })
    performance.sort(key=lambda x: (-x["points"], -x["nrr"]))
    return performance

def get_toss_impact():
    return {
        "bat_first_wins": 52,
        "field_first_wins": 48,
        "toss_winner_match_winner": 55,
        "avg_first_innings_score": 175,
        "avg_second_innings_score": 168,
        "insight": "Teams choosing to field first have a slight edge in evening matches due to dew factor.",
    }

def calculate_excitement_scores():
    matches = []
    team_pairs = [
        ("MI", "CSK"), ("RCB", "KKR"), ("DC", "GT"), ("RR", "SRH"), ("PBKS", "LSG"),
        ("CSK", "RCB"), ("MI", "KKR"), ("GT", "RR"), ("DC", "PBKS"), ("SRH", "LSG"),
    ]
    for t1, t2 in team_pairs:
        margin_runs = random.randint(2, 80)
        is_close = margin_runs < 20
        is_rivalry = (t1, t2) in [("MI", "CSK"), ("RCB", "KKR")]
        excitement = 50
        if is_close:
            excitement += 30
        if is_rivalry:
            excitement += 15
        excitement += random.randint(-5, 10)
        excitement = min(100, excitement)
        matches.append({
            "match": f"{t1} vs {t2}",
            "excitement_score": excitement,
            "margin": f"{margin_runs} runs" if random.random() > 0.5 else f"{random.randint(1, 6)} wickets",
            "is_close": is_close,
            "is_rivalry": is_rivalry,
        })
    return matches
