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
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import eaarthLogo from '@/assets/eaarth.webp';
import NavigationDropdown from './NavigationDropdown';
import { adminDropdownList } from '../../config/adminDropdownNavList';
import { useProjectMenus } from '../../hooks/useProjectMenuList';

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
  const fullName = currentUser?.name?.trim() || 'Mohad Shanid';
  const role = currentUser?.role || 'Camera Operator';

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
        <div className="px-6 h-full flex items-center justify-between">

          {/* LEFT */}
          <img
            src={eaarthLogo}
            alt="EAARTH"
            className="h-10 cursor-pointer"
            onClick={() => navigate('/home')}
          />

          {/* CENTER NAV */}
          <nav className="flex items-center gap-2">
            {navigationMenuList.map(
              (menu) =>
                menu && (
                  <NavigationDropdown
                    key={menu.id}
                    menu={menu}
                    displayMode={displayMode}
                  />
                )
            )}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

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
            <DisplayModeTrigger
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />

            {/* PROFILE (LAST) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 py-1.5"
                >
                  {/* Avatar / Initials */}
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
                  )}

                  {/* NAME + ROLE */}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-semibold truncate max-w-[110px]">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">
                      {role}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">

                <DropdownMenuItem onClick={() => setShowMessages(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                  {messageCount > 0 && (
                    <span className="ml-auto text-xs bg-purple-600 text-white rounded-full px-2">
                      {messageCount}
                    </span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/projects/Myoffers')}>
                  <FileText className="w-4 h-4 mr-2" />
                  My Offers
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

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => navigate('/login')}
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
