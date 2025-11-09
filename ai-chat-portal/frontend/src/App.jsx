// import React from 'react'
// import ConversationsList from './components/ConversationsList'
// import ChatPage from './components/ChatPage'
// import IntelligencePage from './components/IntelligencePage'
//
// export default function App(){
//   const [view, setView] = React.useState('list')
//   const [activeConv, setActiveConv] = React.useState(null)
//
//   return (
//     <div className='min-h-screen p-6'>
//       <header className='max-w-4xl mx-auto mb-6'>
//         <h1 className='text-2xl font-bold'>AI Chat Portal (LM Studio / REST)</h1>
//         <div className='mt-2 space-x-2'>
//           <button onClick={()=>setView('list')} className='px-3 py-1 bg-white rounded shadow'>Conversations</button>
//           <button onClick={()=>setView('chat')} className='px-3 py-1 bg-white rounded shadow'>Chat</button>
//           <button onClick={()=>setView('intel')} className='px-3 py-1 bg-white rounded shadow'>Intelligence</button>
//         </div>
//       </header>
//
//       <main className='max-w-4xl mx-auto bg-white rounded p-4 shadow'>
//         {view === 'list' && <ConversationsList onOpen={(c)=>{ setActiveConv(c); setView('chat')}} />}
//         {view === 'chat' && <ChatPage conversation={activeConv} onBack={()=>setView('list')} />}
//         {view === 'intel' && <IntelligencePage />}
//       </main>
//     </div>
//   )
// }


import React from 'react'
import ConversationsList from './components/ConversationsList'
import ChatPage from './components/ChatPage'
import IntelligencePage from './components/IntelligencePage'

export default function App(){
  const [view, setView] = React.useState('list')
  const [activeConv, setActiveConv] = React.useState(null)
  const [darkMode, setDarkMode] = React.useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} transition-all duration-300`}>
      {/* Modern Header */}
      <header className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm`}>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo & Title */}
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Chat Portal
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Intelligent Conversation Platform
                </p>
              </div>
            </div>

            {/* Navigation Pills */}
            <div className='flex items-center space-x-2'>
              <div className={`flex space-x-1 p-1 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setView('list')}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    view === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  📚 Conversations
                </button>
                <button
                  onClick={() => setView('chat')}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    view === 'chat'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setView('intel')}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    view === 'intel'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  🧠 Intelligence
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-6 py-8'>
        {view === 'list' && <ConversationsList darkMode={darkMode} onOpen={(c)=>{ setActiveConv(c); setView('chat')}} />}
        {view === 'chat' && <ChatPage darkMode={darkMode} conversation={activeConv} onBack={()=>setView('list')} />}
        {view === 'intel' && <IntelligencePage darkMode={darkMode} />}
      </main>
    </div>
  )
}