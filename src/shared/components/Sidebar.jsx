import { use, useState } from 'react';
import { Home, FolderOpen, User, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Bell, Calendar, FileText, Users, BarChart3, Moon, Sun, Building2, Briefcase, FileUser, CreditCard, Wallet, Building, FileSpreadsheet, Clock, UserCheck, Shield, Mail, Megaphone, Bot, Activity, Grid, BookOpen, CloudIcon, MessageSquare, ScrollText, CalendarClock, ListTodo, GitBranch, Package, Shirt, UtensilsCrossed, Calculator, ShoppingCart, TrendingUp, Truck, Play, FileCheck, PawPrint, Car, MapPin, ThumbsUp, Plus, CheckCircle, DollarSign } from 'lucide-react';
import eaarthLogo from '@/assets/eaarth.png';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import sidebarMenuList from '../config/sidebarMenuList';

export default function Sidebar({ userRole="Studio admin", userName, userEmail="razik@eaarthstudios.com" }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set(['profile', 'master-admin', 'studio-admin', 'agency-admin']));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };
  const handleLogout = () => {
    navigate("/auth/login")
  }

  const getUserInitials = () => {
    if (userName) {
      return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userEmail) {
      const emailName = userEmail.split('@')[0];
      if (emailName.length >= 2) {
        return emailName.slice(0, 2).toUpperCase();
      }
      return emailName[0].toUpperCase();
    }
    return 'U';
  };

  const menuItems = sidebarMenuList(pathname.split("/")[1]);

  const isPageInSubItems = (item, page) => {
    if (!item.subItems) return false;

    const checkSubItems = (subItems) => {
      return subItems.some(sub => {
        if (sub.page === page || page?.startsWith(sub.page + '-')) return true;
        if (sub.subItems) return checkSubItems(sub.subItems);
        return false;
      });
    };

    return checkSubItems(item.subItems);
  };

  const isSubItemActive = (subItem, page) => {
    return page === subItem.page || page?.includes(subItem.page);
  };

  // Recursive component for rendering nested sub-items
  const renderSubItems = (subItems, depth = 0) => {
    return subItems.map((subItem) => {
      const isSubActive = isSubItemActive(subItem, pathname);
      const hasNestedItems = subItem.subItems && subItem.subItems.length > 0;
      const isSubExpanded = expandedItems.has(subItem.id);

      return (
        <div key={subItem.id}>
          <button
            onClick={() => {
              if (hasNestedItems) {
                toggleExpanded(subItem.id);
              } else {
                navigate(subItem.page);
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm ${isSubActive
              ? 'bg-lavender-200 text-lavender-900 dark:bg-lavender-500 dark:text-white'
              : 'text-gray-600 hover:bg-lavender-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            style={{ paddingLeft: `${1 + depth * 0.5}rem` }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isSubActive
              ? 'bg-white dark:bg-white'
              : 'bg-gray-400 dark:bg-gray-600'
              }`} />
            <span className="font-bold flex-1 text-left">
              {subItem.label}
            </span>
            {hasNestedItems && (
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          {/* Nested sub-items */}
          {hasNestedItems && isSubExpanded && (
            <div className="ml-2 mt-1 space-y-1">
              {renderSubItems(subItem.subItems, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-lavender-500/20 to-pastel-pink-500/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Side Navigation */}
      <aside
        className={`sticky left-0 top-0 h-screen z-50 bg-gradient-to-b from-lavender-50 via-teal-50 to-pastel-pink-50 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-r-2 border-lavender-200/50 dark:border-gray-800 shadow-xl transition-all duration-300`}
        style={{ width: isCollapsed ? '80px' : '280px' }}
      >
        <div className="flex flex-col h-screen">
          {/* Logo Section */}
          <div className={`${isCollapsed ? 'p-4 pb-2' : 'p-6'} border-b-2 border-lavender-200/50 dark:border-gray-800`}>
            <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : 'flex-row gap-4'}`}>

              <Link to="dashboard" className="flex items-center gap-3">
                {!isCollapsed && (
                  <img
                    src={eaarthLogo}
                    alt="Eaarth Studios"
                    className="w-26 h-auto object-contain"
                  />
                )}
                {isCollapsed && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lavender-400 to-pastel-pink-400 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-xl transition-all hover:bg-lavender-100/50 text-lavender-600 dark:hover:bg-gray-800 dark:text-gray-400"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'py-3 px-4.5' : 'p-5 py-3'} space-y-2 overflow-y-auto`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.page;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.has(item.id);
              const isParentActive = isActive || isPageInSubItems(item, pathname);

              return (
                <div key={item.id}>
                  {/* Main Menu Item */}
                  <motion.button
                    onClick={() => {
                      if (hasSubItems && !isCollapsed) {
                        toggleExpanded(item.id);
                      } else {
                        navigate(item.page);
                      }
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center ${isCollapsed ? "py-2.5" : "gap-3 px-4 py-1.5"} rounded-3xl border border-lavender-200 shadow-sm shadow-lavender-300 dark:border-gray-800 transition-all ${isParentActive
                      ? 'bg-gradient-to-r from-lavender-400 to-pastel-pink-400 text-white shadow-lg dark:from-lavender-600 dark:to-pastel-pink-600'
                      : 'text-gray-700 hover:bg-lavender-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Icon className={`size-4 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-bold text-sm flex-1 text-left">
                          {item.label}
                        </span>
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        )}
                      </>
                    )}
                  </motion.button>

                  {/* Sub Menu Items */}
                  {hasSubItems && isExpanded && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {renderSubItems(item.subItems)}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t-2 border-lavender-200/50 dark:border-gray-800 space-y-3">
            {/* Help */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('support')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-3xl border border-lavender-200 shadow-sm shadow-lavender-300 dark:border-gray-800 transition-all text-gray-700 hover:bg-lavender-100/50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <HelpCircle className={`size-4 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <span className="font-bold text-sm">HELP & SUPPORT</span>
              )}
            </motion.button>

            {/* Bottom Row: User Avatar + Logout */}
            <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              {/* User Avatar with Drop-up Menu */}
              <div className="relative flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full justify-start'} flex items-center  gap-3 p-2 rounded-2xl hover:bg-lavender-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className='leading-4 flex flex-col items-start'>
                      <p className='font-bold text-sm'>{userName || userEmail?.split('@')[0].toUpperCase() || 'USER'}</p>
                      <p className='text-sm'>{userRole}</p>
                    </div>
                  )}
                  {!isCollapsed && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  )}
                </motion.button>

                {/* Drop-up Menu */}
                {showUserMenu && (
                  <div
                    className={`absolute bottom-full ${isCollapsed ? 'left-0' : 'left-0 right-0'} mb-2 rounded-2xl shadow-2xl border overflow-hidden bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
                    style={{ minWidth: isCollapsed ? '200px' : 'auto' }}
                  >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-500 to-pastel-pink-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate text-gray-900 dark:text-white">
                            {userName || userEmail?.split('@')[0].toUpperCase() || 'USER'}
                          </div>
                          <div className="text-xs truncate text-gray-600 dark:text-gray-400">
                            {userRole === 'master-admin' ? 'MASTER ADMIN' :
                              userRole === 'studio-admin' ? 'STUDIO ADMIN' :
                                userRole === 'agency-admin' ? 'AGENCY ADMIN' :
                                  'CREW MEMBER'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('profile-general');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-bold text-sm">MY PROFILE</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('profile-documents');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-bold text-sm">DOCUMENTS</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('profile-calendar');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="font-bold text-sm">CALENDAR</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('account-settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-lavender-50 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-bold text-sm">SETTINGS</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`${isCollapsed ? 'w-10 h-10' : 'w-auto'} flex items-center justify-center gap-2 p-3 rounded-xl transition-all bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400`}
              >
                <LogOut className="w-5 h-5" />
                {/* {!isCollapsed && (
                  <span className="font-bold text-sm">LOGOUT</span>
                )} */}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}