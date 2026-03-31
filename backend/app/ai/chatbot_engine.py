from datetime import datetime
from app.services.weather_service import get_current_weather
from app.services.tmdb_service import get_trending, get_mood_recommendations, search_entertainment
from app.services.food_service import get_nearby_restaurants, get_trending_cuisines
from app.services.sports_service import get_live_matches, get_upcoming_matches
from app.services.travel_service import get_mood_travel, get_travel_deals
from app.services.news_service import get_headlines
from app.ai.recommendation_engine import get_recommendations
from app.utils.helpers import get_time_of_day

MOOD_KEYWORDS = {
    "chill": ["chill", "relax", "calm", "peaceful", "lazy", "cozy", "tired", "rest", "quiet"],
    "excited": ["excited", "pumped", "energetic", "hyped", "thrilled", "adventure", "adrenaline", "fun"],
    "bored": ["bored", "boring", "nothing to do", "dull", "meh", "blah", "what to do", "suggest"],
    "social": ["friends", "party", "group", "gang", "hangout", "meetup", "social", "people", "together"],
    "romantic": ["romantic", "date", "love", "couple", "partner", "girlfriend", "boyfriend", "anniversary", "valentine"],
    "hungry": ["hungry", "food", "eat", "starving", "dinner", "lunch", "snack", "craving", "appetite", "famished"],
}

INTENT_PATTERNS = {
    "find_food": ["restaurant", "food", "eat", "hungry", "dinner", "lunch", "cuisine", "biryani", "pizza", "thali", "cafe", "where to eat", "order food", "best food", "nearby food", "good restaurant"],
    "check_sports": ["match", "score", "cricket", "football", "ipl", "live", "playing", "game", "who is playing", "any match", "sports", "today's match", "basketball", "tennis"],
    "plan_trip": ["trip", "travel", "weekend", "getaway", "vacation", "visit", "destination", "where to go", "holiday", "tour", "outing"],
    "get_weather": ["weather", "rain", "temperature", "hot", "cold", "forecast", "sunny", "cloudy", "humidity", "wind"],
    "watch_something": ["watch", "movie", "show", "series", "netflix", "film", "web series", "ott", "streaming", "what to watch", "recommend movie", "best movie"],
    "get_news": ["news", "headlines", "happening", "current events", "latest", "update"],
    "ask_analytics": ["trending", "popular", "statistics", "data", "analysis", "trend", "analytics", "insights"],
    "plan_evening": ["tonight", "evening", "plan", "what should i do", "suggest something", "recommend", "bored tonight", "free tonight", "nothing to do tonight"],
    "greeting": ["hi", "hello", "hey", "sup", "what's up", "good morning", "good evening", "howdy"],
    "help": ["help", "what can you do", "features", "how to use", "guide"],
}


def _detect_mood(message: str, provided_mood: str = None):
    if provided_mood:
        return provided_mood
    # Emoji detection
    emoji_moods = {
        '😌': 'chill', '😊': 'chill', '🙂': 'chill', '😴': 'bored', '💤': 'bored',
        '🤩': 'excited', '🔥': 'excited', '💪': 'excited', '🎉': 'social', '🥳': 'social',
        '💕': 'romantic', '❤️': 'romantic', '😍': 'romantic', '🍕': 'hungry', '🍔': 'hungry',
        '😢': 'bored', '😤': 'excited', '😎': 'chill', '🤔': 'bored', '😋': 'hungry',
    }
    for emoji, mood_val in emoji_moods.items():
        if emoji in message:
            return mood_val

    msg = message.lower()
    scores = {}
    for mood, keywords in MOOD_KEYWORDS.items():
        score = sum(2 if kw in msg else 0 for kw in keywords)
        if score > 0:
            scores[mood] = score
    return max(scores, key=scores.get) if scores else "chill"


def _detect_intent(message: str):
    msg = message.lower()
    scores = {}
    for intent, patterns in INTENT_PATTERNS.items():
        score = sum(1 for p in patterns if p in msg)
        if score > 0:
            scores[intent] = score
    return max(scores, key=scores.get) if scores else "plan_evening"


