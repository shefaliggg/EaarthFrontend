import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import eaarthLogo from '@/assets/eaarth.png';
import { motion, AnimatePresence } from 'framer-motion';
import getMenuItems from './sidebar/sidebarConfig';
import SidebarItem from './sidebar/SidebarItem';
import UserMenu from './sidebar/UserMenu';

export default function Sidebar({ 
  onLogout, 
  isDarkMode, 
  sidebarType = 'studio', 
  userName = 'dummy', 
  userEmail = 'dummy@email.com' 
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const [expandedItems, setExpandedItems] = useState(new Set(['profile', 'master-admin', 'studio-admin', 'agency-admin']));
  const [showUserMenu, setShowUserMenu] = useState(false);

  // const toggleExpanded = (itemId) => {
  //   const newExpanded = new Set(expandedItems);
  //   if (newExpanded.has(itemId)) newExpanded.delete(itemId); 
  //   else newExpanded.add(itemId);
  //   setExpandedItems(newExpanded);
  // };

  const menuItems = getMenuItems(sidebarType);

  return (
    <>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsCollapsed(true)} 
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false} 
        animate={{ width: isCollapsed ? '80px' : '280px' }} 
        transition={{ duration: 0.28 }} 
        className={`fixed left-0 top-0 h-screen z-50 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800' 
            : 'bg-gradient-to-b from-lavender-50 via-teal-50 to-pastel-pink-50'
        } border-r-2 ${
          isDarkMode ? 'border-gray-800' : 'border-lavender-200/50'
        } shadow-xl transition-colors`}
      >
        <div className="flex flex-col h-full">
          <div className={`${isCollapsed ? 'p-4.5 py-3.5' : 'p-6  py-4'} border-b-2 border-lavender-200/50 dark:border-gray-800`}>
            <div className="flex flex-wrap gap-y-1 items-center justify-between">
              <div className="flex items-center gap-3">
                {!isCollapsed ? (
                  <img src={eaarthLogo} alt="Eaarth Studios" className="w-26 h-auto object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lavender-400 to-pastel-pink-400 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className={`p-2 rounded-xl transition-all ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-lavender-100/50 text-lavender-600'
                }`}
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.id} 
                item={item} 
                isCollapsed={isCollapsed} 
                isDarkMode={isDarkMode} 
              />
            ))}
          </nav>

          <div className={`p-4 border-t-2 ${isDarkMode ? 'border-gray-800' : 'border-lavender-200/50'} space-y-2`}>
            <NavLink to="/support">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-lavender-600 to-pastel-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-lavender-400 to-pastel-pink-400 text-white shadow-lg'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-800' 
                        : 'text-gray-700 hover:bg-lavender-100/50'
                  }`}
                >
                  <HelpCircle className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && <span className="font-bold text-sm">HELP & SUPPORT</span>}
                </motion.div>
              )}
            </NavLink>

            <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              <UserMenu 
                isCollapsed={isCollapsed} 
                isDarkMode={isDarkMode} 
                showUserMenu={showUserMenu} 
                setShowUserMenu={setShowUserMenu} 
                userName={userName} 
                userEmail={userEmail} 
                sidebarType={sidebarType} 
                onLogout={onLogout} 
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}