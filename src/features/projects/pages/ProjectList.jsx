import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ProjectCard } from '../components/ProjectCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { ProjectFilters } from '../components/ProjectFilters';
import { useProject } from '../hooks/useProject';
import { toast } from 'sonner';

export default function ProjectList() {
  const navigate = useNavigate();
  const {
    projects,
    isFetching,
    error,
    search,
    projectType,
    studioId,
    sort,
    page,
    pages,
    total,
    fetchProjects,
    updateSearch,
    updateProjectType,
    updateStudioId,
    updateSort,
    updatePage,
    clearErrorMessage,
  } = useProject();

  // TODO: Replace with actual API call to fetch studios
  const [studios] = React.useState([
    { _id: '69494aa6df29472c2c6b5d8f', studioName: 'Rainbow Studios', studioCode: 'STO-000016' },
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrorMessage();
    }
  }, [error, clearErrorMessage]);

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleProjectTypeChange = (value) => {
    updateProjectType(value === 'all' ? '' : value);
  };

  const handleStudioChange = (value) => {
    updateStudioId(value === 'all' ? '' : value);
  };

  const handleSortChange = (value) => {
    updateSort(value);
  };

  const handlePageChange = (newPage) => {
    updatePage(newPage);
  };

  const handleProjectOpen = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const transformProjectData = (project) => {
    const getProjectPhase = () => {
      const now = new Date();
      const prepStart = new Date(project.prepStartDate);
      const prepEnd = new Date(project.prepEndDate);
      const shootStart = new Date(project.shootStartDate);
      const shootEnd = new Date(project.shootEndDate);
      const wrapStart = new Date(project.wrapStartDate);
      const wrapEnd = new Date(project.wrapEndDate);

      if (now < prepStart) return 'Development';
      if (now >= prepStart && now <= prepEnd) return 'Pre-Production';
      if (now >= shootStart && now <= shootEnd) return 'Principal Photography';
      if (now >= wrapStart && now <= wrapEnd) return 'Post-Production';
      if (now > wrapEnd) return 'Distribution';
      return 'Development';
    };

    const getCompletionPercentage = () => {
      const now = new Date();
      const start = new Date(project.prepStartDate);
      const end = new Date(project.wrapEndDate);
      
      if (now < start) return 0;
      if (now > end) return 100;
      
      const total = end - start;
      const elapsed = now - start;
      return Math.round((elapsed / total) * 100);
    };

    const getDaysProgress = () => {
      const now = new Date();
      const start = new Date(project.prepStartDate);
      const end = new Date(project.wrapEndDate);
      
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
      
      return {
        elapsed: Math.max(0, Math.min(elapsedDays, totalDays)),
        total: totalDays
      };
    };

    const completion = getCompletionPercentage();
    const daysProgress = getDaysProgress();

    return {
      id: project._id,
      name: project.projectName,
      status: project.status || 'active',
      phase: getProjectPhase(),
      studioName: project.studioId?.studioName || 'No Studio',
      studioCode: project.studioId?.studioCode || 'N/A',
      stats: {
        budget: 100000000,
        spent: Math.round(100000000 * (completion / 100)),
        daysShot: daysProgress.elapsed,
        totalDays: daysProgress.total,
        crewSize: 0,
        department: 0,
        completion: completion,
        onSchedule: completion <= 100,
        onBudget: true,
      }
    };
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalProjects = projects.length;
  const uniqueStudios = [...new Set(projects.map(p => p.studioId?._id).filter(Boolean))];

  return (
    <div className="px-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          icon="Film"
          title="PROJECTS"
          
        />
        
        <Button onClick={() => navigate('/projects/create')}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          CREATE NEW PROJECT
        </Button>
      </div>

      {/* Studio Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Production pipeline"
          icon="Film"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle="All time"
          icon="Folder"
          iconColor="text-purple-600"
        />

        <StatCard
          title="This Month"
          value={projects.filter(p => {
            const created = new Date(p.createdAt);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length}
          subtitle="New projects"
          icon="TrendingUp"
          iconColor="text-green-600"
        />

        <StatCard
          title="Studios"
          value={uniqueStudios.length}
          subtitle="Active studios"
          icon="Building"
          iconColor="text-orange-600"
        />
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="">
          <ProjectFilters
            search={search}
            onSearchChange={handleSearchChange}
            studioId={studioId}
            onStudioChange={handleStudioChange}
            projectType={projectType}
            onProjectTypeChange={handleProjectTypeChange}
            sort={sort}
            onSortChange={handleSortChange}
            studios={studios}
          />
        </CardContent>
      </Card>

      {/* Projects List */}
      {isFetching ? (
        <div className="flex items-center justify-center py-12">
          <Icons.Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first project
            </p>
            <Button onClick={() => navigate('/projects/create')}>
              <Icons.Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                {...transformProjectData(project)}
                onOpen={handleProjectOpen}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm">
                Page {page} of {pages} ({total} total)
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages}
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {projects.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <QuickActionButton
                icon="Plus"
                label="Create Project"
                onClick={() => navigate('/projects/create')}
              />
              <QuickActionButton
                icon="BarChart3"
                label="View Reports"
                onClick={() => navigate('/projects/reports')}
              />
              <QuickActionButton
                icon="Users"
                label="Manage Team"
                onClick={() => navigate('/projects/team')}
              />
              <QuickActionButton
                icon="Target"
                label="Studio Analytics"
                onClick={() => navigate('/projects/analytics')}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}