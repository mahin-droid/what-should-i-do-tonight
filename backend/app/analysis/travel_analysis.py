import random

def get_destination_popularity():
    months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    destinations = ["Udaipur", "Goa", "Mount Abu", "Kutch", "Mumbai", "Diu"]
    data = []
    for month in months:
        entry = {"month": month}
        for dest in destinations:
            if dest == "Goa" and month in ("Nov", "Dec", "Jan"):
                entry[dest] = random.randint(80, 100)
            elif dest == "Kutch" and month in ("Dec", "Jan", "Feb"):
                entry[dest] = random.randint(85, 100)
            elif dest == "Mount Abu" and month in ("Oct", "Nov"):
                entry[dest] = random.randint(70, 90)
            else:
                entry[dest] = random.randint(30, 70)
        data.append(entry)
    return data

def get_budget_breakdown():
    return [
        {"category": "Transport", "percentage": 35, "avg_spend": 3500, "color": "#378ADD"},
        {"category": "Hotel", "percentage": 30, "avg_spend": 3000, "color": "#7F77DD"},
        {"category": "Food", "percentage": 20, "avg_spend": 2000, "color": "#1D9E75"},
        {"category": "Activities", "percentage": 10, "avg_spend": 1000, "color": "#EF9F27"},
        {"category": "Shopping", "percentage": 5, "avg_spend": 500, "color": "#E24B4A"},
    ]
