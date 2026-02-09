import { useState } from 'react';
import SignersManagement from '../../components/Signersmanagement';
import RecipientsManagement from '../../components/Recipientsmanagement';

export default function ProjectSettingsPage({ projectName = "EAARTH" }) {
  const [activeTab, setActiveTab] = useState('signers');

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-4">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold">Signers & Recipients</h2>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: '70%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-600">70%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('signers')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'signers'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
              }`}
            >
              Authorized Signers
            </button>
            <button
              onClick={() => setActiveTab('recipients')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'recipients'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
              }`}
            >
              Recipients
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'signers' && <SignersManagement />}
          {activeTab === 'recipients' && <RecipientsManagement />}
        </div>
      </div>
    </div>
  );
}