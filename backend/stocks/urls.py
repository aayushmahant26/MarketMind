from django.urls import path
from .views import (
    stock_info,
    stock_history,
    technical_analysis,
    market_news,
    stock_search,
    get_all_stocks
)

urlpatterns = [
    path('info/', stock_info),
    path('history/', stock_history),
    path('technical/', technical_analysis),
    path('news/', market_news),
    path('search/', stock_search),
    path('all/', get_all_stocks),
]