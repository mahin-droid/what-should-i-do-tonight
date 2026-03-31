from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class WeatherResponse(BaseModel):
    city: str
    temperature: float
    feels_like: float
    humidity: int
    condition: str
    icon: str
    wind_speed: float
    description: str

class EntertainmentItem(BaseModel):
    id: int
    title: str
    type: str  # movie, tv, music
    rating: float
    poster_url: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = None
    genres: List[str] = []
    trending_score: Optional[float] = None

class SportsMatch(BaseModel):
    match_id: str
    sport: str  # cricket, football
    teams: List[str]
    score: Optional[dict] = None
    status: str  # live, upcoming, completed
    venue: Optional[str] = None
    league: Optional[str] = None
    start_time: Optional[str] = None
    excitement_score: float = 0.0

class Restaurant(BaseModel):
    id: str
    name: str
    cuisine: List[str]
    rating: float
    price_level: int  # 1-4
    distance_km: Optional[float] = None
    address: Optional[str] = None
    review_sentiment: Optional[float] = None
    top_review: Optional[str] = None

class TravelDeal(BaseModel):
    destination: str
    distance_km: float
    budget_range: str
    transport_options: List[str]
    best_time: Optional[str] = None
    highlights: List[str] = []
    image_url: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    mood: Optional[str] = None
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    mood_detected: Optional[str] = None
    recommendations: Optional[List[dict]] = None
    intent: Optional[str] = None

class RecommendationRequest(BaseModel):
    mood: Optional[str] = None
    weather: Optional[str] = None
    time: Optional[str] = None
    budget: Optional[str] = None
    city: Optional[str] = "Ahmedabad"

class RecommendationResponse(BaseModel):
    plan_title: str
    steps: List[dict]
    categories: List[str]
    confidence: float
    mood: str

class AnalyticsData(BaseModel):
    chart_type: str
    title: str
    subtitle: Optional[str] = None
    data: List[dict]
    insights: Optional[List[str]] = None
