import { useEffect, useState } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkmodeButton from '../DarkmodeButton';
import { NotificationsPanel } from '../NotificationPanel';
import { ChatPanel } from '../ChatPanel';
import { Button } from '../ui/button';
import eaarthLogo from '@/assets/eaarth.webp';
import NavigationDropdown from './NavigationDropdown';
import DisplayModeTrigger from './DisplayModeTrigger';
import { adminDropdownList } from '../../config/adminDropdownNavList';
import { useProjectMenus } from '../../hooks/useProjectMenuList';
// import { useCrewMenus } from '../../hooks/useCrewMenus';
import { useSelector } from 'react-redux';

export default function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [displayMode, setDisplayMode] = useState('text-icon');
    const [notificationCount] = useState(5);
    const [messageCount] = useState(3);
    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user);
    // const userType = currentUser?.userType ?? "";
    const userType = "crew" //temporary for development

    const STUDIO_PROJECTS = [
        {
            id: 'avatar1',
            name: 'AVATAR 1',
            status: 'active',
            color: 'blue',
            lightColor: 'text-blue-600',
            darkColor: 'text-blue-400',
            bgLight: 'bg-blue-50',
            bgDark: 'bg-blue-950',
        },
        {
            id: 'avatar3',
            name: 'AVATAR 3',
            status: 'active',
            color: 'cyan',
            lightColor: 'text-cyan-600',
            darkColor: 'text-cyan-400',
            bgLight: 'bg-cyan-50',
            bgDark: 'bg-cyan-950',
        },
        {
            id: 'avatar4',
            name: 'AVATAR 4',
            status: 'active',
            color: 'emerald',
            lightColor: 'text-emerald-600',
            darkColor: 'text-emerald-400',
            bgLight: 'bg-emerald-50',
            bgDark: 'bg-emerald-950',
        },
        {
            id: 'scifi-thriller',
            name: 'Untitled Sci-Fi Thriller',
            status: 'active',
            color: 'purple',
            lightColor: 'text-purple-600',
            darkColor: 'text-purple-400',
            bgLight: 'bg-purple-50',
            bgDark: 'bg-purple-950',
        },
    ];

    // Mock crew assigned projects (in production, fetch from backend based on crew member)
    const CREW_ASSIGNED_PROJECTS = [
        {
            id: 'avatar1',
            name: 'AVATAR 1',
            status: 'active',
            color: 'blue',
            lightColor: 'text-blue-600',
            darkColor: 'text-blue-400',
            bgLight: 'bg-blue-50',
            bgDark: 'bg-blue-950',
        },
        {
            id: 'avatar3',
            name: 'AVATAR 3',
            status: 'active',
            color: 'cyan',
            lightColor: 'text-cyan-600',
            darkColor: 'text-cyan-400',
            bgLight: 'bg-cyan-50',
            bgDark: 'bg-cyan-950',
        },
    ];

    const studioAdminprojectDropdownList = useProjectMenus(STUDIO_PROJECTS); // all projects from backend should be passed here
    const CrewprojectDropdownList =  useProjectMenus(CREW_ASSIGNED_PROJECTS); // Get crew-specific menus with assigned projects

    useEffect(() => {
        if (showMessages || showNotifications) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [showMessages, showNotifications]);

    // Build navigation menu based on user role
    const navigationMenuList = userType === 'crew'
        ? [...CrewprojectDropdownList, adminDropdownList(userType)] // Show crew menus + crew dropdown for crew users
        : [...studioAdminprojectDropdownList, adminDropdownList(userType)]; // Show projects + studio admin for studio users

    return (
        <>
            <div className="h-16 border-b backdrop-blur-sm sticky top-0 z-40 bg-background">
                <div className="max-w-full mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={eaarthLogo}
                            alt="EAARTH logo"
                            className="h-10 w-auto cursor-pointer"
                            onClick={() => navigate('home')}
                        />
                        {/* <div className="h-6 w-px bg-border" /> */}
                    </div>

                    <nav className="flex items-center gap-2">
                        {navigationMenuList.map((menu) => (
                            menu && (
                                <NavigationDropdown
                                    key={menu.id}
                                    menu={menu}
                                    displayMode={displayMode}
                                />
                            )
                        ))}
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <Button
                            size="sm"
                            variant={"ghost"}
                            onClick={() => setShowNotifications(true)}
                            className="relative transition-all gap-0"
                        >
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5  bg-[#9333ea] text-white text-xs font-medium rounded-3xl flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </Button>

                        <Button
                            size="sm"
                            variant={"ghost"}
                            onClick={() => setShowMessages(true)}
                            className="relative transition-all gap-0"
                        >
                            <MessageSquare className="w-5 h-5" />
                            {messageCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9333ea] text-white text-xs font-medium rounded-full flex items-center justify-center">
                                    {messageCount}
                                </span>
                            )}
                        </Button>

                        <DarkmodeButton />

                        <DisplayModeTrigger displayMode={displayMode} setDisplayMode={setDisplayMode} />
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