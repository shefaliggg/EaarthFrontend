import { Minus, Search, SearchX, Star } from 'lucide-react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import ProjectActionGridCard from './ProjectActionGridCard';
import { Button } from '../../../shared/components/ui/button';
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import ProjectActionListCard from './ProjectActionListCard';

function ProjectDepartmentsLayout() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const departments = [
        { name: 'ACCOUNTS', icon: "Calculator", category: 'PRODUCTION' },
        { name: 'ACTION VEHICLES', icon: "Car", category: 'TRANSPORT' },
        { name: 'AERIAL', icon: "Plane", category: 'CAMERA' },
        { name: 'ANIMALS', icon: "PawPrint", category: 'SPECIAL' },
        { name: 'ANIMATION', icon: "Film", category: 'POST' },
        { name: 'ARMOURY', icon: "Shield", category: 'PROPS' },
        { name: 'ART', icon: "Palette", category: 'ART' },
        { name: 'ASSETS', icon: "Box", category: 'PRODUCTION' },
        { name: 'ASSISTANT DIRECTORS', icon: "Clapperboard", category: 'PRODUCTION' },
        { name: 'CAMERA', icon: "Camera", category: 'CAMERA' },
        { name: 'CAST', icon: "Users", category: 'TALENT' },
        { name: 'CHAPERONES', icon: "Heart", category: 'PRODUCTION' },
        { name: 'CHOREOGRAPHY', icon: "Drama", category: 'TALENT' },
        { name: 'CLEARANCES', icon: "FileCheck", category: 'PRODUCTION' },
        { name: 'COMPUTER GRAPHICS', icon: "Cpu", category: 'POST' },
        { name: 'CONSTRUCTION', icon: "HardHat", category: 'ART' },
        { name: 'CONTINUITY', icon: "Eye", category: 'PRODUCTION' },
        { name: 'COSTUME', icon: "Shirt", category: 'WARDROBE' },
        { name: 'COSTUME FX', icon: "Sparkles", category: 'WARDROBE' },
        { name: 'COVID SAFETY', icon: "Plus", category: 'SAFETY' },
        { name: 'CREATURE EFFECTS', icon: "Activity", category: 'SPECIAL' },
        { name: 'DIT', icon: "Monitor", category: 'CAMERA' },
        { name: 'DIGITAL ASSETS', icon: "Database", category: 'POST' },
        { name: 'DIGITAL PLAYBACK', icon: "Video", category: 'POST' },
        { name: 'DIRECTOR', icon: "FilmIcon", category: 'PRODUCTION' },
        { name: 'DOCUMENTARY', icon: "FileText", category: 'PRODUCTION' },
        { name: 'DRAPES', icon: "Layers", category: 'ART' },
        { name: 'EPK', icon: "Image", category: 'PRODUCTION' },
        { name: 'EDITORIAL', icon: "Edit", category: 'POST' },
        { name: 'ELECTRICAL', icon: "Zap", category: 'LIGHTING' },
        { name: 'ELECTRICAL RIGGING', icon: "Grip", category: 'LIGHTING' },
        { name: 'FRANCHISE', icon: "Trophy", category: 'PRODUCTION' },
        { name: 'GREENS', icon: "Trees", category: 'ART' },
        { name: 'GREENSCREENS', icon: "Grid2X2", category: 'SPECIAL' },
        { name: 'GRIP', icon: "Wrench", category: 'CAMERA' },
        { name: 'HAIR AND MAKEUP', icon: "Sparkles", category: 'WARDROBE' },
        { name: 'HEALTH AND SAFETY', icon: "Heart", category: 'SAFETY' },
        { name: 'IT', icon: "Wifi", category: 'PRODUCTION' },
        { name: 'LOCATIONS', icon: "MapPin", category: 'PRODUCTION' },
        { name: 'MARINE', icon: "Anchor", category: 'SPECIAL' },
        { name: 'MEDICAL', icon: "Cross", category: 'SAFETY' },
        { name: 'MILITARY', icon: "Shield", category: 'SPECIAL' },
        { name: 'MUSIC', icon: "Music", category: 'SOUND' },
        { name: 'PHOTOGRAPHY', icon: "Camera", category: 'CAMERA' },
        { name: 'PICTURE VEHICLES', icon: "Truck", category: 'TRANSPORT' },
        { name: 'POST PRODUCTION', icon: "Scissors", category: 'POST' },
        { name: 'PRODUCTION', icon: "Briefcase", category: 'PRODUCTION' },
        { name: 'PROP MAKING', icon: "Wrench", category: 'PROPS' },
        { name: 'PROPS', icon: "Package", category: 'PROPS' },
        { name: 'PROSTHETICS', icon: "Activity", category: 'SPECIAL' },
        { name: 'PUBLICITY', icon: "Megaphone", category: 'PRODUCTION' },
        { name: 'PUPPETEER', icon: "Users", category: 'SPECIAL' },
        { name: 'RIGGING', icon: "Grip", category: 'LIGHTING' },
        { name: 'SFX', icon: "Flame", category: 'SPECIAL' },
        { name: 'SCRIPT', icon: "Scroll", category: 'PRODUCTION' },
        { name: 'SCRIPT EDITING', icon: "Edit", category: 'PRODUCTION' },
        { name: 'SECURITY', icon: "Lock", category: 'SAFETY' },
        { name: 'SET DEC', icon: "Paintbrush", category: 'ART' },
        { name: 'SOUND', icon: "Volume2", category: 'SOUND' },
        { name: 'STANDBY', icon: "Clock", category: 'PRODUCTION' },
        { name: 'STORYBOARD', icon: "BookOpen", category: 'PRODUCTION' },
        { name: 'STUDIO UNIT', icon: "Briefcase", category: 'PRODUCTION' },
        { name: 'STUNTS', icon: "Axe", category: 'SPECIAL' },
        { name: 'SUPPORTING ARTIST', icon: "Users", category: 'TALENT' },
        { name: 'SUSTAINABILITY', icon: "Leaf", category: 'PRODUCTION' },
        { name: 'TRANSPORT', icon: "Bus", category: 'TRANSPORT' },
        { name: 'TUTORS', icon: "GraduationCap", category: 'PRODUCTION' },
        { name: 'UNDERWATER', icon: "Waves", category: 'SPECIAL' },
        { name: 'VFX', icon: "Wand2", category: 'POST' },
        { name: 'VIDEO', icon: "Video", category: 'POST' },
        { name: 'VOICE', icon: "MessageSquare", category: 'SOUND' },
    ];

    const filteredDeparments = departments.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between pr-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    DEPARTMENTS
                </h2>
                <div className='flex gap-2 items-center'>
                    <Badge variant={"outline"} className="px-4 py-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {filteredDeparments.length} DEPARTMENTS
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
                    placeholder="SEARCH DEPARTMENTS..."
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
            {filteredDeparments.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {filteredDeparments.map((department, index) => (
                            <ProjectActionGridCard
                                feature={
                                    {
                                        id: department.name,
                                        label: department.name,
                                        subtitle: department.category,
                                        icon: department.icon
                                    }
                                }
                                key={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDeparments.map((department, index) => (
                            <ProjectActionListCard
                                feature={
                                    {
                                        id: department.name,
                                        label: department.name,
                                        subtitle: department.category,
                                        icon: department.icon
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
                        NO DEPARTMENTS FOUND
                    </p>
                    <p className=" mt-1 text-gray-400 dark:text-gray-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </div>

    )
}

export default ProjectDepartmentsLayout



