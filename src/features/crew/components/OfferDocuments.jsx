import { FileText, Download, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useState } from "react";

const DOCUMENT_TYPES = [
  { id: "passport", label: "PASSPORT", icon: FileText, colorScheme: "lavender" },
  { id: "right_to_work", label: "RIGHT TO WORK VERIFICATION", icon: FileText, colorScheme: "pink" },
  { id: "employment_contract", label: "EMPLOYMENT CONTRACT", icon: FileText, colorScheme: "mint" },
  { id: "tax_forms", label: "TAX FORMS (P45/P46)", icon: FileText, colorScheme: "peach" },
  { id: "bank_details", label: "BANK DETAILS", icon: FileText, colorScheme: "sky" },
  { id: "nda", label: "NDA AGREEMENT", icon: FileText, colorScheme: "lavender" },
];

const COLOR_SCHEMES = {
  lavender: {
    bg: "bg-lavender-50 dark:bg-lavender-900/20",
    border: "border-lavender-200 dark:border-lavender-800/40",
    hover: "hover:border-lavender-300 dark:hover:border-lavender-700/60",
    icon: "text-lavender-600 dark:text-lavender-400",
    button: "text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 dark:text-lavender-400 dark:hover:text-lavender-300 dark:hover:bg-lavender-900/30",
  },
  pink: {
    bg: "bg-pastel-pink-50 dark:bg-pastel-pink-900/20",
    border: "border-pastel-pink-200 dark:border-pastel-pink-800/40",
    hover: "hover:border-pastel-pink-300 dark:hover:border-pastel-pink-700/60",
    icon: "text-pastel-pink-600 dark:text-pastel-pink-400",
    button: "text-pastel-pink-600 hover:text-pastel-pink-700 hover:bg-pastel-pink-50 dark:text-pastel-pink-400 dark:hover:text-pastel-pink-300 dark:hover:bg-pastel-pink-900/30",
  },
  mint: {
    bg: "bg-mint-50 dark:bg-mint-900/20",
    border: "border-mint-200 dark:border-mint-800/40",
    hover: "hover:border-mint-300 dark:hover:border-mint-700/60",
    icon: "text-mint-600 dark:text-mint-400",
    button: "text-mint-600 hover:text-mint-700 hover:bg-mint-50 dark:text-mint-400 dark:hover:text-mint-300 dark:hover:bg-mint-900/30",
  },
  peach: {
    bg: "bg-peach-50 dark:bg-peach-900/20",
    border: "border-peach-200 dark:border-peach-800/40",
    hover: "hover:border-peach-300 dark:hover:border-peach-700/60",
    icon: "text-peach-600 dark:text-peach-400",
    button: "text-peach-600 hover:text-peach-700 hover:bg-peach-50 dark:text-peach-400 dark:hover:text-peach-300 dark:hover:bg-peach-900/30",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-800/40",
    hover: "hover:border-sky-300 dark:hover:border-sky-700/60",
    icon: "text-sky-600 dark:text-sky-400",
    button: "text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-sky-900/30",
  },
};

export default function OfferDocuments({ documents = [], onDownload }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card className="border shadow-sm">
      <div 
        className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted/30 transition-colors border-b"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Documents</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {documents?.length || 6}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5 bg-lavender-500 hover:bg-lavender-600 dark:bg-lavender-600 dark:hover:bg-lavender-700 text-white h-8 px-3 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Download all documents');
            }}
          >
            <Download className="w-3 h-3" />
            Download all
          </Button>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {DOCUMENT_TYPES.map((doc) => {
              const hasDocument = documents?.includes(doc.id);
              const IconComponent = doc.icon;
              const colors = COLOR_SCHEMES[doc.colorScheme];
              
              return (
                <div
                  key={doc.id}
                  className={`relative flex flex-col items-center justify-between p-3 rounded-lg border transition-all ${
                    hasDocument
                      ? `${colors.bg} ${colors.border} ${colors.hover} hover:shadow-sm cursor-pointer`
                      : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 opacity-50'
                  }`}
                  onClick={() => hasDocument && onDownload?.(doc.id)}
                >
                  <div className="mb-2">
                    <IconComponent className={`w-8 h-8 ${hasDocument ? colors.icon : 'text-gray-400 dark:text-gray-600'}`} />
                  </div>
                  
                  <p className={`text-[9px] font-bold text-center uppercase tracking-wide leading-tight mb-2 min-h-[28px] flex items-center ${
                    hasDocument ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    {doc.label}
                  </p>
                  
                  {hasDocument && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-6 px-2 text-[10px] gap-1 w-full font-semibold ${colors.button}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload?.(doc.id);
                      }}
                    >
                      <Download className="w-2.5 h-2.5" />
                      Download
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}