def _extract_city(message: str, default: str = "Ahmedabad"):
    cities = {
        "ahmedabad": "Ahmedabad", "mumbai": "Mumbai", "delhi": "Delhi",
        "bangalore": "Bangalore", "chennai": "Chennai", "kolkata": "Kolkata",
        "pune": "Pune", "jaipur": "Jaipur", "hyderabad": "Hyderabad", "goa": "Goa",
    }
    msg = message.lower()
    for key, name in cities.items():
        if key in msg:
            return name
    return default


async def process_chat(message: str, mood: str = None, context: dict = None):
    detected_mood = _detect_mood(message, mood)
    intent = _detect_intent(message)
    city = _extract_city(message)
    time_of_day = get_time_of_day()

    try:
        if intent == "greeting":
            return _greeting_response(detected_mood, time_of_day)

        elif intent == "help":
            return _help_response()

        elif intent == "find_food":
            return await _food_response(detected_mood, city)

        elif intent == "check_sports":
            return await _sports_response(message)

        elif intent == "get_weather":
            return await _weather_response(city)

        elif intent == "watch_something":
            return await _entertainment_response(detected_mood, message)

        elif intent == "plan_trip":
            return await _travel_response(detected_mood, city)

        elif intent == "get_news":
            return await _news_response(message)

        elif intent == "ask_analytics":
            return await _analytics_response()

        else:  # plan_evening or general
            return await _full_plan_response(detected_mood, city, time_of_day)

    except Exception as e:
        return {
            "reply": f"I ran into an issue fetching data, but here's what I suggest for a {detected_mood} {time_of_day}: Try exploring the different sections of the app — check Sports for live matches, Explore for restaurants and movies, or use the Plan feature for a step-by-step evening plan!",
            "mood_detected": detected_mood,
            "recommendations": [],
            "intent": intent,
        }


def _greeting_response(mood, time_of_day):
    greetings = {
        "morning": "Good morning! ☀️",
        "afternoon": "Good afternoon! 🌤️",
        "evening": "Good evening! 🌆",
        "night": "Hey there, night owl! 🌙",
    }
    greeting = greetings.get(time_of_day, "Hey there! 👋")
    return {
        "reply": f"{greeting}\n\nI'm your AI assistant for tonight! I can help you with:\n\n🎬 **Movie & show recommendations**\n🍽️ **Restaurant suggestions**\n🏏 **Live sports scores**\n✈️ **Trip planning**\n🌤️ **Weather updates**\n📰 **Latest news**\n\nJust tell me how you're feeling or what you're looking for!",
        "mood_detected": mood,
        "recommendations": [],
        "intent": "greeting",
    }


def _help_response():
    return {
        "reply": "Here's what I can do:\n\n**Try asking me:**\n• \"I'm bored, what should I do tonight?\"\n• \"Find me a good restaurant in Ahmedabad\"\n• \"Any cricket matches today?\"\n• \"What's the weather like?\"\n• \"Recommend a good movie\"\n• \"Plan a weekend trip from Ahmedabad\"\n• \"What's trending in news?\"\n• \"Plan a romantic evening\"\n\n**Tips:**\n• Tell me your mood for personalized suggestions\n• Mention a city for location-specific results\n• Ask about specific cuisines, sports, or genres",
        "mood_detected": "chill",
        "recommendations": [],
        "intent": "help",
    }


