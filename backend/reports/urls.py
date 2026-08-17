from django.urls import path
from .views import analyze_market, get_reports, chat_api, delete_report

urlpatterns = [
    path('analyze/', analyze_market),
    path('reports/', get_reports),
    path('chat/', chat_api),
    path('reports/delete/<int:report_id>/', delete_report),
]