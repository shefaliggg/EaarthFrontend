import React from 'react';
import { Calendar, FileText, Clock, Users, MessageSquare, Bell, FileStack, DollarSign, ShoppingCart, Truck, Play, Clipboard, Box, Dog, Car, MapPin, Cloud, Clock2, Star, Users2 } from 'lucide-react';
import { Switch } from '../../../shared/components/ui/switch';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ApplicationCard = ({ icon: Icon, title, description, price, isSelected, onClick, isFree, isPremium }) => (
  <button
    onClick={onClick}
    disabled={isFree}
    className={cn(
      "relative p-4 rounded-lg border transition-all duration-200 text-left w-full group flex items-center gap-3 h-20",
      !isFree && "hover:shadow-md active:scale-[0.98] cursor-pointer",
      isFree && "cursor-default",
      isSelected
        ? "border-purple-600 bg-purple-50 shadow-md"
        : "border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/30"
    )}
  >
    {/* Icon */}
    <div
      className={cn(
        "p-2 rounded-md transition-all duration-200 flex-shrink-0",
        isSelected || isFree
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
      )}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3
          className={cn(
            "font-medium text-sm transition-colors duration-200 truncate",
            isSelected || isFree ? "text-gray-900" : "text-gray-900 group-hover:text-purple-700"
          )}
        >
          {title}
        </h3>
        {isFree ? (
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">FREE</span>
        ) : (
          <span className="text-xs font-semibold text-purple-600 whitespace-nowrap">{price}</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
    </div>

    {/* Toggle Button */}
    <Switch
      checked={isSelected}
      onCheckedChange={() => onClick()}
      disabled={isFree}
      className={cn(
        isFree && "opacity-100 cursor-default",
        isFree ? "data-[state=checked]:bg-green-600" : "data-[state=checked]:bg-purple-600"
      )}
    />
  </button>
);

export const ProjectApplications = ({ selectedApps = [], onChange }) => {
  const applications = [
    // Free Apps
    { id: 'chat', icon: MessageSquare, title: 'Project Chat', description: 'Real-time messaging and collaboration', price: 'FREE', isFree: true, isPremium: false },
    { id: 'crew', icon: Users, title: 'Crew', description: 'Crew management system', price: 'FREE', isFree: true, isPremium: false },
    { id: 'cast', icon: Users2, title: 'Cast', description: 'Cast management system', price: 'FREE', isFree: true, isPremium: false },
    { id: 'documents', icon: FileText, title: 'Documents', description: 'Document storage and sharing', price: 'FREE', isFree: true, isPremium: false },
    
    // Premium Applications
    { id: 'calendar', icon: Calendar, title: 'Project Calendar', description: 'Schedule shoots and milestones', price: '$10/mo', isFree: false, isPremium: true },
    { id: 'callsheets', icon: FileText, title: 'Call Sheets', description: 'Detailed daily call sheets', price: '$5/mo', isFree: false, isPremium: true },
    { id: 'schedule', icon: Clock2, title: 'Shooting Schedule', description: 'Production scheduling', price: '$8/mo', isFree: false, isPremium: true },
    { id: 'asset', icon: Box, title: 'Asset', description: 'Asset management', price: '$12/mo', isFree: false, isPremium: true },
    { id: 'costume', icon: Users2, title: 'Costume', description: 'Costume tracking', price: '$15/mo', isFree: false, isPremium: true },
    { id: 'catering', icon: Truck, title: 'Catering', description: 'Catering management', price: '$20/mo', isFree: false, isPremium: true },
    { id: 'accounts', icon: DollarSign, title: 'Accounts', description: 'Financial management', price: '$25/mo', isFree: false, isPremium: true },
    { id: 'script', icon: FileStack, title: 'Script', description: 'Script management', price: '$8/mo', isFree: false, isPremium: true },
    { id: 'market', icon: ShoppingCart, title: 'Market', description: 'Marketplace integration', price: '$10/mo', isFree: false, isPremium: true },
    { id: 'transport', icon: Truck, title: 'Transport', description: 'Transport management', price: '$12/mo', isFree: false, isPremium: true },
    { id: 'eplayer', icon: Play, title: 'E Player', description: 'Video player', price: '$15/mo', isFree: false, isPremium: true },
    { id: 'forms', icon: Clipboard, title: 'Forms', description: 'Form builder', price: '$5/mo', isFree: false, isPremium: true },
    { id: 'props', icon: Box, title: 'Props & Assets', description: 'Props management', price: '$18/mo', isFree: false, isPremium: true },
    { id: 'animals', icon: Dog, title: 'Animals', description: 'Animal coordination', price: '$22/mo', isFree: false, isPremium: true },
    { id: 'vehicles', icon: Car, title: 'Vehicles', description: 'Vehicle management', price: '$15/mo', isFree: false, isPremium: true },
    { id: 'locations', icon: MapPin, title: 'Locations', description: 'Location scouting', price: '$12/mo', isFree: false, isPremium: true },
    { id: 'cloud', icon: Cloud, title: 'Cloud', description: 'Cloud storage', price: '$30/mo', isFree: false, isPremium: true },
    { id: 'timesheets', icon: Clock, title: 'Timesheets', description: 'Track crew hours', price: '$10/mo', isFree: false, isPremium: true },
    { id: 'noticeboard', icon: Bell, title: 'Notice Board', description: 'Announcement board', price: '$5/mo', isFree: false, isPremium: true },
    { id: 'breakdown', icon: FileStack, title: 'Script Breakdown', description: 'Script analysis', price: '$8/mo', isFree: false, isPremium: true },
    { id: 'reports', icon: FileText, title: 'Production Reports', description: 'Daily reports', price: '$12/mo', isFree: false, isPremium: true },
    { id: 'casting', icon: Star, title: 'Casting Calls', description: 'Casting management', price: '$20/mo', isFree: false, isPremium: true },
    { id: 'budget', icon: DollarSign, title: 'Budget', description: 'Budget tracking', price: '$15/mo', isFree: false, isPremium: true },
    { id: 'eearth_sign', icon: Clipboard, title: 'EAARTH Sign', description: 'Digital signing', price: '$18/mo', isFree: false, isPremium: true }
  ];

  // Free apps are always included
  const freeApps = applications.filter(app => app.isFree).map(app => app.id);
  const allSelectedApps = [...new Set([...freeApps, ...selectedApps])];

  const toggleApp = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (app?.isFree) return; // Can't toggle free apps

    const newSelection = selectedApps.includes(appId)
      ? selectedApps.filter(id => id !== appId)
      : [...selectedApps, appId];
    onChange(newSelection);
  };

  const premiumApps = applications.filter(app => !app.isFree);
  const selectedPremiumCount = selectedApps.length;
  const totalPrice = selectedApps.reduce((sum, appId) => {
    const app = applications.find(a => a.id === appId);
    const price = app?.price?.replace(/[^\d]/g, '') || 0;
    return sum + parseInt(price);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Available Applications</h3>
          <p className="text-xs text-gray-600">Select the applications you want to enable for this project</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Selected Total</p>
          <p className="text-sm font-semibold text-purple-600">${totalPrice}/mo</p>
        </div>
      </div>

      {/* Application Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            icon={app.icon}
            title={app.title}
            description={app.description}
            price={app.price}
            isSelected={allSelectedApps.includes(app.id)}
            onClick={() => toggleApp(app.id)}
            isFree={app.isFree}
            isPremium={app.isPremium}
          />
        ))}
      </div>
    </div>
  );
};