async def _food_response(mood, city):
    restaurants = await get_nearby_restaurants(mood=mood, city=city)
    cuisines_data = await get_trending_cuisines(city)

    if not restaurants:
        return {"reply": f"I couldn't find restaurants right now. Try checking the Explore page for food options in {city}!", "mood_detected": mood, "recommendations": [], "intent": "find_food"}

    top = restaurants[:5]
    lines = [f"Here are the best restaurants for your **{mood}** mood in **{city}**:\n"]
    recs = []
    for i, r in enumerate(top, 1):
        price = "₹" * r.get("price_level", 2)
        cuisines = ", ".join(r.get("cuisine", [])[:2])
        lines.append(f"**{i}. {r['name']}** — {cuisines}")
        lines.append(f"   ⭐ {r['rating']} | {price} | {r.get('address', city)}")
        if r.get("top_review"):
            lines.append(f"   💬 _{r['top_review'][:80]}_")
        lines.append("")
        recs.append({"type": "food", "name": r["name"], "rating": r["rating"]})

    # Add trending cuisine info
    if cuisines_data and cuisines_data.get("cuisines"):
        trending = sorted(cuisines_data["cuisines"].items(), key=lambda x: x[1].get("popularity", 0), reverse=True)[:3]
        lines.append(f"🔥 **Trending cuisines in {city}:** {', '.join(t[0] for t in trending)}")

    return {"reply": "\n".join(lines), "mood_detected": mood, "recommendations": recs, "intent": "find_food"}


async def _sports_response(message):
    msg = message.lower()
    sport_filter = None
    for sport in ["cricket", "football", "basketball", "tennis", "hockey", "badminton"]:
        if sport in msg:
            sport_filter = sport
            break

    live = await get_live_matches(sport_filter)
    upcoming = await get_upcoming_matches(sport_filter)

    all_matches = live + upcoming[:5]

    if not all_matches:
        sport_name = sport_filter or "any sport"
        return {"reply": f"No {sport_name} matches found right now. Check back later or try a different sport!\n\n🏏 Cricket | ⚽ Football | 🏀 Basketball | 🎾 Tennis", "mood_detected": "excited", "recommendations": [], "intent": "check_sports"}

    lines = ["Here are the latest matches:\n"]
    recs = []
    for m in all_matches[:6]:
        teams = " vs ".join(m["teams"])
        sport_emoji = {"cricket": "🏏", "football": "⚽", "basketball": "🏀", "tennis": "🎾", "hockey": "🏒", "badminton": "🏸"}.get(m["sport"], "🏆")

        if m["status"] == "live":
            score_text = ""
            if m.get("score") and m["score"].get("display"):
                score_text = f" | {m['score']['display']}"
            lines.append(f"{sport_emoji} **LIVE: {teams}**{score_text}")
            lines.append(f"   {m['league']} | Excitement: {m['excitement_score']}/100 🔥")
        elif m["status"] == "completed":
            score_text = m.get("score", {}).get("display", "")
            lines.append(f"{sport_emoji} **{teams}** — {score_text} (Completed)")
            lines.append(f"   {m['league']}")
        else:
            date_str = ""
            if m.get("start_time"):
                try:
                    dt = datetime.fromisoformat(m["start_time"].replace("Z", "+00:00"))
                    date_str = dt.strftime("%d %b, %I:%M %p")
                except:
                    date_str = m["start_time"][:10]
            lines.append(f"{sport_emoji} **{teams}** — {date_str}")
            lines.append(f"   {m['league']}{' | ' + m.get('venue', '') if m.get('venue') else ''}")

        lines.append("")
        recs.append({"type": "sports", "match": teams, "excitement": m.get("excitement_score", 0)})

    return {"reply": "\n".join(lines), "mood_detected": "excited", "recommendations": recs, "intent": "check_sports"}


