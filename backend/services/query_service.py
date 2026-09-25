# The Query Service is responsible for extracting stock symbols from the user's query. It uses a combination of regex and a mapping dictionary to extract the stock symbol from the query.
# It uses SYMBOL_MAP from symbol_service.py to get the stock symbols.
# It uses re from regex module to extract the stock symbol from the query.

import re
from services.symbol_service import SYMBOL_MAP
from llms.router import LLMRouter

router = None

def extract_symbol(query):
    global router
    upper_query = query.upper()

    # 1. First, check if it's in our static dictionary map (sorted by length descending with word boundaries)
    sorted_symbols = sorted(SYMBOL_MAP.keys(), key=len, reverse=True)
    for symbol in sorted_symbols:
        if symbol.startswith("^"):
            if symbol in upper_query:
                return symbol
        elif re.search(r'(?:\b|^)' + re.escape(symbol) + r'(?:\b|$)', upper_query):
            return symbol

    # 2. Try falling back to LLM to correct spelling and extract the correct entity name/symbol
    try:
        if router is None:
            router = LLMRouter()
            
        prompt = f"""You are a financial entity extraction assistant.
Analyze the user query: "{query}"

Classify the query into one of three categories:
1. Specific Entity: If the query mentions a specific company name, stock ticker, or index, reply ONLY with that entity name (e.g. "reliance" -> "RELIANCE", "infosis" -> "INFOSYS", "tata motors" -> "TATAMOTORS"). Correct typos and spelling errors.
2. General Financial: If the query does NOT mention a specific company, but is about general stock market trends, general news headlines, market sentiments, sectors, or financial indices, reply ONLY with "NIFTY".
3. Out of Context: If the query is completely unrelated to finance, investments, stock markets, or technical analysis (e.g. baking recipes, FIFA world cup, general coding advice, movies), reply ONLY with "None".

Provide ONLY the corrected ticker name, "NIFTY", or "None". Do NOT include any punctuation, quotes, introduction, or extra words.
Result:"""
        result = router.generate(prompt)
        corrected = result["response"].strip().replace('"', '').replace("'", "")
        if corrected:
            return corrected
    except Exception:
        # Fallback to local heuristic parser if LLM fails
        pass

    # 3. Fallback heuristic for custom symbols
    common_words = {
        "ANALYZE", "WHAT", "IS", "THE", "TREND", "STOCK", "FOR", "TOMORROW", 
        "TODAY", "WEEK", "MONTH", "YEAR", "CHART", "REPORT", "PRICE", "LIVE", 
        "QUOTE", "INDICATOR", "INDICATORS", "TECHNICAL", "ANALYSIS", "MARKET", 
        "MIND", "AI", "RESEARCH", "ASSISTANT", "AND", "EXPLAIN", "KEY", "OF",
        "RSI", "MACD", "EMA", "SMA", "ATR", "BOLLINGER", "BAND", "BANDS", "BB",
        "SUPPORT", "RESISTANCE", "RISK"
    }

    words = re.findall(r'[A-Z\^]+', upper_query)
    for word in words:
        if len(word) >= 2 and word not in common_words:
            return word

    return None