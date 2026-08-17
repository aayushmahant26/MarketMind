# The News Agent is responsible for fetching latest market news related to the user's query symbol. 
# It uses NewsService() to fetch the news from the market.
# It stores the fetched news in the shared GraphState for the next agents.

from agents.state import GraphState
from services.news_service import NewsService
from services.logger_service import logger

news_service = NewsService()


def news_agent(state: GraphState):
    logger.info("News agent started")

    query_symbol = state["query_symbol"]

    headlines = news_service.fetch_market_news(query_symbol)
    
    news_data = {
        "headline_count": len(headlines),
        "articles": headlines
    }

    state["news_data"] = news_data

    logger.info(
        f"News agent completed | Headline count={len(headlines)}"
    )

    return state