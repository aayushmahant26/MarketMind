from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import AIReport
from .serializers import AIReportSerializer
from services.analysis_service import AnalysisService

from services.chat_service import ChatService

analysis_service = AnalysisService()
chat_service = ChatService()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_market(request):
    query = request.data.get("query")

    if not query:
        return Response(
            {"error": "Query required"},
            status=400
        )

    try:
        result = analysis_service.analyze(query)

        report_obj = AIReport.objects.create(
            user=request.user,
            query=query,
            symbol=result["query_symbol"],
            report=result["final_report"]
        )

        return Response({
            "report_id": report_obj.id,
            "symbol": result["query_symbol"],
            "report": result["final_report"]
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reports(request):
    reports = AIReport.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = AIReportSerializer(reports, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_api(request):
    message = request.data.get("message")
    symbol = request.data.get("symbol")

    if not message:
        return Response(
            {"error": "Message required"},
            status=400
        )

    try:
        response = chat_service.chat(
            request.user,
            message,
            symbol
        )

        return Response({
            "response": response
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_report(request, report_id):
    try:
        report = AIReport.objects.get(id=report_id, user=request.user)
        report.delete()
        return Response({"message": "Report deleted successfully"}, status=status.HTTP_200_OK)
    except AIReport.DoesNotExist:
        return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)