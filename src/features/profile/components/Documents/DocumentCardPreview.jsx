// DocumentCardPreview.jsx

import React from 'react';
import { FileText, Download, Eye, Trash2, Share2 } from 'lucide-react';
import { getExpiryStatus } from '../../utils/getExpiryStatus';

export const DocumentCardPreview = ({ doc, index, onShare, onDelete }) => {
  const expiryStatus = getExpiryStatus(doc.expiryDate);
  const StatusIcon = expiryStatus.icon;
  
  return (
    <div
      style={{
        animation: `fadeIn 0.3s ease-out ${0.3 + index * 0.05}s both`
      }}
      className="bg-card rounded-lg shadow-sm border border-border hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Document Preview */}
      <div className="h-40 bg-primary/10 border-2 border-primary/30 flex items-center justify-center relative">
        <FileText className="w-12 h-12 text-primary" />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 bg-card backdrop-blur-sm text-[10px] font-bold text-primary rounded-full border border-border">
            {doc.type}
          </span>
        </div>
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 ${expiryStatus.bg} rounded-full`}>
          <StatusIcon className={`w-3 h-3 ${expiryStatus.color}`} />
          <span className={`text-[10px] font-medium ${expiryStatus.color} capitalize`}>{expiryStatus.status}</span>
        </div>
      </div>

      {/* Document Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground mb-1 truncate" title={doc.fileName}>
          {doc.fileName}
        </h3>
        <p className="text-[10px] text-muted-foreground mb-2">{doc.documentType.replace('_', ' ')}</p>
        
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium text-foreground">{doc.size}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Uploaded:</span>
            <span className="font-medium text-foreground">{doc.uploadDate}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Expires:</span>
            <span className="font-medium text-foreground">{doc.expiryDate}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Status:</span>
            {doc.shared ? (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                Shared
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full">
                Private
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-1">
          <button 
            onClick={() => onShare(doc.id)}
            className={`p-1.5 ${doc.shared ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
          >
            <Share2 className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Eye className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5 mx-auto" />
          </button>
          <button 
            onClick={() => onDelete(doc.id)}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};



