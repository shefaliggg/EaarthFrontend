import React, { useState } from 'react'
import CardWrapper from '../../../../../shared/components/wrappers/CardWrapper'
import TextDataField from '../../../../../shared/components/wrappers/TextDataField'
import EditableTextDataField from '../../../../../shared/components/wrappers/EditableTextDataField';
import { Button } from '../../../../../shared/components/ui/button';
import { Check, Edit, Edit3, Pen, X } from 'lucide-react';
import EditableCheckboxField from '../../../../../shared/components/wrappers/EditableCheckboxField';
import { SelectMenu } from '../../../../../shared/components/menus/SelectMenu';
import { SmartIcon } from '../../../../../shared/components/SmartIcon';
import EditableSelectField from '../../../../../shared/components/wrappers/EditableSelectField';

function TimesheetGeneralSettings() {
  const [isEditMode, setIsEditMode] = useState(false)

  const [crewInfo, setCrewInfo] = useState({
    firstName: 'LUKE',
    lastName: 'GREENAN',
    department: 'ELECTRICAL - SHOOTING ELECTRICAL',
    role: 'SHOOTING ELECTRICIAN',
    contractType: 'PAYE',
    employmentType: 'WEEKLY',
    basicRate: 2145.25,
    dailyRate: 429.05,
    hourlyRate: 39.00,
    jobTitle: 'SHOOTING ELECTRICIAN',
    company: 'MIRAGE PICTURES LIMITED',
    isVATRegistered: true,
    startDate: '2025-10-20', // Contract Start Date
    endDate: '2025-12-21'   // Contract End Date
  });

  const [approvalSettings, setApprovalSettings] = useState({
    overtimeThreshold: 60,
    budgetThreshold: 5000,
    mealBreakRequired: true,
    mealBreakMinHours: 6,
    lateSubmissionHours: 2, // Hours after deadline
    weekendWorkAlert: true,
    nightShiftAlert: true,
    nightShiftStart: '22:00',
    nightShiftEnd: '06:00',
  });

  const [budgetSettings, setBudgetSettings] = useState({
    weeklyBudget: 50000,
    dailyCrewBudget: 800,
    weeklyCrewBudget: 5000,
    overtimeBudgetLimit: 15000,
    allowancesBudgetLimit: 10000,
    currencySymbol: '£',
    showCostAlerts: true,
  });

  const [workflowSettings, setWorkflowSettings] = useState({
    requireHODApproval: true,
    requireProductionApproval: true,
    requireFinanceApproval: true,
    requirePayrollReview: true,
    autoApproveUnder40Hours: false,
    autoApproveNoCost: false,
    allowBulkApproval: true,
    maxBulkApprovalCount: 50,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnSubmission: true,
    emailOnApproval: true,
    emailOnRejection: true,
    emailDailyDigest: false,
    emailWeeklySummary: true,
    smsReminders: false,
    notifyOvertime: true,
    notifyBudgetExceed: true,
    notifyMissingSubmissions: true,
  });

  const [exportSettings, setExportSettings] = useState({
    defaultFormat: 'excel',
    includeNotes: true,
    includeApprovalHistory: true,
    includeAlerts: true,
    autoArchiveWeeks: 12,
    emailRecipients: 'finance@production.com, payroll@production.com',
  });

  const [displaySettings, setDisplaySettings] = useState({
    defaultView: 'list',
    showComparisonByDefault: false,
    showDepartmentProgress: true,
    showAlertIcons: true,
    defaultSortField: 'name',
    defaultSortDirection: 'asc',
    rowsPerPage: 50,
    highlightExcessiveOT: true,
    highlightWeekendWork: true,
    highlightMissingBreaks: true,
  });

  const [allowanceCaps, setAllowanceCaps] = useState({
    computer: { cap: 250, paidTillDate: 122.5, claimed: 0, code: '' },
    software: { cap: 250, paidTillDate: 122.5, claimed: 0, code: '' },
    box: { cap: 200, paidTillDate: 0, claimed: 0, code: '' },
    equipment: { cap: 1000, paidTillDate: 350, claimed: 0, code: '' },
    vehicle: { cap: 300, paidTillDate: 300, claimed: 0, code: '' },
    mobile: { cap: 100, paidTillDate: 45, claimed: 0, code: '' },
    living: { cap: 500, paidTillDate: 0, claimed: 0, code: '' }
  });

  const updateCrewInfo = (field, value) => {
    setCrewInfo({
      ...crewInfo,
      [field]: value
    });
  };

  const updateApprovalSetting = (field, value) => {
    setApprovalSettings({
      ...approvalSettings,
      [field]: value
    });
  };

  const updateBudgetSetting = (field, value) => {
    setBudgetSettings({
      ...budgetSettings,
      [field]: value
    });
  };

  const updateNotificationSetting = (field, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  const updateExportSetting = (field, value) => {
    setExportSettings({
      ...exportSettings,
      [field]: value
    });
  };

  const updateWorkflowSetting = (field, value) => {
    setWorkflowSettings({
      ...workflowSettings,
      [field]: value
    });
  };

  const updateDisplaySetting = (field, value) => {
    setDisplaySettings({
      ...displaySettings,
      [field]: value
    });
  };

  const updateCap = (key, field, value) => {
    setAllowanceCaps({
      ...allowanceCaps,
      [key]: {
        ...allowanceCaps[key],
        [field]: value
      }
    });
  };


  return (
    <div className='container mx-auto space-y-6'>
      <CardWrapper
        title="Crew & Production"
        icon="User"
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">
          <EditableTextDataField
            label="First Name"
            icon="User"
            value={crewInfo.firstName}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("firstName", val)}
          />

          <EditableTextDataField
            label="Last Name"
            value={crewInfo.lastName}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("lastName", val)}
          />

          <EditableTextDataField
            label="Job Title / Role"
            value={crewInfo.jobTitle}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("jobTitle", val)}
          />

          <EditableTextDataField
            label="Department"
            value={crewInfo.department}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("department", val)}
          />

          <EditableTextDataField
            label="Production Company"
            value={crewInfo.company}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("company", val)}
          />

          <EditableTextDataField
            label="Daily Rate (£)"
            value={crewInfo.dailyRate}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("dailyRate", Number(val))}
            placeholder="0.00"
          />

          <EditableTextDataField
            label="Hourly Rate (£)"
            value={crewInfo.hourlyRate}
            isEditing={isEditMode}
            onChange={(val) => updateCrewInfo("hourlyRate", Number(val))}
            placeholder="0.00"
          />
        </div>
      </CardWrapper>

      <CardWrapper
        title="Approval & Alert Thresholds"
        icon="AlertTriangle"
        iconColor='text-red-500'
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableTextDataField
            label="Overtime Threshold (Hours / Week)"
            icon="Clock"
            value={approvalSettings.overtimeThreshold}
            isEditing={isEditMode}
            type="number"
            placeholder="60"
            onChange={(val) =>
              updateApprovalSetting("overtimeThreshold", Number(val))
            }
          />

          <EditableTextDataField
            label="Budget Threshold (£)"
            icon="PoundSterling"
            value={approvalSettings.budgetThreshold}
            isEditing={isEditMode}
            type="number"
            placeholder="5000"
            onChange={(val) =>
              updateApprovalSetting("budgetThreshold", Number(val))
            }
          />

          <EditableTextDataField
            label="Meal Break Required After (Hours)"
            icon="Utensils"
            value={approvalSettings.mealBreakMinHours}
            isEditing={isEditMode}
            type="number"
            placeholder="6"
            onChange={(val) =>
              updateApprovalSetting("mealBreakMinHours", Number(val))
            }
          />

          <EditableTextDataField
            label="Late Submission Grace Period (Hours)"
            icon="AlarmClock"
            value={approvalSettings.lateSubmissionHours}
            isEditing={isEditMode}
            type="number"
            placeholder="2"
            onChange={(val) =>
              updateApprovalSetting("lateSubmissionHours", Number(val))
            }
          />

          <EditableTextDataField
            label="Night Shift Start Time"
            icon="Moon"
            value={approvalSettings.nightShiftStart}
            isEditing={isEditMode}
            type="time"
            onChange={(val) =>
              updateApprovalSetting("nightShiftStart", val)
            }
          />

          <EditableTextDataField
            label="Night Shift End Time"
            icon="Sunrise"
            value={approvalSettings.nightShiftEnd}
            isEditing={isEditMode}
            type="time"
            onChange={(val) =>
              updateApprovalSetting("nightShiftEnd", val)
            }
          />

          {/* Alerts */}
          <div className="col-span-3 grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-muted">

            <EditableCheckboxField
              label="Weekend Work Alert"
              icon="CalendarDays"
              checked={approvalSettings.weekendWorkAlert}
              isEditing={isEditMode}
              description="Triggers alert when work is logged on weekends."
              onChange={(val) =>
                updateApprovalSetting("weekendWorkAlert", val)
              }
            />

            <EditableCheckboxField
              label="Night Shift Alert"
              icon="MoonStar"
              checked={approvalSettings.nightShiftAlert}
              isEditing={isEditMode}
              description="Triggers alert for overnight work hours."
              onChange={(val) =>
                updateApprovalSetting("nightShiftAlert", val)
              }
            />

          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        title="Budget Limits"
        icon="DollarSign"
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableTextDataField
            label="Weekly Total Budget (£)"
            icon="Wallet"
            value={budgetSettings.weeklyBudget}
            isEditing={isEditMode}
            type="number"
            placeholder="0.00"
            onChange={(val) =>
              updateBudgetSetting("weeklyBudget", Number(val))
            }
          />

          <EditableTextDataField
            label="Daily Crew Budget (£)"
            icon="Users"
            value={budgetSettings.dailyCrewBudget}
            isEditing={isEditMode}
            type="number"
            placeholder="0.00"
            onChange={(val) =>
              updateBudgetSetting("dailyCrewBudget", Number(val))
            }
          />

          <EditableTextDataField
            label="Weekly Crew Budget (£)"
            icon="CalendarDays"
            value={budgetSettings.weeklyCrewBudget}
            isEditing={isEditMode}
            type="number"
            placeholder="0.00"
            onChange={(val) =>
              updateBudgetSetting("weeklyCrewBudget", Number(val))
            }
          />

          <EditableTextDataField
            label="Overtime Budget Limit (£)"
            icon="Clock"
            value={budgetSettings.overtimeBudgetLimit}
            isEditing={isEditMode}
            type="number"
            placeholder="0.00"
            onChange={(val) =>
              updateBudgetSetting("overtimeBudgetLimit", Number(val))
            }
          />

          <EditableTextDataField
            label="Allowances Budget Limit (£)"
            icon="Receipt"
            value={budgetSettings.allowancesBudgetLimit}
            isEditing={isEditMode}
            type="number"
            placeholder="0.00"
            onChange={(val) =>
              updateBudgetSetting("allowancesBudgetLimit", Number(val))
            }
          />

          {/* Alerts */}
          <div className="col-span-3 pt-2 border-t border-dashed border-muted">
            <EditableCheckboxField
              label="Show Cost Alerts"
              icon="Bell"
              checked={budgetSettings.showCostAlerts}
              isEditing={isEditMode}
              description="Notify when budgets approach defined limits."
              onChange={(val) =>
                updateBudgetSetting("showCostAlerts", val)
              }
            />
          </div>

        </div>
      </CardWrapper>

      <CardWrapper
        title="Approval Workflow"
        icon="Shield"
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableCheckboxField
            label="Require HOD Approval"
            icon="UserCheck"
            checked={workflowSettings.requireHODApproval}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("requireHODApproval", val)
            }
          />

          <EditableCheckboxField
            label="Require Production Approval"
            icon="Clapperboard"
            checked={workflowSettings.requireProductionApproval}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("requireProductionApproval", val)
            }
          />

          <EditableCheckboxField
            label="Require Finance Approval"
            icon="Wallet"
            checked={workflowSettings.requireFinanceApproval}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("requireFinanceApproval", val)
            }
          />

          <EditableCheckboxField
            label="Require Payroll Review"
            icon="Receipt"
            checked={workflowSettings.requirePayrollReview}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("requirePayrollReview", val)
            }
          />

          <EditableCheckboxField
            label="Auto-approve under 40 hours"
            icon="Clock"
            checked={workflowSettings.autoApproveUnder40Hours}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("autoApproveUnder40Hours", val)
            }
          />

          <EditableCheckboxField
            label="Auto-approve zero-cost"
            icon="Zap"
            checked={workflowSettings.autoApproveNoCost}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("autoApproveNoCost", val)
            }
          />

          <EditableCheckboxField
            label="Allow bulk approval"
            icon="Layers"
            checked={workflowSettings.allowBulkApproval}
            isEditing={isEditMode}
            onChange={(val) =>
              updateWorkflowSetting("allowBulkApproval", val)
            }
          />

          <EditableTextDataField
            label="Max Bulk Approval Count"
            icon="Hash"
            type="number"
            value={workflowSettings.maxBulkApprovalCount}
            isEditing={isEditMode && workflowSettings.allowBulkApproval}
            placeholder="0"
            onChange={(val) =>
              updateWorkflowSetting("maxBulkApprovalCount", Number(val))
            }
          />

        </div>
      </CardWrapper>

      <CardWrapper
        title="Notifications"
        icon="Bell"
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableCheckboxField
            label="Email on submission"
            icon="Mail"
            checked={notificationSettings.emailOnSubmission}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("emailOnSubmission", val)
            }
          />

          <EditableCheckboxField
            label="Email on approval"
            icon="CheckCircle"
            checked={notificationSettings.emailOnApproval}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("emailOnApproval", val)
            }
          />

          <EditableCheckboxField
            label="Email on rejection"
            icon="XCircle"
            checked={notificationSettings.emailOnRejection}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("emailOnRejection", val)
            }
          />

          <EditableCheckboxField
            label="Daily digest"
            icon="Sun"
            checked={notificationSettings.emailDailyDigest}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("emailDailyDigest", val)
            }
          />

          <EditableCheckboxField
            label="Weekly summary"
            icon="Calendar"
            checked={notificationSettings.emailWeeklySummary}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("emailWeeklySummary", val)
            }
          />

          <EditableCheckboxField
            label="SMS reminders"
            icon="MessageSquare"
            checked={notificationSettings.smsReminders}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("smsReminders", val)
            }
          />

          <EditableCheckboxField
            label="Overtime alerts"
            icon="Clock"
            checked={notificationSettings.notifyOvertime}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("notifyOvertime", val)
            }
          />

          <EditableCheckboxField
            label="Budget exceed alerts"
            icon="AlertTriangle"
            checked={notificationSettings.notifyBudgetExceed}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("notifyBudgetExceed", val)
            }
          />

          <EditableCheckboxField
            label="Missing submissions"
            icon="FileWarning"
            checked={notificationSettings.notifyMissingSubmissions}
            isEditing={isEditMode}
            onChange={(val) =>
              updateNotificationSetting("notifyMissingSubmissions", val)
            }
          />

        </div>
      </CardWrapper>

      <CardWrapper
        title="Export & Reporting"
        icon="Download"
        actions={
          <>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditMode(prev => !prev)}
              className={"hover:bg-red-200 dark:hover:bg-red-800"}
            >
              {isEditMode ? <X className='text-red-500' /> : <Pen />}
            </Button>
            {isEditMode &&
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditMode(prev => !prev)}
                className={"hover:bg-green-200 dark:hover:bg-green-800"}
              >
                <Check className='text-green-500' />
              </Button>
            }
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableSelectField
            label={"Default Export Format"}
            icon={"Download"}
            value={exportSettings.defaultFormat}
            items={[
              { label: "Excel (.xlsx)", value: "excel", icon: "FileSpreadsheet" },
              { label: "CSV", value: "csv", icon: "Table" },
              { label: "PDF", value: "pdf", icon: "FileText" },
            ]}
            isEditing={isEditMode}
            onChange={(val) =>
              updateExportSetting("defaultFormat", val)
            }
          />

          {/* Auto Archive Weeks */}
          <EditableTextDataField
            label="Auto-Archive After (Weeks)"
            icon="Archive"
            value={exportSettings.autoArchiveWeeks}
            isEditing={isEditMode}
            placeholder="0"
            onChange={(val) =>
              updateExportSetting("autoArchiveWeeks", Number(val))
            }
          />

          {/* Spacer for grid balance */}
          <div />

          {/* Email Recipients */}
          <div className="col-span-3">
            <EditableTextDataField
              label="Email Recipients"
              icon="Mail"
              value={exportSettings.emailRecipients}
              isEditing={isEditMode}
              multiline
              placeholder="finance@production.com, payroll@production.com"
              onChange={(val) =>
                updateExportSetting("emailRecipients", val)
              }
            />
          </div>

          {/* Include Notes */}
          <EditableCheckboxField
            label="Include Notes"
            icon="StickyNote"
            checked={exportSettings.includeNotes}
            isEditing={isEditMode}
            onChange={(val) =>
              updateExportSetting("includeNotes", val)
            }
          />

          {/* Approval History */}
          <EditableCheckboxField
            label="Include Approval History"
            icon="History"
            checked={exportSettings.includeApprovalHistory}
            isEditing={isEditMode}
            onChange={(val) =>
              updateExportSetting("includeApprovalHistory", val)
            }
          />

          {/* Alerts & Warnings */}
          <EditableCheckboxField
            label="Include Alerts / Warnings"
            icon="AlertTriangle"
            checked={exportSettings.includeAlerts}
            isEditing={isEditMode}
            onChange={(val) =>
              updateExportSetting("includeAlerts", val)
            }
          />

        </div>
      </CardWrapper>

      <CardWrapper
        title="Display Preferences"
        icon="Monitor"
        actions={
          <>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsEditMode(prev => !prev)}
              className="hover:bg-red-200 dark:hover:bg-red-800"
            >
              {isEditMode ? <X className="text-red-500" /> : <Pen />}
            </Button>

            {isEditMode && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                className="hover:bg-green-200 dark:hover:bg-green-800"
              >
                <Check className="text-green-500" />
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-3 gap-6">

          <EditableSelectField
            label="Default View"
            icon="Layout"
            value={displaySettings.defaultView}
            items={[
              { label: "List View", value: "list", icon: "List" },
              { label: "Single View", value: "single", icon: "Square" },
            ]}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("defaultView", val)
            }
          />

          <EditableSelectField
            label="Default Sort Field"
            icon="ArrowUpDown"
            value={displaySettings.defaultSortField}
            items={[
              { label: "Name", value: "name", icon: "User" },
              { label: "Total Hours", value: "hours", icon: "Clock" },
              { label: "Department", value: "department", icon: "Users" },
              { label: "Cost", value: "cost", icon: "DollarSign" },
              { label: "Submission Time", value: "submitted", icon: "Send" },
            ]}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("defaultSortField", val)
            }
          />

          <EditableSelectField
            label="Sort Direction"
            icon="ArrowDownUp"
            value={displaySettings.defaultSortDirection}
            items={[
              { label: "Ascending", value: "asc", icon: "ArrowUp" },
              { label: "Descending", value: "desc", icon: "ArrowDown" },
            ]}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("defaultSortDirection", val)
            }
          />

          <EditableTextDataField
            label="Rows Per Page"
            icon="Rows"
            value={displaySettings.rowsPerPage}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("rowsPerPage", Number(val))
            }
          />

          <EditableCheckboxField
            label="Week Comparison"
            icon="BarChart"
            checked={displaySettings.showComparisonByDefault}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("showComparisonByDefault", val)
            }
          />

          <EditableCheckboxField
            label="Department Progress"
            icon="TrendingUp"
            checked={displaySettings.showDepartmentProgress}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("showDepartmentProgress", val)
            }
          />

          <EditableCheckboxField
            label="Alert Icons"
            icon="AlertCircle"
            checked={displaySettings.showAlertIcons}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("showAlertIcons", val)
            }
          />

          <EditableCheckboxField
            label="Excessive Overtime"
            icon="ClockAlert"
            checked={displaySettings.highlightExcessiveOT}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("highlightExcessiveOT", val)
            }
          />

          <EditableCheckboxField
            label="Weekend Work"
            icon="Calendar"
            checked={displaySettings.highlightWeekendWork}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("highlightWeekendWork", val)
            }
          />

          <EditableCheckboxField
            label="Missing Breaks"
            icon="Coffee"
            checked={displaySettings.highlightMissingBreaks}
            isEditing={isEditMode}
            onChange={(val) =>
              updateDisplaySetting("highlightMissingBreaks", val)
            }
          />

        </div>
      </CardWrapper>

      <CardWrapper
        title="Allowance Limits"
        icon="CreditCard"
        actions={
          <>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsEditMode(prev => !prev)}
              className="hover:bg-red-200 dark:hover:bg-red-800"
            >
              {isEditMode ? <X className="text-red-500" /> : <Pen />}
            </Button>

            {isEditMode && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                className="hover:bg-green-200 dark:hover:bg-green-800"
              >
                <Check className="text-green-500" />
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-6">

          {[
            { key: "computer", label: "Computer", icon: "Monitor" },
            { key: "software", label: "Software", icon: "FileText" },
            { key: "equipment", label: "Equipment", icon: "Package" },
            { key: "box", label: "Box Rental", icon: "Box" },
            { key: "vehicle", label: "Vehicle", icon: "Truck" },
            { key: "mobile", label: "Mobile Phone", icon: "Smartphone" },
          ].map(({ key, label, icon }) => (
            <div
              key={key}
              className="grid grid-cols-[auto_1fr_1fr] gap-6 border-b border-dashed last:border-none pb-4"
            >
              <div className="flex items-center gap-2 min-w-[160px]">
                <span className='p-2 bg-primary/10 rounded-md'>
                  <SmartIcon icon={icon} size='md' className={"text-primary"} />
                </span>
                <span className="font-bold">{label}</span>
              </div>

              <EditableTextDataField
                label="Total Cap (£)"
                icon={icon}
                value={allowanceCaps[key]?.cap}
                isEditing={isEditMode}
                onChange={(val) =>
                  updateCap(key, "cap", Number(val))
                }
              />

              <EditableTextDataField
                label="Paid To Date (£)"
                icon="Wallet"
                value={allowanceCaps[key]?.paidTillDate}
                isEditing={isEditMode}
                onChange={(val) =>
                  updateCap(key, "paidTillDate", Number(val))
                }
              />
            </div>
          ))}

        </div>
      </CardWrapper>

    </div>
  )
}

export default TimesheetGeneralSettings