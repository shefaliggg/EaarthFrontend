import { useState } from 'react';
import { Edit, Send, Eye, Check, X, GitBranch } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import CrewOfferSendSuccessModal from './CrewOfferSendSuccessModal';
import { CrewOfferWorkflowModal } from './CrewOfferWorkflowModal';

function OnboardingStageDetailedView({ stageName, offers, onEdit, onSend }) {
    const [selectedOffers, setSelectedOffers] = useState(new Set());
    const [workflowModalOffer, setWorkflowModalOffer] = useState(null);

    const pendingOffers = offers.filter(offer => offer.currentStage === stageName);
    const completedOffers = offers.filter(
        offer => offer.stages[stageName]?.status === 'APPROVED' && offer.currentStage !== stageName
    );

    const handleSelectOffer = (offerId) => {
        const newSelected = new Set(selectedOffers);
        newSelected.has(offerId) ? newSelected.delete(offerId) : newSelected.add(offerId);
        setSelectedOffers(newSelected);
    };

    const handleSendSelected = () => {
        if (selectedOffers.size === 0) {
            alert('PLEASE SELECT AT LEAST ONE OFFER TO SEND');
            return;
        }
        selectedOffers.forEach(offerId => onSend(offerId));
        setSelectedOffers(new Set());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {stageName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pendingOffers.length} PENDING • {completedOffers.length} COMPLETED
                    </p>
                </div>

                {selectedOffers.size > 0 && (
                    <Button
                        onClick={handleSendSelected}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        SEND SELECTED ({selectedOffers.size})
                    </Button>
                )}
            </div>

            {/* Pending Offers */}
            {pendingOffers.length > 0 && (
                <div className="rounded-xl border p-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h4 className="text-lg font-bold mb-4 text-yellow-700 dark:text-yellow-400">
                        ⏳ PENDING APPROVAL
                    </h4>

                    <div className="space-y-3">
                        {pendingOffers.map(offer => (
                            <div
                                key={offer.id}
                                className={`p-4 rounded-lg border transition ${selectedOffers.has(offer.id)
                                    ? 'border-gray-300 bg-[#ede7f6] dark:bg-[#7e57c2]/30'
                                    : 'bg-yellow-50 border-yellow-200 dark:bg-gray-900 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedOffers.has(offer.id)}
                                        onChange={() => handleSelectOffer(offer.id)}
                                        className="w-5 h-5 mt-1 rounded border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]"
                                    />

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h5 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {offer.fullName}
                                            </h5>
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700">
                                                AWAITING YOUR APPROVAL
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-400">
                                            <p><span className="font-bold">POSITION:</span> {offer.position}</p>
                                            <p><span className="font-bold">DEPARTMENT:</span> {offer.department}</p>
                                            <p><span className="font-bold">START:</span> {offer.startDate}</p>
                                            <p><span className="font-bold">END:</span> {offer.endDate}</p>
                                            <p><span className="font-bold">RATE:</span> {offer.rate}</p>
                                            <p><span className="font-bold">EMAIL:</span> {offer.email}</p>
                                        </div>

                                        <p className="text-xs mt-2 text-gray-500">
                                            Last updated: {offer.lastUpdated}
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => setWorkflowModalOffer(offer)}
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            <GitBranch className="w-4 h-4 mr-1" />
                                            WORKFLOW
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => onEdit(offer.id)}
                                            variant="outline"
                                            className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            EDIT
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => onSend(offer.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Send className="w-4 h-4 mr-1" />
                                            SEND
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed */}
            {completedOffers.length > 0 && (
                <div className="rounded-xl border p-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h4 className="text-lg font-bold mb-4 text-green-700 dark:text-green-400">
                        ✅ COMPLETED
                    </h4>

                    <div className="space-y-3">
                        {completedOffers.map(offer => (
                            <div
                                key={offer.id}
                                className="p-4 rounded-lg border bg-green-50 border-green-200 dark:bg-gray-900 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h5 className="font-bold text-gray-900 dark:text-white">
                                                {offer.fullName}
                                            </h5>
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                                                ✓ APPROVED
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <p>
                                                <span className="font-bold">POSITION:</span> {offer.position} • {offer.department}
                                            </p>
                                            <p><span className="font-bold">APPROVED:</span> {offer.stages[stageName]?.date || 'N/A'}</p>
                                            <p><span className="font-bold">BY:</span> {offer.stages[stageName]?.approver || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => setWorkflowModalOffer(offer)}
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            <GitBranch className="w-4 h-4 mr-1" />
                                            WORKFLOW
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => onEdit(offer.id)}
                                            variant="outline"
                                            className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            VIEW
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {pendingOffers.length === 0 && completedOffers.length === 0 && (
                <div className="rounded-xl border-2 border-dashed p-16 text-center border-gray-300 dark:border-gray-700">
                    <Check className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-xl font-bold mb-2 text-gray-600 dark:text-gray-400">
                        NO OFFERS AT THIS STAGE
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        OFFERS WILL APPEAR HERE WHEN THEY REACH THIS APPROVAL STAGE
                    </p>
                </div>
            )}

            {/* Workflow Modal */}
            {workflowModalOffer && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setWorkflowModalOffer(null)}
                >
                    <div
                        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-100 flex items-center justify-between p-6 border-b bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                OFFER WORKFLOW STATUS
                            </h3>
                            <button
                                onClick={() => setWorkflowModalOffer(null)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <CrewOfferWorkflowModal offer={workflowModalOffer} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OnboardingStageDetailedView;



