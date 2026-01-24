import React from 'react';
import { Calendar, FileText, Clock, Users, Check, MessageSquare, Crown, Sparkles } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ApplicationCard = ({ icon: Icon, title, description, isSelected, onClick, isFree, isPremium }) => (
  <button
    onClick={onClick}
    disabled={isFree}
    className={cn(
      "relative p-6 rounded-xl border-2 transition-all duration-200 text-left w-full group",
      !isFree && "hover:shadow-lg active:scale-[0.98]",
      isFree && "cursor-default",
      isSelected
        ? "border-purple-600 bg-gradient-to-br from-purple-50 to-white shadow-lg shadow-purple-100"
        : "border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/50"
    )}
  >
    {/* Free Badge */}
    {isFree && (
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
        <Check className="w-3 h-3" />
        FREE
      </div>
    )}

    {/* Premium Badge */}
    {isPremium && !isFree && (
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
        <Crown className="w-3 h-3" />
        PREMIUM
      </div>
    )}

    {/* Selection Indicator - Only for non-free items */}
    {!isFree && (
      <div
        className={cn(
          "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          isSelected
            ? "border-purple-600 bg-purple-600 scale-100"
            : "border-gray-300 bg-white group-hover:border-purple-400 scale-90"
        )}
      >
        {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    )}

    <div className="flex items-start gap-4 pr-12">
      {/* Icon */}
      <div
        className={cn(
          "p-3.5 rounded-lg transition-all duration-200",
          isSelected || isFree
            ? "bg-purple-600 text-white shadow-md shadow-purple-200"
            : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
        )}
      >
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3
          className={cn(
            "font-semibold mb-1.5 transition-colors duration-200",
            isSelected || isFree ? "text-purple-900" : "text-gray-900 group-hover:text-purple-700"
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>

    {/* Hover Effect - Only for non-free items */}
    {!isFree && (
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 pointer-events-none",
          "bg-gradient-to-br from-purple-100/20 to-transparent",
          !isSelected && "group-hover:opacity-100"
        )}
      />
    )}
  </button>
);

export const ProjectApplications = ({ selectedApps = [], onChange }) => {
  const applications = [
    {
      id: 'callsheet',
      icon: FileText,
      title: 'Call Sheet',
      description: 'Create and distribute daily call sheets with real-time updates',
      isFree: true,
      isPremium: false
    },
    {
      id: 'chat',
      icon: MessageSquare,
      title: 'Team Chat & Collaboration',
      description: 'Real-time messaging, file sharing, and team communication hub',
      isFree: true,
      isPremium: false
    },
    {
      id: 'onboarding',
      icon: Users,
      title: 'Crew Onboarding',
      description: 'Streamline crew registration, documentation, and compliance management',
      isFree: false,
      isPremium: true
    },
    {
      id: 'timesheet',
      icon: Clock,
      title: 'Timesheet Management',
      description: 'Track crew hours, overtime, and working time records with automated calculations',
      isFree: false,
      isPremium: true
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Production Calendar',
      description: 'Schedule shoots, meetings, and key milestones across the production timeline',
      isFree: false,
      isPremium: true
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Project Applications
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Choose which tools you want to enable for this project. Free applications are included by default.
        </p>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Free tier includes {freeApps.length} essential applications
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Premium applications can be added to unlock advanced features and capabilities
            </p>
          </div>
        </div>
      </div>

      {/* Application Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            icon={app.icon}
            title={app.title}
            description={app.description}
            isSelected={allSelectedApps.includes(app.id)}
            onClick={() => toggleApp(app.id)}
            isFree={app.isFree}
            isPremium={app.isPremium}
          />
        ))}
      </div>

      {/* Selection Summary */}
      <div className="space-y-3">
        {/* Free Apps Summary */}
        <div className="p-4 rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-green-600 text-white shadow-md shadow-green-200">
                {freeApps.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Free Applications Included
                </p>
                <p className="text-xs text-gray-600">
                  Call Sheet & Team Chat available at no cost
                </p>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>
        </div>

        {/* Premium Apps Summary */}
        <div
          className={cn(
            "p-4 rounded-lg border-2 transition-all duration-300",
            selectedPremiumCount > 0
              ? "bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200"
              : "bg-gray-50 border-gray-200"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                  selectedPremiumCount > 0
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-200"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {selectedPremiumCount}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedPremiumCount === 0 && "No premium applications selected"}
                  {selectedPremiumCount === 1 && "1 premium application selected"}
                  {selectedPremiumCount > 1 && `${selectedPremiumCount} premium applications selected`}
                </p>
                <p className="text-xs text-gray-600">
                  {selectedPremiumCount === 0
                    ? `${premiumApps.length} premium tools available to enhance your project`
                    : "Premium features will be available immediately after project creation"}
                </p>
              </div>
            </div>

            {selectedPremiumCount > 0 && (
              <button
                onClick={() => onChange([])}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                Clear premium
              </button>
            )}
          </div>
        </div>

        {/* Total Summary */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-bold">
                  {allSelectedApps.length}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Total Applications: {allSelectedApps.length} of {applications.length}
                  </p>
                  <p className="text-xs text-gray-600">
                    {freeApps.length} free + {selectedPremiumCount} premium
                  </p>
                </div>
              </div>
            </div>

            {selectedPremiumCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-xs font-semibold text-amber-900">
                  Premium Tier
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};