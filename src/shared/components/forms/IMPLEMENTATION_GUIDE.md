# Editable Form Components - Implementation Guide

## What Was Created

I've created a set of reusable form components that automatically switch between read-only display mode and editable mode, matching the design in your mockup image.

### Files Created

1. **`src/shared/components/forms/EditableInput.jsx`**
   - Single-line text input component
   - Supports all input types (text, email, tel, number, password, etc.)
   - In read-only mode: light gray background, no interaction
   - In edit mode: full interactive input with focus effects

2. **`src/shared/components/forms/EditableTextarea.jsx`**
   - Multi-line text input component
   - For longer text content
   - Same read-only/edit mode behavior as EditableInput

3. **`src/shared/components/forms/EditableSelect.jsx`**
   - Dropdown/select component
   - In read-only mode: displays selected value as text
   - In edit mode: shows full select dropdown
   - Accepts array of `{ value, label }` options

4. **`src/shared/components/forms/index.js`**
   - Barrel export file for easy importing

5. **`src/shared/components/forms/README.md`**
   - Complete documentation with examples

## Key Features

✅ **Visual Design Matching Your Mockup**
- Read-only fields display as light gray (`bg-gray-100` / `dark:bg-gray-800`)
- Edit mode fields have normal styling with borders and focus effects
- Smooth transitions between modes

✅ **Dark Mode Support**
- Full light/dark theme compatibility
- Uses your existing Tailwind dark: classes

✅ **Error Handling**
- Built-in error message display
- Optional error styling (red border in edit mode)

✅ **Accessibility**
- Proper labels with uppercase styling (like your mockup)
- Required field indicators
- Focus management

✅ **Type Support**
- All HTML input types supported
- Custom className prop for additional styling

## How to Use

### Basic Example

```jsx
import { EditableInput } from '@/shared/components/forms';
import { useState } from 'react';

function MyForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('Christopher Fitzpatrick');

  return (
    <div>
      <EditableInput
        isEditing={isEditing}
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter full name"
        required
      />
      
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}
```

### Props Summary

**All Components Share:**
- `isEditing` (boolean) - Control mode
- `label` (string) - Field label
- `value` (string) - Current value
- `onChange` (function) - Change handler
- `placeholder` (string) - Placeholder text
- `required` (boolean) - Show required indicator
- `error` (string) - Error message
- `className` (string) - Additional CSS classes

**EditableInput Only:**
- `type` (string) - Input type (default: "text")

**EditableTextarea Only:**
- `rows` (number) - Number of visible rows (default: 4)

**EditableSelect Only:**
- `options` (array) - Array of { value, label } objects

## Integration Steps

To apply these throughout your app:

1. **Find all form inputs** in your features (AccountSettings, Profile, etc.)

2. **Replace with EditableInput:**
   ```jsx
   // Before
   <input 
     disabled={!isEditing}
     value={name}
     onChange={(e) => setName(e.target.value)}
   />

   // After
   <EditableInput
     isEditing={isEditing}
     label="Full Name"
     value={name}
     onChange={(e) => setName(e.target.value)}
   />
   ```

3. **Replace all textareas** with EditableTextarea

4. **Replace all selects** with EditableSelect

5. **Test both modes** (isEditing true/false)

## Example Implementation - Complete Form

Here's a complete example showing how to structure a form:

```jsx
import { useState } from 'react';
import { EditableInput, EditableTextarea, EditableSelect } from '@/shared/components/forms';
import { Save, Edit } from 'lucide-react';

export default function RecipientForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Christopher Fitzpatrick',
    email: 'christofitz@hotmail.com',
    phone: '07949687641',
    emergencyContact: 'Jane Fitzpatrick',
    spouse: '+44 7700 900123',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
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

  const handleSave = async () => {
    // Validate
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to API
    // setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Recipient Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? 'Edit recipient details' : 'View recipient details'}
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            isEditing 
              ? 'bg-accent text-accent-foreground hover:opacity-90' 
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
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
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableInput
          isEditing={isEditing}
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Enter full name"
          required
          error={errors.fullName}
        />

        <EditableInput
          isEditing={isEditing}
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="Enter email"
          required
          error={errors.email}
        />

        <EditableInput
          isEditing={isEditing}
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="Enter phone number"
        />

        <EditableInput
          isEditing={isEditing}
          label="Emergency Contact"
          value={formData.emergencyContact}
          onChange={handleChange('emergencyContact')}
          placeholder="Contact name"
        />
      </div>

      {/* Full-width textarea */}
      <EditableTextarea
        isEditing={isEditing}
        label="Additional Notes"
        value={formData.notes}
        onChange={handleChange('notes')}
        placeholder="Any additional notes..."
        rows={5}
      />
    </div>
  );
}
```

## Styling Details

### Visual States

**Read-Only (isEditing = false)**
```
┌─────────────────────────────┐
│ Light Gray Background       │  Light gray, no border
│ Text is non-interactive     │  Looks like "display only"
└─────────────────────────────┘
```

**Edit Mode (isEditing = true)**
```
┌─────────────────────────────┐
│ Normal Background with      │  Border visible
│ Border & Focus Ring         │  Can type/interact
└─────────────────────────────┘
```

**Error State**
```
┌─────────────────────────────┐
│ ✗ Error Message Below      │  Red border
│ Field with Red Border       │  Red error text
└─────────────────────────────┘
```

## Next Steps

1. ✅ Components are ready to use
2. ⏭️ Start replacing form inputs in your pages
3. ⏭️ Test in both edit and read-only modes
4. ⏭️ Adjust styling/colors if needed

## Support & Customization

If you need to:

- **Change colors:** Modify the `className` props in the component
- **Add validation:** Pass error messages via the `error` prop
- **Add icons:** Wrap components in a div with icon elements
- **Adjust spacing:** Use the `className` prop for additional margins/padding

All components are fully customizable via props and className!
