from fastapi import APIRouter, Query
from app.services.sports_service import get_live_matches, get_upcoming_matches, get_recent_results, get_available_sports

router = APIRouter()

@router.get("/live")
async def live_matches(sport: str = Query(None, description="Filter by sport: cricket, football, basketball, tennis, hockey, badminton, baseball")):
    filter_sport = sport if sport and sport != "all" else None
    data = await get_live_matches(filter_sport)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/upcoming")
async def upcoming_matches(sport: str = Query(None)):
    filter_sport = sport if sport and sport != "all" else None
    data = await get_upcoming_matches(filter_sport)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/results")
async def recent_results(sport: str = Query(None)):
    filter_sport = sport if sport and sport != "all" else None
    data = await get_recent_results(filter_sport)
    return {"status": "success", "data": data, "count": len(data)}

@router.get("/sports")
async def available_sports():
    return {"status": "success", "data": get_available_sports()}

@router.get("/match/{match_id}")
async def match_details(match_id: str):
    all_matches = await get_live_matches()
    match = next((m for m in all_matches if m["match_id"] == match_id), None)
    if not match:
        upcoming = await get_upcoming_matches()
        match = next((m for m in upcoming if m["match_id"] == match_id), None)
    if not match:
        results = await get_recent_results()
        match = next((m for m in results if m["match_id"] == match_id), None)
    if not match:
        return {"status": "error", "message": "Match not found"}
    return {"status": "success", "data": match}
