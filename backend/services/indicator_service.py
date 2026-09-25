import pandas as pd
# pyright: ignore [reportMissingImports]
from ta.momentum import RSIIndicator
# pyright: ignore [reportMissingImports]
from ta.trend import MACD, EMAIndicator, SMAIndicator
# pyright: ignore [reportMissingImports]
from ta.volatility import BollingerBands, AverageTrueRange

class IndicatorService:

    def prepare_dataframe(self, candles):
        df = pd.DataFrame(candles)
        return df
    
    def calculate_rsi(self, df):
        window = min(14, max(2, len(df) - 1))
        if len(df) >= 3:
            rsi = RSIIndicator(close=df["close"], window=window)
            series = rsi.rsi().dropna()
            if not series.empty:
                return round(float(series.iloc[-1]), 2)
        return 50.0
    
    def calculate_macd(self, df):
        if len(df) >= 26:
            macd = MACD(close=df["close"])
            m_series = macd.macd().dropna()
            s_series = macd.macd_signal().dropna()
            macd_value = round(float(m_series.iloc[-1]), 2) if not m_series.empty else 0.0
            signal_value = round(float(s_series.iloc[-1]), 2) if not s_series.empty else 0.0
        else:
            macd_value = 0.0
            signal_value = 0.0

        return {
            "macd": macd_value,
            "signal": signal_value
        }
    
    def calculate_ema(self, df, window=20):
        w = min(window, max(2, len(df)))
        if len(df) >= 2:
            ema = EMAIndicator(close=df["close"], window=w)
            series = ema.ema_indicator().dropna()
            if not series.empty:
                return round(float(series.iloc[-1]), 2)
        return round(float(df["close"].iloc[-1]), 2)
    
    def calculate_sma(self, df, window=50):
        w = min(window, max(2, len(df)))
        if len(df) >= 2:
            sma = SMAIndicator(close=df["close"], window=w)
            series = sma.sma_indicator().dropna()
            if not series.empty:
                return round(float(series.iloc[-1]), 2)
        return round(float(df["close"].iloc[-1]), 2)
    
    def calculate_bollinger(self, df):
        w = min(20, max(2, len(df)))
        if len(df) >= 2:
            bb = BollingerBands(close=df["close"], window=w)
            h_series = bb.bollinger_hband().dropna()
            l_series = bb.bollinger_lband().dropna()
            upper = round(float(h_series.iloc[-1]), 2) if not h_series.empty else round(float(df["close"].iloc[-1]), 2)
            lower = round(float(l_series.iloc[-1]), 2) if not l_series.empty else round(float(df["close"].iloc[-1]), 2)
        else:
            c = round(float(df["close"].iloc[-1]), 2)
            upper, lower = c, c

        return {
            "upper_band": upper,
            "lower_band": lower
        }
    
    def calculate_atr(self, df):
        w = min(14, max(2, len(df)))
        if len(df) >= 2:
            atr = AverageTrueRange(
                high=df["high"],
                low=df["low"],
                close=df["close"],
                window=w
            )
            series = atr.average_true_range().dropna()
            if not series.empty:
                return round(float(series.iloc[-1]), 2)
        return round(float(df["high"].iloc[-1] - df["low"].iloc[-1]), 2)
    
    def detect_trend(self, df):
        current_price = df["close"].iloc[-1]

        ema20 = self.calculate_ema(df, 20)
        sma50 = self.calculate_sma(df, 50)

        if current_price > ema20 >= sma50:
            return "Bullish"

        elif current_price < ema20 <= sma50:
            return "Bearish"

        return "Sideways"
    
    def calculate_support_resistance(self, df):
        recent = df.tail(min(20, len(df)))

        support = round(float(recent["low"].min()), 2)
        resistance = round(float(recent["high"].max()), 2)

        return {
            "support": support,
            "resistance": resistance
        }
    
    def full_analysis(self, candles):
        if not candles or len(candles) < 2:
            raise ValueError("Insufficient historical data to perform technical analysis.")

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