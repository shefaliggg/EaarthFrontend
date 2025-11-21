import React, { useState } from 'react';
import { FileText, Download, Eye, Trash2, Upload, Search, Filter, Grid, List, Share2, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';

export function ProfileDocuments({ isDarkMode = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [uploadForm, setUploadForm] = useState({
    documentType: 'PASSPORT',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    file: null,
    expiryDate: '',
  });

  const [ProfileDocuments, setProfileDocuments] = useState([
    { 
      id: 1, 
      documentType: 'PASSPORT',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      fileName: 'PASSPORT_SHEFALI_GAJBHIYE.pdf', 
      type: 'PDF', 
      size: '3.2 MB', 
      uploadDate: '15/01/2024',
      expiryDate: '01/01/2025',
      category: 'Identity',
      shared: false
    },
    { 
      id: 2, 
      documentType: 'VISA',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      fileName: 'VISA_SHEFALI_GAJBHIYE.pdf', 
      type: 'PDF', 
      size: '2.1 MB', 
      uploadDate: '10/01/2024',
      expiryDate: '15/06/2024',
      category: 'Identity',
      shared: true
    },
    { 
      id: 3, 
      documentType: 'DRIVING_LICENSE',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      fileName: 'DRIVING_LICENSE_SHEFALI_GAJBHIYE.jpg', 
      type: 'JPG', 
      size: '1.8 MB', 
      uploadDate: '08/01/2024',
      expiryDate: '20/12/2025',
      category: 'Identity',
      shared: false
    },
    { 
      id: 4, 
      documentType: 'INSURANCE',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      fileName: 'INSURANCE_SHEFALI_GAJBHIYE.pdf', 
      type: 'PDF', 
      size: '890 KB', 
      uploadDate: '05/01/2024',
      expiryDate: '31/12/2024',
      category: 'Insurance',
      shared: false
    },
  ]);

  const categories = ['all', 'Identity', 'Insurance', 'Financial', 'Tax', 'Contracts'];

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.expiryDate) {
      alert('Please fill all required fields');
      return;
    }

    const fileName = `${uploadForm.documentType}_${uploadForm.firstName}_${uploadForm.lastName}.${uploadForm.file.name.split('.').pop()}`;
    
    const newDoc = {
      id: ProfileDocuments.length + 1,
      documentType: uploadForm.documentType,
      firstName: uploadForm.firstName,
      lastName: uploadForm.lastName,
      fileName: fileName,
      type: uploadForm.file.type.includes('pdf') ? 'PDF' : uploadForm.file.type.includes('image') ? 'JPG' : 'FILE',
      size: `${(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toLocaleDateString('en-GB'),
      expiryDate: uploadForm.expiryDate,
      category: uploadForm.documentType.includes('PASSPORT') || uploadForm.documentType.includes('VISA') || uploadForm.documentType.includes('LICENSE') ? 'Identity' : 'Other',
      shared: false
    };

    setProfileDocuments([newDoc, ...ProfileDocuments]);
    setShowUploadModal(false);
    alert('Document uploaded successfully!');
    
    checkExpiryReminder(newDoc);
    
    setUploadForm({
      documentType: 'PASSPORT',
      firstName: 'SHEFALI',
      lastName: 'GAJBHIYE',
      file: null,
      expiryDate: '',
    });
  };

  const checkExpiryReminder = (doc) => {
    const parts = doc.expiryDate.split('/');
    const expiry = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    if (expiry <= sixMonthsFromNow) {
      const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 180 && daysUntil > 0) {
        alert(`⚠️ ${doc.documentType} expires in ${daysUntil} days!`);
      } else if (daysUntil <= 0) {
        alert(`🚨 ${doc.documentType} has expired!`);
      }
    }
  };

  const handleShare = (docId) => {
    setProfileDocuments(ProfileDocuments.map(doc => 
      doc.id === docId ? { ...doc, shared: !doc.shared } : doc
    ));
    const doc = ProfileDocuments.find(d => d.id === docId);
    if (doc?.shared) {
      alert('Document sharing disabled');
    } else {
      alert('Document shared with productions for contract verification!');
    }
  };

  const handleDelete = (docId) => {
    setProfileDocuments(ProfileDocuments.filter(doc => doc.id !== docId));
    alert('Document deleted successfully');
  };

  const getExpiryStatus = (expiryDate) => {
    const parts = expiryDate.split('/');
    const expiry = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 0) {
      return { status: 'expired', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle };
    } else if (daysUntil <= 180) {
      return { status: 'expiring', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
    } else {
      return { status: 'valid', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    }
  };

  const filteredProfileDocuments = ProfileDocuments.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search ProfileDocuments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          
          {/* View Mode Selector */}
          <div className={`flex gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded transition-all ${
                viewMode === 'table' 
                  ? isDarkMode
                    ? 'bg-gray-800 shadow-sm text-purple-400 font-medium'
                    : 'bg-white shadow-sm text-purple-600 font-medium'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded transition-all ${
                viewMode === 'list' 
                  ? isDarkMode
                    ? 'bg-gray-800 shadow-sm text-purple-400 font-medium'
                    : 'bg-white shadow-sm text-purple-600 font-medium'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-2 rounded transition-all ${
                viewMode === 'preview' 
                  ? isDarkMode
                    ? 'bg-gray-800 shadow-sm text-purple-400 font-medium'
                    : 'bg-white shadow-sm text-purple-600 font-medium'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Preview View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfileDocuments.map((doc) => {
                  const expiryStatus = getExpiryStatus(doc.expiryDate);
                  const StatusIcon = expiryStatus.icon;
                  
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.fileName}</div>
                            <div className="text-xs text-gray-500">{doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          {doc.documentType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.uploadDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {doc.expiryDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 ${expiryStatus.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-xs font-medium capitalize">{expiryStatus.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doc.shared ? (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            Shared
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            Private
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleShare(doc.id)}
                            className={`p-2 ${doc.shared ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
                            title="Share with productions"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredProfileDocuments.map((doc) => {
            const expiryStatus = getExpiryStatus(doc.expiryDate);
            const StatusIcon = expiryStatus.icon;
            
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{doc.fileName}</div>
                      <div className="text-sm text-gray-500">{doc.documentType.replace('_', ' ')} • {doc.size}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {doc.expiryDate}</span>
                    </div>
                    
                    <div className={`flex items-center gap-1 px-2 py-1 ${expiryStatus.bg} rounded-full`}>
                      <StatusIcon className={`w-4 h-4 ${expiryStatus.color}`} />
                      <span className={`text-xs font-medium ${expiryStatus.color} capitalize`}>{expiryStatus.status}</span>
                    </div>
                    
                    {doc.shared ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        Shared
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        Private
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleShare(doc.id)}
                        className={`p-2 ${doc.shared ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
                        title="Share with productions"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview View */}
      {viewMode === 'preview' && (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfileDocuments.map((doc) => {
            const expiryStatus = getExpiryStatus(doc.expiryDate);
            const StatusIcon = expiryStatus.icon;
            
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Document Preview */}
                <div className="h-48 bg-purple-100 border-2 border-purple-300 flex items-center justify-center relative">
                  <FileText className="w-16 h-16 text-purple-600" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-purple-600 rounded-full">
                      {doc.type}
                    </span>
                  </div>
                  <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 ${expiryStatus.bg} rounded-full`}>
                    <StatusIcon className={`w-3 h-3 ${expiryStatus.color}`} />
                    <span className={`text-xs font-medium ${expiryStatus.color} capitalize`}>{expiryStatus.status}</span>
                  </div>
                </div>

                {/* Document Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{doc.documentType.replace('_', ' ')}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium text-gray-900">{doc.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Uploaded:</span>
                      <span className="font-medium text-gray-900">{doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Expires:</span>
                      <span className="font-medium text-gray-900">{doc.expiryDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Status:</span>
                      {doc.shared ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          Shared
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-1">
                    <button 
                      onClick={() => handleShare(doc.id)}
                      className={`p-2 ${doc.shared ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                      <Download className="w-4 h-4 mx-auto" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="PASSPORT">PASSPORT</option>
                  <option value="VISA">VISA</option>
                  <option value="DRIVING_LICENSE">DRIVING LICENSE</option>
                  <option value="INSURANCE">INSURANCE</option>
                  <option value="TAX_CERTIFICATE">TAX CERTIFICATE</option>
                  <option value="BANK_STATEMENT">BANK STATEMENT</option>
                  <option value="CONTRACT">CONTRACT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={uploadForm.firstName}
                  onChange={(e) => setUploadForm({ ...uploadForm, firstName: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="FIRST NAME"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={uploadForm.lastName}
                  onChange={(e) => setUploadForm({ ...uploadForm, lastName: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="LAST NAME"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={uploadForm.expiryDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: new Date(e.target.value).toLocaleDateString('en-GB') })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-600 file:cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">File will be named: {uploadForm.documentType}_{uploadForm.firstName}_{uploadForm.lastName}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentsDemo() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              DOCUMENTS
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your documents and files
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* FIX: Use the correct component */}
        <ProfileDocuments isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
