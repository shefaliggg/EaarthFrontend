# Editable Form Components

A set of reusable form components that seamlessly switch between read-only display mode and editable mode.

## Features

- **Automatic styling**: Fields display as light gray disabled-looking inputs when not in edit mode
- **Edit mode activation**: When `isEditing` is `true`, fields become fully interactive
- **Consistent design**: Matches the form design shown in your mockups
- **Error support**: Built-in error message display
- **Dark mode support**: Full light/dark theme support
- **Type safe**: Full TypeScript support (can be added if needed)

## Components

### EditableInput

For single-line text input fields (text, email, phone, number, etc.)

```jsx
import { EditableInput } from '@/shared/components/forms';
import { useState } from 'react';

function MyForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('Christopher Fitzpatrick');
  const [email, setEmail] = useState('christofitz@hotmail.com');
  const [errors, setErrors] = useState({});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableInput
          isEditing={isEditing}
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
          required
          error={errors.fullName}
        />

        <EditableInput
          isEditing={isEditing}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          required
          error={errors.email}
        />

        <EditableInput
          isEditing={isEditing}
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <button
        onClick={() => setIsEditing(!isEditing)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>
    </div>
  );
}
```

### EditableTextarea

For multi-line text content.

```jsx
import { EditableTextarea } from '@/shared/components/forms';

function MyForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Your bio content...');

  return (
    <EditableTextarea
      isEditing={isEditing}
      label="Bio"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      placeholder="Tell us about yourself"
      rows={5}
      required
    />
  );
}
```

### EditableSelect

For dropdown/select fields.

```jsx
import { EditableSelect } from '@/shared/components/forms';

function MyForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [department, setDepartment] = useState('');

  const departmentOptions = [
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
  ];

  return (
    <EditableSelect
      isEditing={isEditing}
      label="Department"
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      options={departmentOptions}
      placeholder="Select a department"
      required
    />
  );
}
```

## Props

### Common Props (all components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isEditing` | `boolean` | `false` | Whether the field is in edit mode |
| `label` | `string` | - | Label displayed above the field |
| `value` | `string` | - | Current value of the field |
| `onChange` | `function` | - | Callback when value changes |
| `placeholder` | `string` | `""` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `required` | `boolean` | `false` | Show required indicator |
| `error` | `string` | - | Error message to display |

### EditableInput Specific

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `"text"` | Input type (text, email, tel, number, password, etc.) |

### EditableTextarea Specific

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `4` | Number of visible text rows |

### EditableSelect Specific

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array` | `[]` | Array of `{ value, label }` objects |

## Styling

The components automatically handle styling based on the `isEditing` state:

### Read-only Mode (isEditing = false)
- Light gray background (`bg-gray-100` / `dark:bg-gray-800`)
- No border
- Non-interactive appearance
- Text is read-only

### Edit Mode (isEditing = true)
- Normal background with border
- Focus ring on interaction
- Fully interactive
- Hover effects

## Usage Pattern

Here's the recommended pattern for integrating these components:

```jsx
import { useState } from 'react';
import { EditableInput, EditableTextarea, EditableSelect } from '@/shared/components/forms';

export default function RecipientForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Christopher Fitzpatrick',
    email: 'christofitz@hotmail.com',
    phone: '07949687641',
    emergencyContact: 'Jane Fitzpatrick',
    spouse: '+44 7700 900123',
  });

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    // Validate form
    // Send to API
    // Handle response
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recipient Details</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-4 py-2 rounded-lg font-medium ${
            isEditing 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableInput
          isEditing={isEditing}
          label="Full Name"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          required
        />

        <EditableInput
          isEditing={isEditing}
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
        />

        <EditableInput
          isEditing={isEditing}
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange('phone')}
        />

        <EditableInput
          isEditing={isEditing}
          label="Emergency Contact"
          value={formData.emergencyContact}
          onChange={handleInputChange('emergencyContact')}
        />
      </div>
    </div>
  );
}
```

## Integration Steps

To apply these components throughout your app:

1. **Replace existing form inputs** in your forms with `EditableInput`
2. **Replace textareas** with `EditableTextarea`
3. **Replace select dropdowns** with `EditableSelect`
4. **Pass the `isEditing` state** to all editable components
5. **Test in both modes** to ensure proper styling and functionality

## Dark Mode Support

All components fully support dark mode through Tailwind CSS dark mode classes. Test with:

```bash
# In your layout or document root
<html class="dark">
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers
