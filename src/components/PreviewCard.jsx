import React, { useState } from 'react';
import { Clock, User, Film, Music, CheckCircle2 } from 'lucide-react';

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return 'Live / Unknown';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function PreviewCard({ info }) {
  const [imgError, setImgError] = useState(false);

  if (!info) return null;

  return (
    <div className="w-full rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-56 aspect-video sm:aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/60 shrink-0 group">
          {info.thumbnail && !imgError ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
              <Film className="w-8 h-8" />
              <span className="text-xs">No preview</span>
            </div>
          )}

          {/* Duration overlay badge */}
          {info.duration > 0 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono text-neutral-200 border border-neutral-700/50 backdrop-blur-xs flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{formatDuration(info.duration)}</span>
            </div>
          )}

          {/* Platform badge */}
          {info.platform && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/90 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              {info.platform}
            </div>
          )}
        </div>

        {/* Media Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-100 leading-snug line-clamp-2 title-display">
              {info.title}
            </h3>

            <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-neutral-400">
              <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="truncate max-w-[200px]">{info.uploader}</span>
              </div>

              {info.duration > 0 && (
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span>{formatDuration(info.duration)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center gap-2 text-xs text-neutral-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for format selection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
