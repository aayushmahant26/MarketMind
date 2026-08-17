from django.db import models
from django.contrib.auth.models import User
from stocks.models import Stock


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'stock') # makes sure the same user cannot add the same stock more than once in watchlist.
    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"