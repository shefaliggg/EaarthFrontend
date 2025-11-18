import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function SidebarItem({ 
  item, 
  isCollapsed, 
  isDarkMode,
}) {
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // For items with a direct link
  if (item.link && !hasSubItems) {
    return (
      <NavLink to={item.link}>
        {({ isActive }) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-2 py-2 rounded-3xl border border-lavender-300 shadow-sm shadow-lavender-300 transition-all ${
              isActive
                ? isDarkMode
                  ? 'bg-gradient-to-r from-lavender-600 to-pastel-pink-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-lavender-400 to-pastel-pink-400 text-white shadow-lg'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-lavender-50'
            }`}
          >
            {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />}
            {!isCollapsed && (
              <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
            )}
          </motion.div>
        )}
      </NavLink>
    );
  }

  // For items with sub-items or no link (expandable sections)
  return (
    <div>
      <motion.button
        onClick={() => {
          if (hasSubItems && !isCollapsed) {
            // toggleExpanded(item.id);
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-4 px-2 py-3 rounded-2xl transition-all ${
          isDarkMode
            ? 'text-gray-300 hover:bg-gray-800'
            : 'text-gray-700 hover:bg-lavender-50'
        }`}
      >
        {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />}
        {isCollapsed ? ()
        :(
          <>
            <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
            {hasSubItems && (
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            )}
          </>
        )}
      </motion.button>

      {hasSubItems && isExpanded && !isCollapsed && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }} 
          className="ml-4 mt-1 space-y-1"
        >
          {item.subItems.map((subItem) => {
            const hasNested = subItem.subItems && subItem.subItems.length > 0;
            const [nestedExpanded, setNestedExpanded] = React.useState(false);

            if (subItem.link) {
              return (
                <div key={subItem.id}>
                  <NavLink to={subItem.link}>
                    {({ isActive }) => (
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm ${
                          isActive
                            ? isDarkMode
                              ? 'bg-lavender-500 text-white'
                              : 'bg-lavender-200 text-lavender-900'
                            : isDarkMode
                              ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                              : 'text-gray-600 hover:bg-lavender-50 hover:text-gray-700'
                        }`}
                      >
                        <div 
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                          }`} 
                        />
                        <span className="font-bold">{subItem.label}</span>
                      </motion.div>
                    )}
                  </NavLink>

                  {hasNested && (
                    <div className="ml-4 mt-1">
                      {subItem.subItems.map((deep) => (
                        deep.link ? (
                          <NavLink key={deep.id} to={deep.link}>
                            {({ isActive }) => (
                              <motion.div 
                                className={`w-full text-sm text-left px-4 py-2 rounded-lg transition-colors ${
                                  isActive
                                    ? isDarkMode
                                      ? 'bg-lavender-400 text-white'
                                      : 'bg-lavender-100 text-lavender-900'
                                    : isDarkMode 
                                      ? 'text-gray-300 hover:bg-gray-800' 
                                      : 'text-gray-600 hover:bg-lavender-50'
                                }`}
                              >
                                {deep.label}
                              </motion.div>
                            )}
                          </NavLink>
                        ) : (
                          <motion.button 
                            key={deep.id} 
                            onClick={() => {/* handle navigation */}}
                            className={`w-full text-sm text-left px-4 py-2 rounded-lg transition-colors ${
                              isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-lavender-50'
                            }`}
                          >
                            {deep.label}
                          </motion.button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // For sub-items without links (expandable sections)
            return (
              <div key={subItem.id}>
                <motion.button
                  onClick={() => setNestedExpanded(!nestedExpanded)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm ${
                    isDarkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                      : 'text-gray-600 hover:bg-lavender-50 hover:text-gray-700'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span className="font-bold flex-1 text-left">{subItem.label}</span>
                  {hasNested && (
                    <ChevronDown 
                      className={`w-3 h-3 transition-transform ${nestedExpanded ? 'rotate-180' : ''}`} 
                    />
                  )}
                </motion.button>

                {hasNested && nestedExpanded && (
                  <div className="ml-4 mt-1">
                    {subItem.subItems.map((deep) => (
                      deep.link ? (
                        <NavLink key={deep.id} to={deep.link}>
                          {({ isActive }) => (
                            <motion.div 
                              className={`w-full text-sm text-left px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? isDarkMode
                                    ? 'bg-lavender-400 text-white'
                                    : 'bg-lavender-100 text-lavender-900'
                                  : isDarkMode 
                                    ? 'text-gray-300 hover:bg-gray-800' 
                                    : 'text-gray-600 hover:bg-lavender-50'
                              }`}
                            >
                              {deep.label}
                            </motion.div>
                          )}
                        </NavLink>
                      ) : (
                        <motion.button 
                          key={deep.id}
                          className={`w-full text-sm text-left px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-lavender-50'
                          }`}
                        >
                          {deep.label}
                        </motion.button>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}