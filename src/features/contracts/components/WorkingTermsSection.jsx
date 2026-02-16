import React from 'react';

export default function WorkingTermsSection({ formData, onChange }) {
  const handleChange = (field, value) => {
    onChange('workingTerms', field, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-3">
        Working Terms
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Day Hours
          </label>
          <input
            type="number"
            value={formData.workingTerms.workingDayHours}
            onChange={(e) => handleChange('workingDayHours', parseInt(e.target.value))}
            min="1"
            max="24"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Total hours including travel time</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actual Working Hours
          </label>
          <input
            type="number"
            value={formData.workingTerms.workingHours}
            onChange={(e) => handleChange('workingHours', parseInt(e.target.value))}
            min="1"
            max="24"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Excluding travel time</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Time (minutes)
          </label>
          <input
            type="number"
            value={formData.workingTerms.travelTimeMinutes}
            onChange={(e) => handleChange('travelTimeMinutes', parseInt(e.target.value))}
            step="30"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Split: {formData.workingTerms.travelTimeMinutes / 2} min at start + {formData.workingTerms.travelTimeMinutes / 2} min at end
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overtime Rate (£/hour)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.workingTerms.overtimeRate}
            onChange={(e) => handleChange('overtimeRate', parseFloat(e.target.value))}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overtime Increments (minutes)
          </label>
          <select
            value={formData.workingTerms.overtimeIncrements}
            onChange={(e) => handleChange('overtimeIncrements', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• {formData.workingTerms.workingDayHours} hour working day ({formData.workingTerms.workingHours} hours work + {formData.workingTerms.travelTimeMinutes} mins travel)</li>
          <li>• Overtime: £{formData.workingTerms.overtimeRate}/hour in {formData.workingTerms.overtimeIncrements} minute increments</li>
          <li>• Overtime payable after {formData.workingTerms.workingDayHours} hours with UPM approval</li>
        </ul>
      </div>
    </div>
  );
}