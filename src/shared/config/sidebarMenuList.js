import * as Icon from "lucide-react";
import React from "react";

function sidebarMenuList(sidebarType) {
  let roleBasedItems = [];
  let commonItems = [
    {
      id: "home",
      label: "HOME",
      page: "/home",
      icon: Icon.Home,
      // gradient: "from-lavender-400/20 to-lavender-500/20",
      // color: "text-lavender-600",
      // hoverBg: "hover:bg-lavender-50",
      // darkHoverBg: "dark:hover:bg-lavender-900/20",
    },
    {
      id: "settings",
      label: "SETTINGS",
      page: "/settings",
      icon: Icon.Settings,
      // gradient: "from-peach-400/20 to-peach-500/20",
      // color: "text-peach-600",
      // hoverBg: "hover:bg-peach-50",
      // darkHoverBg: "dark:hover:bg-peach-900/20",
       subItems: [
        { id: "settings-account", label: "ACCOUNT", page: "/settings/account" },
        { id: "settings-password", label: "PASSWORD", page: "/settings/password" },
        { id: "settings-preferences", label: "PREFERENCES", page: "/settings/preferences" },
      ],
    },
  ];

  let projectsMenuItems = [
    {
      id: "projects",
      label: "PROJECTS",
      page: "/projects",
      icon: Icon.FolderOpen,
      gradient: "from-pastel-pink-400/20 to-pastel-pink-500/20",
      color: "text-pastel-pink-600",
      hoverBg: "hover:bg-pastel-pink-50",
      darkHoverBg: "dark:hover:bg-pastel-pink-900/20",

      subItems: [
        { id: "projects-all", label: "ALL PROJECTS", page: "/projects" },

        // -----------------------------------------------------------
        // PROJECT: AVATAR 1
        // -----------------------------------------------------------
        {
          id: "projects-avatar1",
          label: "AVATAR 1",
          page: "/projects/avatar-1",

          subItems: [
            { id: "avatar1-activities", label: "ACTIVITIES", page: "/projects/avatar-1/activities" },

            // ----------------------- APPS -----------------------
            {
              id: "avatar1-apps",
              label: "APPS",
              page: "/projects/avatar-1/apps",

              subItems: [
                { id: "props", label: "PROPS", page: "/projects/avatar-1/apps/props" },
                { id: "costume", label: "COSTUME", page: "/projects/avatar-1/apps/costume" },
                { id: "catering", label: "CATERING", page: "/projects/avatar-1/apps/catering" },

                {
                  id: "accounts",
                  label: "ACCOUNTS",
                  page: "/projects/avatar-1/apps/accounts",

                  subItems: [
                    { id: "accounts-payable", label: "ACCOUNTS PAYABLE", page: "/projects/avatar-1/apps/accounts/payable" },
                    { id: "purchase-order", label: "PURCHASE ORDER", page: "/projects/avatar-1/apps/accounts/purchase-order" },
                    { id: "p-card", label: "P-CARD", page: "/projects/avatar-1/apps/accounts/p-card" },
                    { id: "petty-cash", label: "PETTY CASH", page: "/projects/avatar-1/apps/accounts/petty-cash" },
                    { id: "vat-gst", label: "VAT / GST", page: "/projects/avatar-1/apps/accounts/vat-gst" },
                    { id: "bank-reconciliation", label: "BANK RECONCILIATION", page: "/projects/avatar-1/apps/accounts/bank-reconciliation" },
                    { id: "payroll", label: "PAYROLL", page: "/projects/avatar-1/apps/accounts/payroll" },
                    { id: "budget", label: "BUDGET", page: "/projects/avatar-1/apps/accounts/budget" },
                    { id: "cashflow", label: "CASHFLOW", page: "/projects/avatar-1/apps/accounts/cashflow" },
                    { id: "reports", label: "REPORTS", page: "/projects/avatar-1/apps/accounts/reports" },
                    { id: "settings", label: "SETTINGS", page: "/projects/avatar-1/apps/accounts/settings" },
                  ],
                },

                {
                  id: "purchase-orders",
                  label: "PURCHASE ORDERS",
                  page: "/projects/avatar-1/apps/purchase-orders",

                  subItems: [
                    { id: "po-all", label: "ALL POS", page: "/projects/avatar-1/apps/purchase-orders" },
                    { id: "po-create", label: "CREATE PO", page: "/projects/avatar-1/apps/purchase-orders/create" },
                    { id: "po-pending", label: "PENDING", page: "/projects/avatar-1/apps/purchase-orders/pending" },
                    { id: "po-approved", label: "APPROVED", page: "/projects/avatar-1/apps/purchase-orders/approved" },
                    { id: "po-vendors", label: "VENDORS", page: "/projects/avatar-1/apps/purchase-orders/vendors" },
                    { id: "po-reports", label: "REPORTS", page: "/projects/avatar-1/apps/purchase-orders/reports" },
                  ],
                },

                { id: "script", label: "SCRIPT", page: "/projects/avatar-1/apps/script" },
                { id: "market", label: "MARKET", page: "/projects/avatar-1/apps/market" },
                { id: "stocks", label: "STOCKS", page: "/projects/avatar-1/apps/stocks" },
                { id: "transport", label: "TRANSPORT", page: "/projects/avatar-1/apps/transport" },
                { id: "eplayer", label: "E PLAYER", page: "/projects/avatar-1/apps/eplayer" },

                {
                  id: "forms",
                  label: "FORMS",
                  page: "/projects/avatar-1/apps/forms",
                  subItems: [
                    { id: "mileage", label: "MILEAGE FORM", page: "/projects/avatar-1/apps/forms/mileage" },
                    { id: "fuel", label: "FUEL FORM", page: "/projects/avatar-1/apps/forms/fuel" },
                    { id: "wire-transfer", label: "WIRE TRANSFER", page: "/projects/avatar-1/apps/forms/wire-transfer" },
                    { id: "cash-advance", label: "CASH ADVANCE", page: "/projects/avatar-1/apps/forms/cash-advance" },
                    { id: "missing-receipts", label: "MISSING RECEIPTS", page: "/projects/avatar-1/apps/forms/missing-receipts" },
                    { id: "payment-request", label: "PAYMENT REQUEST", page: "/projects/avatar-1/apps/forms/payment-request" },
                    { id: "p-card-application", label: "P-CARD APPLICATION", page: "/projects/avatar-1/apps/forms/p-card-application" },
                    { id: "p-card-form", label: "P-CARD FORM", page: "/projects/avatar-1/apps/forms/p-card" },
                    { id: "petty-cash-form", label: "PETTY CASH FORM", page: "/projects/avatar-1/apps/forms/petty-cash" },
                  ],
                },

                { id: "cast-crew", label: "CAST & CREW", page: "/projects/avatar-1/apps/cast-crew" },
                { id: "animals", label: "ANIMALS", page: "/projects/avatar-1/apps/animals" },
                { id: "vehicles", label: "VEHICLES", page: "/projects/avatar-1/apps/vehicles" },

                {
                  id: "locations",
                  label: "LOCATIONS",
                  page: "/projects/avatar-1/apps/locations",
                  subItems: [
                    { id: "locations-schedule", label: "SCHEDULE", page: "/projects/avatar-1/apps/locations/schedule" },
                    { id: "locations-settings", label: "SETTINGS", page: "/projects/avatar-1/apps/locations/settings" },
                    { id: "locations-script", label: "SCRIPT", page: "/projects/avatar-1/apps/locations/script" },
                  ],
                },

                {
                  id: "cloud",
                  label: "CLOUD",
                  page: "/projects/avatar-1/apps/cloud",
                  subItems: [
                    {
                      id: "cloud-departments",
                      label: "DEPARTMENTS",
                      page: "/projects/avatar-1/apps/cloud/departments",
                    },
                  ],
                },

                { id: "timesheets", label: "TIMESHEETS", page: "/projects/avatar-1/apps/timesheets" },
                { id: "approval", label: "APPROVAL", page: "/projects/avatar-1/apps/approval" },
              ],
            },

            { id: "calendar", label: "CALENDAR", page: "/projects/avatar-1/calendar" },
            { id: "call-sheets", label: "CALL SHEETS", page: "/projects/avatar-1/call-sheets" },
            { id: "cast-crew", label: "CAST & CREW", page: "/projects/avatar-1/cast-crew" },
            { id: "cloud-storage", label: "CLOUD STORAGE", page: "/projects/avatar-1/cloud-storage" },
            { id: "departments", label: "DEPARTMENTS", page: "/projects/avatar-1/departments" },
            { id: "notice-board", label: "NOTICE BOARD", page: "/projects/avatar-1/notice-board" },
            { id: "on-boarding", label: "ON-BOARDING", page: "/projects/avatar-1/on-boarding" },
            { id: "project-chat", label: "PROJECT CHAT", page: "/projects/avatar-1/project-chat" },
            { id: "script", label: "SCRIPT", page: "/projects/avatar-1/script" },
            { id: "shooting-schedule", label: "SHOOTING SCHEDULE", page: "/projects/avatar-1/shooting-schedule" },
            { id: "tasks", label: "TASKS", page: "/projects/avatar-1/tasks" },
            { id: "timeline", label: "TIMELINE", page: "/projects/avatar-1/timeline" },
            { id: "settings", label: "SETTINGS", page: "/projects/avatar-1/settings" },
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

  const sidebarMenu = [commonItems[0],...projectsMenuItems, ...roleBasedItems, commonItems[1]];

  return sidebarMenu;
}

export default sidebarMenuList;
