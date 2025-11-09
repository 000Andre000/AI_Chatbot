from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationListSerializer, ConversationDetailSerializer, MessageSerializer
from . import ai as ai_module

class ConversationListCreateView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all().order_by('-start_time')
    serializer_class = ConversationListSerializer

class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer

@api_view(['POST'])
def send_message(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk)
    except Conversation.DoesNotExist:
        return Response({'detail':'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    user_text = request.data.get('content')
    if not user_text:
        return Response({'detail':'content required'}, status=status.HTTP_400_BAD_REQUEST)
    user_msg = Message.objects.create(conversation=conv, sender='user', content=user_text)
    ai_text = ai_module.ai_handle_user_message(conv, user_text)
    ai_msg = Message.objects.create(conversation=conv, sender='ai', content=ai_text)
    serializer = MessageSerializer(ai_msg)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def end_conversation(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk)
    except Conversation.DoesNotExist:
        return Response({'detail':'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    conv.status = 'ended'
    conv.end_time = timezone.now()
    conv.save()
    summary = ai_module.ai_generate_summary(conv)
    conv.summary = summary
    conv.save()
    return Response({'summary': summary})


@api_view(['POST'])
def query_conversations(request):
    query = request.data.get('query', '').strip()
    if not query:
        return Response({'error': 'Query is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch all conversation messages
    messages = Message.objects.select_related('conversation').all().order_by('-timestamp')

    # Create a summarized text corpus
    context_text = ""
    for msg in messages:
        context_text += f"[{msg.conversation.title or 'Untitled'} - {msg.sender}] {msg.content}\n"

    # Ask the AI model
    try:
        answer = ai_module.ai_query_conversations(query, context_text)
        return Response({'query': query, 'answer': answer})
    except Exception as e:
        print("Error in AI query:", e)
        return Response({'error': 'Failed to generate response'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
