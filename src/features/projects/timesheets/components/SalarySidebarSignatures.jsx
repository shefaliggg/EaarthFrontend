import React from 'react';
import { Edit2 } from 'lucide-react';
import { SignatureStamp } from './SignatureStamp';

export function SalarySidebarSignatures({ theme, signatures }) {
  return (
    <div className={`px-4 py-3 border-t ${theme.border} bg-purple-50 dark:bg-gray-800/50 h-[35mm] flex-none`}>
        <div className="grid grid-cols-5 gap-2 h-full">
            {signatures.map((sig, index) => {
                // Parse date: "16 Nov 2025 18:30" -> date: "16 Nov 2025", time: "18:30"
                const dateParts = sig.date ? sig.date.split(' ') : [];
                const dateStr = dateParts.length >= 3 ? `${dateParts[0]} ${dateParts[1]} ${dateParts[2]}` : '';
                const timeStr = dateParts.length >= 4 ? dateParts[3] : '';
                
                return (
                    <div key={sig.label} className="h-full flex flex-col relative group">
                        {/* Label - Always visible in top left */}
                        <div className="absolute top-0.5 left-1 z-20 pointer-events-none">
                            <span className="text-[5px] font-black uppercase tracking-wider text-purple-400/80">{sig.label}</span>
                        </div>
                        
                        {sig.name ? (
                            <div className="h-full border rounded flex items-center justify-center bg-white">
                                <SignatureStamp
                                    approver={sig.name}
                                    date={dateStr}
                                    time={timeStr}
                                    code={sig.code || ''}
                                    status={index === 4 ? 'checked' : 'approved'}
                                />
                            </div>
                        ) : (
                            <div className={`h-full border rounded flex items-center justify-center ${theme.card} ${theme.border} border-dashed opacity-60 hover:opacity-100 transition-opacity`}>
                                <div className="w-8 h-4 border-b border-dashed border-gray-300 dark:border-gray-600"></div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
}