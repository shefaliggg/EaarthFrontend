import React, { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HelpCircle,
  User,
  FileText,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import eaarthLogo from '@/assets/eaarth.png';
import sidebarMenuList from '../config/sidebarMenuList';

function NavChevron({ isOpen, size = 16 }) {
  return (
    <motion.span
      aria-hidden
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ display: 'inline-flex' }}
    >
      <ChevronDown className={`w-${size / 4} h-${size / 4}`} />
    </motion.span>
  );
}

const SubItem = React.memo(function SubItem({
  subItem,
  depth,
  pathname,
  expandedItems,
  toggleExpanded,
  navigate,
}) {
  const isSubActive = pathname === subItem.page || pathname?.includes(subItem.page);
  const hasNested = subItem.subItems && subItem.subItems.length > 0;
  const isSubExpanded = expandedItems.has(subItem.id);

  const onClick = useCallback(() => {
    if (hasNested) toggleExpanded(subItem.id);
    else if (subItem.page) {
      // schedule navigation on next frame to prevent layout jank
      requestAnimationFrame(() => {
        navigate(subItem.page.startsWith('/') ? subItem.page : `/${subItem.page}`);
      });
    }
  }, [hasNested, subItem, toggleExpanded, navigate]);

  return (
    <div key={subItem.id}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-3xl border shadow transition-all text-sm ${isSubActive ? 'bg-lavender-200 text-lavender-900 border-lavender-300 dark:bg-lavender-500 dark:text-white' : 'text-gray-600 hover:bg-lavender-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'}`}
        style={{ paddingLeft: `${1 + depth * 0.5}rem` }}
        aria-expanded={hasNested ? isSubExpanded : undefined}
        aria-current={isSubActive ? 'page' : undefined}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-white dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'}`} />
        <span className="font-semibold flex-1 text-left">{subItem.label}</span>
        {hasNested && <NavChevron isOpen={isSubExpanded} size={12} />}
      </motion.button>

      <AnimatePresence initial={false}>
        {hasNested && isSubExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="ml-1 mt-1 space-y-1.5"
          >
            {subItem.subItems.map((child) => (
              <SubItem
                key={child.id}
                subItem={child}
                depth={depth + 1}
                pathname={pathname}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
                navigate={navigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function Sidebar({ userRole }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // store expanded as array of ids for stable comparisons (Set works, but arrays + memoization is easier to reason about)
  const [expandedItems, setExpandedItems] = useState(() => new Set(['profile', 'master-admin', 'studio-admin', 'agency-admin']));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // temp user data
  const userName = 'Razik';
  const userEmail = 'razik@eaarthstudios.com';

  // memoize menu to avoid recomputing on each render
  const menuItems = useMemo(() => sidebarMenuList(userRole), [userRole]);

  // stable toggleExpanded using useCallback
  const toggleExpanded = useCallback((itemId) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }, []);

  const handleLogout = useCallback(() => {
    // use RAF to avoid blocking a paint before navigation
    requestAnimationFrame(() => navigate('/auth/login'));
  }, [navigate]);

  const getUserInitials = useCallback(() => {
    if (userName) return userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    if (userEmail) {
      const emailName = userEmail.split('@')[0];
      if (emailName.length >= 2) return emailName.slice(0, 2).toUpperCase();
      return emailName[0].toUpperCase();
    }
    return 'U';
  }, [userName, userEmail]);

  // find first leaf page
  const findFirstLeafPage = useCallback((item) => {
    if (!item) return null;
    if (item.page) return item.page;
    if (!item.subItems || item.subItems.length === 0) return null;
    for (const sub of item.subItems) {
      const found = findFirstLeafPage(sub);
      if (found) return found;
    }
    return null;
  }, []);

  // render main menu
  return (
    <>
      {!isCollapsed && (
        <div className="fixed inset-0 bg-gradient-to-br from-lavender-500/20 to-pastel-pink-500/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}
      <aside
        className={`sticky left-0 top-0 h-screen z-50 bg-gradient-to-b from-lavender-50 via-teal-50 to-pastel-pink-50 dark:bg-gradient-to-b dark:from-background dark:via-slate-950 dark:to-background border-r-2 border-lavender-200/50 dark:border-gray-800 shadow-xl transition-all duration-300`}
        style={{ width: isCollapsed ? '80px' : '280px' }}
        aria-label="Main sidebar"
      >
        <div className="flex flex-col h-screen">
          <div className={`${isCollapsed ? 'p-4 pb-2' : 'p-6 px-5'} border-b-2 border-lavender-200/50 dark:border-gray-800`}>
            <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
              <Link to="home" className="flex items-center gap-3">
                {!isCollapsed ? (
                  <img src={eaarthLogo} alt="Eaarth Studios" className="w-26 h-auto object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lavender-400 to-pastel-pink-400 flex items-center justify-center shadow-lg"><Sparkles className="w-5 h-5 text-white" /></div>
                )}
              </Link>

              <button onClick={() => setIsCollapsed((s) => !s)} className="p-2 rounded-xl transition-all hover:bg-lavender-100/50 text-lavender-600 dark:hover:bg-gray-800 dark:text-gray-400" aria-pressed={!isCollapsed}>
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav className={`flex-1 ${isCollapsed ? 'py-3 px-4.5' : 'p-5 py-3'} space-y-2 overflow-y-auto`}>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.page;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.has(item.id);

              const onMainClick = () => {
                if (hasSubItems) {
                  if (isCollapsed) {
                    const target = findFirstLeafPage(item) || item.page;
                    if (target) requestAnimationFrame(() => navigate(target.startsWith('/') ? target : `/${target}`));
                  } else {
                    toggleExpanded(item.id);
                  }
                } else {
                  if (item.page) requestAnimationFrame(() => navigate(item.page.startsWith('/') ? item.page : `/${item.page}`));
                }
              };

              return (
                <div key={item.id}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onMainClick}
                    className={`w-full flex items-center ${isCollapsed ? 'py-2.5' : 'gap-3 px-4 py-2'} rounded-3xl border shadow transition-all ${isActive ? 'bg-gradient-to-r from-lavender-400 to-pastel-pink-400 text-white shadow-lg dark:from-lavender-600 dark:to-pastel-pink-600' : 'text-gray-700 hover:bg-lavender-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                    aria-expanded={hasSubItems ? isExpanded : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`size-4 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
                        {hasSubItems && <NavChevron isOpen={isExpanded} size={16} />}
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {hasSubItems && isExpanded && !isCollapsed && (
                      <motion.div
                        key={`sub-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="ml-1 mt-1 space-y-1.5"
                      >
                        {item.subItems.map((sub) => (
                          <SubItem
                            key={sub.id}
                            subItem={sub}
                            depth={0}
                            pathname={pathname}
                            expandedItems={expandedItems}
                            toggleExpanded={toggleExpanded}
                            navigate={navigate}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t-2 border-lavender-200/50 dark:border-gray-800 space-y-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => requestAnimationFrame(() => navigate('support'))} className={`w-full flex items-center ${isCollapsed ? 'py-2.5' : 'gap-3 px-4 py-2'} rounded-3xl border shadow-lg transition-all text-gray-700 hover:bg-lavender-50 dark:text-gray-300 dark:hover:bg-gray-800`}>
              <HelpCircle className={`size-4 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="font-bold text-sm">HELP & SUPPORT</span>}
            </motion.button>

            <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              <div className="relative flex-1">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setShowUserMenu((s) => !s)} className={`${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full justify-start'} flex items-center gap-3 p-2 rounded-xl text-foreground border shadow transition-all`} aria-expanded={showUserMenu}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">{getUserInitials()}</span></div>
                  {!isCollapsed && (
                    <div className='leading-4 flex flex-col items-start'>
                      <p className='font-bold text-sm'>{userName || userEmail?.split('@')[0].toUpperCase() || 'USER'}</p>
                      <p className='text-sm'>{userRole}</p>
                    </div>
                  )}
                </motion.button>

                {showUserMenu && (
                  <div className={`absolute bottom-full ${isCollapsed ? 'left-0' : 'left-0 right-0'} mb-2 rounded-2xl shadow-2xl border overflow-hidden bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`} style={{ minWidth: isCollapsed ? '200px' : 'auto' }}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">{getUserInitials()}</span></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate text-gray-900 dark:text-white">{userName || userEmail?.split('@')[0].toUpperCase() || 'USER'}</div>
                          <div className="text-xs truncate text-gray-600 dark:text-gray-400">{userRole === 'master-admin' ? 'MASTER ADMIN' : userRole === 'studio-admin' ? 'STUDIO ADMIN' : userRole === 'agency-admin' ? 'AGENCY ADMIN' : 'CREW MEMBER'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button onClick={() => { requestAnimationFrame(() => navigate('profile-general')); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"><User className="w-5 h-5" /><span className="font-bold text-sm">MY PROFILE</span></button>
                      <button onClick={() => { requestAnimationFrame(() => navigate('profile-documents')); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"><FileText className="w-5 h-5" /><span className="font-bold text-sm">DOCUMENTS</span></button>
                      <button onClick={() => { requestAnimationFrame(() => navigate('profile-calendar')); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"><Calendar className="w-5 h-5" /><span className="font-bold text-sm">CALENDAR</span></button>
                      <button onClick={() => { requestAnimationFrame(() => navigate('account-settings')); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"><Settings className="w-5 h-5" /><span className="font-bold text-sm">SETTINGS</span></button>
                    </div>
                  </div>
                )}
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className={`${isCollapsed ? 'w-11 h-10' : 'w-auto py-4'} flex items-center justify-center gap-2 p-3 rounded-xl transition-all bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 border dark:border-0`}>
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
