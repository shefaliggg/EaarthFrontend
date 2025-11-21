import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, Search, Users, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export function ChatPanel({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Agent Shukla',
      message: 'Hey team! Just scheduled the Avatar shooting for next week. Please check your calendars.',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'Rekha Patel',
      message: 'Got it! I\'ve confirmed my availability. Looking forward to it!',
      timestamp: '10:32 AM',
      isOwn: false,
    },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        message: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const onlineMembers = [
    { name: 'Agent Shukla', status: 'online' },
    { name: 'Rekha Patel', status: 'online' },
    { name: 'Madhu Kumar', status: 'online' },
    { name: 'John Doe', status: 'away' },
    { name: 'Jane Smith', status: 'offline' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#ede7f6] p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">DEPARTMENT CHAT</h2>
                    <p className="text-sm text-gray-500">{onlineMembers.filter(m => m.status === 'online').length} members online</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="SEARCH MESSAGES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
            </div>

            {/* Online Members */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex gap-2">
                  {onlineMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-full text-xs font-medium whitespace-nowrap"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="text-gray-700">{member.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {!message.isOwn && (
                    <div className="w-8 h-8 bg-purple-100 border border-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-purple-700">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className={`flex-1 max-w-[75%] ${message.isOwn ? 'flex flex-col items-end' : ''}`}>
                    {!message.isOwn && (
                      <p className="text-xs font-medium text-gray-700 mb-1">{message.sender}</p>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      message.isOwn
                        ? 'bg-[#7e57c2] text-white rounded-tr-sm'
                        : 'bg-white text-gray-900 rounded-tl-sm shadow-sm border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-100 rounded-2xl p-3">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="TYPE YOUR MESSAGE..."
                    rows={1}
                    className="w-full bg-transparent outline-none resize-none text-sm text-gray-900 placeholder:text-gray-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Smile className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="w-12 h-12 bg-[#7e57c2] hover:bg-[#7e57c2] transition-colors text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



