from llms.router import LLMRouter
from reports.models import ChatMessage

router = LLMRouter()

class ChatService:

    def get_recent_context(self, user, symbol=None):
        chats = ChatMessage.objects.filter(
            user=user
        )

        if symbol:
            chats = chats.filter(symbol=symbol)

        chats = chats.order_by('-created_at')[:5]
        chats = reversed(chats)

        context = ""

        for chat in chats:
            context += f"""
Symbol: {chat.symbol}
User: {chat.message}
Assistant: {chat.response}
"""

        return context
    
    def chat(self, user, message, symbol=None):
        from agents.graph import run_marketmind
        from services.query_service import extract_symbol

        # Retrieve conversation context from history
        context = self.get_recent_context(user, symbol)

        # Run the unified LangGraph agent network with force_full=False
        result = run_marketmind(message, force_full=False, conversation_context=context)
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