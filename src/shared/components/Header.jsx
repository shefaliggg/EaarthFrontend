import { useEffect, useState } from 'react';
import { Search, Bell, MessageSquare, User, ChevronDown, Settings, LogOut, Calendar, FileText, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DarkmodeButton from './DarkmodeButton';
import { NotificationsPanel } from './NotificationPanel';
import { ChatPanel } from './ChatPanel';

export default function Header() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount] = useState(5);
    const [messageCount] = useState(3);

    useEffect(() => {
        if (showMessages || showNotifications) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }
    },[showMessages, showNotifications])

    const navigate = useNavigate();

    return (
        <>
            <div className="h-16 border-b backdrop-blur-sm sticky top-0 z-40 bg-background dark:bg-slate-950 border">
                <div className="max-w-full mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="SEARCH ANYTHING..."
                                className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 outline-none transition-all
                         bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500
                         dark:bg-slate-900 dark:border-gray-800 dark:text-white dark:placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-3">
                        <DarkmodeButton />

                        {/* Notifications */}
                        <motion.button
                            onClick={() => setShowNotifications(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 rounded-lg transition-all
                       bg-gray-100 hover:bg-gray-200 text-gray-700
                       dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
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
                            onClick={() => setShowMessages(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 rounded-lg transition-all
                       bg-gray-100 hover:bg-gray-200 text-gray-700
                       dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
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

            {showNotifications && (
                <NotificationsPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            )}

            {showMessages && (
                <ChatPanel
                    isOpen={showMessages}
                    onClose={() => setShowMessages(false)}
                />
            )}
        </>
    );
}