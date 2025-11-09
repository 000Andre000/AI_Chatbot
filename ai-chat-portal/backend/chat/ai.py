# """LM Studio adapter (local) for chat completions and simple summarization.
#
# This module assumes LM Studio exposes an HTTP API at:
#   {LMSTUDIO_URL}{LMSTUDIO_API_PATH}
# Default LM Studio base configured in .env.example is http://localhost:1234
# """
# import os
# import requests
#
# LMSTUDIO_URL = os.getenv('LMSTUDIO_URL', 'http://localhost:1234').rstrip('/')
# LMSTUDIO_API_PATH = os.getenv('LMSTUDIO_API_PATH', '/v1/chat/completions')
#
# def _lmstudio_post(payload):
#     url = LMSTUDIO_URL + LMSTUDIO_API_PATH
#     headers = {'Content-Type': 'application/json'}
#     try:
#         resp = requests.post(url, json=payload, headers=headers, timeout=30)
#         resp.raise_for_status()
#         return resp.json()
#     except Exception as e:
#         return {'error': str(e)}
#
# def ai_handle_user_message(conversation, user_text, max_context_messages=12):
#     msgs_qs = conversation.messages.order_by('-timestamp')[:max_context_messages]
#     messages = []
#     for m in reversed(msgs_qs):
#         role = 'user' if m.sender == 'user' else 'assistant'
#         messages.append({'role': role, 'content': m.content})
#     messages.append({'role': 'user', 'content': user_text})
#     payload = {
#         'model': 'local',
#         'messages': messages,
#         'max_tokens': 512,
#         'stream': False
#     }
#     r = _lmstudio_post(payload)
#     if 'choices' in r and isinstance(r['choices'], list) and r['choices']:
#         return r['choices'][0].get('message', {}).get('content') or r['choices'][0].get('text','')
#     if r.get('error'):
#         return 'Error from LM Studio: ' + r['error']
#     return str(r)
#
# def ai_generate_summary(conversation):
#     msgs = conversation.messages.order_by('timestamp')
#     all_text = "\n".join([f"{m.sender}: {m.content}" for m in msgs])
#     prompt = f"Summarize the following conversation. Provide a short title, key topics, decisions, and action items.\nConversation:\n{all_text}"
#     payload = {
#         'model': 'local',
#         'messages': [{'role':'user','content': prompt}],
#         'max_tokens': 512
#     }
#     r = _lmstudio_post(payload)
#     if 'choices' in r and r['choices']:
#         return r['choices'][0].get('message',{}).get('content') or r['choices'][0].get('text','')
#     if r.get('error'):
#         return 'Error generating summary: ' + r['error']
#     return str(r)
#
# import requests
#
# def ai_query_conversations(query, context):
#     """
#     Sends conversation history + query to LM Studio (or your AI backend)
#     and returns the AI's answer.
#     """
#     try:
#         response = requests.post(
#             "http://localhost:1234/v1/chat/completions",
#             json={
#                 "model": "lmstudio-community/Meta-Llama-3-8B-Instruct",
#                 "messages": [
#                     {"role": "system", "content": "You are an AI assistant that analyzes past conversations and answers semantic questions."},
#                     {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{query}\n\nAnswer concisely:"}
#                 ]
#             },
#             timeout=60  # seconds
#         )
#         data = response.json()
#         return data['choices'][0]['message']['content']
#     except Exception as e:
#         print("AI query error:", e)
#         return "Error contacting AI service."


