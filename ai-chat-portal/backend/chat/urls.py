from django.urls import path
from . import views

urlpatterns = [
    path('conversations/query/', views.query_conversations, name='query_conversations'),
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversation_list'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='conversation_detail'),
    path('conversations/<int:pk>/messages/', views.send_message, name='send_message'),
    path('conversations/<int:pk>/end/', views.end_conversation, name='end_conversation'),
]

from .extra_views import query_conversations
urlpatterns += [
    path('conversations/query/', query_conversations, name='conversations-query'),
]
