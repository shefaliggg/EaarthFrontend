// src/features/project/components/ProjectCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ApprovalStatusBadge, OperationalStatusBadge } from './ProjectStatusBadge';
import ActionsMenu from '@/shared/components/ActionsMenu';

export function ProjectCard({
  project,
  onOpen,
  onDelete,
  onSubmitForApproval,
  isSubmitting = false,
  isDeleting = false,
}) {
  const navigate = useNavigate();
  
  const {
    _id,
    projectName,
    projectCode,
    projectType,
    approvalStatus,
    status,
    studioId,
    country,
    rejectionReason,
    createdAt,
  } = project;

  // Check what actions are available based on approval status
  const canEdit = approvalStatus === 'draft' || approvalStatus === 'rejected' || approvalStatus === 'approved';
  const canDelete = approvalStatus === 'draft' || approvalStatus === 'rejected';
  const canSubmit = approvalStatus === 'draft' || approvalStatus === 'rejected';
  const canView = approvalStatus === 'approved';

  const handleEdit = () => {
    navigate(`/projects/${_id}/edit`);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-bold">{projectName}</h3>
                <ApprovalStatusBadge status={approvalStatus} />
                {approvalStatus === 'approved' && (
                  <OperationalStatusBadge status={status} />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Icons.Hash className="w-4 h-4" />
                  {projectCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icons.Film className="w-4 h-4" />
                  {projectType}
                </span>
                {studioId && (
                  <span className="flex items-center gap-1.5">
                    <Icons.Building className="w-4 h-4" />
                    {studioId.studioName}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Icons.MapPin className="w-4 h-4" />
                  {country}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Primary Actions based on status */}
              {approvalStatus === 'pending' && (
                <Button size="sm" variant="secondary" disabled>
                  <Icons.Clock className="w-4 h-4 mr-1" />
                  Waiting for Approval
                </Button>
              )}

              {canSubmit && (
                <Button
                  size="sm"
                  onClick={() => onSubmitForApproval(_id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Icons.Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Icons.Send className="w-4 h-4 mr-1" />
                  )}
                  Submit for Approval
                </Button>
              )}

              {canView && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onOpen(_id)}
                >
                  <Icons.Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              )}

              {/* Actions Menu */}
              <ActionsMenu
                actions={[
                  canView && {
                    label: "View Details",
                    icon: "Eye",
                    onClick: () => onOpen(_id),
                  },
                  canEdit && {
                    label: "Edit Project",
                    icon: "Edit",
                    onClick: handleEdit,
                    separatorBefore: canView,
                  },
                  canSubmit && {
                    label: "Submit for Approval",
                    icon: "Send",
                    onClick: () => onSubmitForApproval(_id),
                    separatorBefore: !canView && canEdit,
                  },
                  canDelete && {
                    label: "Delete Project",
                    icon: "Trash2",
                    onClick: () => onDelete(_id),
                    destructive: true,
                    separatorBefore: true,
                  },
                ].filter(Boolean)}
              />
            </div>
          </div>

          {/* Rejection Reason Alert */}
          {approvalStatus === 'rejected' && rejectionReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <Icons.AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <span className="text-muted-foreground">
              Created: {new Date(createdAt).toLocaleDateString()}
            </span>
            {approvalStatus === 'draft' && (
              <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <Icons.AlertCircle className="w-4 h-4" />
                Submit for approval to activate
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}