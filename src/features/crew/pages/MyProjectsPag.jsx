import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Archive, 
  Sparkles,
  Clapperboard,
  Video,
  Palette,
  Globe,
  Tv,
  Briefcase,
} from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { ProjectCard } from '../components/ProjectCards';
import { ProjectTabs } from '../components/ProjectTabs';
import { toast } from 'sonner';

const projects = [
  {
    id: 'project-avatar1',
    title: 'AVATAR 1',
    type: 'Feature Film',
    category: 'film',
    period: 'shoot',
    progress: 60,
    role: 'LEAD ANIMATION ARTIST',
    studios: ['Disney Studios', 'Amazon Prime'],
    startDate: '2024-01-15',
    endDate: '2024-12-30',
    rating: 4.5,
    teamSize: 125,
    budget: '£2.5M',
    icon: Clapperboard,
  },
  {
    id: 'project-avatar2',
    title: 'AVATAR 2',
    type: 'Feature Film',
    category: 'film',
    period: 'prep',
    progress: 45,
    role: 'CHARACTER DESIGNER',
    studios: ['Disney Studios', 'Amazon Prime'],
    startDate: '2024-03-01',
    endDate: '2025-01-15',
    rating: 4.2,
    teamSize: 98,
    budget: '£3.2M',
    icon: Video,
  },
  {
    id: 'project-mumbai',
    title: 'MUMBAI CHRONICLES',
    type: 'Television Series',
    category: 'tv',
    period: 'wrap',
    progress: 85,
    role: 'ANIMATION ARTIST',
    studios: ['Netflix', 'Hotstar'],
    startDate: '2023-06-10',
    endDate: '2024-10-20',
    rating: 4.9,
    teamSize: 67,
    budget: '£1.8M',
    icon: Tv,
  },
  {
    id: 'project-brand',
    title: 'COCA-COLA SUMMER CAMPAIGN',
    type: 'Commercial',
    category: 'commercial',
    period: 'shoot',
    progress: 70,
    role: 'VFX SUPERVISOR',
    studios: ['WPP Studios'],
    startDate: '2024-04-05',
    endDate: '2024-06-30',
    rating: 4.6,
    teamSize: 32,
    budget: '£850K',
    icon: Palette,
  },
  {
    id: 'project-doc',
    title: 'CLIMATE CRISIS: THE TRUTH',
    type: 'Documentary',
    category: 'documentary',
    period: 'prep',
    progress: 25,
    role: 'MOTION GRAPHICS LEAD',
    studios: ['BBC Studios'],
    startDate: '2024-11-01',
    endDate: '2025-03-15',
    rating: 4.3,
    teamSize: 18,
    budget: '£620K',
    icon: Globe,
  },
];

const archivedProjects = [
  {
    id: 'project-tech-doc',
    title: 'TECH STARTUP DOC',
    type: 'Documentary',
    category: 'documentary',
    period: 'wrap',
    progress: 100,
    role: 'MOTION GRAPHICS',
    studios: ['Sony Pictures'],
    startDate: '2024-02-05',
    endDate: '2024-09-15',
    rating: 4.7,
    teamSize: 15,
    budget: '£480K',
    icon: Briefcase,
  },
];

export function MyProjectsPage({ isDarkMode, onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const handleAIAction = (action) => {
    toast.success(`AI is processing: ${action}`);
  };

  const displayedProjects = showArchived ? archivedProjects : projects;
  
  const filteredProjects = displayedProjects.filter(project => {
    const matchesTab = activeTab === 'all' || project.category === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className=" space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <PageHeader 
          title="PROJECTS" 
          icon="LayoutGrid"
          
        />
        
        <div className="flex gap-3">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md shadow-purple-500/20"
            onClick={() => handleAIAction('Generating portfolio insights...')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="w-4 h-4 mr-2" />
            {showArchived ? 'Show Active' : 'Show Archived'}
          </Button>
        </div>
      </div>

      {/* Filters & Search Card */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <ProjectTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              isDarkMode={isDarkMode}
            />

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                size="icon"
                className="h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              title={project.title}
              type={project.type}
              rating={project.rating || 0}
              status={project.period}
              yourRole={project.role}
              progress={project.progress}
              crewCount={project.teamSize || 0}
              startDate={project.startDate}
              endDate={project.endDate}
              studio={project.studios[0]}
              productionCompany={project.studios[1]}
              isDarkMode={isDarkMode}
              onClick={() => onNavigate?.('project-details')}
            />
          ))
        )}
      </div>
    </div>
  );
}