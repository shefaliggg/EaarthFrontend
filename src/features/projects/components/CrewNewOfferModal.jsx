import React, { useState } from 'react';
import { X } from 'lucide-react';
import RoleConfigurationTab from './RoleConfigurationTab';

// Input Component
const Input = ({ type = 'text', value, onChange, placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-4 py-2 rounded-lg border shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
  />
);

// Textarea Component
const Textarea = ({ value, onChange, placeholder, maxLength }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    maxLength={maxLength}
    className="w-full px-4 py-2 rounded-lg border shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7] resize-none"
    rows={4}
  />
);

// Select Component
const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2 rounded-lg border shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
  >
    <option value="">SELECT AN OPTION</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Checkbox Component
const Checkbox = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-[#9333ea] focus:ring-2 focus:ring-[#a855f7]"
    />
    <span className="text-gray-900 dark:text-white font-medium">{label}</span>
  </label>
);

// RadioGroup Component
const RadioGroup = ({ value, onChange, options }) => (
  <div className="space-y-3">
    {options.map((opt) => (
      <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          name="radio-group"
          value={opt.value}
          checked={value === opt.value}
          onChange={(e) => onChange(e.target.value)}
          className="w-5 h-5 border-gray-300 dark:border-gray-600 text-[#9333ea] focus:ring-2 focus:ring-[#a855f7]"
        />
        <span className="text-gray-900 dark:text-white font-medium">{opt.label}</span>
      </label>
    ))}
  </div>
);

// FormField Component
const FormField = ({ label, required, tooltip, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({tooltip})</span>}
    </label>
    {children}
  </div>
);

export default function NewOfferModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    isViaAgent: false,
    alternativeContract: '',
    allowSelfEmployed: '',
    statusDeterminationReason: '',
    otherStatusReason: '',
    otherDealProvisions: '',
    additionalNotes: ''
  });

  const [jobTitles, setJobTitles] = useState([]);

  const handleSave = () => {
    onSave({ ...formData, jobTitles });
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      isViaAgent: false,
      alternativeContract: '',
      allowSelfEmployed: '',
      statusDeterminationReason: '',
      otherStatusReason: '',
      otherDealProvisions: '',
      additionalNotes: ''
    });
    setJobTitles([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full container my-8 rounded-3xl border shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center rounded-t-3xl justify-between p-6 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            NEW OFFER
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* RECIPIENT SECTION */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b text-[#9333ea] dark:text-[#c084fc] border-gray-200 dark:border-gray-700">
              RECIPIENT
            </h4>
            <div className="space-y-4">
              <FormField label="FULL NAME" required>
                <Input
                  value={formData.fullName}
                  onChange={(v) => setFormData({ ...formData, fullName: v })}
                  placeholder="ENTER FULL NAME"
                />
              </FormField>

              <FormField
                label="EMAIL"
                required
                tooltip="Ensure this is the recipient's preferred email address for use on their engine account"
              >
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                  placeholder="EMAIL@EXAMPLE.COM"
                />
              </FormField>

              <FormField label="MOBILE NUMBER" required>
                <Input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(v) => setFormData({ ...formData, mobileNumber: v })}
                  placeholder="07XXX XXXXXX"
                />
              </FormField>

              <Checkbox
                checked={formData.isViaAgent}
                onChange={(v) => setFormData({ ...formData, isViaAgent: v })}
                label="CHECK THE BOX IF THIS DEAL IS VIA AN AGENT"
              />

              <FormField label="ALTERNATIVE CONTRACT">
                <Select
                  value={formData.alternativeContract}
                  onChange={(v) => setFormData({ ...formData, alternativeContract: v })}
                  options={[
                    { value: 'HOD', label: 'HOD' },
                    { value: 'NO_CONTRACT', label: 'NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)' },
                    { value: 'SENIOR_AGREEMENT', label: 'SENIOR AGREEMENT' }
                  ]}
                />
              </FormField>
            </div>
          </div>

          {/* TAX STATUS SECTION */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b text-[#9333ea] dark:text-[#c084fc] border-gray-200 dark:border-gray-700">
              TAX STATUS
            </h4>
            <div className="space-y-4">
              <FormField label="ALLOW AS SELF-EMPLOYED OR LOAN OUT?" required>
                <RadioGroup
                  value={formData.allowSelfEmployed}
                  onChange={(v) => setFormData({ ...formData, allowSelfEmployed: v })}
                  options={[
                    { value: 'YES', label: 'YES' },
                    { value: 'NO', label: 'NO' }
                  ]}
                />
              </FormField>

              <FormField label="STATUS DETERMINATION REASON" required>
                <Select
                  value={formData.statusDeterminationReason}
                  onChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}
                  options={[
                    { value: 'HMRC_LIST', label: 'JOB TITLE APPEARS ON HMRC LIST OF \'ROLES NORMALLY TREATED AS SELF-EMPLOYED\'' },
                    { value: 'CEST_ASSESSMENT', label: 'OUR CEST ASSESSMENT HAS CONFIRMED \'OFF-PAYROLL WORKING RULES (IR35) DO NOT APPLY\'' },
                    { value: 'LORIMER_LETTER', label: 'YOU HAVE SUPPLIED A VALID LORIMER LETTER' },
                    { value: 'OTHER', label: 'OTHER' }
                  ]}
                />
              </FormField>

              {formData.statusDeterminationReason === 'OTHER' && (
                <FormField label="OTHER STATUS DETERMINATION REASON" required>
                  <Input
                    value={formData.otherStatusReason}
                    onChange={(v) => setFormData({ ...formData, otherStatusReason: v })}
                    placeholder="PLEASE SPECIFY"
                  />
                </FormField>
              )}
            </div>
          </div>

          {/* ROLE CONFIGURATION */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b text-[#9333ea] dark:text-[#c084fc] border-gray-200 dark:border-gray-700">
              ROLE CONFIGURATION
            </h4>

            <RoleConfigurationTab
              roles={jobTitles}
              onRolesChange={setJobTitles}
            />
          </div>

          {/* NOTES SECTION */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b text-[#9333ea] dark:text-[#c084fc] border-gray-200 dark:border-gray-700">
              NOTES
            </h4>
            <div className="space-y-4">
              <FormField label="OTHER DEAL PROVISIONS">
                <Textarea
                  value={formData.otherDealProvisions}
                  onChange={(v) => setFormData({ ...formData, otherDealProvisions: v })}
                  placeholder="ENTER ADDITIONAL DEAL PROVISIONS..."
                  maxLength={300}
                />
              </FormField>

              <FormField label="ADDITIONAL NOTES">
                <Textarea
                  value={formData.additionalNotes}
                  onChange={(v) => setFormData({ ...formData, additionalNotes: v })}
                  placeholder="ENTER ADDITIONAL NOTES..."
                  maxLength={300}
                />
              </FormField>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-lg font-bold transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-lg font-bold bg-[#9333ea] dark:bg-[#9333ea] text-white hover:bg-[#9333ea] dark:hover:bg-[#a855f7] transition-all"
            >
              SAVE OFFER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}








