export function SignatureStamp({ approver, date, time, code, status = 'approved' }) {
  const backdropText = status === 'checked' ? 'Checked' : 'Approved';
  
  return (
    <div className="relative px-4 py-2">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <span className="text-2xl font-serif font-bold text-slate-800 uppercase">{backdropText}</span>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-2xl font-serif italic text-blue-900 -rotate-6 pr-4 uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-full" style={{ fontFamily: 'Times New Roman, serif' }}>
          {approver}
        </div>
        
        <div className="w-full h-px bg-slate-400 my-1 relative">
           <span className="absolute -top-2 right-0 text-[8px] text-slate-500 uppercase">Authorized Signature</span>
        </div>
        
        <div className="w-full text-[10px] text-slate-500 font-mono mt-1 text-center whitespace-nowrap">
          {date} {time} GMT ID: {code}
        </div>
        
        <div className="mt-2 border border-slate-300 rounded px-2 py-0.5 text-[8px] uppercase tracking-widest text-slate-400">
          Digitally Signed
        </div>
      </div>
    </div>
  );
}