import React, { useState } from 'react';
import {
  Cloud, Folder, File, Image, Video, Music, FileText,
  Download, Share2, Trash2, Star, Clock, Grid, List,
  ChevronRight, Search, Plus, Upload, MoreVertical,
  FolderPlus, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import { Button } from '../../../shared/components/ui/button';
import ProjectActionListCard from '../components/ProjectActionListCard';
import ProjectActionGridCard from '../components/ProjectActionGridCard';
import ProjectActionTable from '../components/ProjectActionTable';
import { Badge } from '../../../shared/components/ui/badge';

function ProjectCloudStorage() {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPath, setCurrentPath] = useState(['All Files']);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated file store grouped by path (basic demo data)
  const files = [
    { id: '1', name: 'Scene Assets', icon: "Folder", type: 'folder', modified: '2 days ago', starred: true },
    { id: '2', name: 'Character Designs', icon: "Folder", type: 'folder', modified: '5 days ago' },
    { id: '3', name: 'Storyboards', icon: "Folder", type: 'folder', modified: '1 week ago' },
    { id: '4', name: 'Animation_Final_v3.mp4', icon: "Video", type: 'video', size: '2.3 GB', modified: '3 hours ago', starred: true },
    { id: '5', name: 'Character_Sketch_01.png', icon: "Image", type: 'image', size: '5.2 MB', modified: '1 day ago' },
    { id: '6', name: 'Scene_42_Audio.wav', icon: "Music", type: 'audio', size: '120 MB', modified: '2 days ago' },
    { id: '7', name: 'Production_Notes.pdf', icon: "FileText", type: 'document', size: '890 KB', modified: '3 days ago' },
    { id: '8', name: 'Background_Art.psd', icon: "Image", type: 'image', size: '450 MB', modified: '4 days ago', shared: true },
  ];

  const displayedFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  //   const base = 'w-full h-full';
  //   switch (type) {
  //     case 'folder':
  //       return <Folder className={`${base} text-blue-500`} />;
  //     case 'image':
  //       return <Image className={`${base} text-green-500`} />;
  //     case 'video':
  //       return <Video className={`${base} text-[#a855f7]`} />;
  //     case 'audio':
  //       return <Music className={`${base} text-pink-500`} />;
  //     case 'document':
  //       return <FileText className={`${base} text-red-500`} />;
  //     default:
  //       return <File className={`${base} text-gray-500`} />;
  //   }
  // };

  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedItems([]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-6 p-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-10 h-10 text-[#a855f7]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CLOUD STORAGE</h1>
                <p className="text-sm text-gray-500">Project files and assets</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size={"lg"}>
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload New</span>
              </Button>

              <Button size={"lg"} variant={"outline"}>
                <FolderPlus className="w-4 h-4" />
                <span className="text-sm">New Folder</span>
              </Button>
            </div>
          </div>

          {/* Storage Indicator (placed below title as requested) */}
          <div className='px-1'>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">STORAGE USED</div>
              <div className="text-sm font-bold text-gray-900">45.2 GB of 100 GB</div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#9333ea] w-[45%]" />
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4">QUICK ACCESS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="flex items-center gap-2 p-3 bg-[#faf5ff] border border-gray-100 rounded-lg hover:bg-[#e9d5ff] transition-colors">
              <Star className="w-5 h-5 text-[#9333ea]" />
              <span className="text-sm font-medium text-gray-900">Starred</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-[#faf5ff] border border-gray-100 rounded-lg hover:bg-[#e9d5ff] transition-colors">
              <Share2 className="w-5 h-5 text-[#9333ea]" />
              <span className="text-sm font-medium text-gray-900">Shared</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-[#faf5ff] border border-gray-100 rounded-lg hover:bg-[#e9d5ff] transition-colors">
              <Clock className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm font-medium text-gray-900">Recent</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-[#faf5ff] border border-gray-100 rounded-lg hover:bg-[#e9d5ff] transition-colors">
              <Trash2 className="w-5 h-5 text-[#9333ea]" />
              <span className="text-sm font-medium text-gray-900">Trash</span>
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH FILES..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent"
            />
          </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {selectedItems.length > 0 && (
            <Badge variant={"outline"} className="text-sm text-gray-600 px-3">{selectedItems.length} selected</Badge>
          )}
          </div>

          <div className='flex gap-3 items-center'>
            <div className="flex items-center gap-2">
              {/* When in selection mode show download/delete for selected count */}
              {selectedItems.length > 0 && (
                <>
                  <Button variant={"secondary"}>
                    <Download className="w-4 h-4" />
                    Download ({selectedItems.length})
                  </Button>
                  <Button variant={"destructive"} onClick={() => alert('Delete ' + selectedItems.length + ' items')}>
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedItems.length})
                  </Button>
                  <Button variant={"outline"} onClick={clearSelection}>
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                </>
              )}
            </div>
            <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {displayedFiles.map((file, index) => (
              <ProjectActionGridCard
                feature={
                  {
                    id: file.name,
                    label: file.name,
                    subtitle: file.type,
                    icon: file.icon
                  }
                }
                key={index}
              />
            ))}
          </div>
        )}

        {/* List View - Category Cards */}
        {viewMode === 'list' && (
          <ProjectActionTable files={displayedFiles} selectedItems={selectedItems} toggleSelect={toggleSelect} />
          // <div className="space-y-4">
          //   {displayedFiles.map((file, index) => (
          //     <ProjectActionListCard
          //       feature={
          //         {
          //           id: file.name,
          //           label: file.name,
          //           subtitle: file.folder,
          //           icon: file.icon
          //         }
          //       }
          //       key={index}
          //     />
          //   ))}
          // </div>
        )}

      </div>
    </div>
  );
}

export default ProjectCloudStorage;








