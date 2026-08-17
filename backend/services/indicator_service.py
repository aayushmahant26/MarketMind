import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import MACD, EMAIndicator, SMAIndicator
from ta.volatility import BollingerBands, AverageTrueRange

class IndicatorService:

    def prepare_dataframe(self, candles):
        df = pd.DataFrame(candles)
        return df
    
    def calculate_rsi(self, df):
        rsi = RSIIndicator(close=df["close"], window=14)
        return round(float(rsi.rsi().iloc[-1]), 2)
    
    def calculate_macd(self, df):
        macd = MACD(close=df["close"])

        macd_value = round(float(macd.macd().iloc[-1]), 2)
        signal_value = round(float(macd.macd_signal().iloc[-1]), 2)

        return {
            "macd": macd_value,
            "signal": signal_value
        }
    
    def calculate_ema(self, df, window=20):
        ema = EMAIndicator(close=df["close"], window=window)
        return round(float(ema.ema_indicator().iloc[-1]), 2)
    
    def calculate_sma(self, df, window=50):
        sma = SMAIndicator(close=df["close"], window=window)
        return round(float(sma.sma_indicator().iloc[-1]), 2)
    
    def calculate_bollinger(self, df):
        bb = BollingerBands(close=df["close"])

        return {
            "upper_band": round(float(bb.bollinger_hband().iloc[-1]), 2),
            "lower_band": round(float(bb.bollinger_lband().iloc[-1]), 2)
        }
    
    def calculate_atr(self, df):
        atr = AverageTrueRange(
            high=df["high"],
            low=df["low"],
            close=df["close"]
        )

        return round(float(atr.average_true_range().iloc[-1]), 2)
    
    def detect_trend(self, df):
        current_price = df["close"].iloc[-1]

        ema20 = self.calculate_ema(df, 20)
        sma50 = self.calculate_sma(df, 50)

        if current_price > ema20 > sma50:
            return "Bullish"

        elif current_price < ema20 < sma50:
            return "Bearish"

        return "Sideways"
    
    def calculate_support_resistance(self, df):
        recent = df.tail(20)

        support = round(float(recent["low"].min()), 2)
        resistance = round(float(recent["high"].max()), 2)

        return {
            "support": support,
            "resistance": resistance
        }
    
    def full_analysis(self, candles):
        df = self.prepare_dataframe(candles)

        macd_data = self.calculate_macd(df)
        bb_data = self.calculate_bollinger(df)
        sr_data = self.calculate_support_resistance(df)

        analysis = {
            "rsi": self.calculate_rsi(df),
            "macd": macd_data["macd"],
            "signal": macd_data["signal"],
            "ema_20": self.calculate_ema(df, 20),
            "sma_50": self.calculate_sma(df, 50),
            "atr": self.calculate_atr(df),
            "trend": self.detect_trend(df),
            "upper_band": bb_data["upper_band"],
            "lower_band": bb_data["lower_band"],
            "support": sr_data["support"],
            "resistance": sr_data["resistance"]
        }

        return analysis