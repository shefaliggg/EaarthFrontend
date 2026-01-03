// src/features/project/pages/ProjectList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilters } from '../components/ProjectFilters';
import { useProject } from '../hooks/useProject';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

export default function ProjectList() {
  const navigate = useNavigate();
  const {
    projects,
    isFetching,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    search,
    projectType,
    approvalStatus,
    sort,
    page,
    pages,
    total,
    fetchProjects,
    submitForApproval,
    deleteProject,
    updateSearch,
    updateProjectType,
    updateApprovalStatus,
    updateSort,
    updatePage,
    clearErrorMessage,
    clearSuccessMessage,
  } = useProject();

  const [filters, setFilters] = useState({
    search: '',
    approvalStatus: 'all',
    projectType: 'all',
    studioId: 'all',
  });

  // Dialogs
  const [submitDialog, setSubmitDialog] = useState({ isOpen: false, projectId: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, projectId: null });

  // Fetch projects on mount and when filters change
  useEffect(() => {
    const apiFilters = {
      search: filters.search || undefined,
      approvalStatus: filters.approvalStatus === 'all' ? undefined : filters.approvalStatus,
      projectType: filters.projectType === 'all' ? undefined : filters.projectType,
      studioId: filters.studioId === 'all' ? undefined : filters.studioId,
      page,
      limit: 10,
      sort,
    };
    fetchProjects(apiFilters);
  }, [page, sort, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrorMessage();
    }
  }, [error, clearErrorMessage]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearSuccessMessage();
    }
  }, [successMessage, clearSuccessMessage]);

  const handleProjectOpen = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleProjectEdit = (projectId) => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleSubmitForApproval = (projectId) => {
    setSubmitDialog({ isOpen: true, projectId });
  };

  const confirmSubmitForApproval = async () => {
    if (!submitDialog.projectId) return;
    const result = await submitForApproval(submitDialog.projectId);
    if (!result.error) {
      setSubmitDialog({ isOpen: false, projectId: null });
    }
  };

  const handleDeleteProject = (projectId) => {
    setDeleteDialog({ isOpen: true, projectId });
  };

  const confirmDeleteProject = async () => {
    if (!deleteDialog.projectId) return;
    const result = await deleteProject(deleteDialog.projectId);
    if (!result.error) {
      setDeleteDialog({ isOpen: false, projectId: null });
    }
  };

  // Calculate real stats from projects
  const stats = {
    active: projects.filter(p => p.approvalStatus === 'approved' && p.status === 'active').length,
    draft: projects.filter(p => p.approvalStatus === 'draft').length,
    pending: projects.filter(p => p.approvalStatus === 'pending').length,
    rejected: projects.filter(p => p.approvalStatus === 'rejected').length,
  };

  // Extract unique studios from projects (if you have studios data, pass it here)
  const studios = []; // Replace with your actual studios data if available

  return (
    <div className='space-y-6 container mx-auto'>
      <div className="flex items-center justify-between mb-6">
        <PageHeader icon="Film" title="MY PROJECTS" />
        <Button onClick={() => navigate('/projects/create')}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          CREATE NEW PROJECT
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Projects"
          value={stats.active}
          subtitle="Approved & Active"
          icon="CheckCircle"
          iconColor="text-green-600"
        />
        <StatCard
          title="Draft Projects"
          value={stats.draft}
          subtitle="Not submitted"
          icon="FileText"
          iconColor="text-gray-600"
        />
        <StatCard
          title="Pending Approval"
          value={stats.pending}
          subtitle="Under review"
          icon="Clock"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          subtitle="Need revision"
          icon="XCircle"
          iconColor="text-red-600"
        />
      </div>

      {/* Filters */}
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="">
          <ProjectFilters
            search={filters.search}
            onSearchChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            approvalStatus={filters.approvalStatus}
            onApprovalStatusChange={(value) => setFilters(prev => ({ ...prev, approvalStatus: value }))}
            studioId={filters.studioId}
            onStudioChange={(value) => setFilters(prev => ({ ...prev, studioId: value }))}
            projectType={filters.projectType}
            onProjectTypeChange={(value) => setFilters(prev => ({ ...prev, projectType: value }))}
            sort={sort}
            onSortChange={updateSort}
            studios={studios}
          />
        </CardContent>
      </Card>

      {/* Projects List */}
      {isFetching && projects.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Icons.Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-gray-600">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.approvalStatus !== 'all' || filters.projectType !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first project'}
            </p>
            <Button onClick={() => navigate('/projects/create')}>
              <Icons.Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpen={handleProjectOpen}
                onEdit={handleProjectEdit}
                onDelete={handleDeleteProject}
                onSubmitForApproval={handleSubmitForApproval}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
              />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePage(page - 1)}
                disabled={page === 1 || isFetching}
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {pages} ({total} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePage(page + 1)}
                disabled={page === pages || isFetching}
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Submit for Approval Dialog */}
      <AlertDialog
        open={submitDialog.isOpen}
        onOpenChange={(open) => !open && setSubmitDialog({ isOpen: false, projectId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Project for Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Once submitted, you cannot edit the project until the admin reviews it.
              Are you sure you want to submit this project for approval?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitForApproval} disabled={isSubmitting}>
              {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, projectId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}