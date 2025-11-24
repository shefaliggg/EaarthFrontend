// DocumentTableRow.jsx

import React from 'react';
import { FileText, Download, Eye, Trash2, Share2, Calendar } from 'lucide-react';
import { getExpiryStatus } from '../../utils/getExpiryStatus';

export const DocumentTableRow = ({ doc, index, onShare, onDelete }) => {
  const expiryStatus = getExpiryStatus(doc.expiryDate);
  const StatusIcon = expiryStatus.icon;
  
  return (
    <tr
      style={{
        animation: `fadeIn 0.3s ease-out ${0.3 + index * 0.05}s both`
      }}
      className="hover:bg-muted/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-medium text-foreground">{doc.fileName}</div>
            <div className="text-[10px] text-muted-foreground">{doc.size}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
          {doc.documentType.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
        {doc.uploadDate}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          {doc.expiryDate}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className={`flex items-center gap-1 ${expiryStatus.color}`}>
          <StatusIcon className="w-3 h-3" />
          <span className="text-[10px] font-medium capitalize">{expiryStatus.status}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {doc.shared ? (
          <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
            Shared
          </span>
        ) : (
          <span className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full">
            Private
          </span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
        <div className="flex items-center justify-end gap-1">
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
      </td>
    </tr>
  );
};







