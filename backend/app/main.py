from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from collections import defaultdict
import time
from app.config import settings
from app.database import init_db
from app.routers import entertainment, sports, food, weather, travel, events, analytics, chatbot, recommendations

# Simple rate limiter
class RateLimiter:
    def __init__(self, requests_per_minute=60):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        minute_ago = now - 60
        self.requests[client_ip] = [t for t in self.requests[client_ip] if t > minute_ago]
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            return False
        self.requests[client_ip].append(now)
        return True

rate_limiter = RateLimiter(requests_per_minute=120)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="What Should I Do Tonight? API",
    description="AI-powered life recommendation engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip):
        return JSONResponse(status_code=429, content={"detail": "Too many requests. Please slow down."})
    response = await call_next(request)
    return response

app.include_router(entertainment.router, prefix="/api/entertainment", tags=["Entertainment"])
app.include_router(sports.router, prefix="/api/sports", tags=["Sports"])
app.include_router(food.router, prefix="/api/food", tags=["Food"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(travel.router, prefix="/api/travel", tags=["Travel"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(chatbot.router, prefix="/api/chat", tags=["Chat"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
