/**
 * EXAMPLE: Complete Form Using Editable Components
 * 
 * This file demonstrates the recommended pattern for using the
 * EditableInput, EditableSelect, and EditableTextarea components
 * throughout your application.
 * 
 * Copy this pattern to any form page you want to update.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit } from 'lucide-react';
import { 
  EditableInput, 
  EditableSelect, 
  EditableTextarea 
} from '@/shared/components/forms';

/**
 * EXAMPLE FORM COMPONENT
 * Shows all three types of editable fields
 */
export default function CompleteFormExample() {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: 'Christopher Fitzpatrick',
    email: 'christofitz@hotmail.com',
    phone: '07949687641',
    jobTitle: 'SMUFX Modeller',
    department: 'Prosthetics',
    workplace: 'Off set',
    startDate: '2026-01-06',
    endDate: '2026-03-13',
    notes: 'Ad hoc days. Off-set rate: £400; on-set upgraded rate £500',
    additionalNotes: 'SCHD',
  });

  // Error state for validation
  const [errors, setErrors] = useState({});

  // Handle input change for text fields
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle save action
  const handleSave = async () => {
    // Validate form
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to API
    console.log('Saving form data:', formData);
    // await api.updateProfile(formData);
    
    // Exit edit mode
    setIsEditing(false);
  };

  // Select options for dropdowns
  const departmentOptions = [
    { value: 'prosthetics', label: 'Prosthetics' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'costume', label: 'Costume' },
    { value: 'vfx', label: 'VFX' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* ==================== HEADER ==================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offer Details</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isEditing ? 'Edit offer information' : 'View offer information'}
          </p>
        </div>

        {/* Edit/Save Button */}
        <motion.button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isEditing
              ? 'bg-accent text-accent-foreground hover:opacity-90'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit
            </>
          )}
        </motion.button>
      </div>

      {/* ==================== RECIPIENT SECTION ==================== */}
      <div className="bg-card rounded-lg border border-border p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-lg font-semibold">Recipient</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableInput
            isEditing={isEditing}
            label="Full Name"
            value={formData.fullName}
            onChange={handleInputChange('fullName')}
            placeholder="Enter full name"
            required
            error={errors.fullName}
          />

          <EditableInput
            isEditing={isEditing}
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="Enter email address"
            required
            error={errors.email}
          />

          <EditableInput
            isEditing={isEditing}
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            placeholder="Enter phone number"
          />

          <EditableInput
            isEditing={isEditing}
            label="Job Title"
            value={formData.jobTitle}
            onChange={handleInputChange('jobTitle')}
            placeholder="Enter job title"
            required
          />
        </div>
      </div>

      {/* ==================== OFFER DETAILS SECTION ==================== */}
      <div className="bg-card rounded-lg border border-border p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-lg font-semibold">Offer Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableSelect
            isEditing={isEditing}
            label="Department"
            value={formData.department}
            onChange={handleInputChange('department')}
            options={departmentOptions}
            placeholder="Select department"
          />

          <EditableInput
            isEditing={isEditing}
            label="Workplace"
            value={formData.workplace}
            onChange={handleInputChange('workplace')}
            placeholder="Enter workplace"
          />

          <EditableInput
            isEditing={isEditing}
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange('startDate')}
          />

          <EditableInput
            isEditing={isEditing}
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange('endDate')}
          />
        </div>
      </div>

      {/* ==================== NOTES SECTION ==================== */}
      <div className="bg-card rounded-lg border border-border p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-lg font-semibold">Notes</h2>
        </div>

        <EditableTextarea
          isEditing={isEditing}
          label="Other Deal Provisions"
          value={formData.notes}
          onChange={handleInputChange('notes')}
          placeholder="Enter any special provisions..."
          rows={4}
        />

        <EditableTextarea
          isEditing={isEditing}
          label="Additional Notes"
          value={formData.additionalNotes}
          onChange={handleInputChange('additionalNotes')}
          placeholder="Enter additional notes..."
          rows={3}
        />
      </div>

      {/* ==================== ACTION BUTTONS ==================== */}
      {isEditing && (
        <div className="flex gap-4 justify-end">
          <motion.button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

/**
 * USAGE NOTES:
 * 
 * 1. Import the components:
 *    import { EditableInput, EditableSelect, EditableTextarea } from '@/shared/components/forms';
 * 
 * 2. Set up state for edit mode:
 *    const [isEditing, setIsEditing] = useState(false);
 * 
 * 3. Set up form data state:
 *    const [formData, setFormData] = useState({...});
 * 
 * 4. Use the components with isEditing prop:
 *    <EditableInput isEditing={isEditing} label="Field" value={value} onChange={handler} />
 * 
 * 5. The components automatically handle:
 *    - Light gray background in view mode
 *    - Normal styling in edit mode
 *    - Focus effects
 *    - Error display
 *    - Dark mode support
 * 
 * PROPS REFERENCE:
 * 
 * EditableInput:
 *   - isEditing (boolean): Control read-only/edit mode
 *   - label (string): Field label
 *   - type (string): Input type (text, email, tel, number, date, etc.)
 *   - value (string): Current value
 *   - onChange (function): Change handler
 *   - placeholder (string): Placeholder text
 *   - required (boolean): Show required indicator
 *   - error (string): Error message to display
 * 
 * EditableSelect:
 *   - isEditing (boolean): Control read-only/edit mode
 *   - label (string): Field label
 *   - value (string): Current value
 *   - onChange (function): Change handler
 *   - options (array): Array of { value, label } objects
 *   - required (boolean): Show required indicator
 *   - error (string): Error message to display
 * 
 * EditableTextarea:
 *   - isEditing (boolean): Control read-only/edit mode
 *   - label (string): Field label
 *   - value (string): Current value
 *   - onChange (function): Change handler
 *   - placeholder (string): Placeholder text
 *   - rows (number): Number of visible rows
 *   - required (boolean): Show required indicator
 *   - error (string): Error message to display
 */
