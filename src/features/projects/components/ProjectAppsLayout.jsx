import { Minus, Search, SearchX, Star } from 'lucide-react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import ProjectActionGridCard from './ProjectActionGridCard';
import { Button } from '../../../shared/components/ui/button';
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import ProjectActionListCard from './ProjectActionListCard';

function ProjectAppsLayout() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const params = useParams();
    const currentProjectName = params.projectName.replace("-", " ").toUpperCase() || 'PROJECT';

    const apps = [
        { label: 'PROPS', category: 'PRODUCTION', icon: "Package", subtitle: 'Props inventory and tracking' },
        { label: 'COSTUME', category: 'PRODUCTION', icon: "Shirt", subtitle: 'Wardrobe management system' },
        { label: 'CATERING', category: 'PRODUCTION', icon: "UtensilsCrossed", subtitle: 'Catering and meal planning' },
        { label: 'ACCOUNTS', category: 'PRODUCTION', icon: "Calculator", subtitle: 'Financial management and budgeting' },
        { label: 'PURCHASE ORDERS', category: 'PRODUCTION', icon: "ShoppingCart", subtitle: 'Purchase order management system' },
        { label: 'SCRIPT', category: 'PRODUCTION', icon: "ScrollText", subtitle: 'Script management and breakdown' },
        { label: 'MARKET', category: 'BUSINESS', icon: "ShoppingCart", subtitle: 'Market research and analysis' },
        { label: 'STOCKS', category: 'BUSINESS', icon: "TrendingUp", subtitle: 'Stock and inventory management' },
        { label: 'TRANSPORT', category: 'LOGISTICS', icon: "Truck", subtitle: 'Transportation and logistics' },
        { label: 'E PLAYER', category: 'MEDIA', icon: "Play", subtitle: 'Electronic media player and dailies' },
        { label: 'FORMS', category: 'ADMIN', icon: "FileCheck", subtitle: 'Digital forms and documentation' },
        { label: 'CAST & CREW', category: 'PEOPLE', icon: "Users", subtitle: 'Cast and crew management' },
        { label: 'ANIMALS', category: 'SPECIAL', icon: "PawPrint", subtitle: 'Animal wrangling and coordination' },
        { label: 'ACTION/PICTURE VEHICLES', category: 'SPECIAL', icon: "Car", subtitle: 'Vehicle coordination and tracking' },
        { label: 'LOCATIONS', category: 'PRODUCTION', icon: "MapPin", subtitle: 'Location scouting and management' },
        { label: 'CLOUD', category: 'TECH', icon: "Cloud", subtitle: 'Cloud storage and collaboration' },
        { label: 'TIMESHEETS', category: 'ADMIN', icon: "Clock", subtitle: 'Time tracking and payroll' },
        { label: 'APPROVAL', category: 'ADMIN', icon: "ThumbsUp", subtitle: 'Approval workflow management' },
    ];

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.label.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    PRODUCTION APPS <Minus /> {currentProjectName}
                </h2>
                <div className='flex gap-2 items-center'>
                    <Badge variant={"outline"} className="px-4 py-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {filteredApps.length} APPS
                        </span>
                    </Badge>
                    <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 pl-4 pr-3 py-2 bg-background dark:bg-slate-900 rounded-3xl border shadow-md dark:shadow-shadow">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                    type="text"
                    placeholder="SEARCH APPS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-semibold focus:outline-none ring-0"
                />

                {searchQuery && (
                    <Button
                        size={"sm"}
                        onClick={() => setSearchQuery("")}
                        className="rounded-3xl h-6"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Apps Grid */}
            {filteredApps.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {filteredApps.map((app, index) => (
                            <ProjectActionGridCard
                                feature={
                                    {
                                        id: app.label,
                                        label: app.label,
                                        subtitle: app.subtitle,
                                        icon: app.icon
                                    }
                                }
                                key={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApps.map((app, index) => (
                            <ProjectActionListCard
                                feature={
                                    {
                                        id: app.label,
                                        label: app.label,
                                        subtitle: app.subtitle,
                                        icon: app.icon
                                    }
                                }
                                key={index}
                            />
                        ))}
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center py-32">
                    <SearchX className='size-12 mb-4' />
                    <p className="font-bold text-xl text-gray-500 dark:text-gray-400">
                        NO APPS FOUND
                    </p>
                    <p className=" mt-1 text-gray-400 dark:text-gray-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </div>

    )
}

export default ProjectAppsLayout