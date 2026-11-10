import React, { useState, useEffect } from 'react';
import { Film, Music, Download, Check, Sparkles, SlidersHorizontal } from 'lucide-react';

export function FormatPicker({ heights = [], onDownload, isDownloading, disabled }) {
  const [formatType, setFormatType] = useState('video'); // 'video' | 'audio'
  const [selectedHeight, setSelectedHeight] = useState('');

  // Set default selected height when heights update
  useEffect(() => {
    if (heights && heights.length > 0) {
      // Pick 1080p or 720p or highest available height
      const preferred = heights.includes(1080) ? 1080 : heights[0];
      setSelectedHeight(preferred.toString());
    } else {
      setSelectedHeight('');
    }
  }, [heights]);

  const handleDownloadClick = () => {
    if (isDownloading || disabled) return;
    onDownload({
      type: formatType,
      height: formatType === 'video' && selectedHeight ? parseInt(selectedHeight, 10) : null,
    });
  };

  const getQualityLabel = h => {
    if (h >= 2160) return `${h}p (4K UHD)`;
    if (h >= 1440) return `${h}p (2K QHD)`;
    if (h >= 1080) return `${h}p (Full HD)`;
    if (h >= 720) return `${h}p (HD)`;
    return `${h}p`;
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <span>Select Format & Quality</span>
        <span className="text-emerald-400 flex items-center gap-1 font-normal lowercase">
          <Sparkles className="w-3.5 h-3.5" /> fast transcode
        </span>
      </div>

      {/* Format Selection Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setFormatType('video')}
          disabled={isDownloading || disabled}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 border ${
            formatType === 'video'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Video (MP4)</span>
        </button>

        <button
          type="button"
          onClick={() => setFormatType('audio')}
          disabled={isDownloading || disabled}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 border ${
            formatType === 'audio'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Audio (MP3)</span>
        </button>
      </div>

      {/* Quality dropdown for video */}
      {formatType === 'video' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <label htmlFor="quality-select" className="text-xs sm:text-sm text-neutral-300 font-medium flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            Video Quality:
          </label>

          <select
            id="quality-select"
            value={selectedHeight}
            onChange={e => setSelectedHeight(e.target.value)}
            disabled={isDownloading || disabled}
            aria-label="Video Quality"
            className="w-full sm:w-60 py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
          >
            {heights && heights.length > 0 ? (
              <>
                {heights.map(h => (
                  <option key={h} value={h}>
                    {getQualityLabel(h)}
                  </option>
                ))}
                <option value="">Best Available</option>
              </>
            ) : (
              <option value="">Best Available (Original)</option>
            )}
          </select>
        </div>
      )}

      {/* Audio description */}
      {formatType === 'audio' && (
        <div className="py-1 px-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-xs text-neutral-400 flex items-center justify-between">
          <span>High quality audio extraction (320kbps / best VBR MP3)</span>
          <span className="text-emerald-400 font-mono text-[11px]">.mp3</span>
        </div>
      )}

      {/* Download Action Button */}
      <button
        type="button"
        onClick={handleDownloadClick}
        disabled={isDownloading || disabled}
        className="w-full mt-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-neutral-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        <Download className="w-5 h-5" />
        <span>Download {formatType === 'audio' ? 'MP3 Audio' : 'MP4 Video'}</span>
      </button>
    </div>
  );
}
