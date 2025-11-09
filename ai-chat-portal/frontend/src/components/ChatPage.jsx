// import React, {useEffect, useState} from 'react'
// import api from '../api/api'
//
// export default function ChatPage({conversation, onBack}){
//   const [conv, setConv] = useState(conversation)
//   const [messages, setMessages] = useState(conversation?.messages || [])
//   const [text, setText] = useState('')
//
//   useEffect(()=>{ if(conversation && conversation.id){ api.get(`conversations/${conversation.id}/`).then(r=>{ setConv(r.data); setMessages(r.data.messages) }) }}, [conversation])
//
//   const send = async ()=>{
//     if(!conv) return alert('Open a conversation first')
//     if(!text) return
//     setMessages(prev=>[...prev, {sender:'user', content:text}])
//     try{
//       const r = await api.post(`conversations/${conv.id}/messages/`, {content:text})
//       setMessages(prev=>[...prev, r.data])
//       setText('')
//     }catch(e){
//       alert('Error sending')
//     }
//   }
//
//   const endConv = async ()=>{
//     if(!conv) return
//     const r = await api.post(`conversations/${conv.id}/end/`)
//     alert('Summary generated (saved)')
//     setConv({...conv, summary: r.data.summary, status:'ended'})
//   }
//
//   return (
//     <div>
//       <div className='flex items-center justify-between mb-4'>
//         <button onClick={onBack} className='px-2 py-1 bg-gray-100 rounded'>Back</button>
//         <div className='font-semibold'>{conv?.title || 'New Conversation'}</div>
//         <div>
//           <button onClick={endConv} className='px-3 py-1 bg-red-500 text-white rounded'>End</button>
//         </div>
//       </div>
//
//       <div className='h-64 overflow-auto p-3 bg-gray-50 rounded'>
//         {messages.map((m, i)=>(
//           <div key={i} className={'my-2 '+(m.sender==='user'?'text-right':'text-left')}>
//             <div className='inline-block p-2 rounded-lg bg-white shadow'>{m.content}</div>
//           </div>
//         ))}
//       </div>
//
//       <div className='mt-3 flex'>
//         <input value={text} onChange={e=>setText(e.target.value)} className='flex-1 p-2 border rounded' placeholder='Type your message' />
//         <button onClick={send} className='ml-2 px-4 py-2 bg-blue-600 text-white rounded'>Send</button>
//       </div>
//     </div>
//   )
// }



import React, {useEffect, useState, useRef} from 'react'
import api from '../api/api'

export default function ChatPage({conversation, onBack, darkMode}){
  const [conv, setConv] = useState(conversation)
  const [messages, setMessages] = useState(conversation?.messages || [])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(()=>{
    if(conversation && conversation.id){
      api.get(`conversations/${conversation.id}/`).then(r=>{
        setConv(r.data);
        setMessages(r.data.messages)
      })
    }
  }, [conversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

//   const send = async ()=>{
//     if(!conv || !text.trim() || sending) return
//     setSending(true)
//     setMessages(prev=>[...prev, {sender:'user', content:text}])
//     const userText = text
//     setText('')
//
//
//       const r = await api.post(`conversations/${conv.id}/messages/`, {content:userText})
//       setMessages(prev=>[...prev, r.data])
//     }catch(e){
//       alert('Error sending message')
//     } finally {
//       setSending(false)
//     }
//   }
const send = async () => {
  if (!conv || !text.trim() || sending) return;
  setSending(true);
  setMessages(prev => [...prev, { sender: 'user', content: text }]);
  const userText = text;
  setText('');

  try {
    // Create a timeout promise (30 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
    );

    // Race between API request and timeout
    const r = await Promise.race([
      api.post(`conversations/${conv.id}/messages/`, { content: userText }),
      timeoutPromise
    ]);

    // If successful, add AI response
    setMessages(prev => [...prev, r.data]);

  } catch (e) {
    console.error(e);
    if (e.message.includes("timed out")) {
      alert("⚠️ The AI is taking too long to respond. Please try again.");
    } else {
      alert("❌ Error sending message. Please check your connection or server.");
    }
  } finally {
    setSending(false);
  }
};

  const endConv = async ()=>{
    if(!conv) return
    const r = await api.post(`conversations/${conv.id}/end/`)
    alert('Conversation ended! Summary generated.')
    setConv({...conv, summary: r.data.summary, status:'ended'})
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-12rem)] flex flex-col`}>
      {/* Chat Header */}
      <div className={`${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200'} border-b p-4`}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={onBack}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white text-gray-700'
              }`}
            >
              ← Back
            </button>
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {conv?.title || 'New Conversation'}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {conv?.status === 'active' ? '🟢 Active Chat' : '⚫ Ended'}
              </p>
            </div>
          </div>
          <button
            onClick={endConv}
            className='px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium'
          >
            ⏹️ End Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>💬</div>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Start a conversation
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Send a message to begin chatting with AI
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i)=>(
              <div key={i} className={`flex ${m.sender==='user'?'justify-end':'justify-start'} animate-fade-in`}>
                <div className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                  m.sender==='user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-100 border border-gray-700'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className='whitespace-pre-wrap'>{m.content}</p>
                  {m.timestamp && (
                    <p className={`text-xs mt-2 ${m.sender==='user' ? 'text-blue-100' : darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className='flex justify-start'>
                <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className='flex space-x-2'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                    <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                    <div className='w-2 h-2 bg-pink-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className={`${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
        <div className='flex space-x-3'>
          <input
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && send()}
            className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder='Type your message...'
            disabled={!conv || sending}
          />
          <button
            onClick={send}
            disabled={!conv || !text.trim() || sending}
            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium'
          >
            {sending ? '⏳' : '📤'} Send
          </button>
        </div>
      </div>
    </div>
  )
}