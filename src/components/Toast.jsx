import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-[10000] max-w-sm w-[90vw] animate-slide-in-right">
      <div className="bg-[#121212]/95 backdrop-blur-md border border-outline-variant/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {type === "success" ? (
            <CheckCircle2 className="text-secondary shrink-0" size={20} />
          ) : (
            <XCircle className="text-primary shrink-0" size={20} />
          )}
          <p className="text-xs font-headline font-light leading-relaxed text-white">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#acabaa] hover:text-white transition-colors hover:bg-surface-container shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
