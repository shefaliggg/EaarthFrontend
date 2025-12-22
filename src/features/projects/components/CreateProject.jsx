import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Textarea } from '../../../shared/components/ui/textarea';
import { PageHeader } from '../../../shared/components/PageHeader';
import { useProject } from '../hooks/useProject';
import { toast } from 'sonner';

export default function CreateProject() {
  const navigate = useNavigate();
  const { createProject, isCreating, error, successMessage, resetState, clearErrorMessage } = useProject();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    projectType: '',
    country: '',
    prepStartDate: '',
    prepEndDate: '',
    shootStartDate: '',
    shootEndDate: '',
    wrapStartDate: '',
    wrapEndDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      resetState();
    };
  }, [resetState]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrorMessage();
    }
  }, [error, clearErrorMessage]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      navigate('/projects');
    }
  }, [successMessage, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateDates = () => {
    const newErrors = {};
    const {
      prepStartDate,
      prepEndDate,
      shootStartDate,
      shootEndDate,
      wrapStartDate,
      wrapEndDate
    } = formData;

    // Convert to Date objects for comparison
    const prepStart = new Date(prepStartDate);
    const prepEnd = new Date(prepEndDate);
    const shootStart = new Date(shootStartDate);
    const shootEnd = new Date(shootEndDate);
    const wrapStart = new Date(wrapStartDate);
    const wrapEnd = new Date(wrapEndDate);

    if (prepEnd <= prepStart) {
      newErrors.prepEndDate = 'Prep end date must be after prep start date';
    }

    if (shootStart <= prepEnd) {
      newErrors.shootStartDate = 'Shoot start date must be after prep end date';
    }

    if (shootEnd <= shootStart) {
      newErrors.shootEndDate = 'Shoot end date must be after shoot start date';
    }

    if (wrapStart <= shootEnd) {
      newErrors.wrapStartDate = 'Wrap start date must be after shoot end date';
    }

    if (wrapEnd <= wrapStart) {
      newErrors.wrapEndDate = 'Wrap end date must be after wrap start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    if (!validateDates()) {
      toast.error('Please fix the date validation errors');
      return;
    }

    const result = await createProject(formData);
    
    if (result.type === 'project/create/fulfilled') {
      // Success is handled in useEffect
    } else {
      // Error is handled in useEffect
    }
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
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description (optional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select 
                value={formData.projectType} 
                onValueChange={(value) => handleChange('projectType', value)} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feature Film">Feature Film</SelectItem>
                  <SelectItem value="Television">Television</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
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
                  <Label htmlFor="prepStartDate">Prep Start *</Label>
                  <Input
                    id="prepStartDate"
                    type="date"
                    value={formData.prepStartDate}
                    onChange={(e) => handleChange('prepStartDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepEndDate">Prep End *</Label>
                  <Input
                    id="prepEndDate"
                    type="date"
                    value={formData.prepEndDate}
                    onChange={(e) => handleChange('prepEndDate', e.target.value)}
                    required
                    className={errors.prepEndDate ? 'border-red-500' : ''}
                  />
                  {errors.prepEndDate && (
                    <p className="text-sm text-red-500">{errors.prepEndDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shoot Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Shoot Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shootStartDate">Shoot Start *</Label>
                  <Input
                    id="shootStartDate"
                    type="date"
                    value={formData.shootStartDate}
                    onChange={(e) => handleChange('shootStartDate', e.target.value)}
                    required
                    className={errors.shootStartDate ? 'border-red-500' : ''}
                  />
                  {errors.shootStartDate && (
                    <p className="text-sm text-red-500">{errors.shootStartDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shootEndDate">Shoot End *</Label>
                  <Input
                    id="shootEndDate"
                    type="date"
                    value={formData.shootEndDate}
                    onChange={(e) => handleChange('shootEndDate', e.target.value)}
                    required
                    className={errors.shootEndDate ? 'border-red-500' : ''}
                  />
                  {errors.shootEndDate && (
                    <p className="text-sm text-red-500">{errors.shootEndDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Wrap Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Wrap Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wrapStartDate">Wrap Start *</Label>
                  <Input
                    id="wrapStartDate"
                    type="date"
                    value={formData.wrapStartDate}
                    onChange={(e) => handleChange('wrapStartDate', e.target.value)}
                    required
                    className={errors.wrapStartDate ? 'border-red-500' : ''}
                  />
                  {errors.wrapStartDate && (
                    <p className="text-sm text-red-500">{errors.wrapStartDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wrapEndDate">Wrap End *</Label>
                  <Input
                    id="wrapEndDate"
                    type="date"
                    value={formData.wrapEndDate}
                    onChange={(e) => handleChange('wrapEndDate', e.target.value)}
                    required
                    className={errors.wrapEndDate ? 'border-red-500' : ''}
                  />
                  {errors.wrapEndDate && (
                    <p className="text-sm text-red-500">{errors.wrapEndDate}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={isCreating}>
            {isCreating ? (
              <>
                <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icons.Save className="w-4 h-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/projects')}
            disabled={isCreating}
          >
            <Icons.X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}