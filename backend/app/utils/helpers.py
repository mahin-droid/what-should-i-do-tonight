from datetime import datetime

def get_time_of_day():
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return "morning"
    elif 12 <= hour < 17:
        return "afternoon"
    elif 17 <= hour < 21:
        return "evening"
    else:
        return "night"

def get_day_type():
    day = datetime.now().weekday()
    return "weekend" if day >= 5 else "weekday"

def format_inr(amount):
    if amount >= 10000000:
        return f"₹{amount/10000000:.1f} Cr"
    elif amount >= 100000:
        return f"₹{amount/100000:.1f} L"
    elif amount >= 1000:
        return f"₹{amount/1000:.1f}K"
    return f"₹{amount}"

def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))
