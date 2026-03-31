import random
from app.services.cache_service import cache

MOCK_PLAYLISTS = {
    "chill": [
        {"title": "Tum Hi Ho", "artist": "Arijit Singh", "album": "Aashiqui 2", "genre": "Bollywood Romance"},
        {"title": "Agar Tum Saath Ho", "artist": "Arijit Singh & Alka Yagnik", "album": "Tamasha", "genre": "Bollywood Romance"},
        {"title": "Raabta", "artist": "Arijit Singh", "album": "Agent Vinod", "genre": "Bollywood"},
        {"title": "Channa Mereya", "artist": "Arijit Singh", "album": "Ae Dil Hai Mushkil", "genre": "Bollywood Romance"},
        {"title": "Khairiyat", "artist": "Arijit Singh", "album": "Chhichhore", "genre": "Bollywood"},
    ],
    "excited": [
        {"title": "Naatu Naatu", "artist": "Rahul Sipligunj & Kaala Bhairava", "album": "RRR", "genre": "Telugu/Dance"},
        {"title": "Besharam Rang", "artist": "Shilpa Rao & Caralisa", "album": "Pathaan", "genre": "Bollywood Dance"},
        {"title": "Jhoome Jo Pathaan", "artist": "Arijit Singh & Sukriti Kakar", "album": "Pathaan", "genre": "Bollywood Dance"},
        {"title": "Zinda Banda", "artist": "Anirudh", "album": "Jawan", "genre": "Bollywood"},
        {"title": "Arabic Kuthu", "artist": "Anirudh", "album": "Beast", "genre": "Tamil/Dance"},
    ],
    "romantic": [
        {"title": "Hawayein", "artist": "Arijit Singh", "album": "Jab Harry Met Sejal", "genre": "Bollywood Romance"},
        {"title": "Pal Pal Dil Ke Paas", "artist": "Arijit Singh", "album": "Pal Pal Dil Ke Paas", "genre": "Bollywood Romance"},
        {"title": "Pehla Nasha", "artist": "Udit Narayan & Sadhana Sargam", "album": "Jo Jeeta Wohi Sikandar", "genre": "Retro Romance"},
        {"title": "Tujhe Kitna Chahne Lage", "artist": "Arijit Singh", "album": "Kabir Singh", "genre": "Bollywood Romance"},
    ],
    "social": [
        {"title": "London Thumakda", "artist": "Labh Janjua & Sonu Kakkar", "album": "Queen", "genre": "Bollywood Party"},
        {"title": "Gallan Goodiyaan", "artist": "Various", "album": "Dil Dhadakne Do", "genre": "Bollywood Party"},
        {"title": "Kala Chashma", "artist": "Badshah & Neha Kakkar", "album": "Baar Baar Dekho", "genre": "Bollywood Party"},
        {"title": "Kar Gayi Chull", "artist": "Badshah & Neha Kakkar", "album": "Kapoor & Sons", "genre": "Bollywood Party"},
    ],
}

async def get_mood_playlist(mood: str):
    cached = cache.get(f"spotify_{mood}", "entertainment")
    if cached:
        return cached

    playlist = MOCK_PLAYLISTS.get(mood.lower(), MOCK_PLAYLISTS["chill"])
    result = {
        "mood": mood,
        "playlist_name": f"{mood.capitalize()} Vibes - Tonight's Mix",
        "tracks": playlist,
        "total_tracks": len(playlist),
    }
    cache.set(f"spotify_{mood}", result, "entertainment")
    return result
