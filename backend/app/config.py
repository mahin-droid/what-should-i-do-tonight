import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Entertainment
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "demo_key")
    # Weather (Open-Meteo is used by default - no key needed)
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "demo_key")
    # Music
    SPOTIFY_CLIENT_ID: str = os.getenv("SPOTIFY_CLIENT_ID", "demo_key")
    SPOTIFY_CLIENT_SECRET: str = os.getenv("SPOTIFY_CLIENT_SECRET", "demo_key")
    # News
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "demo_key")
    GNEWS_API_KEY: str = os.getenv("GNEWS_API_KEY", "demo_key")
    # Sports
    FOOTBALL_API_KEY: str = os.getenv("FOOTBALL_API_KEY", "demo_key")
    CRICKET_API_KEY: str = os.getenv("CRICKET_API_KEY", "demo_key")
    # Food - FourSquare Places API (free 100K/month)
    FOURSQUARE_API_KEY: str = os.getenv("FOURSQUARE_API_KEY", "demo_key")
    # Travel - Amadeus Test API (free, real flight data)
    AMADEUS_CLIENT_ID: str = os.getenv("AMADEUS_CLIENT_ID", "demo_key")
    AMADEUS_CLIENT_SECRET: str = os.getenv("AMADEUS_CLIENT_SECRET", "demo_key")
    # Events - Ticketmaster (free 5000/day)
    TICKETMASTER_API_KEY: str = os.getenv("TICKETMASTER_API_KEY", "demo_key")
    # Database & Server
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

settings = Settings()
