from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def query_conversations(request):
    q = request.data.get('query')
    return Response({'answer': f'This endpoint should search and answer for: {q}', 'sources': []})
