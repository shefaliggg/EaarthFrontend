// ProjectTabs.jsx - Updated to use CSS color variables
import { LayoutGrid, Film, Play, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabOptions = [
  { value: 'all', label: 'All Projects', icon: LayoutGrid },
  { value: 'film', label: 'Films', icon: Film },
  { value: 'tv', label: 'TV Series', icon: Play },
  { value: 'commercial', label: 'Commercials', icon: Award },
  { value: 'documentary', label: 'Documentaries', icon: TrendingUp },
];

export function ProjectTabs({ activeTab, onTabChange, isDarkMode }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabOptions.map((option) => {
        const isActive = activeTab === option.value;
        const Icon = option.icon;
        
        return (
          <button
            key={option.value}
            onClick={() => onTabChange(option.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 outline-none",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md transform scale-105" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
            <span className="uppercase tracking-wide">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}