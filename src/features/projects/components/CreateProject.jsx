// src/features/project/pages/CreateProject.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { PageHeader } from '@/shared/components/PageHeader';
import { useProject } from '../hooks/useProject';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

export default function CreateProject() {
  const navigate = useNavigate();
  const { createProject, isCreating, error, successMessage, resetState, clearErrorMessage, clearSuccessMessage } = useProject();
  
  // Get user's studios from Redux state
  const user = useSelector((state) => {
    if (state.auth?.user) return state.auth.user;
    if (state.user?.user) return state.user.user;
    if (state.authentication?.user) return state.authentication.user;
    if (state.user) return state.user;
    return null;
  });

  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    studioId: '',
    country: '',
    prepStartDate: '',
    prepEndDate: '',
    shootStartDate: '',
    shootEndDate: '',
    wrapStartDate: '',
    wrapEndDate: ''
  });

  const [errors, setErrors] = useState({});

  // Use useMemo to prevent infinite loops
  const finalStudios = useMemo(() => {
    const studios = user?.studios?.filter(s => s.role === 'studio_admin') || [];
    
    // TEMPORARY FALLBACK
    if (studios.length > 0) {
      return studios;
    }
    
    return [{
      studioId: '69494aa6df29472c2c6b5d8f',
      role: 'studio_admin'
    }];
  }, [user]);

  // Auto-select studio if only one (runs once)
  useEffect(() => {
    if (finalStudios.length === 1 && !formData.studioId) {
      const studioId = typeof finalStudios[0].studioId === 'object' 
        ? finalStudios[0].studioId._id || finalStudios[0].studioId.$oid
        : finalStudios[0].studioId;
      
      setFormData(prev => ({ ...prev, studioId }));
    }
  }, []); // Empty array - runs only once

  useEffect(() => {
    return () => resetState();
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
      clearSuccessMessage();
      navigate('/projects');
    }
  }, [successMessage, navigate, clearSuccessMessage]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (!formData.studioId) {
      toast.error('Please select a studio');
      return;
    }

    if (!validateDates()) {
      toast.error('Please fix the date validation errors');
      return;
    }

    await createProject(formData);
  };

  return (
    <div className="px-4 pb-8">
      <PageHeader icon="Film" title="CREATE NEW PROJECT" />

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Icons.Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Your project will be created as a <strong>Draft</strong>. You'll need to submit it for admin approval before it becomes active.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.FileText className="w-5 h-5" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">
                Project Name <span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="projectType">
                Project Type <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.projectType} 
                onValueChange={(value) => handleChange('projectType', value)}
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
              <Label htmlFor="studioId">
                Studio <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.studioId} 
                onValueChange={(value) => handleChange('studioId', value)}
                disabled={finalStudios.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={finalStudios.length === 0 ? "No studios available" : "Select studio"} />
                </SelectTrigger>
                <SelectContent>
                  {finalStudios.map((studio, index) => {
                    const studioId = typeof studio.studioId === 'object' 
                      ? studio.studioId._id || studio.studioId.$oid
                      : studio.studioId;
                    
                    const studioName = typeof studio.studioId === 'object'
                      ? studio.studioId.studioName
                      : 'Rainbow Studios';
                    
                    return (
                      <SelectItem key={studioId || index} value={studioId}>
                        {studioName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {finalStudios.length === 0 && (
                <p className="text-sm text-red-500">
                  You don't have studio admin access. Please contact your administrator.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5" />
              Production Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prep Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Prep Phase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepStartDate">Prep Start <span className="text-red-500">*</span></Label>
                  <Input
                    id="prepStartDate"
                    type="date"
                    value={formData.prepStartDate}
                    onChange={(e) => handleChange('prepStartDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prepEndDate">Prep End <span className="text-red-500">*</span></Label>
                  <Input
                    id="prepEndDate"
                    type="date"
                    value={formData.prepEndDate}
                    onChange={(e) => handleChange('prepEndDate', e.target.value)}
                    required
                    className={errors.prepEndDate ? 'border-red-500' : ''}
                  />
                  {errors.prepEndDate && <p className="text-sm text-red-500">{errors.prepEndDate}</p>}
                </div>
              </div>
            </div>

            {/* Shoot Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Shoot Phase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shootStartDate">Shoot Start <span className="text-red-500">*</span></Label>
                  <Input
                    id="shootStartDate"
                    type="date"
                    value={formData.shootStartDate}
                    onChange={(e) => handleChange('shootStartDate', e.target.value)}
                    required
                    className={errors.shootStartDate ? 'border-red-500' : ''}
                  />
                  {errors.shootStartDate && <p className="text-sm text-red-500">{errors.shootStartDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shootEndDate">Shoot End <span className="text-red-500">*</span></Label>
                  <Input
                    id="shootEndDate"
                    type="date"
                    value={formData.shootEndDate}
                    onChange={(e) => handleChange('shootEndDate', e.target.value)}
                    required
                    className={errors.shootEndDate ? 'border-red-500' : ''}
                  />
                  {errors.shootEndDate && <p className="text-sm text-red-500">{errors.shootEndDate}</p>}
                </div>
              </div>
            </div>

            {/* Wrap Phase */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Wrap Phase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wrapStartDate">Wrap Start <span className="text-red-500">*</span></Label>
                  <Input
                    id="wrapStartDate"
                    type="date"
                    value={formData.wrapStartDate}
                    onChange={(e) => handleChange('wrapStartDate', e.target.value)}
                    required
                    className={errors.wrapStartDate ? 'border-red-500' : ''}
                  />
                  {errors.wrapStartDate && <p className="text-sm text-red-500">{errors.wrapStartDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wrapEndDate">Wrap End <span className="text-red-500">*</span></Label>
                  <Input
                    id="wrapEndDate"
                    type="date"
                    value={formData.wrapEndDate}
                    onChange={(e) => handleChange('wrapEndDate', e.target.value)}
                    required
                    className={errors.wrapEndDate ? 'border-red-500' : ''}
                  />
                  {errors.wrapEndDate && <p className="text-sm text-red-500">{errors.wrapEndDate}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isCreating || finalStudios.length === 0}
          >
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