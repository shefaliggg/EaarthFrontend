import { Fragment, useEffect, useState } from 'react';
import {
  Bell,
  MessageSquare,
  User,
  FileText,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  LayoutPanelLeft,
  Columns,
  Grid,
  Type,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { NotificationsPanel } from '../NotificationPanel';
import { ChatPanel } from '../ChatPanel';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import eaarthLogo from '@/assets/eaarth.webp';
import NavigationDropdown from './NavigationDropdown';
import { useProjectMenus } from '../../hooks/useProjectMenuList';
import { cn, getFullName } from '../../config/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { triggerGlobalLogout } from '../../../features/auth/config/globalLogoutConfig';
import { SmartIcon } from '../SmartIcon';
import { adminDropdownConfig } from '../../config/adminDropdownNavList';
import { useScrollHeaderTracker } from '../../hooks/useScrollHeaderTracker';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [displayMode, setDisplayMode] = useState('text-icon');
  const [currentTheme, setCurrentTheme] = useState('');
  const showHeader = useScrollHeaderTracker()

  const [notificationCount] = useState(5);
  const [messageCount] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);

  const fullName = getFullName(currentUser) || 'Not Available';
  const role = currentUser?.userType || 'Not Available';

  const nameParts = fullName.split(' ').filter(Boolean);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  // Display: Last, First
  const displayName =
    lastName && firstName ? `${lastName}, ${firstName}` : fullName;

  // Initials: Last letter + First letter
  const initials = `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();

  const avatar = currentUser?.avatar;

  /* ---------- PROJECT MENUS ---------- */
  const PROJECTS = [
    { id: 'avatar1', name: 'AVATAR 1' },
    { id: 'avatar3', name: 'AVATAR 3' },
  ];

  const projectMenus = useProjectMenus(PROJECTS);
  console.log("role", role, "currentUser", currentUser);

  const navigationMenuList = [...projectMenus]

  const adminMenuItems = adminDropdownConfig(role);

  const handleThemeChange = (value) => {
    setCurrentTheme(value);
    localStorage.setItem("theme", value);

    if (value === "dark") {
      document.body.classList.add("dark");
    } else if (value === "light") {
      document.body.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }

    setTimeout(() => {
      window.dispatchEvent(new Event("theme-change"));
    }, 0);
  };

  const actionHandlers = {
    logout: () => triggerGlobalLogout(),
    messages: () => setShowMessages(true),
    "display-mode": (value) => setDisplayMode(value),
    "theme": (value) => handleThemeChange(value),
  };

  useEffect(() => {
    if (localStorage.getItem('theme') === "dark") {
      document.body.classList.add("dark");
      setCurrentTheme('dark');
    } else if (localStorage.getItem('theme') === "light") {
      document.body.classList.remove("dark");
      setCurrentTheme('light');
    } else {
      setCurrentTheme('system');
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle(
      'overflow-hidden',
      showMessages || showNotifications
    );
  }, [showMessages, showNotifications]);

  return (
    <>
      <div className={`h-16 border-b sticky top-0 z-40 bg-background transition-transform duration-300  ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="px-6 h-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">

          {/* LEFT */}
          <img
            src={eaarthLogo}
            alt="EAARTH"
            className="h-10 cursor-pointer"
            onClick={() => navigate('/home')}
          />

          {/* CENTER NAV */}
          <nav className="flex items-center justify-center gap-2">
            {role !== "none" &&
              navigationMenuList.map(
                (menu) =>
                  menu && (
                    <NavigationDropdown
                      key={menu.id}
                      menu={menu}
                      displayMode={displayMode}
                    />
                  )
              )
            }
          </nav>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2">

            {/* NOTIFICATIONS */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-background text-xs rounded-full px-1.5">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* PROFILE (LAST) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex pl-1.5 h-11 group"
                >
                  {/* Avatar / Initials */}
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={avatar}
                      alt={displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <AvatarFallback className={"group-hover:bg-muted"}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* NAME + ROLE */}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-semibold truncate max-w-[110px]">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">
                      {role}
                    </span>
                  </div>

                  {/* <ChevronDown className="text-muted-foreground" /> */}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {adminMenuItems.map((item) => {

                  if (item.type === "submenu") {
                    return (
                      <Fragment>
                        {item.separatorBefore && <DropdownMenuSeparator key={item.id} />}

                        <DropdownMenuSub key={item.id}>
                          <DropdownMenuSubTrigger className="gap-2">
                            <SmartIcon icon={item.icon} className="mr-2" />
                            {item.label}
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent className="w-44">
                            {item.children.map((child) => {
                              const isActive = item.id === "display-mode" 
                                ? displayMode === child.id 
                                : currentTheme === child.id;
                              
                              return (
                                <DropdownMenuItem
                                  key={child.id}
                                  onClick={() =>
                                    actionHandlers[child.action](child.id)
                                  }
                                  className={cn(
                                    isActive && "bg-accent text-background"
                                  )}
                                >
                                  <SmartIcon
                                    icon={child.icon}
                                    className={cn(
                                      "mr-2",
                                      isActive && "text-background"
                                    )}
                                  />
                                  {child.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </Fragment>
                    );
                  }

                  return (
                    <Fragment>
                      {item.separatorBefore && <DropdownMenuSeparator key={item.id} />}

                      <DropdownMenuItem
                        key={item.id}
                        className={cn(item.danger && "text-red-600")}
                        onClick={() => {
                          if (item.route) navigate(item.route);
                          if (item.action) actionHandlers[item.action]?.();
                        }}
                      >
                        <SmartIcon icon={item.icon} className="w-4 h-4 mr-2" />
                        {item.label}

                        {item.badge && messageCount > 0 && (
                          <span className="bg-purple-600 text-background text-xs rounded-full px-1.5 ml-auto">
                            {messageCount}
                          </span>
                        )}
                      </DropdownMenuItem>
                    </Fragment>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
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
