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
    <div className="flex flex-wrap gap-2 ">
      {tabOptions.map((option) => {
        const isActive = activeTab === option.value;
        const Icon = option.icon;
        
        return (
          <button
            key={option.value}
            onClick={() => onTabChange(option.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 outline-none",
              isActive 
                ? "bg-purple-600 text-white shadow-md transform scale-105 shadow-purple-500/20" 
                : isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="uppercase tracking-wide">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}