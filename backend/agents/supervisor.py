# The Supervisor Agent is the first agent that runs in the LangGraph workflow. It analyzes the user's query, determines what kind of analysis is needed (analysis_type), and decides which downstream agents (News, Risk, etc.) should run or be skipped to make the workflow efficient.

from agents.state import GraphState
from services.logger_service import logger


def supervisor_agent(state: GraphState):
    # This function is the first agent that executes. It receives the current GraphState and returns the updated state.
    logger.info("Supervisor agent started")

    # If force_full is True (from AI Research), skip classification and run all nodes
    if state.get("force_full", False): # checks whether force_full == True . If force_full value doesnt exist , False is used as default
        state["analysis_type"] = "full"
        state["skip_news"] = False
        state["skip_risk"] = False
        logger.info(
            "Routing decision: force_full=True | skip_news=False, skip_risk=False | type=full"
        )
        return state

    # If force_full is False (from Chat), perform keyword classification
    query = state["query"].lower()

    if "rsi" in query:
        analysis_type = "rsi"
    elif "macd" in query:
        analysis_type = "macd"
    elif "ema" in query:
        analysis_type = "ema"
    elif "sma" in query:
        analysis_type = "sma"
    elif "bollinger" in query or "bb" in query or "bands" in query:
        analysis_type = "bollinger"
    elif "atr" in query or "average true range" in query:
        analysis_type = "atr"
    elif "support" in query or "resistance" in query or "level" in query or "zone" in query:
        analysis_type = "support_resistance"
    elif "trend" in query:
        analysis_type = "trend"
    elif "technical" in query or "indicator" in query or "technicals" in query:
        analysis_type = "technical"
    elif "news" in query or "headline" in query or "article" in query or "feed" in query:
        analysis_type = "news"
    elif "risk" in query or "volatility" in query:
        analysis_type = "risk"
    elif "buy" in query or "sell" in query or "should i" in query or "recommendation" in query or "advice" in query:
        analysis_type = "buy_sell"
    elif "market" in query or "price" in query or "volume" in query or "quote" in query:
        analysis_type = "market"
    else:
        analysis_type = "full"

    # Configure skip flags based on analysis type
    skip_news = False
    skip_risk = False

    if analysis_type in ["rsi", "macd", "ema", "sma", "bollinger", "atr", "support_resistance", "trend", "technical", "market"]:
        skip_news = True
        skip_risk = True
    elif analysis_type == "news":
        skip_news = False
        skip_risk = True
    elif analysis_type == "risk":
        skip_news = True
        skip_risk = False
    elif analysis_type in ["buy_sell", "full"]:
        skip_news = False
        skip_risk = False

    state["analysis_type"] = analysis_type
    state["skip_news"] = skip_news
    state["skip_risk"] = skip_risk

    logger.info(
        f"Classification: type={analysis_type} | skip_news={skip_news}, skip_risk={skip_risk}"
    )

    return state
