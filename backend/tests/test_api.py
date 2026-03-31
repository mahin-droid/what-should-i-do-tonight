import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.anyio
async def test_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

@pytest.mark.anyio
async def test_weather_current(client):
    response = await client.get("/api/weather/current?city=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert "temperature" in data["data"]

@pytest.mark.anyio
async def test_weather_forecast(client):
    response = await client.get("/api/weather/forecast?city=Mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

@pytest.mark.anyio
async def test_entertainment_trending(client):
    response = await client.get("/api/entertainment/trending")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert isinstance(data["data"], list)

@pytest.mark.anyio
async def test_entertainment_search(client):
    response = await client.get("/api/entertainment/search?q=jawan")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

@pytest.mark.anyio
async def test_sports_live(client):
    response = await client.get("/api/sports/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert isinstance(data["data"], list)

@pytest.mark.anyio
async def test_sports_with_filter(client):
    response = await client.get("/api/sports/live?sport=cricket")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_sports_upcoming(client):
    response = await client.get("/api/sports/upcoming")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_food_nearby(client):
    response = await client.get("/api/food/nearby?city=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert isinstance(data["data"], list)

@pytest.mark.anyio
async def test_food_trending(client):
    response = await client.get("/api/food/trending?city=Ahmedabad")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_travel_deals(client):
    response = await client.get("/api/travel/deals?from_city=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

@pytest.mark.anyio
async def test_travel_suggestions(client):
    response = await client.get("/api/travel/suggestions?mood=chill")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_events_nearby(client):
    response = await client.get("/api/events/nearby?city=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"], list)

@pytest.mark.anyio
async def test_recommendations(client):
    response = await client.get("/api/recommendations?mood=chill&city=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "steps" in data["data"]

@pytest.mark.anyio
async def test_chat(client):
    response = await client.post("/api/chat", json={"message": "I'm bored tonight", "mood": "bored"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "reply" in data["data"]

@pytest.mark.anyio
async def test_analytics_genre_trends(client):
    response = await client.get("/api/analytics/genre-trends")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_analytics_cuisine(client):
    response = await client.get("/api/analytics/cuisine-distribution?city=Ahmedabad")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_analytics_cross_domain(client):
    response = await client.get("/api/analytics/cross-domain")
    assert response.status_code == 200

@pytest.mark.anyio
async def test_analytics_sports_stats(client):
    response = await client.get("/api/analytics/sports-stats")
    assert response.status_code == 200
