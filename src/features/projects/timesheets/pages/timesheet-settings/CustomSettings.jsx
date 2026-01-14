import React, { useMemo, useState } from 'react'
import { generateMockCrewData } from '../../config/mockCrewData(temp)';
import CardWrapper from '../../../../../shared/components/wrappers/CardWrapper';
import DataTable from '../../../../../shared/components/tables/DataTable/DataTable';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../../../shared/config/utils';
import { StatusBadge } from '../../../../../shared/components/badges/StatusBadge';

const OVERRIDABLE_FIELDS = [
  // Time & Travel
  { label: 'Travel Time', key: 'paidTravel', type: 'number', unit: 'hrs', category: 'Time' },
  { label: 'Mileage', key: 'mileage', type: 'number', unit: 'mi', category: 'Travel' },

  // Per Diem & Meals
  { label: 'Per Diem (Shoot)', key: 'perDiem', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Per Diem (Non-Shoot)', key: 'perDiemNonShoot', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Breakfast', key: 'breakfast', type: 'boolean', category: 'Meals' },
  { label: 'Lunch', key: 'lunch', type: 'boolean', category: 'Meals' },
  { label: 'Dinner', key: 'dinner', type: 'boolean', category: 'Meals' },

  // Overtime / Penalties
  { label: 'Camera 15s', key: 'cameraOT', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Pre Call', key: 'preOT', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Post Call', key: 'postOT', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'BTA', key: 'bta', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Dawn', key: 'dawn', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Night', key: 'night', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Late Meal', key: 'lateMeal', type: 'number', unit: 'x', category: 'Penalties' },
  { label: 'Broken Meal', key: 'brokenMeal', type: 'number', unit: 'x', category: 'Penalties' },
  { label: 'Travel (OT)', key: 'travel', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Turnaround', key: 'turnaround', type: 'number', unit: 'hrs', category: 'Penalties' },
  { label: 'Add. Hour', key: 'additionalHour', type: 'number', unit: 'hrs', category: 'Overtime' },
  { label: 'Enhanced OT', key: 'enhancedOT', type: 'number', unit: 'hrs', category: 'Overtime' },

  // Other Allowances
  { label: 'Fuel', key: 'fuel', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Computer', key: 'computer', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Software', key: 'software', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Box Rental', key: 'box', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Equipment', key: 'equipment', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Vehicle', key: 'vehicle', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Mobile', key: 'mobile', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Living', key: 'living', type: 'number', unit: '£', category: 'Allowances' },
  { label: 'Meals Allowance', key: 'mealsAllowance', type: 'number', unit: '£', category: 'Allowances' },
];

function CustomSettings() {
  const [customDays, setCustomDays] = useState([
    {
      id: '1',
      dayType: 'Driver - Cast Travel',
      paidAs: 'percentage',
      dailyRatePercent: 150,
      holidayPay: 'accrue',
      sixthSeventhDays: 'resets',
      payAllowances: true,
      showToCrew: true
    },
    {
      id: '2',
      dayType: 'Half Day',
      paidAs: 'percentage',
      dailyRatePercent: 50,
      holidayPay: 'accrue',
      sixthSeventhDays: 'resets',
      payAllowances: true,
      showToCrew: true
    },
    {
      id: '3',
      dayType: 'Sick - Paid',
      paidAs: 'percentage',
      dailyRatePercent: 100,
      holidayPay: 'accrue',
      sixthSeventhDays: 'dont_reset',
      payAllowances: false,
      showToCrew: false
    },
    {
      id: '4',
      dayType: 'Travel & Turnaround',
      paidAs: 'percentage',
      dailyRatePercent: 200,
      holidayPay: 'accrue',
      sixthSeventhDays: 'resets',
      payAllowances: true,
      showToCrew: true
    },
    {
      id: '5',
      dayType: 'Travel Somerset',
      paidAs: 'percentage',
      dailyRatePercent: 150,
      holidayPay: 'accrue',
      sixthSeventhDays: 'resets',
      payAllowances: false,
      showToCrew: false
    }
  ]);

  const [customFields, setCustomFields] = useState([
    { id: '1', name: 'Special stips 3', value: 'N/A' },
    { id: '2', name: 'Special stips 7', value: 'N/A' },
    { id: '3', name: 'Special stips 1', value: 'N/A' },
    { id: '4', name: 'Special stips 5', value: 'N/A' },
    { id: '5', name: 'Special stips 6', value: 'N/A' },
    { id: '6', name: 'Special stips 9', value: 'N/A' },
    { id: '7', name: 'Special stips 2', value: 'N/A' },
    { id: '8', name: 'Special stips 4', value: 'N/A' },
    { id: '9', name: 'Special stips 8', value: 'N/A' },
    { id: '10', name: 'Special stips 1', value: 'N/A' },
    { id: '11', name: 'Special stips 1', value: 'N/A' }
  ]);

  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showAddUpgradeRoleModal, setShowAddUpgradeRoleModal] = useState(false);
  const [productionOverrides, setProductionOverrides] = useState([
    {
      id: 'mock-1',
      date: '2025-11-12', // Wednesday
      crewMemberIds: ['1'], // Mock crew 1
      overrides: [
        { field: 'mileage', value: 100 },
        { field: 'paidTravel', value: 2 }
      ]
    },
    {
      id: 'mock-2',
      date: '2025-11-13', // Thursday
      crewMemberIds: ['2'], // Mock crew 2
      overrides: [
        { field: 'cameraOT', value: 0 },
        { field: 'perDiem', value: 0 },
        { field: 'breakfast', value: false },
        { field: 'lunch', value: false },
        { field: 'dinner', value: false }
      ]
    },
  ]);

  const [editingDay, setEditingDay] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingOverride, setEditingOverride] = useState(null);
  const [editingUpgradeRole, setEditingUpgradeRole] = useState(null);

  // Search state for crew selection
  const [crewSearchTerm, setCrewSearchTerm] = useState('');

  const [upgradeRoles, setUpgradeRoles] = useState([
    { id: '1', name: 'Senior Electrician', rate: 450 },
    { id: '2', name: 'Best Boy', rate: 480 },
    { id: '3', name: 'Gaffer', rate: 520 }
  ]);

  // Form states for new upgrade role
  const [newUpgradeRoleForm, setNewUpgradeRoleForm] = useState({
    name: '',
    rate: 0
  });

  // Form states for new day
  const [newDayForm, setNewDayForm] = useState({
    dayType: '',
    paidAs: 'percentage',
    dailyRatePercent: 100,
    holidayPay: 'accrue',
    sixthSeventhDays: 'resets',
    payAllowances: true,
    showToCrew: true
  });

  // Form states for new field
  const [newFieldForm, setNewFieldForm] = useState({
    name: '',
    value: ''
  });

  // Form state for override
  const [overrideForm, setOverrideForm] = useState({
    date: new Date().toISOString().split('T')[0],
    crewMemberIds: [],
    overrides: [{ field: 'mileage', value: 0 }]
  });

  // Mock Crew Data for Selection
  const allCrew = useMemo(() => generateMockCrewData(), []);
  const departments = useMemo(() => Array.from(new Set(allCrew.map(c => c.department))), [allCrew]);

  const handleAddDay = () => {
    const newDay = {
      id: Date.now().toString(),
      ...newDayForm
    };
    setCustomDays([...customDays, newDay]);
    setShowAddDayModal(false);
    setNewDayForm({
      dayType: '',
      paidAs: 'percentage',
      dailyRatePercent: 100,
      holidayPay: 'accrue',
      sixthSeventhDays: 'resets',
      payAllowances: true,
      showToCrew: true
    });
  };

  const handleDeleteDay = (id) => {
    setCustomDays(customDays.filter(day => day.id !== id));
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now().toString(),
      ...newFieldForm
    };
    setCustomFields([...customFields, newField]);
    setShowAddFieldModal(false);
    setNewFieldForm({ name: '', value: '' });
  };

  const handleDeleteField = (id) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setNewFieldForm({ name: field.name, value: field.value });
    setShowAddFieldModal(true);
  };

  const handleUpdateField = () => {
    if (editingField) {
      setCustomFields(customFields.map(f =>
        f.id === editingField.id
          ? { ...f, name: newFieldForm.name, value: newFieldForm.value }
          : f
      ));
      setEditingField(null);
      setShowAddFieldModal(false);
      setNewFieldForm({ name: '', value: '' });
    }
  };

  // Override Handlers
  const handleAddOverride = () => {
    if (setProductionOverrides) {
      const newOverride = {
        id: Date.now().toString(),
        ...overrideForm
      };
      setProductionOverrides([...productionOverrides, newOverride]);
      setShowOverrideModal(false);
      setOverrideForm({
        date: new Date().toISOString().split('T')[0],
        crewMemberIds: [],
        overrides: [{ field: 'mileage', value: 0 }]
      });
    }
  };

  const handleDeleteOverride = (id) => {
    if (setProductionOverrides) {
      setProductionOverrides(productionOverrides.filter(o => o.id !== id));
    }
  };

  const toggleCrewSelection = (crewId) => {
    const currentIds = overrideForm.crewMemberIds;
    if (currentIds.includes(crewId)) {
      setOverrideForm({ ...overrideForm, crewMemberIds: currentIds.filter(id => id !== crewId) });
    } else {
      setOverrideForm({ ...overrideForm, crewMemberIds: [...currentIds, crewId] });
    }
  };

  const updateOverrideField = (index, field, value) => {
    const newOverrides = [...overrideForm.overrides];
    newOverrides[index] = { field, value };
    setOverrideForm({ ...overrideForm, overrides: newOverrides });
  };

  const addOverrideField = () => {
    setOverrideForm({
      ...overrideForm,
      overrides: [...overrideForm.overrides, { field: 'paidTravel', value: 0 }]
    });
  };

  const removeOverrideField = (index) => {
    const newOverrides = overrideForm.overrides.filter((_, i) => i !== index);
    setOverrideForm({ ...overrideForm, overrides: newOverrides });
  };

  // Upgrade Role Handlers
  const handleAddUpgradeRole = () => {
    if (setUpgradeRoles) {
      const newRole = {
        id: Date.now().toString(),
        ...newUpgradeRoleForm
      };
      setUpgradeRoles([...upgradeRoles, newRole]);
      setShowAddUpgradeRoleModal(false);
      setNewUpgradeRoleForm({ name: '', rate: 0 });
    }
  };

  const handleDeleteUpgradeRole = (id) => {
    if (setUpgradeRoles) {
      setUpgradeRoles(upgradeRoles.filter(r => r.id !== id));
    }
  };

  const handleUpdateUpgradeRole = () => {
    if (editingUpgradeRole && setUpgradeRoles) {
      setUpgradeRoles(upgradeRoles.map(r =>
        r.id === editingUpgradeRole.id
          ? { ...r, ...newUpgradeRoleForm }
          : r
      ));
      setEditingUpgradeRole(null);
      setShowAddUpgradeRoleModal(false);
      setNewUpgradeRoleForm({ name: '', rate: 0 });
    }
  };

  const overrideColumns = [
    {
      key: "date",
      label: "Date",
      render: (row) => row.date,
    },
    {
      key: "crew",
      label: "Crew Members",
      render: (row) => (
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {row.crewMemberIds.slice(0, 3).map((id) => {
              const crew = allCrew.find(c => c.id === id);
              return (
                <div
                  key={id}
                  className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center border border-white text-[10px] text-purple-700 font-bold"
                  title={crew?.name}
                >
                  {crew?.name?.charAt(0)}
                </div>
              );
            })}
            {row.crewMemberIds.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-white text-[10px] text-gray-700 font-bold">
                +{row.crewMemberIds.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs ml-2 text-muted-foreground">{row.crewMemberIds.length} crew</span>
        </div>
      ),
    },
    {
      key: "overrides",
      label: "Overrides",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.overrides.map((o, idx) => {
            const fieldConfig = OVERRIDABLE_FIELDS.find(f => f.key === o.field);
            return (
              <StatusBadge
                className="bg-primary/10 text-primary"
                label={`${fieldConfig?.label || o.field}: ${typeof o.value === 'boolean' ? (o.value ? 'Yes' : 'No') : `${o.value}${fieldConfig?.unit || ''}`}`}
              />
            );
          })}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => handleDeleteOverride(row.id)}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <Trash2 className="size-4 text-red-600" />
        </button>
      ),
    },
  ];

  const upgradeRolesColumns = [
    { key: "name", label: "Role Name", render: row => row.name },
    { key: "rate", label: "Daily Rate (£)", render: row => row.rate.toFixed(2) },
    {
      key: "actions",
      label: "Actions",
      render: row => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingUpgradeRole(row);
              setNewUpgradeRoleForm({ name: row.name, rate: row.rate });
              setShowAddUpgradeRoleModal(true);
            }}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Edit className="size-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteUpgradeRole(row.id)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="size-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  const customDaysColumns = [
    { key: "dayType", label: "Day type", render: row => row.dayType },
    { key: "paidAs", label: "Paid as", render: row => row.paidAs.replace('_', ' ') },
    { key: "dailyRatePercent", label: "Daily rate %", render: row => row.dailyRatePercent.toFixed(2) },
    { key: "holidayPay", label: "Holiday pay", render: row => row.holidayPay.replace('_', ' ') },
    { key: "sixthSeventhDays", label: "6th and 7th days", render: row => row.sixthSeventhDays === 'resets' ? 'Resets day count' : "Don't reset and don't count" },
    { key: "payAllowances", label: "Pay allowances?", render: row => row.payAllowances ? 'Yes' : 'No' },
    { key: "showToCrew", label: "Show to crew?", render: row => row.showToCrew ? 'Yes' : 'No' },
    {
      key: "actions",
      label: "Actions",
      render: row => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingDay(row);
              setNewDayForm(row);
              setShowAddDayModal(true);
            }}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Edit className="size-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteDay(row.id)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="size-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  const customFieldsColumns = [
    { key: "name", label: "Name", render: row => row.name },
    { key: "value", label: "Value", render: row => row.value },
    {
      key: "actions",
      label: "Actions",
      align:"right",
      render: row => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEditField(row)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Edit className="size-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteField(row.id)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="size-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];
  return (
    <div className="space-y-6">

      {/* Daily Allowances / Overrides */}
      <CardWrapper
        title="Daily Allowances / Overrides"
        description="Set specific values for any field (Mileage, Travel, Per Diem, etc.) for selected crew on specific days."
        actions={
          <button
            onClick={() => {
              setShowOverrideModal(true);
              setCrewSearchTerm('');
            }}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" /> Add Override
          </button>
        }
      >
        <DataTable
          data={productionOverrides}
          columns={overrideColumns}
          selectable={false}
          loading={false}
          hidePagination
        />
      </CardWrapper>

      {/* Upgrade Roles */}
      <CardWrapper
        title="Upgrade Roles"
        description="Define available upgrade roles and their default daily rates."
        actions={
          <button
            onClick={() => {
              setEditingUpgradeRole(null);
              setNewUpgradeRoleForm({ name: '', rate: 0 });
              setShowAddUpgradeRoleModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" /> Add Upgrade Role
          </button>
        }
      >
        <DataTable
          data={upgradeRoles}
          columns={upgradeRolesColumns}
          selectable={false}
          loading={false}
          hidePagination
        />
      </CardWrapper>

      {/* Custom Days */}
      <CardWrapper
        title="Custom Days"
        actions={
          <button
            onClick={() => setShowAddDayModal(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" /> Add custom day type
          </button>
        }
      >
        <DataTable
          data={customDays}
          columns={customDaysColumns}
          selectable={false}
          loading={false}
          hidePagination
        />
      </CardWrapper>

      {/* Custom Fields */}
      <CardWrapper
        title="Custom Fields"
        description="Create custom fields for basic pay, overtime, or allowance categories"
        actions={
          <button
            onClick={() => {
              setEditingField(null);
              setNewFieldForm({ name: '', value: '' });
              setShowAddFieldModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" /> Add custom field
          </button>
        }
      >
        <DataTable
          data={customFields}
          columns={customFieldsColumns}
          selectable={false}
          loading={false}
          hidePagination
        />
      </CardWrapper>
    </div>
  );
}

export default CustomSettings