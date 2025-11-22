import React, { useState } from 'react';
import { Upload, Search, Grid, List, Eye, FileText } from 'lucide-react';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
import { DocumentTableRow } from '../components/Documents/DocumentTableRow';
import { DocumentListItem } from '../components/Documents/DocumentListItem';
import { DocumentCardPreview } from '../components/Documents/DocumentCardPreview';
import { UploadDocumentModal } from '../components/Documents/UploadDocumentModal';
import { useDocuments } from '../hooks/useDocuments';
import { categories } from '../components/Documents/data/documentDummyData';

export default function ProfileDocuments({ isDarkMode = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { documents, deleteDocument, shareDocument, uploadDocument } = useDocuments();

  const handleUpload = (newDoc) => {
    uploadDocument(newDoc);
    setShowUploadModal(false);
  };

  const handleShare = (docId) => {
    shareDocument(docId);
  };

  const handleDelete = (docId) => {
    deleteDocument(docId);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Breadcrumbs */}
      <UrlBreadcrumbs />

      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-primary text-primary-foreground">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            PROFILE DOCUMENTS
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your documents
          </p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary bg-input border-border text-foreground placeholder-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary bg-input border-border text-foreground"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          
          {/* View Mode Selector */}
          <div className="flex gap-1 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1.5 rounded transition-all ${
                viewMode === 'table' 
                  ? 'bg-card shadow-sm text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1.5 rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-card shadow-sm text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 py-1.5 rounded transition-all ${
                viewMode === 'preview' 
                  ? 'bg-card shadow-sm text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Preview View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Shared
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredDocuments.map((doc, index) => (
                  <DocumentTableRow
                    key={doc.id}
                    doc={doc}
                    index={index}
                    onShare={handleShare}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredDocuments.map((doc, index) => (
            <DocumentListItem
              key={doc.id}
              doc={doc}
              index={index}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Preview View */}
      {viewMode === 'preview' && (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocuments.map((doc, index) => (
            <DocumentCardPreview
              key={doc.id}
              doc={doc}
              index={index}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}