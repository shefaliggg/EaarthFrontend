import React from 'react';

export default function CrewMemberSection({ formData, onChange }) {
  const handleChange = (field, value) => {
    onChange('crewMember', field, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-3">
        Crew Member Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.crewMember.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Smith"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.crewMember.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.smith@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.crewMember.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+44 7123 456789"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citizenship
          </label>
          <input
            type="text"
            value={formData.crewMember.citizenship}
            onChange={(e) => handleChange('citizenship', e.target.value)}
            placeholder="United Kingdom"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.crewMember.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows="2"
            placeholder="123 High Street, London, UK, SW1A 1AA"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of Ordinary Residence
          </label>
          <input
            type="text"
            value={formData.crewMember.residenceCountry}
            onChange={(e) => handleChange('residenceCountry', e.target.value)}
            placeholder="United Kingdom"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}