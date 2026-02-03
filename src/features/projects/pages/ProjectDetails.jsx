import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  Clock,
  Users,
  MessageSquare,
  Bell,
  FileStack,
  DollarSign,
  ShoppingCart,
  Truck,
  Play,
  Clipboard,
  Box,
  Dog,
  Car,
  MapPin,
  Cloud,
  Clock2,
  Star,
  Users2,
  Settings
} from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';

const applications = [
  { name: 'Project Chat', icon: MessageSquare, status: 'active' },
  { name: 'Crew', icon: Users, status: 'pending' },
  { name: 'Cast', icon: Users2, status: 'inactive' },
  { name: 'Documents', icon: FileText, status: 'inactive' },
  { name: 'Project Calendar', icon: Calendar, status: 'active' },
  { name: 'Call Sheets', icon: Clipboard, status: 'inactive' },
  { name: 'Shooting Schedule', icon: Clock2, status: 'inactive' },
  { name: 'Asset', icon: Box, status: 'inactive' },
  { name: 'Costume', icon: Users2, status: 'inactive' },
  { name: 'Catering', icon: Truck, status: 'inactive' },
  { name: 'Accounts', icon: DollarSign, status: 'inactive' },
  { name: 'Script', icon: FileStack, status: 'inactive' },
  { name: 'Market', icon: ShoppingCart, status: 'inactive' },
  { name: 'Transport', icon: Truck, status: 'inactive' },
  { name: 'E Player', icon: Play, status: 'inactive' },
  { name: 'Forms', icon: Clipboard, status: 'inactive' },
  { name: 'Props & Assets', icon: Box, status: 'inactive' },
  { name: 'Animals', icon: Dog, status: 'coming-soon' },
  { name: 'Vehicles', icon: Car, status: 'inactive' },
  { name: 'Locations', icon: MapPin, status: 'inactive' },
  { name: 'Cloud', icon: Cloud, status: 'inactive' },
  { name: 'Timesheets', icon: Clock, status: 'inactive' },
  { name: 'Notice Board', icon: Bell, status: 'inactive' },
  { name: 'Script Breakdown', icon: FileStack, status: 'inactive' },
  { name: 'Production Reports', icon: FileText, status: 'inactive' },
  { name: 'Casting Calls', icon: Star, status: 'inactive' },
  { name: 'Budget', icon: DollarSign, status: 'inactive' },
  { name: 'EAARTH Sign', icon: Clipboard, status: 'inactive' }
];

export default function ProjectDashboard() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const displayTitle = projectName ? projectName.replace(/-/g, ' ') : 'Project';

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="PROJECT DASHBOARD" 
        icon="Film"
        secondaryActions={[
          {
            label: "Settings",
            icon: "Settings",
            variant: "default",
            clickAction: () => navigate(`/projects/${projectName}/settings`)
          }
        ]}
      />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {applications.map((app) => (
          <div
            key={app.name}
            className={`rounded-lg border border-gray-200 shadow-sm px-4 py-4 relative ${
              app.status === 'active'
                ? 'bg-white'
                : 'bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-md bg-purple-50 text-purple-700 flex-shrink-0">
                  <app.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm sm:text-base truncate">{app.name}</span>
              </div>
              {app.status === 'pending' && (
                <div className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded whitespace-nowrap">
                  Pending Setup
                </div>
              )}
              {app.status === 'coming-soon' && (
                <div className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded whitespace-nowrap">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}