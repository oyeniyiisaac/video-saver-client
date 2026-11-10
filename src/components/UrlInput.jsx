import React, { useRef } from 'react';
import { Search, Loader2, ArrowRight, X, ClipboardPaste } from 'lucide-react';

export function UrlInput({ url, setUrl, onSubmit, isLoading, disabled }) {
  const inputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (url.trim() && !isLoading && !disabled) {
      onSubmit(url.trim());
    }
  };

  const handleClear = () => {
    setUrl('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    } catch {
      // Browser permissions or clipboard access denied, fail silently
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div className="relative flex items-center w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl transition-all duration-300 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 group-hover:border-neutral-700">
        <div className="pl-4 sm:pl-5 text-neutral-500 pointer-events-none">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste video or music link (YouTube, TikTok, Instagram, X...)"
          disabled={disabled || isLoading}
          autoFocus
          className="w-full py-4 sm:py-5 px-3 sm:px-4 bg-transparent text-neutral-100 placeholder-neutral-500 text-sm sm:text-base font-normal focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="flex items-center gap-1.5 pr-2 sm:pr-3">
          {url ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || isLoading}
              className="p-1.5 text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              title="Clear input"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaste}
              disabled={disabled || isLoading}
              className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-neutral-800/80 transition-colors border border-neutral-800"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          )}

          <button
            type="submit"
            disabled={!url.trim() || isLoading || disabled}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden sm:inline">Fetching...</span>
              </>
            ) : (
              <>
                <span>Fetch</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
