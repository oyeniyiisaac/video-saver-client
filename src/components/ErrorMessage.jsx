import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="w-full my-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/20 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm leading-relaxed font-normal">
        {message}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-200 p-0.5 rounded transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
