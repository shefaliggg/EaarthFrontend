import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Send,
  UserCheck,
  DollarSign,
  PenTool,
  Building2,
  Star,
  Clock,
  Download,
  Filter,
  XCircle,
  FileX
} from "lucide-react";

// Import reusable components
import { PageHeader } from '@/shared/components/PageHeader';
import SearchBar from '@/shared/components/SearchBar';
import PrimaryStats  from '../../../../shared/components/wrappers/PrimaryStats';
import { WorkflowStages } from '../../../projects/components/WorkflowStages';
import { OffersTable } from '../../../projects/components/OffersTable.jsx';

const WORKFLOW_STATS = [
  { 
    label: "All Contracts", 
    value: 802, 
    icon: FileText, 
    color: "text-slate-600", 
    trend: "+12%",
    trendIcon: "TrendingUp",
    trendColor: "text-green-500"
  },
  { 
    label: "Pending", 
    value: 156, 
    icon: Clock, 
    color: "text-amber-600", 
    bgColor: "bg-amber-50 dark:bg-amber-900/20", 
    trend: "+5%",
    trendIcon: "TrendingUp",
    trendColor: "text-amber-500"
  },
  { 
    label: "Accepted", 
    value: 624, 
    icon: CheckCircle, 
    color: "text-green-600", 
    bgColor: "bg-green-50 dark:bg-green-900/20", 
    trend: "+8%",
    trendIcon: "TrendingUp",
    trendColor: "text-green-500"
  },
  { 
    label: "Rejected", 
    value: 22, 
    icon: XCircle, 
    color: "text-red-600", 
    bgColor: "bg-red-50 dark:bg-red-900/20", 
    trend: "-3%",
    trendIcon: "TrendingUp",
    trendColor: "text-red-500"
  },
  { 
    label: "Ended", 
    value: 178, 
    icon: FileX, 
    color: "text-slate-500", 
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    trend: "-2%",
    trendIcon: "TrendingUp",
    trendColor: "text-red-500"
  },
];

const WORKFLOW_STAGES = [
  { label: "Offer Sent", statusKey: "OFFER SENT", icon: Send, color: "text-blue-600" },
  { label: "Crew Accepted", statusKey: "CREW ACCEPTED", icon: UserCheck, color: "text-green-600" },
  { label: "Production Check", statusKey: "PRODUCTION CHECK", icon: CheckCircle, color: "text-green-500" },
  { label: "Accounts Checks", statusKey: "ACCOUNTS CHECK", icon: DollarSign, color: "text-emerald-600" },
  { label: "Crew Sign", statusKey: "CREW SIGN", icon: PenTool, color: "text-orange-500" },
  { label: "UPM Sign", statusKey: "UPM SIGN", icon: PenTool, color: "text-purple-500" },
  { label: "FC Sign", statusKey: "FC SIGN", icon: Building2, color: "text-blue-500" },
  { label: "Studio Sign", statusKey: "STUDIO SIGN", icon: Star, color: "text-pink-500" },
];

const ROLE_PAGE_TITLES = {
  CREW: "My Offers",
  PRODUCTION_ADMIN: "Crew Onboarding",
  ACCOUNTS_ADMIN: "Accounts Review",
  UPM: "Contracts Awaiting UPM Approval",
  FC: "Contracts Awaiting FC Approval",
  STUDIO: "Contracts Awaiting Studio Approval",
};

function getStatusLabel(status) {
  const labels = {
    "DRAFT": "DRAFT",
    "SENT_TO_CREW": "OFFER SENT",
    "NEEDS_REVISION": "REQUIRES ATTENTION",
    "CREW_ACCEPTED": "CREW ACCEPTED",
    "PRODUCTION_CHECK": "PRODUCTION CHECK",
    "ACCOUNTS_CHECK": "ACCOUNTS CHECK",
    "PENDING_CREW_SIGNATURE": "CREW SIGN",
    "PENDING_UPM_SIGNATURE": "UPM SIGN",
    "PENDING_FC_SIGNATURE": "FC SIGN",
    "PENDING_STUDIO_SIGNATURE": "STUDIO SIGN",
    "COMPLETED": "CONTRACTED",
  };
  return labels[status] || status;
}

