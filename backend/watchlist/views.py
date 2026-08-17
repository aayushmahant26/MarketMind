from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Watchlist
from .serializers import WatchlistSerializer
from stocks.models import Stock
from services.symbol_service import normalize_symbol
from services.market_service import MarketService

market_service = MarketService()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    symbol_input = request.data.get("symbol")

    # make sure symbol is provided
    if not symbol_input:
        return Response(
            {"error": "Symbol required"},
            status=400
        )

    # symbol validation 
    normalized_symbol = normalize_symbol(symbol_input)

    if not market_service.is_valid_symbol(normalized_symbol):
        return Response(
            {"error": f"Symbol '{symbol_input}' does not exist."},
            status=400
        )

    stock, created = Stock.objects.get_or_create(
        symbol=normalized_symbol,
        defaults={
            "name": symbol_input.upper()
        }
    )

    watchlist_item, created = Watchlist.objects.get_or_create(
        user=request.user,
        stock=stock
    )

    if not created:
        return Response(
            {"message": "Already exists in watchlist"}
        )

    return Response(
        {"message": "Added successfully"},
        status=201
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    items = Watchlist.objects.filter(
        user=request.user
    ).select_related('stock')  # used to reduce number of database queries and fixes the N+1 problem 

    serializer = WatchlistSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, item_id):
    try:
        item = Watchlist.objects.get(
            id=item_id,
            user=request.user
        )
        item.delete()
        return Response({"message": "Deleted successfully"})

    except Watchlist.DoesNotExist:
        return Response(
            {"error": "Item not found"},
            status=404
        )