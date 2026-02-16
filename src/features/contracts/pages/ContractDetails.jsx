import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractById, downloadContractPDF } from '../../../store/contract.thunks';
import { clearCurrentContract } from '../../../store/contract.slice';

export default function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentContract: contract, loading } = useSelector((state) => state.contracts);

  useEffect(() => {
    dispatch(fetchContractById(id));
    return () => {
      dispatch(clearCurrentContract());
    };
  }, [id, dispatch]);

  const handleDownload = async () => {
    try {
      await dispatch(downloadContractPDF(id)).unwrap();
    } catch (error) {
      alert('Failed to download PDF');
    }
  };

  if (loading || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_signatures: 'bg-yellow-100 text-yellow-800',
      fully_executed: 'bg-green-100 text-green-800',
      terminated: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => navigate('/contracts')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Back to Contracts
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{contract.production.filmTitle}</h1>
            <p className="mt-2 text-gray-600">Contract Details</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/contracts/${id}/edit`)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Edit Contract
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(contract.status)}`}>
            {contract.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        {/* Contract Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Production</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Film Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.production.filmTitle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Producer Entity</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.production.producerEntity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Production Base</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.production.productionBase || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Crew Member Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Crew Member</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.crewMember.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.crewMember.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.crewMember.phone || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Engagement Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Engagement</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.engagement.position}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.engagement.department}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(contract.engagement.startDate).toLocaleDateString('en-GB')}
                </dd>
              </div>
              {contract.engagement.endDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(contract.engagement.endDate).toLocaleDateString('en-GB')}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Fees */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Fees</h2>
            <dl className="space-y-3">
              {contract.fees.weeklyRate > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Weekly Rate (inc. Holiday)</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    £{contract.fees.weeklyRate.toFixed(2)}
                  </dd>
                </div>
              )}
              {contract.fees.dailyRate > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Daily Rate (inc. Holiday)</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    £{contract.fees.dailyRate.toFixed(2)}
                  </dd>
                </div>
              )}
              {contract.fees.sixthDayRate > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">6th Day Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">£{contract.fees.sixthDayRate.toFixed(2)}</dd>
                </div>
              )}
              {contract.fees.seventhDayRate > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">7th Day Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">£{contract.fees.seventhDayRate.toFixed(2)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Special Stipulations */}
        {contract.specialStipulations && contract.specialStipulations.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Special Stipulations</h2>
            <ul className="list-disc list-inside space-y-2">
              {contract.specialStipulations.map((stipulation, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {stipulation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Signatures */}
        {contract.signatures && contract.signatures.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-3">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contract.signatures.map((sig) => (
                <div key={sig.role} className="border rounded-lg p-4">
                  <div className="font-medium text-gray-900">{sig.role.replace(/_/g, ' ').toUpperCase()}</div>
                  {sig.signedAt ? (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Signed on {new Date(sig.signedAt).toLocaleDateString('en-GB')}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">Pending</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}