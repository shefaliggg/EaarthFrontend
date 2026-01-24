import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from;

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
          <ShieldAlert className="text-red-400" size={28} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          Access Restricted
        </h1>

        {/* Message */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          You don’t have permission to view this page.
          {from && (
            <>
              <br />
              <span className="text-slate-400 text-xs">
                Attempted: <span className="text-red-400">{from}</span>
              </span>
            </>
          )}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-6" />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/home")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
          >
            <Home size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
