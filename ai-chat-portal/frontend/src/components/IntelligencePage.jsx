// import React, {useState} from 'react'
// import api from '../api/api'
//
// export default function IntelligencePage(){
//   const [query, setQuery] = useState('')
//   const [answer, setAnswer] = useState(null)
//
//   const ask = async ()=>{
//     try{
//       const r = await api.post('conversations/query/', {query})
//       setAnswer(r.data)
//     }catch(e){
//       setAnswer({error:'Not implemented in backend sample'})
//     }
//   }
//
//   return (
//     <div>
//       <h2 className='text-lg font-semibold mb-2'>Conversation Intelligence</h2>
//       <p className='text-sm text-gray-600 mb-4'>Ask questions about your past conversations (requires backend semantic search).</p>
//       <div className='flex'>
//         <input className='flex-1 p-2 border rounded' value={query} onChange={e=>setQuery(e.target.value)} placeholder='What did I discuss about X?' />
//         <button onClick={ask} className='ml-2 px-3 py-1 bg-blue-600 text-white rounded'>Ask</button>
//       </div>
//       <div className='mt-4'>
//         <pre className='whitespace-pre-wrap'>{answer ? JSON.stringify(answer, null, 2) : 'No answer yet'}</pre>
//       </div>
//     </div>
//   )
// }


import React, { useState } from 'react'
import api from '../api/api'

export default function IntelligencePage({ darkMode }) {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    if (!query.trim() || loading) return
    setLoading(true)

    try {
      console.log("Sending query:", query)
      const r = await api.post('conversations/query/', { query })
      console.log("Respons  e:", r.data)
      setAnswer(r.data)
    } catch (e) {
      console.error(e)
      setAnswer({ error: 'Error processing query. Make sure backend is running.' })
    } finally {
      setLoading(false)
    }
  }

  const exampleQueries = [
    "What did I discuss about travel?",
    "Summarize my recent conversations",
    "What topics have I talked about?",
    "Show me conversations about work"
  ]

  return (
    <div className='space-y-6'>
      {/* Header Card */}
      <div
        className={`${
          darkMode
            ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50'
            : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
        } border rounded-2xl p-8 shadow-xl`}
      >
        <div className='flex items-center space-x-4 mb-4'>
          <div className='text-5xl'>🧠</div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Conversation Intelligence
            </h1>
            <p className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              Ask questions about your chat history
            </p>
          </div>
        </div>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Use AI-powered semantic search to find insights from your past conversations.
          Ask natural language questions and get intelligent responses.
        </p>
      </div>

      {/* Query Input Card */}
      <div
        className={`${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-2xl p-6 shadow-xl`}
      >
        <label
          className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
        >
          Ask Your Question
        </label>
        <div className='flex space-x-3'>
          <input
            className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && ask()}
            placeholder='e.g., What did I discuss about travel last week?'
          />
          <button
            onClick={ask}
            disabled={!query.trim() || loading}
            className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium'
          >
            {loading ? '⏳ Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Example Queries */}
        <div className='mt-4'>
          <p
            className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            💡 Try these examples:
          </p>
          <div className='flex flex-wrap gap-2'>
            {exampleQueries.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(ex)}
                className={`text-sm px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Card */}
      {answer && (
        <div
          className={`${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-2xl p-6 shadow-xl`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ✨ AI Response
          </h2>

          {answer.error ? (
            <div className='p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl'>
              ⚠️ {answer.error}
            </div>
          ) : (
            <div
              className={`p-6 rounded-xl ${
                darkMode
                  ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/30'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50'
              }`}
            >
              <pre
                className={`whitespace-pre-wrap font-sans ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                {typeof answer === 'string'
                  ? answer
                  : JSON.stringify(answer, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