async def _weather_response(city):
    weather = await get_current_weather(city)
    if not weather or weather.get("condition") == "Unavailable":
        return {"reply": f"Couldn't fetch weather for {city} right now. Try again in a moment!", "mood_detected": "chill", "recommendations": [], "intent": "get_weather"}

    icon_map = {"Clear": "☀️", "Mainly Clear": "🌤️", "Partly Cloudy": "⛅", "Overcast": "☁️", "Fog": "🌫️", "Rain": "🌧️", "Light Rain": "🌦️", "Drizzle": "🌧️", "Thunderstorm": "⛈️", "Snow": "❄️"}
    icon = icon_map.get(weather["condition"], "🌤️")

    lines = [
        f"**Weather in {weather['city']}** {icon}\n",
        f"🌡️ **{weather['temperature']}°C** (Feels like {weather['feels_like']}°C)",
        f"☁️ {weather['description'].capitalize() if isinstance(weather['description'], str) else weather['condition']}",
        f"💧 Humidity: {weather['humidity']}%",
        f"💨 Wind: {weather['wind_speed']} km/h",
        "",
    ]

    # Add activity suggestion based on weather
    temp = weather["temperature"]
    condition = weather["condition"].lower()
    if "rain" in condition or "thunder" in condition or "drizzle" in condition:
        lines.append("🏠 **Suggestion:** Rainy weather! Perfect for movies at home, a cozy cafe, or trying indoor activities.")
    elif temp > 35:
        lines.append("🧊 **Suggestion:** It's hot! Try AC restaurants, ice cream spots, or plan an evening outing when it cools down.")
    elif temp < 15:
        lines.append("🧥 **Suggestion:** Bundle up! Great weather for hot chai, street food, or a warm restaurant dinner.")
    else:
        lines.append("✨ **Suggestion:** Great weather for going out! Perfect for a walk, outdoor dining, or exploring the city.")

    return {"reply": "\n".join(lines), "mood_detected": "chill", "recommendations": [], "intent": "get_weather"}


async def _entertainment_response(mood, message):
    msg = message.lower()

    # Check if searching for something specific
    search_terms = ["search", "find", "look for", "about"]
    is_search = any(term in msg for term in search_terms)

    if is_search:
        # Extract search query (remove common words)
        query = msg
        for word in ["search", "find", "look for", "movie", "show", "series", "watch", "recommend", "me", "a", "the", "about", "for", "good", "best"]:
            query = query.replace(word, "")
        query = query.strip()
        if query:
            results = await search_entertainment(query)
            if results:
                lines = [f"Here's what I found for **\"{query}\"**:\n"]
                for i, item in enumerate(results[:5], 1):
                    genres = ", ".join(item.get("genres", [])[:2]) if item.get("genres") else item.get("type", "")
                    lines.append(f"**{i}. {item['title']}** — {genres}")
                    lines.append(f"   ⭐ {item['rating']}/10 | {item.get('release_date', '')[:4] if item.get('release_date') else ''}")
                    if item.get("overview"):
                        lines.append(f"   {item['overview'][:100]}...")
                    lines.append("")
                return {"reply": "\n".join(lines), "mood_detected": mood, "recommendations": [{"type": "entertainment", "title": r["title"]} for r in results[:5]], "intent": "watch_something"}

    # Mood-based recommendations
    items = await get_mood_recommendations(mood)
    if not items:
        items = await get_trending()

    if items:
        lines = [f"Based on your **{mood}** mood, here's what to watch tonight:\n"]
        for i, item in enumerate(items[:5], 1):
            type_emoji = "🎬" if item.get("type") == "movie" else "📺"
            genres = ", ".join(item.get("genres", [])[:2])
            lines.append(f"{type_emoji} **{i}. {item['title']}** — {genres}")
            lines.append(f"   ⭐ {item['rating']}/10")
            if item.get("overview"):
                lines.append(f"   {item['overview'][:100]}...")
            lines.append("")

        lines.append("💡 **Tip:** Select a mood on the home page for more personalized picks!")
        return {"reply": "\n".join(lines), "mood_detected": mood, "recommendations": [{"type": "entertainment", "title": i["title"]} for i in items[:5]], "intent": "watch_something"}

    return {"reply": "Check out the trending section on the home page for the latest movies and shows!", "mood_detected": mood, "recommendations": [], "intent": "watch_something"}


