from fastapi import APIRouter
from app.models.schemas import ChatMessage
from app.ai.chatbot_engine import process_chat

router = APIRouter()

@router.post("")
async def chat(message: ChatMessage):
    try:
        response = await process_chat(message.message, message.mood, message.context)
        return {"status": "success", "data": response}
    except Exception as e:
        return {
            "status": "success",
            "data": {
                "reply": "I'm having trouble right now. Try asking me something else, or use the mood selector on the home page for recommendations!",
                "mood_detected": message.mood or "chill",
                "recommendations": [],
                "intent": "error",
            }
        }
