import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { PageHeader } from '@/shared/components/PageHeader';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'James Cameron',
    role: 'Director',
    department: 'Direction',
    project: 'AVATAR 1',
    email: 'jcameron@studio.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    initials: 'JC'
  },
  {
    id: 2,
    name: 'Jon Landau',
    role: 'Producer',
    department: 'Production',
    project: 'AVATAR 1',
    email: 'jlandau@studio.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Russell Carpenter',
    role: 'Cinematographer',
    department: 'Camera',
    project: 'AVATAR 3',
    email: 'rcarpenter@studio.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    initials: 'RC'
  },
  {
    id: 4,
    name: 'Stephen Rivkin',
    role: 'Editor',
    department: 'Post-Production',
    project: 'Sci-Fi Thriller',
    email: 'srivkin@studio.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    initials: 'SR'
  },
  {
    id: 5,
    name: 'Rick Carter',
    role: 'Production Designer',
    department: 'Art Department',
    project: 'AVATAR 4',
    email: 'rcarter@studio.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    initials: 'RC'
  },
  {
    id: 6,
    name: 'Simon Franglen',
    role: 'Composer',
    department: 'Music',
    project: 'AVATAR 1',
    email: 'sfranglen@studio.com',
    phone: '+1 (555) 678-9012',
    status: 'inactive',
    initials: 'SF'
  }
];

export function ManageTeam() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeam = TEAM_MEMBERS.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          icon="Users"
          title="TEAM MANAGEMENT"
          subtitle="Manage crew members and departments"
        />
        
        <Button onClick={() => console.log('Add team member')}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          ADD TEAM MEMBER
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search team members by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Crew</p>
              <p className="text-3xl font-bold">{TEAM_MEMBERS.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {TEAM_MEMBERS.filter(m => m.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Departments</p>
              <p className="text-3xl font-bold">
                {new Set(TEAM_MEMBERS.map(m => m.department)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Avg per Project</p>
              <p className="text-3xl font-bold">155</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({filteredTeam.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeam.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icons.Briefcase className="w-3 h-3" />
                        {member.role}
                      </span>
                      <span>{member.department}</span>
                      <span className="text-blue-600">{member.project}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Icons.Mail className="w-3 h-3" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Phone className="w-3 h-3" />
                        {member.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}