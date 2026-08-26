from llms.router import LLMRouter
from reports.models import ChatMessage

router = LLMRouter()

class ChatService:
    
    def chat(self, user, message, symbol=None):
        from agents.graph import run_marketmind
        from services.query_service import extract_symbol

        # Run the unified LangGraph agent network with force_full=False
        result = run_marketmind(message, force_full=False)
        response = result.get("final_report") or "No response generated."

        # Extract symbol for database logging
        extracted = symbol or extract_symbol(message)

        # Log conversation to database history
        ChatMessage.objects.create(
            user=user,
            symbol=extracted if extracted else symbol,
            message=message,
            response=response
        )

        return response