"""
LM Studio adapter (local) for chat completions and summarization.

Assumes LM Studio exposes an HTTP API at:
  {LMSTUDIO_URL}{LMSTUDIO_API_PATH}

Default:
  LMSTUDIO_URL = http://localhost:1234
  LMSTUDIO_API_PATH = /v1/chat/completions
"""
#
# import os
# import requests
#
# # Base LM Studio configuration
# LMSTUDIO_URL = os.getenv('LMSTUDIO_URL', 'http://localhost:1234').rstrip('/')
# LMSTUDIO_API_PATH = os.getenv('LMSTUDIO_API_PATH', '/v1/chat/completions')
# MODEL_NAME = os.getenv('LMSTUDIO_MODEL', 'phi-3-mini-4k-instruct')  # Use model actually running in LM Studio
#
# def _lmstudio_post(payload):
#     """Helper to POST to LM Studio with safe error handling."""
#     url = LMSTUDIO_URL + LMSTUDIO_API_PATH
#     headers = {'Content-Type': 'application/json'}
#
#     try:
#         print(f"🧠 Sending payload to LM Studio: {url}")
#         resp = requests.post(url, json=payload, headers=headers, timeout=30)
#         print(f"🔁 Status: {resp.status_code}")
#         resp.raise_for_status()
#         return resp.json()
#     except requests.exceptions.Timeout:
#         print("⚠️ LM Studio request timed out (30s).")
#         return {'error': 'Timeout contacting LM Studio (over 30s).'}
#     except Exception as e:
#         print("❌ Exception contacting LM Studio:", e)
#         return {'error': str(e)}
#
#
# # === Message Handling ===
#
# def ai_handle_user_message(conversation, user_text, max_context_messages=12):
#     """Send user message + recent context to LM Studio and return response."""
#     msgs_qs = conversation.messages.order_by('-timestamp')[:max_context_messages]
#     messages = []
#     for m in reversed(msgs_qs):
#         role = 'user' if m.sender == 'user' else 'assistant'
#         messages.append({'role': role, 'content': m.content})
#
#     messages.append({'role': 'user', 'content': user_text})
#
#     payload = {
#         'model': MODEL_NAME,
#         'messages': messages,
#         'max_tokens': 512,
#         'stream': False,
#     }
#
#     r = _lmstudio_post(payload)
#
#     if 'choices' in r and isinstance(r['choices'], list) and r['choices']:
#         content = r['choices'][0].get('message', {}).get('content') or r['choices'][0].get('text', '')
#         print("✅ LM Studio reply:", content[:150], "..." if len(content) > 150 else "")
#         return content
#
#     if r.get('error'):
#         print("❌ LM Studio returned error:", r['error'])
#         return 'Error from LM Studio: ' + r['error']
#
#     print("⚠️ Unexpected response:", r)
#     return str(r)
#
#
# # === Summarization ===
#
# def ai_generate_summary(conversation):
#     """Generate a short summary of the conversation."""
#     msgs = conversation.messages.order_by('timestamp')
#     all_text = "\n".join([f"{m.sender}: {m.content}" for m in msgs])
#     prompt = (
#         "Summarize the following conversation. "
#         "Provide a short title, key topics, decisions, and action items.\n\n"
#         f"Conversation:\n{all_text}"
#     )
#
#     payload = {
#         'model': 'phi-3-mini-4k-instruct',
#         'messages': msgs,
#         'max_tokens': 512,
#         'stream': False
#     }
#
#     r = _lmstudio_post(payload)
#
#     if 'choices' in r and r['choices']:
#         content = r['choices'][0].get('message', {}).get('content') or r['choices'][0].get('text', '')
#         print("✅ Summary:", content[:150], "..." if len(content) > 150 else "")
#         return content
#
#     if r.get('error'):
#         print("❌ Error generating summary:", r['error'])
#         return 'Error generating summary: ' + r['error']
#
#     return str(r)
#
#
# # === Conversation Query Intelligence ===
#
# def ai_query_conversations(query, context):
#     """
#     Handles semantic queries over stored conversation context.
#     """
#     try:
#         print(f"🧩 Querying LM Studio intelligence: {query}")
#
#         response = requests.post(
#             LMSTUDIO_URL + LMSTUDIO_API_PATH,
#             json={
#                 "model": MODEL_NAME,
#                 "messages": [
#                     {
#                         "role": "system",
#                         "content": (
#                             "You are an AI assistant that analyzes past conversations "
#                             "and answers semantic or analytical questions about them."
#                         )
#                     },
#                     {
#                         "role": "user",
#                         "content": f"Conversation context:\n{context}\n\nQuestion:\n{query}\n\nAnswer concisely:"
#                     },
#                 ],
#             },
#             timeout=60,
#         )
#
#         print("🔁 Status:", response.status_code)
#
#         if response.status_code != 200:
#             print("❌ Bad response:", response.text)
#             return "Error contacting AI service (bad response)."
#
#         data = response.json()
#         answer = data["choices"][0]["message"]["content"].strip()
#         print("✅ AI Response:", answer[:150], "..." if len(answer) > 150 else "")
#         return answer
#
#     except requests.exceptions.Timeout:
#         print("⚠️ LM Studio intelligence query timed out (60s).")
#         return "The AI model took too long to respond. Please try again."
#
#     except Exception as e:
#         print("❌ Exception in ai_query_conversations:", e)
#         return "Error contacting AI service."
import os
import requests

# Base LM Studio configuration
LMSTUDIO_URL = os.getenv('LMSTUDIO_URL', 'http://localhost:1234').rstrip('/')
LMSTUDIO_API_PATH = os.getenv('LMSTUDIO_API_PATH', '/v1/chat/completions')
MODEL_NAME = os.getenv('LMSTUDIO_MODEL', 'phi-3-mini-4k-instruct')  # Use model actually running in LM Studio


