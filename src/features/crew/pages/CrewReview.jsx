import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Textarea } from "../../../shared/components/ui/textarea";
import { Separator } from "../../../shared/components/ui/separator";
import { CheckCircle, MessageSquare, ArrowLeft, Send, AlertCircle, Clock, User, Briefcase, DollarSign, Calendar, Building } from "lucide-react";
import { toast } from "sonner";
import { WorkflowProgress } from "../components/WorkflowProgress";
import { getMockOfferById } from '../mocks/mockOffers';

export default function CrewReview() {
  const { id, projectName } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [offer, setOffer] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOfferData();
    fetchComments();
  }, [id]);

  const fetchOfferData = () => {
    try {
      setIsLoading(true);
      // Using mock data instead of API call
      const data = getMockOfferById(id);
      setOffer(data);
    } catch (error) {
      toast.error("Failed to load offer details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = () => {
    // Mock comments data
    setComments([
      {
        id: 1,
        comment: "Please confirm the start date works for you.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userRole: "Production"
      },
      {
        id: 2,
        comment: "The overtime rates look good to me.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        userRole: "Crew"
      }
    ]);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    
    // Add comment to local state (mock)
    const newComment = {
      id: comments.length + 1,
      comment: comment,
      createdAt: new Date().toISOString(),
      userRole: "Crew"
    };
    setComments([...comments, newComment]);
    setComment("");
    toast.success("Comment added");
  };

  const acceptOffer = () => {
    // Mock accept offer
    toast.success("Offer accepted");
    setTimeout(() => {
      navigate(`/projects/${projectName || 'demo-project'}/offers`);
    }, 1000);
  };

  const requestChanges = () => {
    // Mock request changes
    toast.success("Changes requested");
    setTimeout(() => {
      navigate(`/projects/${projectName || 'demo-project'}/offers`);
    }, 1000);
  };

  const handleBack = () => {
    navigate(`/projects/${projectName || 'demo-project'}/offers`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-pulse text-muted-foreground">Loading offer details...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-muted-foreground">Offer not found</div>
      </div>
    );
  }

  const isReviewable = offer.status === "SENT_TO_CREW" || offer.status === "NEEDS_REVISION";
  const roles = offer.roles || [];
  const firstRole = roles[0] || {};

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `£${value.toLocaleString()}`;
  };

  console.log('CrewReview loaded:', { id, projectName, offer, firstRole });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate" data-testid="text-offer-title">
            {offer.fullName} - {firstRole.jobTitle || "No Role"}
          </h1>
          <p className="text-muted-foreground" data-testid="text-offer-production">
            {offer.productionName || "Production"}
          </p>
        </div>
        <Badge 
          variant={isReviewable ? "default" : "secondary"}
          data-testid="badge-status"
        >
          {offer.status?.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Recipient Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Name</span>
              <span data-testid="text-recipient-name">{offer.fullName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Email</span>
              <span className="truncate" data-testid="text-recipient-email">{offer.email}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Phone</span>
              <span data-testid="text-recipient-phone">{offer.mobileNumber || "N/A"}</span>
            </div>
            {offer.isViaAgent && (
              <>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Agent</span>
                  <span data-testid="text-agent-name">{offer.agentName || "N/A"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Agent Email</span>
                  <span className="truncate" data-testid="text-agent-email">{offer.agentEmail || "N/A"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Employment Type</span>
              <span data-testid="text-employment-type">{offer.confirmedEmploymentType || firstRole.confirmedEmploymentType || "TBD"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Pay Cadence</span>
              <span data-testid="text-pay-cadence">{firstRole.rateType || firstRole.payCadence || "N/A"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Department</span>
              <span data-testid="text-department">{firstRole.department || "N/A"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Job Title</span>
              <span data-testid="text-job-title">{firstRole.jobTitle || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Rate</span>
              <span data-testid="text-rate">{formatCurrency(firstRole.contractRate || firstRole.rateAmount)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Overtime</span>
              <span data-testid="text-overtime">{firstRole.overtimeType || "N/A"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Holiday Pay</span>
              <span data-testid="text-holiday-pay">
                {offer.holidayPayPercentage ? `${offer.holidayPayPercentage}%` : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Allowances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Box Rental</span>
              <span data-testid="text-box-rental">{formatCurrency(firstRole.allowances?.boxRentalFeePerWeek)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Car Allowance</span>
              <span data-testid="text-car-allowance">{formatCurrency(firstRole.allowances?.carAllowanceFeePerWeek)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Phone Allowance</span>
              <span data-testid="text-phone-allowance">{formatCurrency(firstRole.allowances?.mobilePhoneAllowanceFeePerWeek)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Start Date</span>
              <span data-testid="text-start-date">
                {firstRole.startDate ? new Date(firstRole.startDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">End Date</span>
              <span data-testid="text-end-date">
                {firstRole.endDate ? new Date(firstRole.endDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Working in UK</span>
              <span data-testid="text-working-uk">{firstRole.workingInUnitedKingdom || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Production Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Production</span>
              <span data-testid="text-production-name">{offer.productionName || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {roles.length > 1 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roles.slice(1).map((role, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-md space-y-2 text-sm">
                  <div className="font-medium">{role.jobTitle} - {role.department}</div>
                  <div className="flex gap-4 flex-wrap text-muted-foreground">
                    <span>Rate: {formatCurrency(role.rate)}</span>
                    <span>Cadence: {role.payCadence}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
          </CardTitle>
          <CardDescription>
            Add comments or questions about this offer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium" data-testid={`text-comment-user-${c.id}`}>
                      User
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  <p className="text-sm" data-testid={`text-comment-${c.id}`}>{c.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet</p>
          )}

          {isReviewable && (
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment or question..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                data-testid="input-comment"
              />
              <Button
                variant="outline"
                onClick={addComment}
                disabled={!comment.trim()}
                data-testid="button-add-comment"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isReviewable && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Review Decision</CardTitle>
            <CardDescription>
              Accept this offer or request changes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={acceptOffer}
              data-testid="button-accept-offer"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Offer
            </Button>
            <Button
              variant="outline"
              onClick={requestChanges}
              data-testid="button-request-changes"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {!isReviewable && (
        <Card className="border-muted">
          <CardContent className="pt-6 flex items-center gap-3 text-muted-foreground">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <span>This offer is currently in <strong>{offer.status?.replace(/_/g, " ")}</strong> status and cannot be reviewed.</span>
          </CardContent>
        </Card>
      )}

      <WorkflowProgress offer={offer} onUpdate={fetchOfferData} />
    </div>
  );
}