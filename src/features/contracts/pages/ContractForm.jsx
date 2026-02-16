import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createContract, updateContract, fetchContractById } from '../store/contract.thunks';
import { ArrowLeft, Save, Eye, FileDown, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentContract, loading } = useSelector((state) => state.contracts || {});

  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'transport-self-employed',
    production: {
      filmTitle: '',
      producerEntity: 'MIRAGE PICTURES LIMITED',
      producerAddress: '',
      producerPhone: '',
      productionBase: '',
    },
    crewMember: {
      name: '',
      address: '',
      phone: '',
      email: '',
      citizenship: '',
      residenceCountry: '',
    },
    engagement: {
      department: '',
      position: '',
      startDate: '',
      endDate: '',
      hireType: 'weekly',
    },
    fees: {
      baseWeeklyRate: '',
      baseDailyRate: '',
      base6thDayRate: '',
      base7thDayRate: '',
    },
    workingTerms: {
      workingDayHours: 12,
      workingHours: 11,
      travelTimeMinutes: 60,
      overtimeRate: '',
      overtimeIncrements: 30,
    },
    allowances: {
      mobileAllowance: {
        applicable: false,
        rate: '',
        terms: '',
      },
      holidayEntitlement: '5.6 weeks per year, pro-rated',
    },
    specialStipulations: [],
  });

  // Load existing contract for editing
  useEffect(() => {
    if (id && currentContract?._id === id) {
      setFormData(currentContract);
    } else if (id) {
      dispatch(fetchContractById(id));
    }
  }, [id, currentContract, dispatch]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await dispatch(updateContract({ id, data: formData })).unwrap();
        alert('Contract updated successfully!');
      } else {
        const result = await dispatch(createContract(formData)).unwrap();
        alert('Contract created successfully!');
        navigate(`/contracts/${result._id}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save contract: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contracts/preview`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setPreviewHtml(response.data.html);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to load preview: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) {
      alert('Please save the contract first before downloading PDF');
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/contracts/${id}/download`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${formData.production?.filmTitle || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF: ' + (error.response?.data?.message || error.message));
    }
  };

  // Preview Modal
  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Contract Preview</h2>
            <div className="flex items-center gap-3">
              {id && (
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors"
                >
                  <FileDown size={18} />
                  Download PDF
                </button>
              )}
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div
              className="bg-white shadow-2xl mx-auto"
              style={{
                width: '210mm',
                minHeight: '297mm',
              }}
            >
              <div
                className="contract-preview-content p-8"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>

          {/* Preview Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {id ? 'Update Contract' : 'Save Contract'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/contracts')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {id ? 'Edit Contract' : 'Create New Contract'}
                </h1>
                <p className="text-gray-600">Fill in the contract details below</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                disabled={loadingPreview}
                className="px-4 py-2 border border-lavender-300 text-lavender-700 rounded-lg hover:bg-lavender-50 flex items-center gap-2 transition-colors"
              >
                {loadingPreview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lavender-600"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    Preview
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {id ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
        {/* Contract Type */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contract Type</h2>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange(null, 'type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
          >
            <option value="transport-self-employed">Transport - Self Employed</option>
            <option value="crew-loanout">Crew Loanout</option>
            <option value="actor-day-player">Actor Day Player</option>
            <option value="director-agreement">Director Agreement</option>
          </select>
        </div>

        {/* Production Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Production Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Film Title *
              </label>
              <input
                type="text"
                value={formData.production.filmTitle}
                onChange={(e) => handleInputChange('production', 'filmTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="Enter film title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producer Entity
              </label>
              <input
                type="text"
                value={formData.production.producerEntity}
                onChange={(e) => handleInputChange('production', 'producerEntity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Production Base
              </label>
              <input
                type="text"
                value={formData.production.productionBase}
                onChange={(e) => handleInputChange('production', 'productionBase', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="e.g., London Studios"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producer Phone
              </label>
              <input
                type="tel"
                value={formData.production.producerPhone}
                onChange={(e) => handleInputChange('production', 'producerPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="+44 123 456 7890"
              />
            </div>
          </div>
        </div>

        {/* Crew Member Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Crew Member Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.crewMember.name}
                onChange={(e) => handleInputChange('crewMember', 'name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.crewMember.email}
                onChange={(e) => handleInputChange('crewMember', 'email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.crewMember.phone}
                onChange={(e) => handleInputChange('crewMember', 'phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="+44 123 456 7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.crewMember.address}
                onChange={(e) => handleInputChange('crewMember', 'address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="123 Main St, London"
              />
            </div>
          </div>
        </div>

        {/* Engagement Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={formData.engagement.position}
                onChange={(e) => handleInputChange('engagement', 'position', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="Unit Driver"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.engagement.department}
                onChange={(e) => handleInputChange('engagement', 'department', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="Transport"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.engagement.startDate}
                onChange={(e) => handleInputChange('engagement', 'startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.engagement.endDate}
                onChange={(e) => handleInputChange('engagement', 'endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire Type
              </label>
              <select
                value={formData.engagement.hireType}
                onChange={(e) => handleInputChange('engagement', 'hireType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fixed-term">Fixed Term</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Weekly Rate (£)
              </label>
              <input
                type="number"
                value={formData.fees.baseWeeklyRate}
                onChange={(e) => handleInputChange('fees', 'baseWeeklyRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="800.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Daily Rate (£)
              </label>
              <input
                type="number"
                value={formData.fees.baseDailyRate}
                onChange={(e) => handleInputChange('fees', 'baseDailyRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="160.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6th Day Rate (£)
              </label>
              <input
                type="number"
                value={formData.fees.base6thDayRate}
                onChange={(e) => handleInputChange('fees', 'base6thDayRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="240.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7th Day Rate (£)
              </label>
              <input
                type="number"
                value={formData.fees.base7thDayRate}
                onChange={(e) => handleInputChange('fees', 'base7thDayRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                placeholder="320.00"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Mobile Allowance */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Allowances</h2>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={formData.allowances.mobileAllowance.applicable}
              onChange={(e) =>
                handleNestedInputChange('allowances', 'mobileAllowance', 'applicable', e.target.checked)
              }
              className="w-5 h-5 text-lavender-600 border-gray-300 rounded focus:ring-lavender-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Mobile Allowance Applicable
            </label>
          </div>
          {formData.allowances.mobileAllowance.applicable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate (£)
                </label>
                <input
                  type="number"
                  value={formData.allowances.mobileAllowance.rate}
                  onChange={(e) =>
                    handleNestedInputChange('allowances', 'mobileAllowance', 'rate', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                  placeholder="50.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms
                </label>
                <input
                  type="text"
                  value={formData.allowances.mobileAllowance.terms}
                  onChange={(e) =>
                    handleNestedInputChange('allowances', 'mobileAllowance', 'terms', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 transition-all"
                  placeholder="per week"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/contracts')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePreview}
            disabled={loadingPreview}
            className="px-6 py-3 border border-lavender-300 text-lavender-700 rounded-lg hover:bg-lavender-50 flex items-center gap-2 transition-colors"
          >
            {loadingPreview ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lavender-600"></div>
                Loading Preview...
              </>
            ) : (
              <>
                <Eye size={18} />
                Preview Contract
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {id ? 'Update Contract' : 'Save Contract'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}