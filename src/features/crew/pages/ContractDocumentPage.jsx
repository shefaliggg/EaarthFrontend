import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContractDocument from './ContractDocument';
import { Button } from "../../../shared/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { getMockOfferById } from '../mocks/mockOffers'; // Updated import

export default function ContractDocumentPage() {
  const { projectName, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine mode from route
  const mode = location.pathname.includes('/sign') ? 'sign' : 'view';

  // Fetch offer data using the helper function
  const offer = getMockOfferById(id);

  const [isPending, setIsPending] = useState(false);

  if (!offer) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Offer not found</p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate(`/projects/${projectName}/offers`)}>
              Back to Offers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine current signer based on offer status
  const getCurrentSigner = () => {
    if (offer.status === 'PENDING_CREW_SIGNATURE') return 'crew';
    if (offer.status === 'PENDING_UPM_SIGNATURE') return 'upm';
    if (offer.status === 'PENDING_FC_SIGNATURE') return 'fc';
    if (offer.status === 'PENDING_STUDIO_SIGNATURE') return 'studio';
    return null;
  };

  const handleSign = async (signerType, signatureData) => {
    console.log(`${signerType} signed:`, signatureData);
    setIsPending(true);

    try {
      // TODO: Make API call to save signature
      // await api.saveSignature(id, signerType, signatureData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message (you can add a toast notification here)
      console.log('Contract signed successfully!');

      // Navigate back to view offer page after signing
      navigate(`/projects/${projectName}/offers/${id}/view`);
    } catch (error) {
      console.error('Error signing contract:', error);
      // Show error message (you can add a toast notification here)
    } finally {
      setIsPending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Download PDF');
  };

  return (
    <div className="">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/projects/${projectName}/offers/${id}/view`)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Offer
            </Button>
            <span>/</span>
            <span className="font-medium text-foreground">
              {mode === 'sign' ? 'Sign Contract' : 'View Signed Contract'}
            </span>
          </div>

          {mode === 'view' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          )}
        </div>

        {/* Contract Document */}
        <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
          <ContractDocument
            offer={offer}
            currentSigner={getCurrentSigner()}
            onSign={handleSign}
            isPending={isPending}
            mode={mode}
          />
        </div>

        {isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <p className="text-lg font-semibold">Processing signature...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}