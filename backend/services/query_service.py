# The Query Service is responsible for extracting stock symbols from the user's query. It uses a combination of regex and a mapping dictionary to extract the stock symbol from the query.
# It uses SYMBOL_MAP from symbol_service.py to get the stock symbols.
# It uses re from regex module to extract the stock symbol from the query.

import re
from services.symbol_service import SYMBOL_MAP

def extract_symbol(query):
    upper_query = query.upper()

    for symbol in SYMBOL_MAP.keys():
        if symbol in upper_query:
            return symbol

    # Fallback heuristic for custom symbols
    common_words = {
        "ANALYZE", "WHAT", "IS", "THE", "TREND", "STOCK", "FOR", "TOMORROW", 
        "TODAY", "WEEK", "MONTH", "YEAR", "CHART", "REPORT", "PRICE", "LIVE", 
        "QUOTE", "INDICATOR", "INDICATORS", "TECHNICAL", "ANALYSIS", "MARKET", 
        "MIND", "AI", "RESEARCH", "ASSISTANT", "AND", "EXPLAIN", "KEY", "OF"
    }

    words = re.findall(r'[A-Z\^]+', upper_query)
    for word in words:
        if len(word) >= 2 and word not in common_words:
            return word

    return None