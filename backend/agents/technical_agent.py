# The Technical Agent is responsible for fetching historical price data and calculating technical indicators (RSI, MACD, EMA, Trend, etc.). It stores the calculated technical analysis in the shared GraphState.

from agents.state import GraphState
from services.market_service import MarketService
from services.indicator_service import IndicatorService
from services.logger_service import logger

market_service = MarketService()
indicator_service = IndicatorService()


def technical_agent(state: GraphState):
    logger.info("Technical agent started")

    symbol = state["symbol"]

    candles = market_service.get_historical_data(symbol)
    technical_data = indicator_service.full_analysis(candles)

    state["technical_data"] = technical_data

    logger.info(
        f"Technical analysis completed | RSI={technical_data['rsi']} "
        f"Trend={technical_data['trend']}"
    )

    return state