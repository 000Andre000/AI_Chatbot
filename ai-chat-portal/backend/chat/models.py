from django.db import models
# from pgvector.django import VectorField

class Conversation(models.Model):
    STATUS_CHOICES = (('active', 'Active'), ('ended', 'Ended'))
    title = models.CharField(max_length=255, blank=True)
    participants = models.JSONField(default=list, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    summary = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title or f'Conversation {self.id}'


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=20)  # 'user' or 'ai'
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:60]}"


class ConversationAnalysis(models.Model):
    conversation = models.OneToOneField('Conversation', on_delete=models.CASCADE, related_name='analysis')
    sentiment = models.CharField(max_length=32, blank=True)  # positive/neutral/negative
    topics = models.JSONField(default=list, blank=True)
    action_items = models.JSONField(default=list, blank=True)  # [{"item": "...", "owner": "...", "due": "..."}]
    duration_seconds = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ConversationEmbedding(models.Model):
    conversation = models.OneToOneField('Conversation', on_delete=models.CASCADE, related_name='embedding')
    # vector = VectorField()  # adjust dim to embedding model
    excerpt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
