import random

POSITIVE_WORDS = {"amazing", "excellent", "great", "fantastic", "wonderful", "love", "best", "perfect", "delicious", "beautiful", "outstanding", "superb", "brilliant", "incredible", "awesome"}
NEGATIVE_WORDS = {"terrible", "awful", "worst", "horrible", "bad", "disgusting", "poor", "disappointing", "rude", "dirty", "overpriced", "slow", "cold", "stale", "mediocre"}

FOOD_ASPECTS = {
    "food": {"keywords": ["food", "taste", "flavor", "dish", "menu", "cuisine", "biryani", "thali", "paneer", "naan", "rice", "curry"]},
    "service": {"keywords": ["service", "staff", "waiter", "manager", "rude", "friendly", "quick", "slow", "attentive"]},
    "ambience": {"keywords": ["ambience", "atmosphere", "decor", "view", "music", "lighting", "seating", "rooftop", "cozy"]},
    "hygiene": {"keywords": ["clean", "hygiene", "dirty", "neat", "tidy", "wash", "fresh", "stale"]},
    "value": {"keywords": ["price", "value", "expensive", "cheap", "worth", "overpriced", "affordable", "budget"]},
}

def analyze_sentiment(text: str):
    if not text:
        return {"score": 0.0, "label": "neutral", "key_phrases": []}

    words = set(text.lower().split())
    pos_count = len(words & POSITIVE_WORDS)
    neg_count = len(words & NEGATIVE_WORDS)
    total = pos_count + neg_count

    if total == 0:
        score = 0.1
    else:
        score = (pos_count - neg_count) / total

    if score > 0.2:
        label = "positive"
    elif score < -0.2:
        label = "negative"
    else:
        label = "neutral"

    key_phrases = []
    if pos_count > 0:
        key_phrases.extend(list(words & POSITIVE_WORDS)[:3])
    if neg_count > 0:
        key_phrases.extend(list(words & NEGATIVE_WORDS)[:3])

    return {"score": round(score, 3), "label": label, "key_phrases": key_phrases}

def analyze_food_review(text: str):
    base = analyze_sentiment(text)
    text_lower = text.lower()

    aspects = {}
    for aspect, info in FOOD_ASPECTS.items():
        mentioned = any(kw in text_lower for kw in info["keywords"])
        if mentioned:
            aspect_words = set(text_lower.split())
            pos = len(aspect_words & POSITIVE_WORDS)
            neg = len(aspect_words & NEGATIVE_WORDS)
            if pos > neg:
                aspects[aspect] = {"sentiment": "positive", "score": round(random.uniform(0.5, 1.0), 2)}
            elif neg > pos:
                aspects[aspect] = {"sentiment": "negative", "score": round(random.uniform(-1.0, -0.3), 2)}
            else:
                aspects[aspect] = {"sentiment": "neutral", "score": 0.0}

    base["aspects"] = aspects
    return base

def analyze_headlines(headlines: list):
    results = []
    for h in headlines:
        result = analyze_sentiment(h.get("title", ""))
        result["title"] = h.get("title", "")
        result["source"] = h.get("source", "")
        results.append(result)

    avg_score = sum(r["score"] for r in results) / max(len(results), 1)
    overall = "positive" if avg_score > 0.1 else ("negative" if avg_score < -0.1 else "neutral")
    return {
        "headlines": results,
        "overall_sentiment": round(avg_score, 3),
        "overall_label": overall,
        "count": len(results),
    }
