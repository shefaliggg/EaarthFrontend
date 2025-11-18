import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText, Calendar, Settings } from 'lucide-react';
import { getUserInitials } from '../../lib/utils';

export default function UserMenu({ isCollapsed, isDarkMode, showUserMenu, setShowUserMenu, userName, userEmail, userRole, onNavigate, onLogout }) {
    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${isCollapsed ? 'w-10 h-10' : 'w-full'} flex items-center justify-center gap-3 p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-lavender-100/50 text-gray-700'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{getUserInitials(userName, userEmail)}</span>
                    </div>
                    {!isCollapsed && <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />}
                </motion.button>

                <AnimatePresence>
                    {showUserMenu && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute bottom-full ${isCollapsed ? 'left-0' : 'left-0 right-0'} mb-2 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ minWidth: isCollapsed ? '200px' : 'auto' }}>
                            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">{getUserInitials(userName, userEmail)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName || userEmail?.split('@')[0].toUpperCase() || 'USER'}</div>
                                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userRole?.toUpperCase() || 'USER'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <button onClick={() => { onNavigate('profile-general'); setShowUserMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-lavender-50 text-gray-700'}`}>
                                    <User className="w-5 h-5" />
                                    <span className="font-bold text-sm">MY PROFILE</span>
                                </button>

                                <button onClick={() => { onNavigate('profile-documents'); setShowUserMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-lavender-50 text-gray-700'}`}>
                                    <FileText className="w-5 h-5" />
                                    <span className="font-bold text-sm">DOCUMENTS</span>
                                </button>

                                <button onClick={() => { onNavigate('profile-calendar'); setShowUserMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-lavender-50 text-gray-700'}`}>
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-bold text-sm">CALENDAR</span>
                                </button>

                                <button onClick={() => { onNavigate('account-settings'); setShowUserMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-lavender-50 text-gray-700'}`}>
                                    <Settings className="w-5 h-5" />
                                    <span className="font-bold text-sm">SETTINGS</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button onClick={onLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${isCollapsed ? 'w-10 h-10' : 'w-auto'} flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all ${isDarkMode ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                <svg className="w-5 h-5" />
                {!isCollapsed && <span className="font-bold text-sm">LOGOUT</span>}
            </motion.button>
        </div>
    );
}
