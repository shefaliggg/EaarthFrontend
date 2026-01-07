import { useState } from "react";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Input } from "../../../shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { 
  FileText, Search, Eye, Download, 
  CheckCircle, Calendar, User, Building
} from "lucide-react";

// Sample contract data
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
      fullName: "Sarah Johnson",
      department: "Sound Department",
      roles: [{ roleTitle: "Sound Mixer" }]
    }
  },
  {
    id: 3,
    status: "PENDING_UPM_SIGNATURE",
    productionName: "Desert Storm",
    completedAt: null,
    data: {
      fullName: "Mike Davis",
      department: "Grip Department",
      roles: [{ roleTitle: "Key Grip" }]
    }
  },
  {
    id: 4,
    status: "COMPLETED",
    productionName: "Ocean Waves",
    completedAt: "2024-11-20T14:30:00Z",
    data: {
      fullName: "Emily Chen",
      department: "Art Department",
      roles: [{ roleTitle: "Production Designer" }]
    }
  },
  {
    id: 5,
    status: "PENDING_FC_SIGNATURE",
    productionName: "Mountain High",
    completedAt: null,
    data: {
      fullName: "Robert Martinez",
      department: "Electric Department",
      roles: [{ roleTitle: "Gaffer" }]
    }
  }
];

const getStatusConfig = (status) => {
  const configs = {
    "COMPLETED": { label: "Completed", variant: "default", color: "bg-emerald-100 text-emerald-800" },
    "PENDING_CREW_SIGNATURE": { label: "Awaiting Crew Signature", variant: "outline", color: "bg-amber-100 text-amber-800" },
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
  const statusConfig = getStatusConfig(contract.status);
  const data = contract.data || {};
  const roles = data.roles || [];
  const primaryRole = roles[0] || {};

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-contract-${contract.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-base truncate" data-testid={`text-contract-name-${contract.id}`}>
                {data.fullName || data.crewName || "Unnamed Contract"}
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
                <span>{contract.productionName || "—"}</span>
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
            <Button variant="outline" size="sm" data-testid={`button-view-contract-${contract.id}`}>
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
            {contract.status === "COMPLETED" && (
              <Button variant="ghost" size="icon" data-testid={`button-download-contract-${contract.id}`}>
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
  const [selectedRole] = useState("CREW");

  const allOffers = sampleContracts;

  const signingStatuses = [
    "PENDING_CREW_SIGNATURE", 
    "PENDING_UPM_SIGNATURE", 
    "PENDING_FC_SIGNATURE", 
    "PENDING_STUDIO_SIGNATURE"
  ];

  const signedContracts = allOffers.filter(o => 
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
        data.fullName?.toLowerCase().includes(searchLower) ||
        data.crewName?.toLowerCase().includes(searchLower) ||
        c.productionName?.toLowerCase().includes(searchLower) ||
        data.department?.toLowerCase().includes(searchLower)
      );
    });
  };

  const displayContracts = activeTab === "completed" 
    ? filterContracts(completedContracts)
    : activeTab === "pending"
    ? filterContracts(pendingSignatures)
    : filterContracts(signedContracts);

  const roleLabel = selectedRole === "CREW" ? "Crew Member" : "Production";

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-contracts-title">
              {selectedRole === "CREW" ? "My Signed Contracts" : "Contracts"}
            </h1>
            <p className="text-gray-600 mt-0.5">
              Viewing as: {roleLabel}
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
          <Card data-testid="card-stat-total">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{signedContracts.length}</p>
                <p className="text-sm text-gray-600">Total Contracts</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-completed">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedContracts.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-pending">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSignatures.length}</p>
                <p className="text-sm text-gray-600">Pending Signatures</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-contracts">
              All ({signedContracts.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-contracts">
              Completed ({completedContracts.length})
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending-contracts">
              Pending ({pendingSignatures.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {displayContracts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-semibold mb-1">No contracts found</h3>
                  <p className="text-sm text-gray-600">
                    {searchQuery ? "Try adjusting your search" : "Contracts will appear here once signed"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              displayContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}