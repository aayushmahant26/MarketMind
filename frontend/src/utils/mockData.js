// Used when backend response is not availabe for stock data . 

export const mockIndices = [
  { symbol: 'NIFTY', name: 'NIFTY 50', current_price: 23501.10, day_high: 23620.50, day_low: 23440.30, volume: 298450000 },
  { symbol: 'BANKNIFTY', name: 'NIFTY BANK', current_price: 51224.40, day_high: 51480.90, day_low: 50980.20, volume: 184560000 },
  { symbol: 'SENSEX', name: 'SENSEX', current_price: 77209.90, day_high: 77510.60, day_low: 76950.40, volume: 12040000 }
];

export const mockMovers = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', current_price: 2940.50, day_high: 2958.00, day_low: 2915.20, volume: 5410000, change: 42.10, changePercent: 1.45 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', current_price: 3825.00, day_high: 3844.00, day_low: 3790.00, volume: 2120000, change: -32.50, changePercent: -0.84 },
  { symbol: 'INFY', name: 'Infosys Limited', current_price: 1515.20, day_high: 1530.40, day_low: 1498.00, volume: 3450000, change: 18.40, changePercent: 1.23 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', current_price: 1660.10, day_high: 1675.00, day_low: 1642.00, volume: 8900000, change: 22.80, changePercent: 1.39 }
];

export const mockSentiment = {
  sentiment: 'Bullish',
  score: 0.68,
  headline_count: 12,
  headlines: [
    "Indian markets hit record highs led by reliance and bank stocks",
    "FII inflows surge into Indian equities amid positive GDP forecasts",
    "IT sector shares rebound sharply on strong US Nasdaq gains",
    "RBI retains benchmark repo rates, signals focus on inflation targets",
    "Auto stocks rally on bumper monthly wholesale delivery numbers"
  ]
};

export const getMockInfo = (activeSymbol, querySymbol) => ({
  symbol: querySymbol,
  name: activeSymbol === 'RELIANCE' ? 'Reliance Industries Ltd.' : `${activeSymbol} Corp`,
  current_price: 2940.50,
  day_high: 2965.00,
  day_low: 2912.00,
  volume: 6200000
});

export const generateMockHistory = () => {
  const candles = [];
  const basePrice = 2900;
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const rand = Math.sin(i / 10) * 100 + (Math.random() - 0.5) * 50;
    const close = Number((basePrice + rand).toFixed(2));
    candles.push({
      date: date.toISOString().split('T')[0],
      open: close - 10,
      high: close + 15,
      low: close - 15,
      close: close,
      volume: Math.floor(Math.random() * 5000000)
    });
  }
  return candles;
};

export const mockTechnical = {
  rsi: 58.42,
  macd: 12.45,
  signal: 8.92,
  ema_20: 2910.30,
  sma_50: 2865.10,
  atr: 45.20,
  trend: 'Bullish',
  upper_band: 2980.50,
  lower_band: 2840.20,
  support: 2880.00,
  resistance: 2975.00
};