async def _travel_response(mood, city):
    destinations = await get_mood_travel(mood)

    if not destinations:
        destinations = await get_travel_deals(city)

    if not destinations:
        return {"reply": f"I couldn't fetch travel data right now. Try the Explore page for travel ideas from {city}!", "mood_detected": mood, "recommendations": [], "intent": "plan_trip"}

    lines = [f"Here are travel ideas from **{city}** matching your **{mood}** mood:\n"]
    recs = []
    for d in destinations[:4]:
        lines.append(f"📍 **{d['destination']}** — {d.get('distance_km', '?')} km away")
        lines.append(f"   💰 {d.get('budget_range', 'Check prices')}")
        if d.get("highlights"):
            lines.append(f"   ✨ {', '.join(d['highlights'][:3])}")
        if d.get("transport_options"):
            lines.append(f"   🚗 {', '.join(d['transport_options'][:3])}")
        if d.get("best_time"):
            lines.append(f"   📅 Best time: {d['best_time']}")
        lines.append("")
        recs.append({"type": "travel", "destination": d["destination"]})

    lines.append("💡 **Tip:** Use the Plan feature for a complete evening/weekend itinerary!")
    return {"reply": "\n".join(lines), "mood_detected": mood, "recommendations": recs, "intent": "plan_trip"}


async def _news_response(message):
    msg = message.lower()
    category = "entertainment"
    if any(w in msg for w in ["sport", "cricket", "football", "ipl"]):
        category = "sports"
    elif any(w in msg for w in ["tech", "technology", "startup", "ai"]):
        category = "technology"
    elif any(w in msg for w in ["business", "market", "stock", "economy"]):
        category = "business"

    headlines = await get_headlines(category)
    if not headlines:
        return {"reply": "I couldn't fetch news right now. Try again in a moment!", "mood_detected": "chill", "recommendations": [], "intent": "get_news"}

    lines = [f"📰 **Latest {category.capitalize()} Headlines:**\n"]
    for h in headlines[:5]:
        sentiment_icon = "📈" if h.get("sentiment", 0) > 0.6 else ("📉" if h.get("sentiment", 0) < 0.3 else "📊")
        lines.append(f"{sentiment_icon} **{h['title']}**")
        lines.append(f"   — {h.get('source', 'Unknown')} | {h.get('published_at', '')[:10]}")
        lines.append("")

    return {"reply": "\n".join(lines), "mood_detected": "chill", "recommendations": [{"type": "news", "title": h["title"]} for h in headlines[:5]], "intent": "get_news"}


async def _analytics_response():
    trending = await get_trending()
    lines = ["📊 **What's Trending Right Now:**\n"]

    if trending:
        lines.append("**Top Entertainment:**")
        for item in trending[:5]:
            lines.append(f"  • {item['title']} — ⭐ {item['rating']}")
        lines.append("")

    lines.append("💡 Visit the **Analytics** page for detailed charts on:")
    lines.append("  • Genre popularity trends")
    lines.append("  • Cross-domain activity patterns")
    lines.append("  • Cuisine distribution")
    lines.append("  • Sports excitement analysis")
    lines.append("  • Price vs rating insights")

    return {"reply": "\n".join(lines), "mood_detected": "chill", "recommendations": [{"type": "entertainment", "title": t["title"]} for t in (trending or [])[:5]], "intent": "ask_analytics"}


async def _full_plan_response(mood, city, time_of_day):
    result = await get_recommendations(mood, city=city)

    lines = [f"**{result['plan_title']}** 🎯\n"]
    lines.append(f"_Based on your {mood} mood • {time_of_day} • {city}_\n")

    emoji_map = {"entertainment": "🎬", "food": "🍽️", "sports": "🏏", "travel": "✈️", "events": "🎭", "music": "🎵"}

    for step in result.get("steps", []):
        emoji = emoji_map.get(step.get("category"), "📌")
        lines.append(f"**{step['step']}. {emoji} {step['title']}**")
        lines.append(f"   {step['description']}")
        lines.append("")

    confidence = result.get("confidence", 0)
    lines.append(f"📊 Confidence: **{confidence}%** match for your mood")
    lines.append(f"\n💡 **Want more detail?** Ask me about any specific category — food, movies, sports, or travel!")

    return {
        "reply": "\n".join(lines),
        "mood_detected": mood,
        "recommendations": result.get("steps", []),
        "intent": "plan_evening",
    }
