import { CheckCircle2, Clock, Circle, User, Calendar, AlertCircle, FileCheck, DollarSign, Users, PenTool, Building2 } from 'lucide-react';

export function CrewOfferWorkflowModal({ offer, isUserView = false }) {

  const getStageIcon = (stageName) => {
    switch (stageName) {
      case 'CREATE OFFER':
        return FileCheck;
      case 'PRODUCTION APPROVAL':
        return FileCheck;
      case 'ACCOUNTS APPROVAL':
        return DollarSign;
      case 'CREW APPROVAL':
        return Users;
      case 'PAYROLL APPROVAL':
        return FileCheck;
      case 'CREW SIGN':
        return PenTool;
      case 'PRODUCTION SIGN':
        return PenTool;
      case 'FINANCE SIGN':
        return DollarSign;
      case 'STUDIO SIGN':
        return Building2;
      default:
        return Circle;
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'PENDING':
        return 'purple';
      case 'REJECTED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const stages = [
    { name: 'CREATE OFFER', label: 'OFFER CREATED' },
    { name: 'PRODUCTION APPROVAL', label: 'PRODUCTION APPROVAL' },
    { name: 'ACCOUNTS APPROVAL', label: 'ACCOUNTS APPROVAL' },
    { name: 'CREW APPROVAL', label: 'CREW APPROVAL' },
    { name: 'PAYROLL APPROVAL', label: 'PAYROLL APPROVAL' },
    { name: 'CREW SIGN', label: 'CREW SIGNATURE' },
    { name: 'PRODUCTION SIGN', label: 'PRODUCTION SIGNATURE' },
    { name: 'FINANCE SIGN', label: 'FINANCE SIGNATURE' },
    { name: 'STUDIO SIGN', label: 'STUDIO SIGNATURE' }
  ];

  const getProgressPercentage = () => {
    const completedStages = stages.filter(
      stage => offer.stages[stage.name]?.status === 'APPROVED'
    ).length;
    return (completedStages / stages.length) * 100;
  };

  return (
    <div className={`p-6 rounded-xl border shadow-md space-y-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {isUserView ? 'YOUR OFFER STATUS' : 'OFFER WORKFLOW STATUS'}
          </h3>

          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <div><span className="font-bold">NAME:</span> {offer.fullName}</div>
            <div><span className="font-bold">POSITION:</span> {offer.position}</div>
            <div><span className="font-bold">DEPARTMENT:</span> {offer.department}</div>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
          <div className="font-bold mb-1">CURRENT STAGE</div>
          <div className="px-4 py-2 rounded-lg font-bold bg-[#faf5ff] text-[#9333ea] dark:bg-[#9333ea]/30 dark:text-[#c084fc]">
            {offer.currentStage}
          </div>
          <div className="mt-2 text-xs">
            LAST UPDATED: {offer.lastUpdated}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
            OVERALL PROGRESS
          </span>
          <span className="text-sm font-bold text-[#9333ea] dark:text-[#c084fc]">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-[#a855f7] to-[#9333ea] transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-gray-600 dark:text-gray-400">
          WORKFLOW TIMELINE
        </h4>

        <div className="relative">

          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          <div className="space-y-6">
            {stages.map((stage, index) => {
              const stageData = offer.stages[stage.name];
              const Icon = getStageIcon(stage.name);
              const color = getStageColor(stageData.status);

              return (
                <div key={stage.name} className="relative flex items-start gap-4">

                  {/* Icon */}
                  <div
                    className={`
                      relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center flex-shrink-0
                      ${stageData.status === 'APPROVED' ? `bg-${color}-500 border-${color}-400` : ''}
                      ${stageData.status === 'PENDING' ? `bg-${color}-600 border-${color}-500 animate-pulse` : ''}
                      ${stageData.status === 'REJECTED' ? `bg-${color}-500 border-${color}-400` : ''}
                      ${stageData.status === 'NOT_STARTED'
                        ? 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                        : ''
                      }
                    `}
                  >
                    {stageData.status === 'APPROVED' ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : stageData.status === 'PENDING' ? (
                      <Clock className="w-6 h-6 text-white" />
                    ) : stageData.status === 'REJECTED' ? (
                      <AlertCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-6 ${index === stages.length - 1 ? 'pb-0' : ''}`}>

                    <div className={`
                      p-4 rounded-lg border shadow-md
                      ${stageData.status === 'APPROVED'
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                        : ''}
                      ${stageData.status === 'PENDING'
                        ? 'bg-[#faf5ff] border-gray-100 dark:bg-[#9333ea]/20 dark:border-gray-200'
                        : ''}
                      ${stageData.status === 'REJECTED'
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                        : ''}
                      ${stageData.status === 'NOT_STARTED'
                        ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        : ''}
                    `}
                    >

                      {/* Stage Name */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-bold mb-1 text-gray-900 dark:text-white">
                            {stage.label}
                          </h5>

                          <div className={`
                            flex items-center gap-2 text-xs font-bold
                            ${stageData.status === 'APPROVED'
                              ? 'text-green-600'
                              : stageData.status === 'PENDING'
                              ? 'text-[#9333ea]'
                              : stageData.status === 'REJECTED'
                              ? 'text-red-600'
                              : 'text-gray-400 dark:text-gray-500'
                            }
                          `}>
                            {stageData.status === 'APPROVED' && '✓ APPROVED'}
                            {stageData.status === 'PENDING' && '⏳ PENDING'}
                            {stageData.status === 'REJECTED' && '✗ REJECTED'}
                            {stageData.status === 'NOT_STARTED' && '○ NOT STARTED'}
                          </div>
                        </div>
                      </div>

                      {/* Stage Details */}
                      {stageData.status !== 'NOT_STARTED' && (
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">

                          {/* Pending */}
                          {stageData.status === 'PENDING' && (
                            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/50">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-[#9333ea]" />
                                <span className="font-bold">ASSIGNED TO:</span>
                              </div>

                              <div className="ml-6 text-[#9333ea] dark:text-[#9333ea]">
                                {stageData.approver || 'PENDING ASSIGNMENT'}
                              </div>

                              {stageData.checkedBy && (
                                <div className="mt-2">
                                  <div className="text-xs text-gray-500">CURRENTLY REVIEWING</div>
                                  <div className="ml-6 text-xs text-gray-600 dark:text-gray-400">
                                    {stageData.checkedBy}
                                  </div>

                                  {stageData.checkDate && (
                                    <div className="flex items-center gap-2 ml-6 mt-1 text-xs">
                                      <Calendar className="w-3 h-3" />
                                      {stageData.checkDate}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Approved */}
                          {stageData.status === 'APPROVED' && (
                            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/50">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="font-bold">APPROVED BY:</span>
                              </div>

                              <div className="ml-6 text-green-600 dark:text-green-400">
                                {stageData.approver || 'SYSTEM'}
                              </div>

                              {stageData.date && (
                                <div className="flex items-center gap-2 ml-6 mt-2 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  {stageData.date}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rejected */}
                          {stageData.status === 'REJECTED' && (
                            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/50">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-red-600" />
                                <span className="font-bold">REJECTED BY:</span>
                              </div>

                              <div className="ml-6 text-red-600 dark:text-red-400">
                                {stageData.approver || 'SYSTEM'}
                              </div>

                              {stageData.date && (
                                <div className="flex items-center gap-2 ml-6 mt-2 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  {stageData.date}
                                </div>
                              )}

                              {stageData.rejectionReason && (
                                <div className="mt-2">
                                  <div className="text-xs font-bold text-gray-500">REASON:</div>
                                  <div className="ml-6 text-xs text-gray-600 dark:text-gray-400">
                                    {stageData.rejectionReason}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info for User */}
      {isUserView && (
        <div className="p-4 rounded-lg border shadow-md bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-bold mb-1">ABOUT THIS WORKFLOW</div>
              <div>
                Your offer is progressing through our approval workflow. You will be notified at each stage.
                Once all approvals are complete, you'll be able to review and sign your contract.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}








