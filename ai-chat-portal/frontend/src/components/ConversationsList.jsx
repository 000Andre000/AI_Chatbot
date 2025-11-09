// import React, {useEffect, useState} from 'react'
// import api from '../api/api'
//
// export default function ConversationsList({onOpen}){
//   const [convs, setConvs] = useState([])
//   useEffect(()=>{ api.get('conversations/').then(r=>setConvs(r.data)).catch(()=>{}) }, [])
//   return (
//     <div>
//       <div className='flex justify-between mb-4'>
//         <h2 className='text-lg font-semibold'>Conversations</h2>
//         <button className='px-3 py-1 bg-blue-600 text-white rounded' onClick={async ()=>{
//           const r = await api.post('conversations/', {title: 'New conversation'});
//           onOpen(r.data);
//         }}>New</button>
//       </div>
//       <ul>
//         {convs.map(c=>(
//           <li key={c.id} className='p-3 border-b flex justify-between items-center'>
//             <div>
//               <div className='font-medium'>{c.title || ('Conversation '+c.id)}</div>
//               <div className='text-sm text-gray-500'>{c.start_time}</div>
//             </div>
//             <div>
//               <button className='px-2 py-1 bg-gray-100 rounded mr-2' onClick={async ()=>{ const r = await api.get(`conversations/${c.id}/`); onOpen(r.data) }}>Open</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }
//
//
// // ============================================
// // App.jsx - Modern Styled Version
// // ============================================
//
// import React from 'react'
// import ConversationsList from './components/ConversationsList'
// import ChatPage from './components/ChatPage'
// import IntelligencePage from './components/IntelligencePage'
//
// export default function App(){
//   const [view, setView] = React.useState('list')
//   const [activeConv, setActiveConv] = React.useState(null)
//   const [darkMode, setDarkMode] = React.useState(false)
//
//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} transition-all duration-300`}>
//       {/* Modern Header */}
//       <header className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm`}>
//         <div className='max-w-7xl mx-auto px-6 py-4'>
//           <div className='flex items-center justify-between'>
//             {/* Logo & Title */}
//             <div className='flex items-center space-x-3'>
//               <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg'>
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                   AI Chat Portal
//                 </h1>
//                 <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   Intelligent Conversation Platform
//                 </p>
//               </div>
//             </div>
//
//             {/* Navigation Pills */}
//             <div className='flex items-center space-x-2'>
//               <div className={`flex space-x-1 p-1 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <button
//                   onClick={() => setView('list')}
//                   className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
//                     view === 'list'
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
//                       : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
//                   }`}
//                 >
//                   📚 Conversations
//                 </button>
//                 <button
//                   onClick={() => setView('chat')}
//                   className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
//                     view === 'chat'
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
//                       : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
//                   }`}
//                 >
//                   💬 Chat
//                 </button>
//                 <button
//                   onClick={() => setView('intel')}
//                   className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
//                     view === 'intel'
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
//                       : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-white'
//                   }`}
//                 >
//                   🧠 Intelligence
//                 </button>
//               </div>
//
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-2.5 rounded-lg transition-all duration-200 ${
//                   darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
//                 }`}
//               >
//                 {darkMode ? '☀️' : '🌙'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//
//       {/* Main Content */}
//       <main className='max-w-7xl mx-auto px-6 py-8'>
//         {view === 'list' && <ConversationsList darkMode={darkMode} onOpen={(c)=>{ setActiveConv(c); setView('chat')}} />}
//         {view === 'chat' && <ChatPage darkMode={darkMode} conversation={activeConv} onBack={()=>setView('list')} />}
//         {view === 'intel' && <IntelligencePage darkMode={darkMode} />}
//       </main>
//     </div>
//   )
// }
//
//
// // ============================================
// // components/ConversationsList.jsx
// // ============================================

import React, {useEffect, useState} from 'react'
import api from '../api/api'

export default function ConversationsList({onOpen, darkMode}){
  const [convs, setConvs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{
    api.get('conversations/').then(r=>setConvs(r.data)).catch(()=>{})
  }, [])

  const filteredConvs = convs.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200`}>
          <div className='flex items-center justify-between'>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Total Chats</p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{convs.length}</p>
            </div>
            <div className='text-4xl'>💬</div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200`}>
          <div className='flex items-center justify-between'>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Active Now</p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {convs.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className='text-4xl'>🟢</div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200`}>
          <div className='flex items-center justify-between'>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Completed</p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {convs.filter(c => c.status === 'ended').length}
              </p>
            </div>
            <div className='text-4xl'>✅</div>
          </div>
        </div>
      </div>

      {/* Conversations List Card */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl overflow-hidden`}>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Conversations
            </h2>
            <button
              className='px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium'
              onClick={async ()=>{
                const r = await api.post('conversations/', {title: 'New conversation'});
                onOpen(r.data);
              }}
            >
              ➕ New Chat
            </button>
          </div>

          {/* Search Bar */}
          <div className='relative'>
            <input
              type='text'
              placeholder='🔍 Search conversations...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
          {filteredConvs.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='text-6xl mb-4'>💭</div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm ? 'No conversations found' : 'No conversations yet. Start your first chat!'}
              </p>
            </div>
          ) : (
            filteredConvs.map(c=>(
              <div
                key={c.id}
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4 flex-1'>
                    <div className={`p-3 rounded-xl ${
                      c.status === 'active'
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    } shadow-lg`}>
                      <span className='text-2xl'>💬</span>
                    </div>
                    <div className='flex-1'>
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {c.title || ('Conversation '+c.id)}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {c.start_time} • {c.message_count || 0} messages
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {c.status || 'active'}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={async ()=>{
                        const r = await api.get(`conversations/${c.id}/`);
                        onOpen(r.data)
                      }}
                    >
                      Open →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
