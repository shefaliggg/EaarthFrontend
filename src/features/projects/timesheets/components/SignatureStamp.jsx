export function SignatureStamp({
  approver,
  date,
  time,
  code,
  status = 'approved',
}) {
  const backdropText = status === 'checked' ? 'Checked' : 'Approved';

  return (
    <div className="relative w-full max-w-full px-3 py-2 overflow-hidden">
      {/* BACKDROP STAMP */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[28px] font-serif font-extrabold uppercase tracking-widest text-slate-900/5">
          {backdropText}
        </span>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center min-w-0">
        {/* SIGNATURE NAME */}
        <div
          className="
            max-w-full truncate
            font-serif italic uppercase
            text-[16px] text-slate-900
            rotate-[-4deg]
            tracking-wide
          "
          title={approver}
        >
          {approver}
        </div>

        {/* SIGNATURE LINE */}
        <div className="relative w-full max-w-[220px] my-1">
          <div className="h-px bg-slate-400/80" />
          <span className="absolute -top-2 right-0 bg-white px-1 text-[8px] uppercase tracking-wide text-slate-500">
            Authorized
          </span>
        </div>

        {/* META INFO */}
        <div className="w-full min-w-0 text-center">
          <div className="truncate text-[10px] font-mono text-slate-600">
            {date} {time} GMT
          </div>
          <div
            className="truncate text-[9px] font-mono text-slate-400"
            title={code}
          >
            ID: {code}
          </div>
        </div>

        {/* BADGE */}
        <div
          className="
            mt-1 rounded-full border
            border-slate-300
            px-2 py-[2px]
            text-[8px] font-semibold
            uppercase tracking-wider
            text-slate-500
            bg-slate-50
          "
        >
          Digitally Signed
        </div>
      </div>
    </div>
  );
}