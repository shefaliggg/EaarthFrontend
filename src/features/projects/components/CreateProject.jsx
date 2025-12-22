import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PageHeader } from '@/shared/components/PageHeader';

export default function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Project Details
    title: '',
    projectType: '',
    
    // Contact (from timesheet settings)
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    
    // Overall Dates
    prepStart: '',
    prepEnd: '',
    shootStart: '',
    shootEnd: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating project:', formData);
    // Add your project creation logic here
    navigate('/projects');
  };

  return (
    <div className="px-4 pb-8">
      <PageHeader 
        icon="Film"
        title="CREATE NEW PROJECT"
        subtitle="Set up a new production project"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.FileText className="w-5 h-5" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select one below" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature-film">Feature Film</SelectItem>
                  <SelectItem value="television">Television</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact (from timesheet settings) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.User className="w-5 h-5" />
              Contact Page (from Timesheet Setting)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                placeholder="Enter contact person name"
                value={formData.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5" />
              Overall Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prep Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Prep Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepStart">Prep Start *</Label>
                  <Input
                    id="prepStart"
                    type="date"
                    value={formData.prepStart}
                    onChange={(e) => handleChange('prepStart', e.target.value)}
                    placeholder="06/01/2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepEnd">Prep End *</Label>
                  <Input
                    id="prepEnd"
                    type="date"
                    value={formData.prepEnd}
                    onChange={(e) => handleChange('prepEnd', e.target.value)}
                    placeholder="15/02/2025"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shoot Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Shoot Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shootStart">Shoot Start *</Label>
                  <Input
                    id="shootStart"
                    type="date"
                    value={formData.shootStart}
                    onChange={(e) => handleChange('shootStart', e.target.value)}
                    placeholder="16/02/2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shootEnd">Shoot End *</Label>
                  <Input
                    id="shootEnd"
                    type="date"
                    value={formData.shootEnd}
                    onChange={(e) => handleChange('shootEnd', e.target.value)}
                    placeholder="30/05/2025"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            <Icons.Save className="w-4 h-4 mr-2" />
            Create Project
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
            <Icons.X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}