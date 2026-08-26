SYMBOL_MAP = {
    # INDICES
    "NIFTY": "^NSEI",
    "NIFTY 50": "^NSEI",
    "NIFTY50": "^NSEI",
    "BANKNIFTY": "^NSEBANK",
    "BANK NIFTY": "^NSEBANK",
    "FINNIFTY": "^NSEFIN",
    "FIN NIFTY": "^NSEFIN",
    "MIDCPNIFTY": "^NSEMDCP50",
    "MIDCAP NIFTY": "^NSEMDCP50",
    "SENSEX": "^BSESN",

    # BANKING
    "HDFCBANK": "HDFCBANK.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "SBIN": "SBIN.NS",
    "KOTAKBANK": "KOTAKBANK.NS",
    "AXISBANK": "AXISBANK.NS",
    "BANKBARODA": "BANKBARODA.NS",
    "PNB": "PNB.NS",
    "INDUSINDBK": "INDUSINDBK.NS",
    "IDFCFIRSTB": "IDFCFIRSTB.NS",
    "FEDERALBNK": "FEDERALBNK.NS",

    # IT
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "WIPRO": "WIPRO.NS",
    "TECHM": "TECHM.NS",
    "HCLTECH": "HCLTECH.NS",
    "LTIM": "LTIM.NS",
    "PERSISTENT": "PERSISTENT.NS",
    "MPHASIS": "MPHASIS.NS",
    "COFORGE": "COFORGE.NS",

    # LARGE CAP
    "RELIANCE": "RELIANCE.NS",
    "ITC": "ITC.NS",
    "LT": "LT.NS",
    "BAJFINANCE": "BAJFINANCE.NS",
    "BHARTIARTL": "BHARTIARTL.NS",
    "ASIANPAINT": "ASIANPAINT.NS",
    "MARUTI": "MARUTI.NS",
    "ULTRACEMCO": "ULTRACEMCO.NS",
    "TITAN": "TITAN.NS",
    "NESTLEIND": "NESTLEIND.NS",

    # AUTO
    "TATAMOTORS": "TATAMOTORS.NS",
    "M&M": "M&M.NS",
    "HEROMOTOCO": "HEROMOTOCO.NS",
    "EICHERMOT": "EICHERMOT.NS",
    "BAJAJ-AUTO": "BAJAJ-AUTO.NS",

    # ENERGY
    "ONGC": "ONGC.NS",
    "IOC": "IOC.NS",
    "BPCL": "BPCL.NS",
    "COALINDIA": "COALINDIA.NS",
    "NTPC": "NTPC.NS",
    "POWERGRID": "POWERGRID.NS",
    "ADANIPOWER": "ADANIPOWER.NS",

    # ADANI
    "ADANIENT": "ADANIENT.NS",
    "ADANIPORTS": "ADANIPORTS.NS",
    "ADANIGREEN": "ADANIGREEN.NS",
    "ADANIENSOL": "ADANIENSOL.NS",

    # PHARMA
    "SUNPHARMA": "SUNPHARMA.NS",
    "DRREDDY": "DRREDDY.NS",
    "CIPLA": "CIPLA.NS",
    "LUPIN": "LUPIN.NS",
    "DIVISLAB": "DIVISLAB.NS",

    # FMCG
    "HINDUNILVR": "HINDUNILVR.NS",
    "BRITANNIA": "BRITANNIA.NS",
    "DABUR": "DABUR.NS",
    "GODREJCP": "GODREJCP.NS",
    "COLPAL": "COLPAL.NS",

    # METALS
    "TATASTEEL": "TATASTEEL.NS",
    "JSWSTEEL": "JSWSTEEL.NS",
    "HINDALCO": "HINDALCO.NS",
    "VEDL": "VEDL.NS",
    "SAIL": "SAIL.NS",

    # CEMENT
    "ACC": "ACC.NS",
    "AMBUJACEM": "AMBUJACEM.NS",
    "SHREECEM": "SHREECEM.NS",

    # TELECOM / DIGITAL
    "JIOFIN": "JIOFIN.NS",
    "PAYTM": "PAYTM.NS",
    "ZOMATO": "ZOMATO.NS",
    "SWIGGY": "SWIGGY.NS",
    "NAUKRI": "NAUKRI.NS",
}

# This is for all the other stocks not listed in SYMBOL_MAP, if the stock is not found in the map, it will be returned as it is.

def normalize_symbol(user_input):
    cleaned = user_input.strip().upper()

    # 1. First, check if it's in our static dictionary map
    if cleaned in SYMBOL_MAP:
        return SYMBOL_MAP[cleaned]

    # 2. Check if the database contains the symbol or name
    try:
        from stocks.models import Stock
        # Try finding a stock matching the exact cleaned symbol
        stock = Stock.objects.filter(symbol__iexact=cleaned).first()
        if stock:
            return stock.symbol

        # Try finding a stock matching cleaned with ".NS"
        stock = Stock.objects.filter(symbol__iexact=f"{cleaned}.NS").first()
        if stock:
            return stock.symbol

        # Try finding a stock matching the name (prefer exact, then prefix, then contains)
        stock = (
            Stock.objects.filter(name__iexact=cleaned).first()
            or Stock.objects.filter(name__istartswith=cleaned).first()
            or Stock.objects.filter(name__icontains=cleaned).first()
        )
        if stock:
            return stock.symbol
    except Exception:
        # Django might not be fully loaded or configured, fallback gracefully
        pass

    # 3. If it's a raw index ticker (like ^NSEI), return as-is
    if cleaned.startswith("^"):
        return cleaned

    # 4. If it already has the NSE extension, return as-is
    if cleaned.endswith(".NS"):
        return cleaned

    # 5. Otherwise, remove spaces and add .NS (e.g., "RELIANCE" → "RELIANCE.NS")
    fallback = cleaned.replace(" ", "")
    return fallback + ".NS"