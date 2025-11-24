import { useState } from 'react';
import { Plus, X, Info, Check, Mail, Bell, CheckCircle2, Clock, FileCheck, Users, DollarSign, PenTool, Building2, Eye } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import FilterPillTabs from '../../../shared/components/FilterPillTabs';
import { Button } from '../../../shared/components/ui/button';
import NewOfferModal from '../components/CrewNewOfferModal';
import CrewOfferSendSuccessModal from '../components/CrewOfferSendSuccessModal';
import OnboardingStageDetailedView from '../components/OnboardingStageDetailedView';
import CrewOfferConfiguration from '../components/CrewOfferConfiguration';

function ProjectOnboarding() {
  const [activeTab, setActiveTab] = useState('production-approval');
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [offers, setOffers] = useState([
    {
      id: '1',
      fullName: 'ASHLEIGH SHUTTLEWORTH',
      email: 'ASHLEIGH7822@GMAIL.COM',
      phoneNumber: '07917130911',
      position: 'ASSISTANT LOCATION MANAGER',
      department: 'LOCATIONS',
      startDate: '10 NOV 2025',
      endDate: '19 DEC 2025',
      rate: '£1,750.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '11 NOV 2025, 13:00',
      currentStage: 'PRODUCTION APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '10 NOV 2025, 10:00' },
        'PRODUCTION APPROVAL': { status: 'PENDING', approver: 'PRODUCTION MANAGER', checkedBy: 'JAMES MITCHELL', checkDate: '11 NOV 2025, 12:30' },
        'ACCOUNTS APPROVAL': { status: 'NOT_STARTED' },
        'CREW APPROVAL': { status: 'NOT_STARTED' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    },
    {
      id: '2',
      fullName: 'JOHN WILLIAMS',
      email: 'JOHN.WILLIAMS@EMAIL.COM',
      phoneNumber: '07123456789',
      position: 'DIRECTOR OF PHOTOGRAPHY',
      department: 'CAMERA',
      startDate: '01 OCT 2025',
      endDate: '30 DEC 2025',
      rate: '£3,500.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '05 NOV 2025, 09:30',
      currentStage: 'ACCOUNTS APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '01 OCT 2025, 09:00' },
        'PRODUCTION APPROVAL': { status: 'APPROVED', approver: 'JAMES MITCHELL', date: '02 OCT 2025, 11:00' },
        'ACCOUNTS APPROVAL': { status: 'PENDING', approver: 'RACHEL THOMPSON', checkedBy: 'RACHEL THOMPSON', checkDate: '05 NOV 2025, 08:45' },
        'CREW APPROVAL': { status: 'NOT_STARTED' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    },
    {
      id: '3',
      fullName: 'SARAH MARTINEZ',
      email: 'SARAH.M@EMAIL.COM',
      phoneNumber: '07987654321',
      position: 'PRODUCTION DESIGNER',
      department: 'ART',
      startDate: '15 NOV 2025',
      endDate: '15 JAN 2026',
      rate: '£2,800.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '08 NOV 2025, 14:45',
      currentStage: 'CREW APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '08 NOV 2025, 09:00' },
        'PRODUCTION APPROVAL': { status: 'APPROVED', approver: 'JAMES MITCHELL', date: '08 NOV 2025, 10:30' },
        'ACCOUNTS APPROVAL': { status: 'APPROVED', approver: 'RACHEL THOMPSON', date: '08 NOV 2025, 12:00' },
        'CREW APPROVAL': { status: 'PENDING', approver: 'SARAH MARTINEZ', checkedBy: 'SARAH MARTINEZ', checkDate: '08 NOV 2025, 14:30' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    }
  ]);

  const STAGE_FLOW = {
    "PRODUCTION APPROVAL": {
      next: "ACCOUNTS APPROVAL",
      approver: "PRODUCTION MANAGER"
    },
    "ACCOUNTS APPROVAL": {
      next: "CREW APPROVAL",
      approver: "ACCOUNTS MANAGER"
    },
    "CREW APPROVAL": {
      next: "PAYROLL APPROVAL",
      approver: "CREW MEMBER"
    },
    "PAYROLL APPROVAL": {
      next: "CREW SIGN",
      approver: "PAYROLL MANAGER"
    },
    "CREW SIGN": {
      next: "PRODUCTION SIGN",
      approver: "CREW MEMBER"
    },
    "PRODUCTION SIGN": {
      next: "FINANCE SIGN",
      approver: "PRODUCTION MANAGER"
    },
    "FINANCE SIGN": {
      next: "STUDIO SIGN",
      approver: "FINANCE MANAGER"
    },
    "STUDIO SIGN": {
      next: "COMPLETED",
      approver: "STUDIO EXECUTIVE"
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    isViaAgent: false,
    alternativeContract: '',
    allowSelfEmployed: 'YES',
    statusDeterminationReason: '',
    otherStatusReason: '',
    otherDealProvisions: '',
    additionalNotes: '',
  });

  const handleSave = () => {
    setShowNewOfferForm(false);
    setShowSuccessModal(true);
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      isViaAgent: false,
      alternativeContract: '',
      allowSelfEmployed: 'YES',
      statusDeterminationReason: '',
      otherStatusReason: '',
      otherDealProvisions: '',
      additionalNotes: '',
    });
  };

  function handleStageSend(offerId, stageName, offers, setOffers) {
    const offerIndex = offers.findIndex(o => o.id === offerId);
    if (offerIndex === -1) return;

    const stageInfo = STAGE_FLOW[stageName];
    if (!stageInfo) return;

    const newOffers = [...offers];
    const offer = newOffers[offerIndex];

    // Mark current stage approved
    offer.stages[stageName] = {
      status: "APPROVED",
      approver: stageInfo.approver,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).toUpperCase()
    };

    // Move to next stage
    offer.currentStage = stageInfo.next;

    // If next stage exists, mark as PENDING
    if (stageInfo.next !== "COMPLETED") {
      offer.stages[stageInfo.next].status = "PENDING";
    }

    setOffers(newOffers);

    alert(`✅ ${stageName} APPROVED!\n➡️ MOVED TO ${stageInfo.next}`);
  }

  const filters = [
    { value: 'production-approval', label: 'PRODUCTION APPROVAL' },
    { value: 'accounts-approval', label: 'ACCOUNTS APPROVAL' },
    { value: 'crew-approval', label: 'CREW APPROVAL' },
    { value: 'payroll-approval', label: 'PAYROLL APPROVAL' },
    { value: 'crew-sign', label: 'CREW SIGN' },
    { value: 'production-sign', label: 'PRODUCTION SIGN' },
    { value: 'finance-sign', label: 'FINANCE SIGN' },
    { value: 'studio-sign', label: 'STUDIO SIGN' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          CREW ONBOARDING
        </h2>
        {!showNewOfferForm && activeTab === 'production-approval' && (
          <Button
            onClick={() => setShowNewOfferForm(true)}
          >
            <Plus className="w-5 h-5" />
            NEW OFFER
          </Button>
        )}
      </div>

      {/* WORKFLOW PROGRESS TRACKER */}
      <div className="p-6 rounded-xl border bg-gradient-to-br from-[#ede7f6] to-blue-50 dark:from-gray-800/50 dark:to-gray-800/30 border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">
            ONBOARDING WORKFLOW PROGRESS
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">COMPLETED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7e57c2] animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">IN PROGRESS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400">PENDING</span>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="relative">
          <div className="absolute top-[52px] left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute top-[52px] left-0 h-1 bg-gradient-to-r from-green-500 to-[#7e57c2] transition-all duration-500"
            style={{ width: '22%' }}
          ></div>

          {/* Workflow Stages */}
          <div className="grid grid-cols-8 gap-4 relative">
            {[
              { id: 'production-approval', icon: FileCheck, label: 'PRODUCTION\nAPPROVAL' },
              { id: 'accounts-approval', icon: DollarSign, label: 'ACCOUNTS\nAPPROVAL' },
              { id: 'crew-approval', icon: Users, label: 'CREW\nAPPROVAL' },
              { id: 'payroll-approval', icon: FileCheck, label: 'PAYROLL\nAPPROVAL' },
              { id: 'crew-sign', icon: PenTool, label: 'CREW\nSIGN' },
              { id: 'production-sign', icon: PenTool, label: 'PRODUCTION\nSIGN' },
              { id: 'finance-sign', icon: DollarSign, label: 'FINANCE\nSIGN' },
              { id: 'studio-sign', icon: Building2, label: 'STUDIO\nSIGN' },
            ].map((stage, idx) => {
              const IconComponent = stage.icon;
              const isActive = activeTab === stage.id;
              const isComplete = stage.id === "production-approval"
              const isOngoing = stage.id === "production-approval"
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveTab(stage.id)}
                    className={`relative w-[104px] h-[104px] z-1 rounded-3xl border-2 flex flex-col gap-2 items-center justify-center mb-3 transition-all ${isComplete
                      ? "bg-green-500 border-green-600"
                      : isActive
                        ? 'bg-[#ede7f6] border-gray-200 shadow-lg shadow-[#9575cd]/50'
                        : 'bg-[#ede7f6] border-gray-100 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                  >
                    <IconComponent className={`w-8 h-8 mb-1 text-bold ${isComplete ? " text-white" : isActive ? 'text-[#7e57c2]' : isActive ? 'text-white' : 'dark:text-gray-400 text-gray-400'}`} />
                    <span className={`text-xs font-bold text-center leading-tight ${isComplete ? "text-white" : isActive ? 'text-[#7e57c2]' : 'dark:text-gray-400 text-gray-600'}`}>
                      {stage.label}
                    </span>
                    {isOngoing &&
                      <div className='absolute -z-10 -top-1.1 -left-1.1 w-[102%] h-[102%] rounded-3xl bg-[#7e57c2] animate-pulse'></div>
                    }
                  </button>
                  <div className="text-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    STEP {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          {[
            { icon: Eye, label: 'TOTAL OFFERS', value: offers.length, color: 'blue' },
            { icon: CheckCircle2, label: 'COMPLETED', value: 0, color: 'green' },
            { icon: Clock, label: 'IN PROGRESS', value: offers.length, color: 'purple' },
            { icon: Users, label: 'AWAITING ACTION', value: offers.filter(o => o.currentStage === 'PRODUCTION APPROVAL').length, color: 'orange' },
          ].map((stat) => {
            const colorMap = {
              blue: { bg: 'bg-blue-100 dark:bg-blue-900', icon: 'text-blue-600 dark:text-blue-400' },
              green: { bg: 'bg-green-100 dark:bg-green-900', icon: 'text-green-600 dark:text-green-400' },
              purple: { bg: 'bg-[#ede7f6] dark:bg-gray-900', icon: 'text-[#7e57c2] dark:text-[#b39ddb]' },
              orange: { bg: 'bg-orange-100 dark:bg-orange-900', icon: 'text-orange-600 dark:text-orange-400' },
            };
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="p-4 rounded-lg bg-white dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${colorMap[stat.color].bg} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${colorMap[stat.color].icon}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      {activeTab !== 'edit-offer' && (
        <div className="py-4">
          <FilterPillTabs
            options={filters}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
      )}

      {/* PRODUCTION APPROVAL */}
      {activeTab === 'production-approval' && (
        <OnboardingStageDetailedView
          stageName="PRODUCTION APPROVAL"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "PRODUCTION APPROVAL",
            offers,
            setOffers
          )}
        />
      )}

      {/* ACCOUNTS APPROVAL */}
      {activeTab === 'accounts-approval' && (
        <OnboardingStageDetailedView
          stageName="ACCOUNTS APPROVAL"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "ACCOUNTS APPROVAL",
            offers,
            setOffers
          )}
        />
      )}

      {/* CREW APPROVAL */}
      {activeTab === 'crew-approval' && (
        <OnboardingStageDetailedView
          stageName="CREW APPROVAL"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "CREW APPROVAL",
            offers,
            setOffers
          )}
        />
      )}

      {/* PAYROLL APPROVAL */}
      {activeTab === 'payroll-approval' && (
        <OnboardingStageDetailedView
          stageName="PAYROLL APPROVAL"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "PAYROLL APPROVAL",
            offers,
            setOffers
          )}
        />
      )}

      {/* CREW SIGN */}
      {activeTab === 'crew-sign' && (
        <OnboardingStageDetailedView
          stageName="CREW SIGN"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "CREW SIGN",
            offers,
            setOffers
          )}
        />
      )}

      {/* PRODUCTION SIGN */}
      {activeTab === 'production-sign' && (
        <OnboardingStageDetailedView
          stageName="PRODUCTION SIGN"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "PRODUCTION SIGN",
            offers,
            setOffers
          )}
        />
      )}

      {/* FINANCE SIGN */}
      {activeTab === 'finance-sign' && (
        <OnboardingStageDetailedView
          stageName="FINANCE SIGN"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "FINANCE SIGN",
            offers,
            setOffers
          )}
        />
      )}

      {/* STUDIO SIGN */}
      {activeTab === 'studio-sign' && (
        <OnboardingStageDetailedView
          stageName="STUDIO SIGN"
          offers={offers}
          onEdit={(offerId) => {
            setSelectedOffer(offers.find(o => o.id === offerId));
            setActiveTab('edit-offer');
          }}
          onSend={(offerId) => handleStageSend(
            offerId,
            "STUDIO SIGN",
            offers,
            setOffers
          )}
        />
      )}

      {activeTab === 'edit-offer' && selectedOffer && (
        <CrewOfferConfiguration
          onBack={() => setActiveTab('production-approval')}
        />
      )}

      {/* New Offer Form Modal */}
      {showNewOfferForm && (
        <NewOfferModal isOpen={showNewOfferForm} onClose={() => setShowNewOfferForm(false)} onSave={handleSave} />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <CrewOfferSendSuccessModal formData={formData} />
      )}
    </div>
  );
}

export default ProjectOnboarding;



