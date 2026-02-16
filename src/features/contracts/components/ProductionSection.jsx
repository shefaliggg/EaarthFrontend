import React from 'react';

export default function ProductionSection({ formData, onChange }) {
  const handleChange = (field, value) => {
    onChange('production', field, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-3">
        Production Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Film Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.production.filmTitle}
            onChange={(e) => handleChange('filmTitle', e.target.value)}
            placeholder="e.g., WERWULF"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producer Entity
          </label>
          <input
            type="text"
            value={formData.production.producerEntity}
            onChange={(e) => handleChange('producerEntity', e.target.value)}
            placeholder="MIRAGE PICTURES LIMITED"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producer Address
          </label>
          <textarea
            value={formData.production.producerAddress}
            onChange={(e) => handleChange('producerAddress', e.target.value)}
            rows="2"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producer Phone
          </label>
          <input
            type="tel"
            value={formData.production.producerPhone}
            onChange={(e) => handleChange('producerPhone', e.target.value)}
            placeholder="+44 20 1234 5678"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Production Base
          </label>
          <input
            type="text"
            value={formData.production.productionBase}
            onChange={(e) => handleChange('productionBase', e.target.value)}
            placeholder="e.g., Pinewood Studios, London"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}