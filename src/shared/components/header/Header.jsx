import { useEffect, useState } from 'react';
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

import DarkmodeButton from '../DarkmodeButton';
import DisplayModeTrigger from './DisplayModeTrigger';
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
import { adminDropdownList } from '../../config/adminDropdownNavList';
import { useProjectMenus } from '../../hooks/useProjectMenuList';
import { cn, getFullName } from '../../config/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { triggerGlobalLogout } from '../../../features/auth/config/globalLogoutConfig';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [displayMode, setDisplayMode] = useState('text-icon');

  const [notificationCount] = useState(5);
  const [messageCount] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const userType = 'crew';

  /* ---------- NAME, ROLE & INITIALS ---------- */
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

  const navigationMenuList =
    userType === 'crew'
      ? [...projectMenus, adminDropdownList(userType)]
      : projectMenus;

  useEffect(() => {
    document.body.classList.toggle(
      'overflow-hidden',
      showMessages || showNotifications
    );
  }, [showMessages, showNotifications]);

  return (
    <>
      <div className="h-16 border-b sticky top-0 z-40 bg-background">
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
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-1.5">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* TOGGLES */}
            <DarkmodeButton />

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

                <DropdownMenuItem onClick={() => navigate('/projects/Myoffers')}>
                  <FileText className="w-4 h-4 mr-2" />
                  My Offers
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShowMessages(true)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  My Messages
                  {messageCount > 0 && (
                    <span className="bg-purple-600 text-white text-xs rounded-full px-1.5 mt-1 ml-auto">
                      {messageCount}
                    </span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/support')}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>

                {/* <DropdownMenuSeparator /> */}

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <LayoutPanelLeft className="w-4 h-4 mr-2" />
                    Display Mode
                  </DropdownMenuSubTrigger>

                  <DropdownMenuSubContent className="w-44">
                    <DropdownMenuItem
                      onClick={() => setDisplayMode("text-icon")}
                      className={cn(displayMode === "text-icon" && "bg-accent text-white")}
                    >
                      <Columns className={cn(
                        "w-4 h-4 mr-2",
                        displayMode === "text-icon" && "text-white"
                      )} />
                      Text + Icon
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setDisplayMode("icon-only")}
                      className={cn(displayMode === "icon-only" && "bg-accent text-white")}
                    >
                      <Grid className={cn(
                        "w-4 h-4 mr-2",
                        displayMode === "icon-only" && "text-white"
                      )} />
                      Icon Only
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setDisplayMode("text-only")}
                      className={cn(displayMode === "text-only" && "bg-accent text-white")}
                    >
                      <Type className={cn(
                        "w-4 h-4 mr-2",
                        displayMode === "text-only" && "text-white"
                      )} />
                      Text Only
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => triggerGlobalLogout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
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
