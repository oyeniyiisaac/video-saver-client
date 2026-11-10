import React from 'react';
import { Loader2, CheckCircle2, ArrowDownCircle, RefreshCw } from 'lucide-react';

export function ProgressBar({ status, progress, filename, duration = 0, onReset }) {
  if (status !== 'preparing' && status !== 'downloading' && status !== 'done') {
    return null;
  }

  const isPreparing = status === 'preparing';
  const isDownloading = status === 'downloading';
  const isDone = status === 'done';
  const isLongVideo = duration > 1800; // > 30 minutes

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* State Header */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {isPreparing && (
            <>
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-neutral-200">
                {isLongVideo ? 'Preparing long media...' : 'Preparing...'}
              </span>
            </>
          )}
          {isDownloading && (
            <>
              <ArrowDownCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="text-neutral-200">Downloading to your browser...</span>
            </>
          )}
          {isDone && (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Download Complete!</span>
            </>
          )}
        </div>

        <div className="text-xs font-mono font-semibold text-neutral-400">
          {isPreparing && (
            <span className="text-emerald-400/80 animate-pulse">
              {isLongVideo ? 'Transcoding multi-hour audio' : 'Processing media'}
            </span>
          )}
          {isDownloading && (
            <span className="text-emerald-400 text-sm font-bold">{progress}%</span>
          )}
          {isDone && <span className="text-emerald-400">100%</span>}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 rounded-full bg-neutral-950 border border-neutral-800/80 overflow-hidden relative">
        {isPreparing && (
          <div className="h-full w-full bg-emerald-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2 animate-[shimmer_1.5s_infinite]" />
          </div>
        )}

        {(isDownloading || isDone) && (
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-200 ease-out rounded-full shadow-sm shadow-emerald-500/50"
            style={{ width: `${isDone ? 100 : progress}%` }}
          />
        )}
      </div>

      {/* Subtext info */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
        {isPreparing && (
          <p className="text-neutral-400 leading-relaxed">
            {isLongVideo
              ? 'This is a long video. Fetching and transcoding full multi-hour audio may take a few minutes — please keep this tab open!'
              : 'Fetching media and transcoding with ffmpeg. Your download starts automatically.'}
          </p>
        )}

        {isDownloading && (
          <p className="text-neutral-400">
            Saving directly to your device via high-speed stream.
          </p>
        )}

        {isDone && (
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <p className="text-neutral-300 truncate max-w-sm font-mono text-[11px]">
              Saved as: <span className="text-emerald-400">{filename || 'media file'}</span>
            </p>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors border border-neutral-700/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Save Another</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
