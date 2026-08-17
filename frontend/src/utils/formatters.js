export const cleanSymbol = (symbol) => {
  if (!symbol) return '';
  let clean = symbol.toUpperCase().replace('.NS', '');
  if (clean === '^NSEI') return 'NIFTY';
  if (clean === '^NSEBANK') return 'BANKNIFTY';
  if (clean === '^BSESN') return 'SENSEX';
  return clean;
};

export const cleanName = (symbol, name) => {
  if (!symbol) return name || '';
  const cleanSym = symbol.toUpperCase().replace('.NS', '');
  const map = {
    '^NSEI': 'NIFTY 50',
    'NIFTY': 'NIFTY 50',
    'NIFTY50': 'NIFTY 50',
    '^NSEBANK': 'NIFTY BANK',
    'BANKNIFTY': 'NIFTY BANK',
    '^BSESN': 'SENSEX',
    'SENSEX': 'SENSEX',
    'RELIANCE': 'Reliance Industries',
    'TCS': 'Tata Consultancy Services',
    'INFY': 'Infosys Limited',
    'HDFCBANK': 'HDFC Bank',
    'ICICIBANK': 'ICICI Bank',
    'SBIN': 'State Bank of India',
    'KOTAKBANK': 'Kotak Bank',
    'AXISBANK': 'Axis Bank',
  };
  
  if (map[cleanSym]) {
    return map[cleanSym];
  }
  
  if (name) {
    let cleanedName = name.replace('.NS', '');
    if (cleanedName.toUpperCase() === '^NSEI') return 'NIFTY 50';
    if (cleanedName.toUpperCase() === '^NSEBANK') return 'NIFTY BANK';
    if (cleanedName.toUpperCase() === '^BSESN') return 'SENSEX';
    return cleanedName;
  }
  
  return cleanSym;
};
