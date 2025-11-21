// DocumentListItem.jsx

import React from 'react';
import { FileText, Download, Eye, Trash2, Share2, Calendar } from 'lucide-react';
import { getExpiryStatus } from '../../utils/getExpiryStatus';

export const DocumentListItem = ({ doc, index, onShare, onDelete }) => {
  const expiryStatus = getExpiryStatus(doc.expiryDate);
  const StatusIcon = expiryStatus.icon;
  
  return (
    <div
      style={{
        animation: `fadeIn 0.3s ease-out ${0.3 + index * 0.05}s both`
      }}
      className="bg-card rounded-lg p-3 shadow-sm border border-border hover:shadow-md transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-foreground">{doc.fileName}</div>
            <div className="text-xs text-muted-foreground">{doc.documentType.replace('_', ' ')} • {doc.size}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Expires: {doc.expiryDate}</span>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-0.5 ${expiryStatus.bg} rounded-full`}>
            <StatusIcon className={`w-3 h-3 ${expiryStatus.color}`} />
            <span className={`text-[10px] font-medium ${expiryStatus.color} capitalize`}>{expiryStatus.status}</span>
          </div>
          
          {doc.shared ? (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
              Shared
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full">
              Private
            </span>
          )}
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onShare(doc.id)}
              className={`p-1.5 ${doc.shared ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onDelete(doc.id)}
              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};