export default function ProjectOnboarding() {
  const navigate = useNavigate();
  const { projectName } = useParams(); // Get projectName from URL params
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState(null);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRole = "PRODUCTION_ADMIN";

  useEffect(() => {
    const mockOffers = [
      { id: 1, fullName: "John Smith", status: "SENT_TO_CREW", roles: [{ jobTitle: "Director of Photography", department: "Camera", rateType: "Weekly" }], contractType: "LOAN_OUT", productionName: "Project Alpha" },
      { id: 2, fullName: "Sarah Johnson", status: "CREW_ACCEPTED", roles: [{ jobTitle: "Production Designer", department: "Art", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Beta" },
      { id: 3, fullName: "Mike Chen", status: "PRODUCTION_CHECK", roles: [{ jobTitle: "Sound Mixer", department: "Sound", rateType: "Daily" }], contractType: "LOAN_OUT", productionName: "Project Gamma" },
      { id: 4, fullName: "Emily Davis", status: "ACCOUNTS_CHECK", roles: [{ jobTitle: "Costume Designer", department: "Wardrobe", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Delta" },
      { id: 5, fullName: "Robert Wilson", status: "PENDING_CREW_SIGNATURE", roles: [{ jobTitle: "Gaffer", department: "Electric", rateType: "Daily" }], contractType: "LOAN_OUT", productionName: "Project Epsilon" },
      { id: 6, fullName: "Lisa Anderson", status: "PENDING_UPM_SIGNATURE", roles: [{ jobTitle: "Key Grip", department: "Grip", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Zeta" },
      { id: 7, fullName: "David Martinez", status: "PENDING_FC_SIGNATURE", roles: [{ jobTitle: "1st AD", department: "Production", rateType: "Weekly" }], contractType: "LOAN_OUT", productionName: "Project Eta" },
      { id: 8, fullName: "Jennifer Taylor", status: "PENDING_STUDIO_SIGNATURE", roles: [{ jobTitle: "Editor", department: "Post Production", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Theta" },
      { id: 9, fullName: "James Brown", status: "COMPLETED", roles: [{ jobTitle: "Script Supervisor", department: "Production", rateType: "Daily" }], contractType: "LOAN_OUT", productionName: "Project Iota" },
      { id: 10, fullName: "Maria Garcia", status: "SENT_TO_CREW", roles: [{ jobTitle: "Makeup Artist", department: "Hair & Makeup", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Kappa" },
      { id: 11, fullName: "Thomas Lee", status: "CREW_ACCEPTED", roles: [{ jobTitle: "VFX Supervisor", department: "Visual Effects", rateType: "Weekly" }], contractType: "LOAN_OUT", productionName: "Project Lambda" },
      { id: 12, fullName: "Amanda White", status: "PRODUCTION_CHECK", roles: [{ jobTitle: "Location Manager", department: "Locations", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Mu" },
      { id: 13, fullName: "Christopher Harris", status: "DRAFT", roles: [{ jobTitle: "Stunt Coordinator", department: "Stunts", rateType: "Daily" }], contractType: "LOAN_OUT", productionName: "Project Nu" },
      { id: 14, fullName: "Jessica Martin", status: "NEEDS_REVISION", roles: [{ jobTitle: "Casting Director", department: "Casting", rateType: "Weekly" }], contractType: "PAYE", productionName: "Project Xi" },
      { id: 15, fullName: "Daniel Thompson", status: "COMPLETED", roles: [{ jobTitle: "Cinematographer", department: "Camera", rateType: "Weekly" }], contractType: "LOAN_OUT", productionName: "Project Omicron" },
    ];
    
    setOffers(mockOffers);
  }, []);

  const filteredOffers = useMemo(() => {
    let result = offers;
    
    if (searchQuery) {
      result = result.filter(offer =>
        offer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (offer.roles && Array.isArray(offer.roles) && offer.roles.some((r) => 
          (r?.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r?.department || "").toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (offer.productionName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedStage !== null) {
      result = result.filter(offer => getStatusLabel(offer.status) === selectedStage);
    }
    
    return result;
  }, [searchQuery, selectedStage, offers]);

  const statusCounts = useMemo(() => {
    const counts = {};
    offers.forEach(offer => {
      const label = getStatusLabel(offer.status);
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [offers]);

  const handleStageClick = (stage) => {
    setSelectedStage(selectedStage === stage.statusKey ? null : stage.statusKey);
  };

  // Fixed navigation function
  const handleCreateOffer = () => {
    if (projectName) {
      // Navigate to createoffers within the current project context
      navigate(`/projects/${projectName}/createoffers`);
    } else {
      // Fallback if projectName is not available
      navigate('/projects/createoffers');
    }
  };

  return (
    <div className="">
      <div className="space-y-6">
        <PageHeader
          title={ROLE_PAGE_TITLES[selectedRole] || "CREW ONBOARDING"}
          subtitle="Viewing as: Production Admin"
          icon="Users"
          primaryAction={{
            label: "Create Offer",
            icon: "Plus",
            variant: "default",
            clickAction: handleCreateOffer, // Use the fixed handler
          }}
        />

        <PrimaryStats stats={WORKFLOW_STATS} gridColumns={5} />

        <WorkflowStages 
          stages={WORKFLOW_STAGES}
          statusCounts={statusCounts}
          selectedStage={selectedStage}
          onStageClick={handleStageClick}
        />

        <Card className="border-0 shadow-sm">
          <CardContent className="">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <SearchBar
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onValueChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 w-full sm:max-w-md"
              />
              <div className="flex gap-2">
                {selectedStage && (
                  <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                    {WORKFLOW_STAGES.find(s => s.statusKey === selectedStage)?.label || selectedStage}
                    <button onClick={() => setSelectedStage(null)} className="ml-1 hover:text-primary/70">×</button>
                  </Badge>
                )}
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">All Offers ({filteredOffers.length})</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Clock className="w-3 h-3 mr-1" />
                Updated 2 min ago
              </Badge>
            </div>
          </div>
          
          <OffersTable 
            offers={filteredOffers}
            isLoading={isLoading}
            onNavigate={navigate}
          />
        </Card>
      </div>
    </div>
  );
}