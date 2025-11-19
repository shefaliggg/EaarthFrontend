import { useState } from 'react';
import { Search, Bell, MessageSquare, User, ChevronDown, Settings, LogOut, Calendar, FileText, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkmodeButton from './DarkmodeButton';

export default function Header({
    isDarkMode,
    onToggleDarkMode,
    onOpenNotifications,
    onOpenMessages,
    onNavigate,
    onLogout,
    userName = 'JOHN DOE',
    userRole = 'CREW MEMBER'
}) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount] = useState(5);
    const [messageCount] = useState(3);

    return (
        <div className={`h-16 border-b backdrop-blur-sm sticky top-0 z-40 ${isDarkMode
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-200'
            }`}>
            <div className="max-w-full mx-auto px-6 h-full flex items-center justify-between">
                {/* Left: Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH ANYTHING..."
                            className={`w-full pl-10 pr-4 py-1.5 rounded-xl border-2 outline-none transition-all ${isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                                }`}
                        />
                    </div>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                    <DarkmodeButton />
                    {/* Notifications */}
                    <motion.button
                        onClick={onOpenNotifications}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-2 rounded-lg transition-all ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </motion.button>

                    {/* Messages */}
                    <motion.button
                        onClick={onOpenMessages}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-2 rounded-lg transition-all ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        {messageCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {messageCount}
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}