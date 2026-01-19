import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Input } from "../../../shared/components/ui/input";
import { Tabs, TabsContent } from "../../../shared/components/ui/tabs";
import {
  FileText, Search, Eye, Download,
  CheckCircle, Calendar, User, Building
} from "lucide-react";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import { MetricsCard } from "../../../shared/components/cards/MetricsCard";

// Sample contract data - showing only one crew member's contracts
const sampleContracts = [
  {
    id: 1,
    status: "COMPLETED",
    productionName: "Sunset Boulevard",
    completedAt: "2024-12-15T10:00:00Z",
    data: {
      fullName: "John Smith",
      department: "Camera Department",
      roles: [{ roleTitle: "Director of Photography" }]
    }
  },
  {
    id: 2,
    status: "PENDING_CREW_SIGNATURE",
    productionName: "Night at the Opera",
    completedAt: null,
    data: {
      fullName: "John Smith",
      department: "Camera Department",
      roles: [{ roleTitle: "Camera Operator" }]
    }
  },
  {
    id: 4,
    status: "COMPLETED",
    productionName: "Ocean Waves",
    completedAt: "2024-11-20T14:30:00Z",
    data: {
      fullName: "John Smith",
      department: "Camera Department",
      roles: [{ roleTitle: "First Assistant Camera" }]
    }
  },
  {
    id: 6,
    status: "PENDING_UPM_SIGNATURE",
    productionName: "City Lights",
    completedAt: null,
    data: {
      fullName: "John Smith",
      department: "Camera Department",
      roles: [{ roleTitle: "Director of Photography" }]
    }
  }
];

const getStatusConfig = (status) => {
  const configs = {
    "COMPLETED": { label: "Completed", variant: "default", color: "bg-emerald-100 text-emerald-800" },
    "PENDING_CREW_SIGNATURE": { label: "Awaiting My Signature", variant: "outline", color: "bg-amber-100 text-amber-800" },
    "PENDING_UPM_SIGNATURE": { label: "Awaiting UPM Signature", variant: "outline", color: "bg-blue-100 text-blue-800" },
    "PENDING_FC_SIGNATURE": { label: "Awaiting FC Signature", variant: "outline", color: "bg-purple-100 text-purple-800" },
    "PENDING_STUDIO_SIGNATURE": { label: "Awaiting Studio Signature", variant: "outline", color: "bg-violet-100 text-violet-800" },
  };
  return configs[status] || { label: status, variant: "secondary", color: "bg-slate-100 text-slate-800" };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

function ContractCard({ contract }) {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const statusConfig = getStatusConfig(contract.status);
  const data = contract.data || {};
  const roles = data.roles || [];
  const primaryRole = roles[0] || {};

  const handleViewContract = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${contract.id}/view`);
  };

  const handleDownloadContract = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers/${contract.id}/contract`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-contract-${contract.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-base truncate" data-testid={`text-contract-name-${contract.id}`}>
                {contract.productionName || "Unnamed Production"}
              </h3>
              <Badge className={statusConfig.color} data-testid={`badge-status-${contract.id}`}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>{primaryRole.roleTitle || data.department || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3 h-3" />
                <span>{data.department || "—"}</span>
              </div>
              {contract.completedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Completed {formatDate(contract.completedAt)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid={`button-view-contract-${contract.id}`} onClick={handleViewContract}>
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
            {contract.status === "COMPLETED" && (
              <Button variant="ghost" size="sm" data-testid={`button-download-contract-${contract.id}`} onClick={handleDownloadContract}>
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Contracts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Current logged-in crew member (in real app, get from auth context)
  const currentUserName = "John Smith";

  // Filter contracts for current crew member only
  const userContracts = sampleContracts.filter(contract =>
    contract.data.fullName === currentUserName
  );

  const signingStatuses = [
    "PENDING_CREW_SIGNATURE",
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE"
  ];

  const signedContracts = userContracts.filter(o =>
    o.status === "COMPLETED" || signingStatuses.includes(o.status)
  );

  const completedContracts = signedContracts.filter(c => c.status === "COMPLETED");
  const pendingSignatures = signedContracts.filter(c => signingStatuses.includes(c.status));

  const filterContracts = (contracts) => {
    if (!searchQuery) return contracts;
    return contracts.filter(c => {
      const data = c.data || {};
      const searchLower = searchQuery.toLowerCase();
      return (
        c.productionName?.toLowerCase().includes(searchLower) ||
        data.department?.toLowerCase().includes(searchLower) ||
        data.roles?.[0]?.roleTitle?.toLowerCase().includes(searchLower)
      );
    });
  };

  const displayContracts = activeTab === "completed"
    ? filterContracts(completedContracts)
    : activeTab === "pending"
      ? filterContracts(pendingSignatures)
      : filterContracts(signedContracts);

  const tabOptions = [
    { label: `All (${signedContracts.length})`, value: "all", icon: "FileText" },
    { label: `Completed (${completedContracts.length})`, value: "completed", icon: "CheckCircle" },
    { label: `Pending (${pendingSignatures.length})`, value: "pending", icon: "Calendar" }
  ];

  return (
    <div className="">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-contracts-title">
              My Contracts
            </h1>
            <p className="text-gray-600 mt-0.5">
              View and manage your signed contracts
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
                data-testid="input-search-contracts"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricsCard
            title="Total Contracts"
            value={signedContracts.length}
            icon="FileText"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <MetricsCard
            title="Completed"
            value={completedContracts.length}
            icon="CheckCircle"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <MetricsCard
            title="Pending Signatures"
            value={pendingSignatures.length}
            icon="Calendar"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        <FilterPillTabs
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          transparentBg={true}
          fullWidth={false}
        />

        <Tabs value={activeTab}>
          <TabsContent value={activeTab} className="mt-4">
            {displayContracts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-semibold mb-1">No contracts found</h3>
                  <p className="text-sm text-gray-600">
                    {searchQuery ? "Try adjusting your search" : "You don't have any contracts yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayContracts.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}