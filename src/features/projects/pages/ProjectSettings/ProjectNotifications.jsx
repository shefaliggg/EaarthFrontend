import { useState } from 'react';
import { Plus, Trash2, Mail, Bell, Users, Settings } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/PageHeader";
import { Badge } from "@/shared/components/ui/badge";
import FilterPillTabs from "@/shared/components/FilterPillTabs";

const Notifications = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [notificationData] = useState([
    {
      category: "OFFERS",
      color: "lavender",
      icon: "FileText",
      items: [
        {
          id: "new-offer",
          title: "New offer sent",
          description: "A new offer is sent via email (inc. revised, replaced)",
          enabled: true,
          recipients: [
            { id: "1", name: "Production base email", isDefault: true }
          ]
        },
        {
          id: "offer-accepted",
          title: "Offer is accepted",
          enabled: true,
          recipients: [
            { id: "2", name: "Production base email", isDefault: true }
          ]
        },
        {
          id: "offer-queries",
          title: "Offer queries",
          enabled: true,
          recipients: [
            { id: "3", name: "Production base email", isDefault: true },
            { id: "4", name: "Stefania Kovanic", email: "stefania.kovanic.assistant@outlook.com" }
          ]
        },
        {
          id: "notice-sent-prod",
          title: "Notice sent (Production copy)",
          description: "A notice is sealed",
          enabled: true,
          recipients: [
            { id: "5", name: "Production base email", isDefault: true },
            { id: "6", name: "Sheerin Khosrowshahi-Miyazaki", email: "sheerin@gmail.com" }
          ]
        },
        {
          id: "notice-sent-acc",
          title: "Notice sent (Accounts copy)",
          description: "A notice is sealed",
          enabled: true,
          recipients: [
            { id: "7", name: "Payroll Team", email: "werwulf.payroll@absolutefilms.com" }
          ]
        },
        {
          id: "notice-queries",
          title: "Notice queries",
          enabled: false,
          recipients: [
            { id: "8", name: "Production base email", isDefault: true },
            { id: "9", name: "Sheerin Khosrowshahi", email: "sheerin.khosrowshahi.assistant@outlook.com" }
          ]
        }
      ]
    },
    {
      category: "TIMECARDS",
      color: "mint",
      icon: "Clock",
      items: [
        {
          id: "timecard-queries",
          title: "Timecard queries",
          enabled: true,
          recipients: [
            { id: "10", name: "Production base email", isDefault: true },
            { id: "11", name: "Sheerin Khosrowshahi", email: "sheerin.khosrowshahi.assistant@outlook.com" },
            { id: "12", name: "Payroll Team", email: "werwulf.payroll@absolutefilms.com" }
          ]
        },
        {
          id: "timecard-approval-queries",
          title: "Timecard approval queries",
          description: "Queries on the approval status of timecards",
          enabled: true,
          recipients: [
            { id: "13", name: "Production base email", isDefault: true },
            { id: "14", name: "Stefania Kovanic", email: "stefania.kovanic.assistant@outlook.com" }
          ]
        },
        {
          id: "timecard-date-requests",
          title: "Timecard date requests",
          description: "Requests for timecard dates earlier than the start date",
          enabled: true,
          recipients: [
            { id: "15", name: "Production base email", isDefault: true },
            { id: "16", name: "Stefania Kovanic", email: "stefania.kovanic.assistant@outlook.com" }
          ]
        }
      ]
    },
    {
      category: "GENERAL",
      color: "sky",
      icon: "Settings",
      items: [
        {
          id: "notification-email-queries",
          title: "Notification email queries",
          description: "Queries about notification emails sent by the system",
          enabled: true,
          recipients: [
            { id: "17", name: "Production base email", isDefault: true }
          ]
        },
        {
          id: "digital-queries",
          title: "Digital queries",
          enabled: true,
          recipients: [
            { id: "18", name: "Payroll Team", email: "werwulf.payroll@absolutefilms.com" }
          ]
        },
        {
          id: "production-queries",
          title: "Production queries",
          enabled: true,
          recipients: [
            { id: "19", name: "Production base email", isDefault: true },
            { id: "20", name: "Stefania Kovanic", email: "stefania.kovanic.assistant@outlook.com" }
          ]
        }
      ]
    }
  ]);

  const tabOptions = [
    { value: "all", label: "All Notifications", icon: "Bell" },
    { value: "offers", label: "Offers", icon: "FileText" },
    { value: "timecards", label: "Timecards", icon: "Clock" },
    { value: "general", label: "General", icon: "Settings" }
  ];

  const getCategoryColor = (color) => {
    const colors = {
      lavender: "bg-lavender-50 text-lavender-700 border-lavender-200 dark:bg-lavender-900/20 dark:text-lavender-300 dark:border-lavender-800",
      mint: "bg-mint-50 text-mint-700 border-mint-200 dark:bg-mint-900/20 dark:text-mint-300 dark:border-mint-800",
      sky: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800",
      peach: "bg-peach-50 text-peach-700 border-peach-200 dark:bg-peach-900/20 dark:text-peach-300 dark:border-peach-800"
    };
    return colors[color] || colors.lavender;
  };

  const renderNotificationCard = (item, categoryColor) => {
    return (
      <div 
        key={item.id} 
        className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-card-foreground">
                {item.title}
              </h4>
              <Badge 
                variant={item.enabled ? "default" : "secondary"}
                className={`text-xs ${item.enabled ? 'bg-mint-100 text-mint-700 hover:bg-mint-100 dark:bg-mint-900/30 dark:text-mint-300' : 'bg-muted text-muted-foreground'}`}
              >
                {item.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Recipients */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium">Recipients ({item.recipients.length})</span>
          </div>
          
          <div className="space-y-1">
            {item.recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 group/recipient transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lavender-400 to-pastel-pink-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {recipient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-card-foreground truncate">
                        {recipient.name}
                      </span>
                      {recipient.isDefault && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-lavender-200 text-lavender-600 dark:border-lavender-700 dark:text-lavender-300">
                          Default
                        </Badge>
                      )}
                    </div>
                    {recipient.email && (
                      <div className="text-[11px] text-muted-foreground truncate">
                        {recipient.email}
                      </div>
                    )}
                  </div>
                </div>
                {!recipient.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive/60 opacity-0 group-hover/recipient:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-opacity flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add Recipient Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-xs border-dashed hover:bg-muted/50"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            Add recipient
          </Button>
        </div>
      </div>
    );
  };

  const filteredData = notificationData
    .filter(section => 
      selectedCategory === "all" || section.category.toLowerCase() === selectedCategory
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Heading with Filter */}
        <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold">Notifications</h2>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: '90%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-600">90%</span>
            </div>
          </div>
          <div className="flex gap-2">
            {tabOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedCategory(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === option.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-purple-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Cards Grid */}
        {filteredData.map((section) => (
          <div key={section.category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-md border ${getCategoryColor(section.color)}`}>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {section.category}
                </span>
              </div>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">
                {section.items.length} notification{section.items.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => renderNotificationCard(item, section.color))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No notifications found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filter selection
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-4 flex items-start gap-3 dark:bg-lavender-900/20 dark:border-lavender-800">
          <Mail className="w-5 h-5 text-lavender-600 dark:text-lavender-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-lavender-900 dark:text-lavender-300 mb-1">Email Delivery</h3>
            <p className="text-xs text-lavender-700 dark:text-lavender-400 leading-relaxed">
              All notifications are sent immediately when events occur. Recipients can manage their notification preferences in their account settings. The production base email serves as a fallback when no specific recipients are configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;