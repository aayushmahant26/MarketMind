from rest_framework import serializers


class StockQuerySerializer(serializers.Serializer):
    symbol = serializers.CharField()