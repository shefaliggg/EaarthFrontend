import React, { useState } from 'react'
import CardWrapper from '../../../../../shared/components/wrappers/CardWrapper'
import { SummaryEmailSection } from '../../components/timesheet-settings/SummaryEmailSection'
import { NotificationSection } from '../../components/timesheet-settings/NotificationSection'
import { HelpCircle, Plus } from 'lucide-react';
import { InfoTooltip } from '../../../../../shared/components/InfoTooltip';

function NotificationSettings() {
  const productionBaseEmail = {
    id: 'base',
    name: 'Production base email (default)',
    email: 'werwulfproduction@gmail.com',
    isDefault: true,
  };

  const [notifications, setNotifications] = useState({
    newOfferSent: [productionBaseEmail],
    offerAccepted: [productionBaseEmail],
    offerQueries: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
    ],
    noticeSentProduction: [
      productionBaseEmail,
      { id: '2', name: 'Sheerin Khosrowshahi-Miandoab', email: 'sheerinkm@gmail.com' },
    ],
    noticeSentAccounts: [
      { id: '3', name: 'Werwulf Payroll', email: 'werwulf.payroll@nbcufilms.com' },
    ],
    noticeQueries: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
    ],
    timecardQueries: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
      { id: '3', name: 'Werwulf Payroll', email: 'werwulf.payroll@nbcufilms.com' },
    ],
    timecardApprovalQueries: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
    ],
    timecardDateRequests: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
    ],
    notificationEmailQueries: [productionBaseEmail],
    payrollQueries: [
      { id: '3', name: 'Werwulf Payroll', email: 'werwulf.payroll@nbcufilms.com' },
    ],
    productionQueries: [
      productionBaseEmail,
      { id: '1', name: 'Deimante Kravcunaite', email: 'deimante.kravcunaite@nbcufilms.com' },
    ],
  });

  const [summaryEmails, setSummaryEmails] = useState({
    offersPendingProduction: [],
    offersPendingAccounts: [],
    unacceptedOffers: [
      {
        id: '1',
        name: 'Deimante Kravcunaite',
        email: 'deimante.kravcunaite@nbcufilms.com',
        days: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      },
      {
        id: '3',
        name: 'Werwulf Payroll',
        email: 'werwulf.payroll@nbcufilms.com',
        days: { monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false, sunday: false },
      },
    ],
    timecardsPendingProduction: [],
    timecardsPendingAccounts: [],
    timecardsPendingDepartment: [],
  });

  return (
    <div className='container mx-auto space-y-6'>
      <CardWrapper
        title="Notifications"
        description='Manage who receives email notifications of these events. (Production base email address is used if no other email is added.)'
        icon="Bell"
        variant='ghost'
      >
        <div className='space-y-6'>
          {/* Offers Section */}
          <div className={`bg-card rounded-lg p-6 border `}>
            <h3 className={`text-lg mb-6 `}>
              Offers
            </h3>

            <div className="space-y-6">
              <NotificationSection
                title="New offer sent"
                description="A new offer is sent to crew (inc. revised, replaced)"
                recipients={notifications.newOfferSent}
                notificationType="newOfferSent"
              />

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Offer is accepted"
                  recipients={notifications.offerAccepted}
                  notificationType="offerAccepted"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Offer queries"
                  recipients={notifications.offerQueries}
                  notificationType="offerQueries"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Notice sent (Production copy)"
                  description="A contract is ended"
                  recipients={notifications.noticeSentProduction}
                  notificationType="noticeSentProduction"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Notice sent (Accounts copy)"
                  description="A contract is ended"
                  recipients={notifications.noticeSentAccounts}
                  notificationType="noticeSentAccounts"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Notice queries"
                  recipients={notifications.noticeQueries}
                  notificationType="noticeQueries"
                />
              </div>
            </div>
          </div>

          {/* Timecards Section */}
          <div className={`bg-card rounded-lg p-6 border `}>
            <h3 className={`text-lg mb-6 `}>
              Timecards
            </h3>

            <div className="space-y-6">
              <NotificationSection
                title="Timecard queries"
                recipients={notifications.timecardQueries}
                notificationType="timecardQueries"
              />

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Timecard approval queries"
                  description="Queries from department approvers"
                  recipients={notifications.timecardApprovalQueries}
                  notificationType="timecardApprovalQueries"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Timecard date requests"
                  description="Requests for timecard dates earlier than offer start date"
                  recipients={notifications.timecardDateRequests}
                  notificationType="timecardDateRequests"
                />
              </div>
            </div>
          </div>

          {/* General Section */}
          <div className={`bg-card rounded-lg p-6 border `}>
            <h3 className={`text-lg mb-6 `}>
              General
            </h3>

            <div className="space-y-6">
              <NotificationSection
                title="Notification email queries"
                description="Queries about receiving Notification emails"
                recipients={notifications.notificationEmailQueries}
                notificationType="notificationEmailQueries"
              />

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Payroll queries"
                  recipients={notifications.payrollQueries}
                  notificationType="payrollQueries"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <NotificationSection
                  title="Production queries"
                  recipients={notifications.productionQueries}
                  notificationType="productionQueries"
                />
              </div>
            </div>
          </div>

          {/* Summary Emails Section */}
          <div className={`bg-card rounded-lg p-6 border `}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={`text-lg mb-2 `}>
                  Summary emails
                </h3>
                <div className="flex items-center gap-2">
                  <p className={`text-sm text-muted-foreground`}>Summary email sent at:</p>
                  <InfoTooltip
                    content="All summary emails will be sent at the same time on each day as specified when assigning the recipient."
                  >
                    <HelpCircle className="size-4" />
                  </InfoTooltip>

                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium">
                Save
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm font-medium flex items-center gap-2">
                <Plus className="size-4" />
                Assign summary email(s)
              </button>
              <InfoTooltip
                content="The Offer summary shows the number of offers pending approval at the specified level. The Timecard summary show the number of timecards pending approval for each week at the specified level."
              >
                <HelpCircle className="size-4" />
              </InfoTooltip>
            </div>

            <div className="space-y-6">
              <SummaryEmailSection
                title="Offers pending Production approval"
                recipients={summaryEmails.offersPendingProduction}
                summaryType="offersPendingProduction"
              />

              <div className={`border-t  pt-6`}>
                <SummaryEmailSection
                  title="Offers pending Accounts approval"
                  recipients={summaryEmails.offersPendingAccounts}
                  summaryType="offersPendingAccounts"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <SummaryEmailSection
                  title="Unaccepted offers with start dates that have passed"
                  recipients={summaryEmails.unacceptedOffers}
                  summaryType="unacceptedOffers"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <SummaryEmailSection
                  title="Timecards pending Production approval"
                  recipients={summaryEmails.timecardsPendingProduction}
                  summaryType="timecardsPendingProduction"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <SummaryEmailSection
                  title="Timecards pending Accounts approval"
                  recipients={summaryEmails.timecardsPendingAccounts}
                  summaryType="timecardsPendingAccounts"
                />
              </div>

              <div className={`border-t  pt-6`}>
                <SummaryEmailSection
                  title="Timecards pending Department approval"
                  recipients={summaryEmails.timecardsPendingDepartment}
                  summaryType="timecardsPendingDepartment"
                />
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    </div>
  )
}

export default NotificationSettings