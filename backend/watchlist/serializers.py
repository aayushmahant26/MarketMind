from rest_framework import serializers
from .models import Watchlist


class WatchlistSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    stock_name = serializers.CharField(source='stock.name', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'symbol', 'stock_name', 'created_at']