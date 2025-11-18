import {
  Home,
  FolderOpen,
  Settings,
  Sparkles,
  Building2,
  Briefcase,
  Clock,
} from "lucide-react";

export function getMenuItems(userRole = "master-admin") {
  const base = [
    {
      id: "home",
      label: "HOME",
      icon: Home,
      link: `/studio/dashboard`,
      gradient: "from-lavender-400/20 to-lavender-500/20",
      color: "text-lavender-600",
      hoverBg: "hover:bg-lavender-50",
      darkHoverBg: "dark:hover:bg-lavender-900/20",
    },
    {
      id: "projects",
      label: "PROJECTS",
      link: `/projects`,
      icon: FolderOpen,
      gradient: "from-pastel-pink-400/20 to-pastel-pink-500/20",
      color: "text-pastel-pink-600",
      hoverBg: "hover:bg-pastel-pink-50",
      darkHoverBg: "dark:hover:bg-pastel-pink-900/20",
      subItems: [
        { 
          id: "projects-all", 
          label: "ALL PROJECTS", 
          link: "/projects" 
        },
        {
          id: "projects-avatar1",
          label: "AVATAR 1",
          link: "/project-avatar1",
          subItems: [
            {
              id: "avatar1-activities",
              label: "ACTIVITIES",
              link: "/project-avatar1-activities",
            },
            {
              id: "avatar1-apps",
              label: "APPS",
              link: "/project-avatar1-apps",
              subItems: [
                {
                  id: "avatar1-apps-props",
                  label: "PROPS",
                  link: "/project-avatar1-apps-props",
                },
                {
                  id: "avatar1-apps-costume",
                  label: "COSTUME",
                  link: "/project-avatar1-apps-costume",
                },
                {
                  id: "avatar1-apps-catering",
                  label: "CATERING",
                  link: "/project-avatar1-apps-catering",
                },
                {
                  id: "avatar1-apps-accounts",
                  label: "ACCOUNTS",
                  link: "/project-avatar1-apps-accounts",
                  subItems: [
                    {
                      id: "avatar1-accounts-payable",
                      label: "ACCOUNTS PAYABLE",
                      link: "/project-avatar1-apps-accounts-payable",
                    },
                    {
                      id: "avatar1-purchase-order",
                      label: "PURCHASE ORDER",
                      link: "/project-avatar1-apps-purchase-order",
                    },
                    {
                      id: "avatar1-p-card",
                      label: "P-CARD",
                      link: "/project-avatar1-apps-p-card",
                    },
                    {
                      id: "avatar1-petty-cash",
                      label: "PETTY CASH",
                      link: "/project-avatar1-apps-petty-cash",
                    },
                    {
                      id: "avatar1-vat-gst",
                      label: "VAT/GST",
                      link: "/project-avatar1-apps-vat-gst",
                    },
                    {
                      id: "avatar1-bank-reconciliation",
                      label: "BANK RECONCILIATION",
                      link: "/project-avatar1-apps-bank-reconciliation",
                    },
                    {
                      id: "avatar1-payroll",
                      label: "PAYROLL",
                      link: "/project-avatar1-apps-payroll",
                    },
                    {
                      id: "avatar1-budget",
                      label: "BUDGET",
                      link: "/project-avatar1-apps-budget",
                    },
                    {
                      id: "avatar1-cashflow",
                      label: "CASHFLOW",
                      link: "/project-avatar1-apps-cashflow",
                    },
                    {
                      id: "avatar1-reports",
                      label: "REPORTS",
                      link: "/project-avatar1-apps-reports",
                    },
                    {
                      id: "avatar1-settings",
                      label: "SETTINGS",
                      link: "/project-avatar1-apps-settings",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-script",
                  label: "SCRIPT",
                  link: "/project-avatar1-apps-script",
                },
                {
                  id: "avatar1-apps-purchase-orders",
                  label: "PURCHASE ORDERS",
                  link: "/project-avatar1-apps-purchase-orders",
                  subItems: [
                    {
                      id: "avatar1-po-all",
                      label: "ALL PURCHASE ORDERS",
                      link: "/project-avatar1-apps-purchase-orders/all",
                    },
                    {
                      id: "avatar1-po-create",
                      label: "CREATE NEW PO",
                      link: "/project-avatar1-apps-purchase-orders/create",
                    },
                    {
                      id: "avatar1-po-pending",
                      label: "PENDING APPROVAL",
                      link: "/project-avatar1-apps-purchase-orders/pending",
                    },
                    {
                      id: "avatar1-po-approved",
                      label: "APPROVED POS",
                      link: "/project-avatar1-apps-purchase-orders/approved",
                    },
                    {
                      id: "avatar1-po-vendors",
                      label: "VENDOR MANAGEMENT",
                      link: "/project-avatar1-apps-purchase-orders/vendors",
                    },
                    {
                      id: "avatar1-po-reports",
                      label: "REPORTS & ANALYTICS",
                      link: "/project-avatar1-apps-purchase-orders/reports",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-market",
                  label: "MARKET",
                  link: "/project-avatar1-apps-market",
                },
                {
                  id: "avatar1-apps-stocks",
                  label: "STOCKS",
                  link: "/project-avatar1-apps-stocks",
                },
                {
                  id: "avatar1-apps-transport",
                  label: "TRANSPORT",
                  link: "/project-avatar1-apps-transport",
                },
                {
                  id: "avatar1-apps-eplayer",
                  label: "E PLAYER",
                  link: "/project-avatar1-apps-eplayer",
                },
                {
                  id: "avatar1-apps-forms",
                  label: "FORMS",
                  link: "/project-avatar1-apps-forms",
                  subItems: [
                    {
                      id: "avatar1-mileage-form",
                      label: "MILEAGE FORM",
                      link: "/project-avatar1-apps-forms/mileage",
                    },
                    {
                      id: "avatar1-fuel-form",
                      label: "FUEL FORM",
                      link: "/project-avatar1-apps-forms/fuel",
                    },
                    {
                      id: "avatar1-wire-transfer",
                      label: "WIRE TRANSFER",
                      link: "/project-avatar1-apps-forms/wire-transfer",
                    },
                    {
                      id: "avatar1-petty-cash-advance",
                      label: "PETTY CASH ADVANCE FORM",
                      link: "/project-avatar1-apps-forms/petty-cash-advance",
                    },
                    {
                      id: "avatar1-missing-receipts",
                      label: "MISSING RECEIPTS FORM",
                      link: "/project-avatar1-apps-forms/missing-receipts",
                    },
                    {
                      id: "avatar1-payment-request",
                      label: "PAYMENT REQUEST FORM",
                      link: "/project-avatar1-apps-forms/payment-request",
                    },
                    {
                      id: "avatar1-p-card-application",
                      label: "P CARD APPLICATION FORM",
                      link: "/project-avatar1-apps-forms/p-card-application",
                    },
                    {
                      id: "avatar1-p-card-form",
                      label: "P-CARD FORM",
                      link: "/project-avatar1-apps-forms/p-card",
                    },
                    {
                      id: "avatar1-petty-cash-form",
                      label: "PETTY CASH FORM",
                      link: "/project-avatar1-apps-forms/petty-cash",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-cast-crew",
                  label: "CAST & CREW",
                  link: "/project-avatar1-apps-cast-crew",
                },
                {
                  id: "avatar1-apps-animals",
                  label: "ANIMALS",
                  link: "/project-avatar1-apps-animals",
                },
                {
                  id: "avatar1-apps-vehicles",
                  label: "VEHICLES",
                  link: "/project-avatar1-apps-vehicles",
                },
                {
                  id: "avatar1-apps-locations",
                  label: "LOCATIONS",
                  link: "/project-avatar1-apps-locations",
                  subItems: [
                    {
                      id: "avatar1-locations-schedule",
                      label: "SCHEDULE",
                      link: "/project-avatar1-apps-locations/schedule",
                    },
                    {
                      id: "avatar1-locations-settings",
                      label: "SETTINGS",
                      link: "/project-avatar1-apps-locations/settings",
                    },
                    {
                      id: "avatar1-locations-script",
                      label: "SCRIPT",
                      link: "/project-avatar1-apps-locations/script",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-cloud",
                  label: "CLOUD",
                  link: "/project-avatar1-apps-cloud",
                  subItems: [
                    {
                      id: "avatar1-cloud-departments",
                      label: "DEPARTMENTS",
                      link: "/project-avatar1-apps-cloud/departments",
                    },
                  ],
                },
                {
                  id: "avatar1-apps-timesheets",
                  label: "TIMESHEETS",
                  link: "/project-avatar1-apps-timesheets",
                },
                {
                  id: "avatar1-apps-approval",
                  label: "APPROVAL",
                  link: "/project-avatar1-apps-approval",
                },
              ],
            },
            {
              id: "avatar1-calendar",
              label: "CALENDAR",
              link: "/project-avatar1-calendar",
            },
            {
              id: "avatar1-call-sheets",
              label: "CALL SHEETS",
              link: "/project-avatar1-call-sheets",
            },
            {
              id: "avatar1-cast-crew",
              label: "CAST & CREW",
              link: "/project-avatar1-cast-crew",
            },
            {
              id: "avatar1-cloud-storage",
              label: "CLOUD STORAGE",
              link: "/project-avatar1-cloud-storage",
            },
            {
              id: "avatar1-departments",
              label: "DEPARTMENTS",
              link: "/project-avatar1-departments",
            },
            {
              id: "avatar1-notice-board",
              label: "NOTICE BOARD",
              link: "/project-avatar1-notice-board",
            },
            {
              id: "avatar1-on-boarding",
              label: "ON-BOARDING",
              link: "/project-avatar1-on-boarding",
            },
            {
              id: "avatar1-project-chat",
              label: "PROJECT CHAT",
              link: "/project-avatar1-project-chat",
            },
            {
              id: "avatar1-script",
              label: "SCRIPT",
              link: "/project-avatar1-script",
            },
            {
              id: "avatar1-shooting-schedule",
              label: "SHOOTING SCHEDULE",
              link: "/project-avatar1-shooting-schedule",
            },
            {
              id: "avatar1-tasks",
              label: "TASKS",
              link: "/project-avatar1-tasks",
            },
            {
              id: "avatar1-timeline",
              label: "TIMELINE",
              link: "/project-avatar1-timeline",
            },
            {
              id: "avatar1-settings",
              label: "SETTINGS",
              link: "/project-avatar1-settings",
            },
          ],
        },
      ],
    },
    {
      id: "settings",
      label: "SETTINGS",
      icon: Settings,
      gradient: "from-peach-400/20 to-peach-500/20",
      color: "text-peach-600",
      hoverBg: "hover:bg-peach-50",
      darkHoverBg: "dark:hover:bg-peach-900/20",
      subItems: [
        { 
          id: "settings-account", 
          label: "ACCOUNT", 
          link: "/studio/settings/account" 
        },
        { 
          id: "settings-password", 
          label: "PASSWORD", 
          link: "/reset-password" 
        },
      ],
    },
  ];

  // role-specific inserts near index 2
  const roleItems = [];
  if (userRole === "master-admin") {
    roleItems.push({
      id: "master-admin",
      label: "ADMIN",
      icon: Sparkles,
      subItems: [
        {
          id: "master-admin-dashboard",
          label: "DASHBOARD",
          link: "/master-admin-dashboard",
        },
        {
          id: "master-admin-studios",
          label: "STUDIOS",
          link: "/master-admin-studios",
        },
      ],
    });
  }

  if (userRole === "studio-admin") {
    roleItems.push({
      id: "studio-admin",
      label: "STUDIO",
      icon: Building2,
      subItems: [
        {
          id: "studio-dashboard",
          label: "DASHBOARD",
          link: "/studio-dashboard",
        },
      ],
    });
  }

  if (userRole === "agency-admin") {
    roleItems.push({
      id: "agency-admin",
      label: "AGENCY",
      icon: Briefcase,
      subItems: [
        {
          id: "agency-dashboard",
          label: "DASHBOARD",
          link: "/agency-dashboard",
        },
      ],
    });
  }

  if (userRole === "crew") {
    roleItems.push({
      id: "timesheets",
      label: "TIMESHEETS",
      icon: Clock,
      subItems: [
        { 
          id: "timesheets-overview", 
          label: "OVERVIEW", 
          link: "/timesheets" 
        },
      ],
    });
  }

  const result = [...base.slice(0, 2), ...roleItems, ...base.slice(2)];
  return result;
}

export default getMenuItems;