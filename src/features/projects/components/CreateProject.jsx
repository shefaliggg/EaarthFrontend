import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PageHeader } from '@/shared/components/PageHeader';

export function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phase: '',
    budget: '',
    startDate: '',
    endDate: '',
    director: '',
    producer: '',
    description: ''
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
    <div className="container mx-auto p-6 max-w-4xl">
      <PageHeader 
        icon="Film"
        title="CREATE NEW PROJECT"
        subtitle="Set up a new production project"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Project Phase */}
            <div className="space-y-2">
              <Label htmlFor="phase">Production Phase *</Label>
              <Select value={formData.phase} onValueChange={(value) => handleChange('phase', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="pre-production">Pre-Production</SelectItem>
                  <SelectItem value="principal-photography">Principal Photography</SelectItem>
                  <SelectItem value="post-production">Post-Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="150000000"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Key Personnel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  placeholder="Enter director name"
                  value={formData.director}
                  onChange={(e) => handleChange('director', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producer">Producer</Label>
                <Input
                  id="producer"
                  placeholder="Enter producer name"
                  value={formData.producer}
                  onChange={(e) => handleChange('producer', e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description and synopsis"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Icons.Save className="w-4 h-4 mr-2" />
                Create Project
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}