# === Helper ===

def truncate_text(text, max_chars=12000):
    """Ensure text does not exceed LM Studio 4K token limit (approx 12k chars)."""
    return text[-max_chars:] if len(text) > max_chars else text


def truncate_messages(messages, max_chars=12000):
    """Truncate conversation messages list if total text is too long."""
    total = 0
    truncated = []
    for m in reversed(messages):
        total += len(m['content'])
        if total > max_chars:
            break
        truncated.insert(0, m)
    return truncated


def _lmstudio_post(payload):
    """Helper to POST to LM Studio with safe error handling."""
    url = LMSTUDIO_URL + LMSTUDIO_API_PATH
    headers = {'Content-Type': 'application/json'}

    try:
        print(f"🧠 Sending payload to LM Studio: {url}")
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        print(f"🔁 Status: {resp.status_code}")
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.Timeout:
        print("⚠️ LM Studio request timed out (30s).")
        return {'error': 'Timeout contacting LM Studio (over 30s).'}
    except Exception as e:
        print("❌ Exception contacting LM Studio:", e)
        return {'error': str(e)}


# === Message Handling ===

def ai_handle_user_message(conversation, user_text, max_context_messages=12):
    """Send user message + recent context to LM Studio and return response."""
    msgs_qs = conversation.messages.order_by('-timestamp')[:max_context_messages]
    messages = []
    for m in reversed(msgs_qs):
        role = 'user' if m.sender == 'user' else 'assistant'
        messages.append({'role': role, 'content': m.content})

    messages.append({'role': 'user', 'content': user_text})
    messages = truncate_messages(messages)  # ✅ Prevent context overflow

    payload = {
        'model': MODEL_NAME,
        'messages': messages,
        'max_tokens': 512,
        'stream': False,
    }

    r = _lmstudio_post(payload)

    if 'choices' in r and isinstance(r['choices'], list) and r['choices']:
        content = r['choices'][0].get('message', {}).get('content') or r['choices'][0].get('text', '')
        print("✅ LM Studio reply:", content[:150], "..." if len(content) > 150 else "")
        return content

    if r.get('error'):
        print("❌ LM Studio returned error:", r['error'])
        return 'Error from LM Studio: ' + r['error']

    print("⚠️ Unexpected response:", r)
    return str(r)


# === Summarization ===

def ai_generate_summary(conversation):
    """Generate a short summary of the conversation."""
    msgs = conversation.messages.order_by('timestamp')
    all_text = "\n".join([f"{m.sender}: {m.content}" for m in msgs])
    all_text = truncate_text(all_text)  # ✅ Prevent too-long input

    prompt = (
        "Summarize the following conversation. "
        "Provide a short title, key topics, decisions, and action items.\n\n"
        f"Conversation:\n{all_text}"
    )

    payload = {
        'model': MODEL_NAME,
        'messages': [{'role': 'user', 'content': prompt}],
        'max_tokens': 512,
        'stream': False
    }

    r = _lmstudio_post(payload)

    if 'choices' in r and r['choices']:
        content = r['choices'][0].get('message', {}).get('content') or r['choices'][0].get('text', '')
        print("✅ Summary:", content[:150], "..." if len(content) > 150 else "")
        return content

    if r.get('error'):
        print("❌ Error generating summary:", r['error'])
        return 'Error generating summary: ' + r['error']

    return str(r)


# === Conversation Query Intelligence ===

def ai_query_conversations(query, context):
    """Handles semantic queries over stored conversation context."""
    try:
        print(f"🧩 Querying LM Studio intelligence: {query}")
        context = truncate_text(context)  # ✅ Limit context length

        response = requests.post(
            LMSTUDIO_URL + LMSTUDIO_API_PATH,
            json={
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are an AI assistant that analyzes past conversations "
                            "and answers semantic or analytical questions about them."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Conversation context:\n{context}\n\nQuestion:\n{query}\n\nAnswer concisely:"
                    },
                ],
            },
            timeout=60,
        )

        print("🔁 Status:", response.status_code)

        if response.status_code != 200:
            print("❌ Bad response:", response.text)
            return "Error contacting AI service (bad response)."

        data = response.json()
        answer = data["choices"][0]["message"]["content"].strip()
        print("✅ AI Response:", answer[:150], "..." if len(answer) > 150 else "")
        return answer

    except requests.exceptions.Timeout:
        print("⚠️ LM Studio intelligence query timed out (60s).")
        return "The AI model took too long to respond. Please try again."

    except Exception as e:
        print("❌ Exception in ai_query_conversations:", e)
        return "Error contacting AI service."
