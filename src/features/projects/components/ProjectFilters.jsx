import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/lib/utils';

export function ProjectFilters({
  search,
  onSearchChange,
  approvalStatus,
  onApprovalStatusChange,
  studioId,
  onStudioChange,
  projectType,
  onProjectTypeChange,
  sort,
  onSortChange,
  studios = [],
  className
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-6">
        {/* Search Bar - Takes 50% width */}
        <div className="flex-1 max-w-[50%]">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search projects by name, code, or country..."
              value={search}
              onChange={onSearchChange}
              className="pl-10 rounded-full bg-background dark:bg-background border-2 border-border focus:bg-background focus:border-primary transition-all h-10 w-full"
            />
          </div>
        </div>

        {/* Four Filters - Takes remaining 50% width */}
        <div className="flex-1 flex items-center gap-3">
          {/* Approval Status Filter */}
          <Select value={approvalStatus || 'all'} onValueChange={onApprovalStatusChange}>
            <SelectTrigger className="h-10 rounded-full border-2">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Studio Filter */}
          <Select value={studioId || 'all'} onValueChange={onStudioChange}>
            <SelectTrigger className="h-10 rounded-full border-2">
              <SelectValue placeholder="All Studios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Studios</SelectItem>
              {studios.map((studio) => (
                <SelectItem key={studio._id} value={studio._id}>
                  {studio.studioName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Project Type Filter */}
          <Select value={projectType || 'all'} onValueChange={onProjectTypeChange}>
            <SelectTrigger className="h-10 rounded-full border-2">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Feature Film">Feature Film</SelectItem>
              <SelectItem value="Television">Television</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 rounded-full border-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="prepStartDate">Prep Start Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}