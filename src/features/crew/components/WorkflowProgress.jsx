import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  FileEdit,
  ThumbsUp,
  ClipboardCheck,
  Calculator,
  PenTool,
  UserCheck,
  Shield,
  Building2,
  FileCheck,
  AlertCircle,
  ChevronRight,
  History
} from "lucide-react";
import { format } from "date-fns";

const WORKFLOW_STAGES = [
  { key: "DRAFT", label: "Draft", icon: FileEdit, description: "Offer is being prepared" },
  { key: "SENT_TO_CREW", label: "Sent to Crew", icon: Send, description: "Awaiting crew review" },
  { key: "NEEDS_REVISION", label: "Needs Revision", icon: MessageSquare, description: "Crew requested changes" },
  { key: "CREW_ACCEPTED", label: "Crew Accepted", icon: ThumbsUp, description: "Crew accepted the offer" },
  { key: "PRODUCTION_CHECK", label: "Production Check", icon: ClipboardCheck, description: "Production team reviewing" },
  { key: "ACCOUNTS_CHECK", label: "Accounts Check", icon: Calculator, description: "Finance team verifying" },
  { key: "PENDING_CREW_SIGNATURE", label: "Crew Signature", icon: PenTool, description: "Awaiting crew signature" },
  { key: "PENDING_UPM_SIGNATURE", label: "UPM Signature", icon: UserCheck, description: "Awaiting UPM signature" },
  { key: "PENDING_FC_SIGNATURE", label: "FC Signature", icon: Shield, description: "Awaiting FC signature" },
  { key: "PENDING_STUDIO_SIGNATURE", label: "Studio Signature", icon: Building2, description: "Awaiting studio signature" },
  { key: "COMPLETED", label: "Completed", icon: FileCheck, description: "Contract fully executed" },
];

