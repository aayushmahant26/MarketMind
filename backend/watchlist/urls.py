from django.urls import path
from .views import (
    add_to_watchlist,
    get_watchlist,
    remove_from_watchlist
)

urlpatterns = [
    path('', get_watchlist),
    path('add/', add_to_watchlist),
    path('delete/<int:item_id>/', remove_from_watchlist),
]