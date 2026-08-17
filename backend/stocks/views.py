from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from services.market_service import MarketService
from .serializers import StockQuerySerializer

from services.symbol_service import normalize_symbol

from services.indicator_service import IndicatorService

from services.news_service import NewsService


market_service = MarketService()  # Creating an instance of the MarketService class.

indicator_service = IndicatorService() # Creating an instance of the IndicatorService class.

news_service = NewsService() # Creating an instance of the NewsService class.

@api_view(['POST'])
def stock_info(request):
    serializer = StockQuerySerializer(data=request.data) # Validates the incoming request data.

    if serializer.is_valid():
        raw_symbol = serializer.validated_data["symbol"] # Extracts the symbol from the validated data.
        symbol = normalize_symbol(raw_symbol) # Normalizes the symbol.

        try:
            data = market_service.get_stock_info(symbol) # Fetches the stock information.
            return Response(data) # Returns the stock information.

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    return Response(serializer.errors, status=400)

@api_view(['POST'])
def stock_history(request):
    serializer = StockQuerySerializer(data=request.data)

    if serializer.is_valid():
        raw_symbol = serializer.validated_data["symbol"]
        symbol = normalize_symbol(raw_symbol)

        try:
            data = market_service.get_historical_data(symbol)
            return Response(data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=400
            )

    return Response(serializer.errors, status=400)

@api_view(['POST'])
def technical_analysis(request):
    serializer = StockQuerySerializer(data=request.data)

    if serializer.is_valid():
        raw_symbol = serializer.validated_data["symbol"]
        symbol = normalize_symbol(raw_symbol)

        try:
            candles = market_service.get_historical_data(symbol)
            analysis = indicator_service.full_analysis(candles)

            return Response(analysis)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def market_news(request):
    try:
        query = request.GET.get("q", "NIFTY").strip()
        if not query:
            query = "NIFTY"
        headlines = news_service.fetch_market_news(query)

        return Response({
            "headline_count": len(headlines),
            "articles": headlines
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def stock_search(request):
    query = request.GET.get("q", "").strip().upper()
    if not query:
        return Response([])

    results = []
    seen = set()

    # 1. Match from SYMBOL_MAP
    from services.symbol_service import SYMBOL_MAP
    for display_name, ticker in SYMBOL_MAP.items():
        if query in display_name or query in ticker.upper():
            symbol_to_return = display_name
            if symbol_to_return not in seen:
                seen.add(symbol_to_return)
                results.append({
                    "symbol": symbol_to_return,
                    "name": display_name
                })

    # 2. Match from Stock database
    from stocks.models import Stock
    db_stocks = Stock.objects.filter(symbol__icontains=query) | Stock.objects.filter(name__icontains=query)
    for stock in db_stocks[:10]:
        ticker = stock.symbol
        clean_sym = ticker.replace(".NS", "")
        if clean_sym == "^NSEI":
            clean_sym = "NIFTY"
        elif clean_sym == "^NSEBANK":
            clean_sym = "BANKNIFTY"
        elif clean_sym == "^BSESN":
            clean_sym = "SENSEX"

        if clean_sym not in seen:
            seen.add(clean_sym)
            results.append({
                "symbol": clean_sym,
                "name": stock.name
            })

    return Response(results[:8])

@api_view(['GET'])
def get_all_stocks(request):
    try:
        from stocks.models import Stock
        stocks = Stock.objects.all().order_by('symbol')
        results = []
        for stock in stocks:
            clean_sym = stock.symbol.replace(".NS", "")
            if clean_sym == "^NSEI":
                clean_sym = "NIFTY"
            elif clean_sym == "^NSEBANK":
                clean_sym = "BANKNIFTY"
            elif clean_sym == "^BSESN":
                clean_sym = "SENSEX"
                
            results.append({
                "symbol": clean_sym,
                "name": stock.name
            })
        return Response(results)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

