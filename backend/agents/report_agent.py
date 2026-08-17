# The Report Agent builds an LLM prompt using all the data collected by previous agents (market, technical, news, risk) and asks the LLM to generate the final response. It stores the generated answer in state["final_report"].

from agents.state import GraphState
from llms.router import LLMRouter # Using LLMRouter to route the prompt to the LLM.
from services.logger_service import logger

router = LLMRouter() # Initializing LLMRouter.

# This function creates the prompt that will be sent to the LLM.
# It does not call the LLM.
# It only prepares the input.
def build_prompt(state):
    analysis_type = state.get("analysis_type", "full")
    query = state["query"]
    symbol = state["query_symbol"]
    market_data = state.get("market_data")
    technical_data = state.get("technical_data")
    news_data = state.get("news_data")
    risk_data = state.get("risk_data")

    context = state.get("conversation_context", "")
    context_str = f"\nConversation Context:\n{context}\n" if context else ""

    # Creates the common part of every prompt.
    base_header = f"""You are an expert Indian stock market analyst. 

{context_str}

User Query: {query}
Symbol: {symbol}
Market Data: {market_data}
"""

    if analysis_type == "rsi":
        prompt = base_header + f"""Technical Analysis (specifically RSI): {technical_data}

Instructions:
Provide ONLY:
- The RSI value.
- Whether it indicates bullish, bearish, overbought, oversold, or neutral momentum.
- A 2-3 sentence explanation of what this indicates for the stock.

DO NOT mention MACD, EMA, SMA, ATR, Bollinger Bands, Support, Resistance, News, or Risk.
The response should be around 60-80 words.
"""
    elif analysis_type == "macd":
        prompt = base_header + f"""Technical Analysis (specifically MACD): {technical_data}

Instructions:
Provide ONLY:
- The MACD value and Signal value.
- A brief explanation of what they indicate (e.g. crossover signal, bullish/bearish momentum).

DO NOT mention RSI, EMA, SMA, ATR, Bollinger Bands, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "ema":
        prompt = base_header + f"""Technical Analysis (specifically EMA): {technical_data}

Instructions:
Provide ONLY the 20-period Exponential Moving Average (EMA) value and a brief explanation of how the current price stands relative to the EMA.
DO NOT mention RSI, MACD, SMA, ATR, Bollinger Bands, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "sma":
        prompt = base_header + f"""Technical Analysis (specifically SMA): {technical_data}

Instructions:
Provide ONLY the 50-period Simple Moving Average (SMA) value and a brief explanation of how the current price stands relative to the SMA.
DO NOT mention RSI, MACD, EMA, ATR, Bollinger Bands, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "bollinger":
        prompt = base_header + f"""Technical Analysis (specifically Bollinger Bands): {technical_data}

Instructions:
Provide ONLY the Bollinger Bands upper and lower levels, and what they indicate about the stock's current price boundaries and volatility.
DO NOT mention RSI, MACD, EMA, SMA, ATR, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "atr":
        prompt = base_header + f"""Technical Analysis (specifically ATR): {technical_data}

Instructions:
Provide ONLY the Average True Range (ATR) value and a brief explanation of what it indicates about the stock's current price volatility.
DO NOT mention RSI, MACD, EMA, SMA, Bollinger Bands, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "support_resistance":
        prompt = base_header + f"""Technical Analysis (specifically Support & Resistance): {technical_data}

Instructions:
Provide ONLY the calculated support and resistance levels, and what they represent in terms of immediate price ceilings and floors.
DO NOT mention RSI, MACD, EMA, SMA, ATR, Bollinger Bands, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "trend":
        prompt = base_header + f"""Technical Analysis (specifically Trend): {technical_data}

Instructions:
Provide ONLY the current trend classification (Bullish, Bearish, or Sideways) and a clear, brief explanation of why it is classified this way based on moving averages and price.
DO NOT mention RSI, MACD, ATR, Bollinger Bands, Support, Resistance, News, or Risk.
Keep it concise.
"""
    elif analysis_type == "technical":
        prompt = base_header + f"""Technical Analysis: {technical_data}

Instructions:
Provide a medium-length technical analysis report.
Include:
- RSI (value and interpretation)
- MACD (MACD, Signal, and crossover interpretation)
- EMA 20 & SMA 50
- Current Trend
- Support & Resistance levels

DO NOT include news analysis, news headlines, or risk scoring/risk profiles.
Keep it moderately detailed but focused strictly on technical indicators.
"""
    elif analysis_type == "news":
        prompt = base_header + f"""News Analysis: {news_data}

Instructions:
Provide ONLY a concise news summary based on the headlines. Mention the key news themes and whether the general news tone is positive, negative, or neutral.
DO NOT include technical indicators, support/resistance, or risk assessment.
Keep it concise.
"""
    elif analysis_type == "risk":
        prompt = base_header + f"""Risk Analysis: {risk_data}

Instructions:
Provide ONLY a risk assessment, explaining the calculated risk level and score. Mention key sources of risk (volatility, price ranges).
DO NOT include indicators like MACD or news summaries.
Keep it concise.
"""
    elif analysis_type == "buy_sell":
        prompt = base_header + f"""Technical Analysis: {technical_data}
News Analysis: {news_data}
Risk Analysis: {risk_data}

Instructions:
Provide a clear, speculative trading recommendation:
- Short recommendation (e.g. Buy, Sell, or Hold)
- Key reasons supporting this recommendation
- Associated risks

Provide this in a concise, structured format.
"""
    elif analysis_type == "market":
        prompt = base_header + f"""
Instructions:
Provide ONLY a raw market quote summary based on the market data. Include current price, day high, day low, volume, and percentage change.
DO NOT mention technical indicators (RSI, MACD, EMA, SMA, ATR, Bollinger), news, or risk profiles.
Keep it concise.
"""
    else:  # full
        prompt = f"""You are an expert Indian stock market analyst.

{context_str}

User Query:
{query}

Symbol:
{symbol}

Market Data:
{market_data}

Technical Analysis:
{technical_data}

News Analysis:
{news_data}

Risk Analysis:
{risk_data}

Instructions:
Analyze the market data, technical indicators, news sentiment, and risk profile above. Based on this information, provide a definitive projection of the most likely future trend (Bullish, Bearish, or Sideways) and key trading levels. Do NOT output boilerplate disclaimers about being an AI that cannot predict future market movements. Speculate professionally based on the mathematical evidence.

Generate a professional stock research report in this format:

Trend:
Confidence:
Support:
Resistance:
Risk:
Technical Summary:
News Summary:
Recommendation:
"""
    return prompt


def report_agent(state: GraphState):
    logger.info("Report agent started")

    prompt = build_prompt(state)
    result = router.generate(prompt) # Sends the prompt to the LLM.

    state["final_report"] = result["response"] # Stores the generated report inside GraphState.

    logger.info(
        f"Final report generated using {result['model']}"
    )

    return state