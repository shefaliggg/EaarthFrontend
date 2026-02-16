import React from 'react';

export default function FeesSection({ formData, onChange }) {
  const handleChange = (field, value) => {
    onChange('fees', field, parseFloat(value) || 0);
  };

  // Calculate holiday rates (12.07%)
  const calculateHolidayRate = (baseRate) => {
    return (baseRate * 0.1207).toFixed(2);
  };

  const calculateTotalRate = (baseRate) => {
    const holidayRate = parseFloat(calculateHolidayRate(baseRate));
    return (baseRate + holidayRate).toFixed(2);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-3">
        Fees & Rates
      </h2>
      
      <div className="space-y-6">
        {/* Weekly Rate */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Weekly Rate (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fees.baseWeeklyRate}
                onChange={(e) => handleChange('baseWeeklyRate', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holiday Rate (12.07%)
              </label>
              <input
                type="text"
                value={calculateHolidayRate(formData.fees.baseWeeklyRate)}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Weekly Rate (£)
              </label>
              <input
                type="text"
                value={calculateTotalRate(formData.fees.baseWeeklyRate)}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Daily Rate */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Daily Rate (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fees.baseDailyRate}
                onChange={(e) => handleChange('baseDailyRate', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holiday Rate (12.07%)
              </label>
              <input
                type="text"
                value={calculateHolidayRate(formData.fees.baseDailyRate)}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Daily Rate (£)
              </label>
              <input
                type="text"
                value={calculateTotalRate(formData.fees.baseDailyRate)}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 6th Day Rate */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">6th Day Rate (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base 6th Day Rate (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fees.base6thDayRate || ''}
                onChange={(e) => handleChange('base6thDayRate', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {formData.fees.base6thDayRate > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holiday Rate (12.07%)
                  </label>
                  <input
                    type="text"
                    value={calculateHolidayRate(formData.fees.base6thDayRate)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total 6th Day Rate (£)
                  </label>
                  <input
                    type="text"
                    value={calculateTotalRate(formData.fees.base6thDayRate)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-yellow-50 font-semibold"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 7th Day Rate */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">7th Day Rate (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base 7th Day Rate (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fees.base7thDayRate || ''}
                onChange={(e) => handleChange('base7thDayRate', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {formData.fees.base7thDayRate > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holiday Rate (12.07%)
                  </label>
                  <input
                    type="text"
                    value={calculateHolidayRate(formData.fees.base7thDayRate)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total 7th Day Rate (£)
                  </label>
                  <input
                    type="text"
                    value={calculateTotalRate(formData.fees.base7thDayRate)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-red-50 font-semibold"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Holiday rates are calculated automatically at 12.07% of the base rate as per UK regulations.
          </p>
        </div>
      </div>
    </div>
  );
}