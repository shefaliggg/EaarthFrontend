import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const OrderSummary = ({ formData, updateField, onEdit, onComplete }) => {
  const basePackagePrices = {
    basic: 20,
    agency: 40,
    whitelabel: 70
  };

  const packageDetails = {
    basic: {
      name: 'Basic',
      description: 'Basic Package',
      features: ['🌍 Earth Branding', '10GB Storage', 'Limited Access']
    },
    agency: {
      name: 'Agency',
      description: 'Agency Package',
      features: ['🌍 Earth + 📁 Project Branding', '100GB Storage', 'Full Access']
    },
    whitelabel: {
      name: 'White Label',
      description: 'White Label Package',
      features: ['🎨 Your Studio Branding', 'Unlimited Storage', 'Complete Control']
    }
  };

  const appPrices = {
    calendar: 10,
    callsheets: 5,
    schedule: 8,
    asset: 12,
    costume: 15,
    catering: 20,
    accounts: 25,
    script: 8,
    market: 10,
    transport: 12,
    eplayer: 15,
    forms: 5,
    props: 18,
    animals: 22,
    vehicles: 15,
    locations: 12,
    cloud: 30,
    timesheets: 10,
    noticeboard: 5,
    breakdown: 8,
    reports: 12,
    casting: 20,
    budget: 15,
    eearth_sign: 18
  };

  const appDetails = [
    { id: 'calendar', title: 'Project Calendar' },
    { id: 'callsheets', title: 'Call Sheets' },
    { id: 'schedule', title: 'Shooting Schedule' },
    { id: 'asset', title: 'Asset' },
    { id: 'costume', title: 'Costume' },
    { id: 'catering', title: 'Catering' },
    { id: 'accounts', title: 'Accounts' },
    { id: 'script', title: 'Script' },
    { id: 'market', title: 'Market' },
    { id: 'transport', title: 'Transport' },
    { id: 'eplayer', title: 'E Player' },
    { id: 'forms', title: 'Forms' },
    { id: 'props', title: 'Props & Assets' },
    { id: 'animals', title: 'Animals' },
    { id: 'vehicles', title: 'Vehicles' },
    { id: 'locations', title: 'Locations' },
    { id: 'cloud', title: 'Cloud' },
    { id: 'timesheets', title: 'Timesheets' },
    { id: 'noticeboard', title: 'Notice Board' },
    { id: 'breakdown', title: 'Script Breakdown' },
    { id: 'reports', title: 'Production Reports' },
    { id: 'casting', title: 'Casting Calls' },
    { id: 'budget', title: 'Budget' },
    { id: 'eearth_sign', title: 'EAARTH Sign' }
  ];

  const basePrice = basePackagePrices[formData.packageTier];
  const appsTotal = formData.selectedApplications.reduce((sum, appId) => sum + (appPrices[appId] || 0), 0);
  const weeklyTotal = basePrice + appsTotal;
  const monthlyTotal = weeklyTotal * 4;
  const annualTotal = weeklyTotal * 52;

  const pkg = packageDetails[formData.packageTier];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Review your selections and complete your subscription</p>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Package & Applications */}
        <div className="space-y-4">
          {/* Your Package */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">Your Package</h3>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
              <p className="text-xs text-gray-600">{pkg.description}</p>
              <ul className="text-xs text-gray-600 space-y-0.5 mt-1">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="truncate">{feature}</li>
                ))}
              </ul>
              <p className="text-xs font-semibold text-purple-600 mt-2">
                ${basePrice}/week
              </p>
            </div>
          </div>

          {/* Selected Applications */}
          {formData.selectedApplications.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                Apps ({formData.selectedApplications.length})
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {formData.selectedApplications.map(appId => {
                  const app = appDetails.find(a => a.id === appId);
                  const price = appPrices[appId];
                  return app ? (
                    <div key={appId} className="flex justify-between text-xs">
                      <span className="text-gray-700 truncate pr-2">{app.title}</span>
                      <span className="text-gray-900 font-medium flex-shrink-0">${price}/mo</span>
                    </div>
                  ) : null;
                })}
              </div>
              <button
                onClick={() => onEdit(2)}
                className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Payment & Pricing */}
        <div className="space-y-4">
          {/* Payment Details */}
          <div className="border border-gray-200 rounded-lg p-3 space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Payment</h3>

            {/* Promo Code */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Promo Code</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Code"
                  value={formData.promoCode}
                  onChange={(e) => updateField('promoCode', e.target.value)}
                  className="flex-1 h-7 px-2 rounded text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-2 h-7 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700">
                  Apply
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {[
                  { code: 'SAVE20', discount: '20%' },
                  { code: 'WELCOME10', discount: '10%' }
                ].map(promo => (
                  <button
                    key={promo.code}
                    onClick={() => updateField('promoCode', promo.code)}
                    className="text-xs px-1.5 py-0.5 border border-purple-300 text-purple-600 rounded hover:bg-purple-50"
                    title={promo.discount}
                  >
                    {promo.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Period */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Billing</label>
              <div className="flex gap-1">
                {[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'annual', label: 'Annual' }
                ].map(period => (
                  <button
                    key={period.value}
                    onClick={() => updateField('billingPeriod', period.value)}
                    className={cn(
                      "flex-1 px-2 py-1 rounded text-xs font-medium transition-all",
                      formData.billingPeriod === period.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Weekly:</span>
              <span className="text-gray-900 font-medium">${weeklyTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Monthly:</span>
              <span className="text-gray-900 font-medium">${monthlyTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Annual:</span>
              <span className="text-gray-900 font-medium">${annualTotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-1 mt-1 flex justify-between">
              <span className="text-xs font-semibold text-gray-900">Total:</span>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-600">${weeklyTotal.toFixed(2)}</span>
                <span className="text-xs text-gray-600">/wk</span>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={onComplete}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Complete Subscription
          </button>
        </div>
      </div>
    </div>
  );
};
