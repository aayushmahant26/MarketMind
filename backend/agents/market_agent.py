# The Market Agent is responsible for finding which stock/index the user is asking about and fetching its latest market data. 
# It stores that data in the shared GraphState for the next agents.

from agents.state import GraphState
from services.market_service import MarketService
from services.symbol_service import normalize_symbol
from services.query_service import extract_symbol
from services.logger_service import logger

market_service = MarketService()


def market_agent(state: GraphState):
    logger.info("Market agent started")

    query = state["query"]

    extracted_symbol = extract_symbol(query)

    if not extracted_symbol:
        logger.error("No valid stock symbol found in query")
        raise Exception("No valid stock symbol found in query")

    if extracted_symbol.upper() == "NONE":
        logger.info("Out-of-context query detected. Setting symbol to None.")
        state["query_symbol"] = "None"
        state["symbol"] = "None"
        state["market_data"] = None
        return state

    normalized_symbol = normalize_symbol(extracted_symbol)

    logger.info(
        f"Symbol extracted: {extracted_symbol} -> normalized to {normalized_symbol}"
    )

    market_data = market_service.get_stock_info(normalized_symbol)

    if market_data.get("current_price") is None:
        logger.error(f"Could not retrieve market data for symbol '{normalized_symbol}'")
        raise Exception(f"Could not retrieve market data for '{extracted_symbol}' (resolved: '{normalized_symbol}'). Please verify the symbol.")

    logger.info(f"Fetched market data for {normalized_symbol}")

    state["query_symbol"] = extracted_symbol
    state["symbol"] = normalized_symbol
    state["market_data"] = market_data

    logger.info("Market agent completed successfully")

    return state