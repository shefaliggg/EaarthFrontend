import * as Icon from "lucide-react";
import React from "react";

function sidebarMenuList(sidebarType) {
  let roleBasedItems = [];
  let commonItems = [
    {
      id: "home",
      label: "HOME",
      page: "/studio/dashboard",
      icon: Icon.Home,
      gradient: "from-lavender-400/20 to-lavender-500/20",
      color: "text-lavender-600",
      hoverBg: "hover:bg-lavender-50",
      darkHoverBg: "dark:hover:bg-lavender-900/20",
    },
    {
      id: "settings",
      label: "SETTINGS",
      page: "/studio/settings",
      icon: Icon.Settings,
      gradient: "from-peach-400/20 to-peach-500/20",
      color: "text-peach-600",
      hoverBg: "hover:bg-peach-50",
      darkHoverBg: "dark:hover:bg-peach-900/20",
      subItems: [
        { id: "settings-account", label: "ACCOUNT", page: "account-settings" },
        { id: "settings-password", label: "PASSWORD", page: "reset-password" },
        { id: "settings-preferences", label: "PREFERENCES", page: "settings" },
      ],
    },
  ];

  let projectsMenuItems = [
    {
      id: "projects",
      label: "PROJECTS",
      page: "/studio/projects",
      icon: Icon.FolderOpen,
      gradient: "from-pastel-pink-400/20 to-pastel-pink-500/20",
      color: "text-pastel-pink-600",
      hoverBg: "hover:bg-pastel-pink-50",
      darkHoverBg: "dark:hover:bg-pastel-pink-900/20",
      subItems: [
        { id: "projects-all", label: "ALL PROJECTS", page: "projects" },
        {
          id: "projects-avatar1",
          label: "AVATAR 1",
          page: "project-avatar1",
          subItems: [
            {
              id: "avatar1-activities",
              label: "ACTIVITIES",
              page: "project-avatar1-activities",
            },
            {
              id: "avatar1-apps",
              label: "APPS",
              page: "project-avatar1-apps",
              subItems: [
                {
                  id: "avatar1-apps-props",
                  label: "PROPS",
                  page: "project-avatar1-apps-props",
                },
                {
                  id: "avatar1-apps-costume",
                  label: "COSTUME",
                  page: "project-avatar1-apps-costume",
                },
                {
                  id: "avatar1-apps-catering",
                  label: "CATERING",
                  page: "project-avatar1-apps-catering",
                },
                {
                  id: "avatar1-apps-accounts",
                  label: "ACCOUNTS",
                  page: "project-avatar1-apps-accounts",
                  subItems: [
                    {
                      id: "avatar1-accounts-payable",
                      label: "ACCOUNTS PAYABLE",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-purchase-order",
                      label: "PURCHASE ORDER",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-p-card",
                      label: "P-CARD",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-petty-cash",
                      label: "PETTY CASH",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-vat-gst",
                      label: "VAT/GST",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-bank-reconciliation",
                      label: "BANK RECONCILIATION",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-payroll",
                      label: "PAYROLL",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-budget",
                      label: "BUDGET",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-cashflow",
                      label: "CASHFLOW",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-reports",
                      label: "REPORTS",
                      page: "project-avatar1-apps-accounts",
                    },
                    {
                      id: "avatar1-settings",
                      label: "SETTINGS",
                      page: "project-avatar1-apps-accounts",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-script",
                  label: "SCRIPT",
                  page: "project-avatar1-apps-script",
                },
                {
                  id: "avatar1-apps-purchase-orders",
                  label: "PURCHASE ORDERS",
                  page: "project-avatar1-apps-purchase-orders",
                  subItems: [
                    {
                      id: "avatar1-po-all",
                      label: "ALL PURCHASE ORDERS",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                    {
                      id: "avatar1-po-create",
                      label: "CREATE NEW PO",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                    {
                      id: "avatar1-po-pending",
                      label: "PENDING APPROVAL",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                    {
                      id: "avatar1-po-approved",
                      label: "APPROVED POS",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                    {
                      id: "avatar1-po-vendors",
                      label: "VENDOR MANAGEMENT",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                    {
                      id: "avatar1-po-reports",
                      label: "REPORTS & ANALYTICS",
                      page: "project-avatar1-apps-purchase-orders",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-market",
                  label: "MARKET",
                  page: "project-avatar1-apps-market",
                },
                {
                  id: "avatar1-apps-stocks",
                  label: "STOCKS",
                  page: "project-avatar1-apps-stocks",
                },
                {
                  id: "avatar1-apps-transport",
                  label: "TRANSPORT",
                  page: "project-avatar1-apps-transport",
                },
                {
                  id: "avatar1-apps-eplayer",
                  label: "E PLAYER",
                  page: "project-avatar1-apps-eplayer",
                },
                {
                  id: "avatar1-apps-forms",
                  label: "FORMS",
                  page: "project-avatar1-apps-forms",
                  subItems: [
                    {
                      id: "avatar1-mileage-form",
                      label: "MILEAGE FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-fuel-form",
                      label: "FUEL FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-wire-transfer",
                      label: "WIRE TRANSFER",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-petty-cash-advance",
                      label: "PETTY CASH ADVANCE FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-missing-receipts",
                      label: "MISSING RECEIPTS FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-payment-request",
                      label: "PAYMENT REQUEST FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-p-card-application",
                      label: "P CARD APPLICATION FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-p-card-form",
                      label: "P-CARD FORM",
                      page: "project-avatar1-apps-forms",
                    },
                    {
                      id: "avatar1-petty-cash-form",
                      label: "PETTY CASH FORM",
                      page: "project-avatar1-apps-forms",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-cast-crew",
                  label: "CAST & CREW",
                  page: "project-avatar1-apps-cast-crew",
                },
                {
                  id: "avatar1-apps-animals",
                  label: "ANIMALS",
                  page: "project-avatar1-apps-animals",
                },
                {
                  id: "avatar1-apps-vehicles",
                  label: "VEHICLES",
                  page: "project-avatar1-apps-vehicles",
                },
                {
                  id: "avatar1-apps-locations",
                  label: "LOCATIONS",
                  page: "project-avatar1-apps-locations",
                  subItems: [
                    {
                      id: "avatar1-locations-schedule",
                      label: "SCHEDULE",
                      page: "project-avatar1-apps-locations",
                    },
                    {
                      id: "avatar1-locations-settings",
                      label: "SETTINGS",
                      page: "project-avatar1-apps-locations",
                    },
                    {
                      id: "avatar1-locations-script",
                      label: "SCRIPT",
                      page: "project-avatar1-apps-locations",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-cloud",
                  label: "CLOUD",
                  page: "project-avatar1-apps-cloud",
                  subItems: [
                    {
                      id: "avatar1-cloud-departments",
                      label: "DEPARTMENTS",
                      page: "project-avatar1-apps-cloud",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-timesheets",
                  label: "TIMESHEETS",
                  page: "project-avatar1-apps-timesheets",
                },
                {
                  id: "avatar1-apps-approval",
                  label: "APPROVAL",
                  page: "project-avatar1-apps-approval",
                },
              ],
            },
            {
              id: "avatar1-calendar",
              label: "CALENDAR",
              page: "project-avatar1-calendar",
            },
            {
              id: "avatar1-call-sheets",
              label: "CALL SHEETS",
              page: "project-avatar1-call-sheets",
            },
            {
              id: "avatar1-cast-crew",
              label: "CAST & CREW",
              page: "project-avatar1-cast-crew",
            },
            {
              id: "avatar1-cloud-storage",
              label: "CLOUD STORAGE",
              page: "project-avatar1-cloud-storage",
            },
            {
              id: "avatar1-departments",
              label: "DEPARTMENTS",
              page: "project-avatar1-departments",
            },
            {
              id: "avatar1-notice-board",
              label: "NOTICE BOARD",
              page: "project-avatar1-notice-board",
            },
            {
              id: "avatar1-on-boarding",
              label: "ON-BOARDING",
              page: "project-avatar1-on-boarding",
            },
            {
              id: "avatar1-project-chat",
              label: "PROJECT CHAT",
              page: "project-avatar1-project-chat",
            },
            {
              id: "avatar1-script",
              label: "SCRIPT",
              page: "project-avatar1-script",
            },
            {
              id: "avatar1-shooting-schedule",
              label: "SHOOTING SCHEDULE",
              page: "project-avatar1-shooting-schedule",
            },
            {
              id: "avatar1-tasks",
              label: "TASKS",
              page: "project-avatar1-tasks",
            },
            {
              id: "avatar1-timeline",
              label: "TIMELINE",
              page: "project-avatar1-timeline",
            },
            {
              id: "avatar1-settings",
              label: "SETTINGS",
              page: "project-avatar1-settings",
            },
          ],
        },
        {
          id: "projects-avatar2",
          label: "AVATAR 2",
          page: "project-avatar2",
          subItems: [
            {
              id: "avatar2-activities",
              label: "ACTIVITIES",
              page: "project-avatar2-activities",
            },
            {
              id: "avatar2-apps",
              label: "APPS",
              page: "project-avatar2-apps",
              subItems: [
                {
                  id: "avatar2-apps-props",
                  label: "PROPS",
                  page: "project-avatar2-apps-props",
                },
                {
                  id: "avatar2-apps-costume",
                  label: "COSTUME",
                  page: "project-avatar2-apps-costume",
                },
                {
                  id: "avatar2-apps-catering",
                  label: "CATERING",
                  page: "project-avatar2-apps-catering",
                },
                {
                  id: "avatar2-apps-accounts",
                  label: "ACCOUNTS",
                  page: "project-avatar2-apps-accounts",
                },
                {
                  id: "avatar2-apps-script",
                  label: "SCRIPT",
                  page: "project-avatar2-apps-script",
                },
                {
                  id: "avatar2-apps-purchase-orders",
                  label: "PURCHASE ORDERS",
                  page: "project-avatar2-apps-purchase-orders",
                  subItems: [
                    {
                      id: "avatar2-po-all",
                      label: "ALL PURCHASE ORDERS",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                    {
                      id: "avatar2-po-create",
                      label: "CREATE NEW PO",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                    {
                      id: "avatar2-po-pending",
                      label: "PENDING APPROVAL",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                    {
                      id: "avatar2-po-approved",
                      label: "APPROVED POS",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                    {
                      id: "avatar2-po-vendors",
                      label: "VENDOR MANAGEMENT",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                    {
                      id: "avatar2-po-reports",
                      label: "REPORTS & ANALYTICS",
                      page: "project-avatar2-apps-purchase-orders",
                    },
                  ],
                },
                {
                  id: "avatar2-apps-market",
                  label: "MARKET",
                  page: "project-avatar2-apps-market",
                },
                {
                  id: "avatar2-apps-stocks",
                  label: "STOCKS",
                  page: "project-avatar2-apps-stocks",
                },
                {
                  id: "avatar2-apps-transport",
                  label: "TRANSPORT",
                  page: "project-avatar2-apps-transport",
                },
                {
                  id: "avatar2-apps-eplayer",
                  label: "E PLAYER",
                  page: "project-avatar2-apps-eplayer",
                },
                {
                  id: "avatar2-apps-forms",
                  label: "FORMS",
                  page: "project-avatar2-apps-forms",
                },
                {
                  id: "avatar2-apps-cast-crew",
                  label: "CAST & CREW",
                  page: "project-avatar2-apps-cast-crew",
                },
                {
                  id: "avatar2-apps-animals",
                  label: "ANIMALS",
                  page: "project-avatar2-apps-animals",
                },
                {
                  id: "avatar2-apps-vehicles",
                  label: "VEHICLES",
                  page: "project-avatar2-apps-vehicles",
                },
                {
                  id: "avatar2-apps-locations",
                  label: "LOCATIONS",
                  page: "project-avatar2-apps-locations",
                },
                {
                  id: "avatar2-apps-cloud",
                  label: "CLOUD",
                  page: "project-avatar2-apps-cloud",
                },
                {
                  id: "avatar2-apps-timesheets",
                  label: "TIMESHEETS",
                  page: "project-avatar2-apps-timesheets",
                },
                {
                  id: "avatar2-apps-approval",
                  label: "APPROVAL",
                  page: "project-avatar2-apps-approval",
                },
              ],
            },
            {
              id: "avatar2-calendar",
              label: "CALENDAR",
              page: "project-avatar2-calendar",
            },
            {
              id: "avatar2-call-sheets",
              label: "CALL SHEETS",
              page: "project-avatar2-call-sheets",
            },
            {
              id: "avatar2-cast-crew",
              label: "CAST & CREW",
              page: "project-avatar2-cast-crew",
            },
            {
              id: "avatar2-cloud-storage",
              label: "CLOUD STORAGE",
              page: "project-avatar2-cloud-storage",
            },
            {
              id: "avatar2-departments",
              label: "DEPARTMENTS",
              page: "project-avatar2-departments",
            },
            {
              id: "avatar2-notice-board",
              label: "NOTICE BOARD",
              page: "project-avatar2-notice-board",
            },
            {
              id: "avatar2-on-boarding",
              label: "ON-BOARDING",
              page: "project-avatar2-on-boarding",
            },
            {
              id: "avatar2-project-chat",
              label: "PROJECT CHAT",
              page: "project-avatar2-project-chat",
            },
            {
              id: "avatar2-script",
              label: "SCRIPT",
              page: "project-avatar2-script",
            },
            {
              id: "avatar2-shooting-schedule",
              label: "SHOOTING SCHEDULE",
              page: "project-avatar2-shooting-schedule",
            },
            {
              id: "avatar2-tasks",
              label: "TASKS",
              page: "project-avatar2-tasks",
            },
            {
              id: "avatar2-timeline",
              label: "TIMELINE",
              page: "project-avatar2-timeline",
            },
            {
              id: "avatar2-settings",
              label: "SETTINGS",
              page: "project-avatar2-settings",
            },
          ],
        },
        {
          id: "projects-mumbai",
          label: "MUMBAI DIARIES",
          page: "project-mumbai",
          subItems: [
            {
              id: "mumbai-activities",
              label: "ACTIVITIES",
              page: "project-mumbai-activities",
            },
            {
              id: "mumbai-apps",
              label: "APPS",
              page: "project-mumbai-apps",
              subItems: [
                {
                  id: "mumbai-apps-props",
                  label: "PROPS",
                  page: "project-mumbai-apps-props",
                },
                {
                  id: "mumbai-apps-costume",
                  label: "COSTUME",
                  page: "project-mumbai-apps-costume",
                },
                {
                  id: "mumbai-apps-catering",
                  label: "CATERING",
                  page: "project-mumbai-apps-catering",
                },
                {
                  id: "mumbai-apps-accounts",
                  label: "ACCOUNTS",
                  page: "project-mumbai-apps-accounts",
                },
                {
                  id: "mumbai-apps-script",
                  label: "SCRIPT",
                  page: "project-mumbai-apps-script",
                },
                {
                  id: "mumbai-apps-purchase-orders",
                  label: "PURCHASE ORDERS",
                  page: "project-mumbai-apps-purchase-orders",
                  subItems: [
                    {
                      id: "mumbai-po-all",
                      label: "ALL PURCHASE ORDERS",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                    {
                      id: "mumbai-po-create",
                      label: "CREATE NEW PO",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                    {
                      id: "mumbai-po-pending",
                      label: "PENDING APPROVAL",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                    {
                      id: "mumbai-po-approved",
                      label: "APPROVED POS",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                    {
                      id: "mumbai-po-vendors",
                      label: "VENDOR MANAGEMENT",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                    {
                      id: "mumbai-po-reports",
                      label: "REPORTS & ANALYTICS",
                      page: "project-mumbai-apps-purchase-orders",
                    },
                  ],
                },
                {
                  id: "mumbai-apps-market",
                  label: "MARKET",
                  page: "project-mumbai-apps-market",
                },
                {
                  id: "mumbai-apps-stocks",
                  label: "STOCKS",
                  page: "project-mumbai-apps-stocks",
                },
                {
                  id: "mumbai-apps-transport",
                  label: "TRANSPORT",
                  page: "project-mumbai-apps-transport",
                },
                {
                  id: "mumbai-apps-eplayer",
                  label: "E PLAYER",
                  page: "project-mumbai-apps-eplayer",
                },
                {
                  id: "mumbai-apps-forms",
                  label: "FORMS",
                  page: "project-mumbai-apps-forms",
                },
                {
                  id: "mumbai-apps-cast-crew",
                  label: "CAST & CREW",
                  page: "project-mumbai-apps-cast-crew",
                },
                {
                  id: "mumbai-apps-animals",
                  label: "ANIMALS",
                  page: "project-mumbai-apps-animals",
                },
                {
                  id: "mumbai-apps-vehicles",
                  label: "VEHICLES",
                  page: "project-mumbai-apps-vehicles",
                },
                {
                  id: "mumbai-apps-locations",
                  label: "LOCATIONS",
                  page: "project-mumbai-apps-locations",
                },
                {
                  id: "mumbai-apps-cloud",
                  label: "CLOUD",
                  page: "project-mumbai-apps-cloud",
                },
                {
                  id: "mumbai-apps-timesheets",
                  label: "TIMESHEETS",
                  page: "project-mumbai-apps-timesheets",
                },
                {
                  id: "mumbai-apps-approval",
                  label: "APPROVAL",
                  page: "project-mumbai-apps-approval",
                },
              ],
            },
            {
              id: "mumbai-calendar",
              label: "CALENDAR",
              page: "project-mumbai-calendar",
            },
            {
              id: "mumbai-call-sheets",
              label: "CALL SHEETS",
              page: "project-mumbai-call-sheets",
            },
            {
              id: "mumbai-cast-crew",
              label: "CAST & CREW",
              page: "project-mumbai-cast-crew",
            },
            {
              id: "mumbai-cloud-storage",
              label: "CLOUD STORAGE",
              page: "project-mumbai-cloud-storage",
            },
            {
              id: "mumbai-departments",
              label: "DEPARTMENTS",
              page: "project-mumbai-departments",
            },
            {
              id: "mumbai-notice-board",
              label: "NOTICE BOARD",
              page: "project-mumbai-notice-board",
            },
            {
              id: "mumbai-on-boarding",
              label: "ON-BOARDING",
              page: "project-mumbai-on-boarding",
            },
            {
              id: "mumbai-project-chat",
              label: "PROJECT CHAT",
              page: "project-mumbai-project-chat",
            },
            {
              id: "mumbai-script",
              label: "SCRIPT",
              page: "project-mumbai-script",
            },
            {
              id: "mumbai-shooting-schedule",
              label: "SHOOTING SCHEDULE",
              page: "project-mumbai-shooting-schedule",
            },
            {
              id: "mumbai-tasks",
              label: "TASKS",
              page: "project-mumbai-tasks",
            },
            {
              id: "mumbai-timeline",
              label: "TIMELINE",
              page: "project-mumbai-timeline",
            },
            {
              id: "mumbai-settings",
              label: "SETTINGS",
              page: "project-mumbai-settings",
            },
          ],
        },
        {
          id: "projects-purchase-orders",
          label: "PURCHASE ORDERS",
          page: "purchase-orders",
          subItems: [
            {
              id: "po-all",
              label: "ALL PURCHASE ORDERS",
              page: "purchase-orders",
            },
            {
              id: "po-create",
              label: "CREATE NEW PO",
              page: "purchase-orders",
            },
            {
              id: "po-pending",
              label: "PENDING APPROVAL",
              page: "purchase-orders",
            },
            {
              id: "po-approved",
              label: "APPROVED POS",
              page: "purchase-orders",
            },
            {
              id: "po-vendors",
              label: "VENDOR MANAGEMENT",
              page: "purchase-orders",
            },
            {
              id: "po-reports",
              label: "REPORTS & ANALYTICS",
              page: "purchase-orders",
            },
          ],
        },
      ],
    },
  ];

  // Add Master Admin specific items
  if (sidebarType === "master-admin") {
    roleBasedItems.push({
      id: "master-admin",
      label: "ADMIN",
      icon: Icon.Sparkles,
      gradient: "from-sky-400/20 to-sky-500/20",
      color: "text-sky-600",
      hoverBg: "hover:bg-sky-50",
      darkHoverBg: "dark:hover:bg-sky-900/20",
      subItems: [
        {
          id: "master-admin-dashboard",
          label: "DASHBOARD",
          page: "master-admin-dashboard",
        },
        {
          id: "master-admin-studios",
          label: "STUDIOS",
          page: "master-admin-studios",
        },
        {
          id: "master-admin-agencies",
          label: "AGENCIES",
          page: "master-admin-agencies",
        },
        {
          id: "master-admin-invitations",
          label: "INVITATIONS",
          page: "master-admin-invitations",
        },
        {
          id: "master-admin-permissions",
          label: "PERMISSIONS",
          page: "master-admin-permissions",
        },
        {
          id: "master-admin-audit-log",
          label: "📊 AUDIT LOG",
          page: "master-admin-audit-log",
        },
        {
          id: "period-locking",
          label: "🔒 PERIOD LOCKING",
          page: "period-locking",
        },
        {
          id: "corrections-dashboard",
          label: "🔧 CORRECTIONS",
          page: "corrections-dashboard",
        },
        {
          id: "audit-log-demo",
          label: "🎨 DEMO: ALL AUDIT LOGS",
          page: "audit-log-demo",
        },
      ],
    });
  }

  // Add Studio Admin specific items
  if (sidebarType === "studio-admin") {
    roleBasedItems.push({
      id: "studio-admin",
      label: "STUDIO",
      icon: Icon.Building2,
      gradient: "from-sky-400/20 to-sky-500/20",
      color: "text-sky-600",
      hoverBg: "hover:bg-sky-50",
      darkHoverBg: "dark:hover:bg-sky-900/20",
      subItems: [
        {
          id: "studio-dashboard",
          label: "DASHBOARD",
          page: "studio-dashboard",
        },
        { id: "studio-settings", label: "SETTINGS", page: "studio-settings" },
        { id: "studio-reports", label: "REPORTS", page: "studio-reports" },
        {
          id: "studio-audit-log",
          label: "📊 AUDIT LOG",
          page: "studio-audit-log",
        },
      ],
    });
  }

  // Add Agency Admin specific items
  if (sidebarType === "agency-admin") {
    roleBasedItems.push({
      id: "agency-admin",
      label: "AGENCY",
      icon: Icon.Briefcase,
      gradient: "from-sky-400/20 to-sky-500/20",
      color: "text-sky-600",
      hoverBg: "hover:bg-sky-50",
      darkHoverBg: "dark:hover:bg-sky-900/20",
      subItems: [
        {
          id: "agency-dashboard",
          label: "DASHBOARD",
          page: "agency-dashboard",
        },
        { id: "agency-crew", label: "CREW ROSTER", page: "agency-crew" },
        { id: "agency-bookings", label: "BOOKINGS", page: "agency-bookings" },
        {
          id: "agency-availability",
          label: "AVAILABILITY",
          page: "agency-availability",
        },
        { id: "agency-reports", label: "REPORTS", page: "agency-reports" },
        { id: "agency-settings", label: "SETTINGS", page: "agency-settings" },
        {
          id: "agency-audit-log",
          label: "📊 AUDIT LOG",
          page: "agency-audit-log",
        },
      ],
    });
  }

  // Add crew-specific items
  if (sidebarType === "crew") {
    roleBasedItems.push({
      id: "timesheets",
      label: "TIMESHEETS",
      icon: Icon.Clock,
      gradient: "from-purple-400/20 to-purple-500/20",
      color: "text-purple-600",
      hoverBg: "hover:bg-purple-50",
      darkHoverBg: "dark:hover:bg-purple-900/20",
      subItems: [
        { id: "timesheets-overview", label: "OVERVIEW", page: "timesheets" },
        { id: "timesheets-timecards", label: "TIMECARDS", page: "timecards" },
        {
          id: "timesheets-approval",
          label: "APPROVALS",
          page: "timecard-approval",
        },
      ],
    });
  }

  const sidebarMenu = [commonItems[0],...projectsMenuItems,commonItems[1], ...roleBasedItems];

  return sidebarMenu;
}

export default sidebarMenuList;