export function WorkflowProgress({ offer, onUpdate }) {
  const [revisionComment, setRevisionComment] = useState("");
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchComments();
    fetchHistory();
  }, [offer.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/offers/${offer.id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/offers/${offer.id}/workflow-history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history");
    }
  };

  const sendToCrew = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/send-to-crew`, {
        method: "POST"
      });
      toast.success("Offer sent to crew");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to send offer");
    }
  };

  const requestRevision = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/request-revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: revisionComment })
      });
      toast.success("Revision requested");
      setRevisionComment("");
      setIsRevisionDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to request revision");
    }
  };

  const acceptOffer = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/accept`, {
        method: "POST"
      });
      toast.success("Offer accepted");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to accept offer");
    }
  };

  const startProductionCheck = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/start-production-check`, {
        method: "POST"
      });
      toast.success("Production check started");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to start production check");
    }
  };

  const completeProductionCheck = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/complete-production-check`, {
        method: "POST"
      });
      toast.success("Production check completed");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to complete production check");
    }
  };

  const completeAccountsCheck = async () => {
    try {
      await fetch(`/api/offers/${offer.id}/complete-accounts-check`, {
        method: "POST"
      });
      toast.success("Accounts check completed");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to complete accounts check");
    }
  };

  const getCurrentStageIndex = () => {
    return WORKFLOW_STAGES.findIndex(s => s.key === offer.status);
  };

  const getStageStatus = (stageKey) => {
    const currentIndex = getCurrentStageIndex();
    const stageIndex = WORKFLOW_STAGES.findIndex(s => s.key === stageKey);
    
    if (offer.status === "CANCELLED") return "cancelled";
    
    if (stageKey === "NEEDS_REVISION") {
      if (offer.status === "NEEDS_REVISION") return "current";
      return "skipped";
    }
    
    const linearStages = WORKFLOW_STAGES.filter(s => s.key !== "NEEDS_REVISION");
    const linearCurrentIndex = linearStages.findIndex(s => s.key === offer.status);
    const linearStageIndex = linearStages.findIndex(s => s.key === stageKey);
    
    if (linearStageIndex < linearCurrentIndex) return "completed";
    if (stageKey === offer.status) return "current";
    return "pending";
  };

  const renderActionButtons = () => {
    switch (offer.status) {
      case "DRAFT":
        return (
          <Button 
            onClick={sendToCrew}
            data-testid="button-send-to-crew"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to Crew
          </Button>
        );
      case "SENT_TO_CREW":
        return (
          <div className="flex gap-2 flex-wrap">
            <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-request-revision">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Revision</DialogTitle>
                  <DialogDescription>Describe the changes you would like made to the offer.</DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Please describe the changes you need..."
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="input-revision-comment"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRevisionDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={requestRevision}
                    disabled={!revisionComment.trim()}
                    data-testid="button-submit-revision"
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={acceptOffer}
              data-testid="button-accept-offer"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Accept Offer
            </Button>
          </div>
        );
      case "NEEDS_REVISION":
        return (
          <Button 
            onClick={sendToCrew}
            data-testid="button-resend-to-crew"
          >
            <Send className="w-4 h-4 mr-2" />
            Resend to Crew
          </Button>
        );
      case "CREW_ACCEPTED":
        return (
          <Button 
            onClick={startProductionCheck}
            data-testid="button-start-production-check"
          >
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Start Production Check
          </Button>
        );
      case "PRODUCTION_CHECK":
        return (
          <Button 
            onClick={completeProductionCheck}
            data-testid="button-complete-production-check"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Production Check
          </Button>
        );
      case "ACCOUNTS_CHECK":
        return (
          <Button 
            onClick={completeAccountsCheck}
            data-testid="button-complete-accounts-check"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Accounts Check
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
        <div>
          <CardTitle className="text-lg">Workflow Progress</CardTitle>
          <CardDescription>Track the offer through all stages</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(true)} data-testid="button-view-history">
          <History className="w-4 h-4 mr-2" />
          View History
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="space-y-3">
            {WORKFLOW_STAGES.map((stage, index) => {
              const status = getStageStatus(stage.key);
              const Icon = stage.icon;
              const isRevisionBranch = stage.key === "NEEDS_REVISION";
              
              return (
                <div key={stage.key} className={`flex items-center gap-3 ${isRevisionBranch ? "pl-8 border-l-2 border-dashed border-muted-foreground/30 ml-4" : ""}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                    status === "completed" ? "bg-green-100 border-green-500 dark:bg-green-900" :
                    status === "current" ? "bg-purple-100 border-purple-500 dark:bg-purple-900" :
                    status === "cancelled" ? "bg-red-100 border-red-500 dark:bg-red-900" :
                    status === "skipped" ? "bg-muted/50 border-muted-foreground/20" :
                    "bg-muted border-muted-foreground/30"
                  }`}>
                    {status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : status === "current" ? (
                      <Icon className="w-4 h-4 text-purple-600" />
                    ) : status === "cancelled" ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${
                        status === "completed" ? "text-green-700 dark:text-green-400" :
                        status === "current" ? "text-purple-700 dark:text-purple-400" :
                        status === "skipped" ? "text-muted-foreground/60 line-through" :
                        "text-muted-foreground"
                      }`}>
                        {stage.label}
                      </span>
                      {status === "current" && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Current
                        </Badge>
                      )}
                      {status === "skipped" && isRevisionBranch && (
                        <Badge variant="outline" className="text-xs opacity-60">
                          Optional
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                  {index < WORKFLOW_STAGES.length - 1 && !isRevisionBranch && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {offer.status !== "COMPLETED" && offer.status !== "CANCELLED" && (
          <>
            <Separator />
            <div className="flex flex-col gap-4">
              <h4 className="font-medium">Available Actions</h4>
              {renderActionButtons()}
            </div>
          </>
        )}

        {comments.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {comment.userRole}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "dd MMM yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Workflow History
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[400px] pr-4">
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex gap-3 p-3 bg-muted/30 rounded-md">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{entry.action.replace(/_/g, " ")}</span>
                          {entry.toStatus && (
                            <Badge variant="outline" className="text-xs">
                              {entry.toStatus.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No workflow history yet</p>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}