# pyrefly: ignore [missing-import]
import yfinance as yf


class MarketService:

    def get_stock_info(self, symbol):
        stock = yf.Ticker(symbol)
        info = stock.info or {}

        # Fallbacks for currentPrice
        current_price = info.get("currentPrice")
        if current_price is None:
            current_price = info.get("regularMarketPrice")
        if current_price is None:
            current_price = info.get("previousClose")

        # Fallbacks for dayHigh
        day_high = info.get("dayHigh")
        if day_high is None:
            day_high = info.get("regularMarketDayHigh")

        # Fallbacks for dayLow
        day_low = info.get("dayLow")
        if day_low is None:
            day_low = info.get("regularMarketDayLow")

        # Fallbacks for volume
        volume = info.get("volume")
        if volume is None:
            volume = info.get("regularMarketVolume")

        # Fallbacks for previousClose
        previous_close = info.get("previousClose")
        if previous_close is None:
            previous_close = info.get("regularMarketPreviousClose")

        # Fallbacks for change
        change = info.get("regularMarketChange")
        if change is None and current_price is not None and previous_close is not None:
            change = current_price - previous_close

        # Fallbacks for changePercent
        change_percent = info.get("regularMarketChangePercent")
        if change_percent is None and change is not None and previous_close:
            change_percent = (change / previous_close) * 100

        return {
            "symbol": symbol,
            "name": info.get("longName") or info.get("shortName") or symbol,
            "current_price": current_price,
            "day_high": day_high,
            "day_low": day_low,
            "volume": volume,
            "change": change,
            "changePercent": change_percent
        }
    
    # Candlistick Data.
    def get_historical_data(self, symbol, period="3mo", interval="1d"):
        stock = yf.Ticker(symbol) # Create a Yahoo Finance stock object.
        history = stock.history(period=period, interval=interval)

        candles = []

        for index, row in history.iterrows(): # Iterate over the rows of the history DataFrame (data of every day).
            candles.append({
                "date": str(index.date()),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
        })

        return candles

    # Check whether the stock symbol actually exists.
    def is_valid_symbol(self, symbol):
        try:
            stock = yf.Ticker(symbol)
            info = stock.info or {}
            
            quote_type = info.get("quoteType", "NONE")
            if not quote_type or quote_type.upper() == "NONE":
                return False
                
            price_fields = ["currentPrice", "regularMarketPrice", "previousClose", "regularMarketPreviousClose"]
            if not any(info.get(field) is not None for field in price_fields):
                return False
                
            return True
        except Exception:
            return False