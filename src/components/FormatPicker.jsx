import React, { useState, useEffect } from 'react';
import {
  Film,
  Music,
  Image as ImageIcon,
  Download,
  Sparkles,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

export function FormatPicker({
  heights = [],
  mediaType = 'video',
  hasVideo = true,
  images = [],
  selectedImageIndex = 0,
  onSelectImageIndex,
  onDownload,
  isDownloading,
  disabled,
}) {
  const isImageOnly = mediaType === 'image' || !hasVideo;
  const [formatType, setFormatType] = useState(isImageOnly ? 'image' : 'video'); // 'video' | 'audio' | 'image'
  const [selectedHeight, setSelectedHeight] = useState('');
  const [imageFormat, setImageFormat] = useState('jpg'); // 'jpg' | 'png' | 'webp' | 'original'

  useEffect(() => {
    if (isImageOnly) {
      setFormatType('image');
    } else {
      setFormatType('video');
    }
  }, [isImageOnly]);

  // Set default selected height when heights update
  useEffect(() => {
    if (heights && heights.length > 0) {
      const preferred = heights.includes(1080) ? 1080 : heights[0];
      setSelectedHeight(preferred.toString());
    } else {
      setSelectedHeight('');
    }
  }, [heights]);

  const activeImage = images[selectedImageIndex] || images[0] || null;

  const handleDownloadClick = (downloadAll = false) => {
    if (isDownloading || disabled) return;
    onDownload({
      type: formatType,
      height: formatType === 'video' && selectedHeight ? parseInt(selectedHeight, 10) : null,
      imageUrl: formatType === 'image' ? activeImage?.url || null : null,
      imageIndex: selectedImageIndex,
      imageFormat,
      downloadAll,
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
          <Sparkles className="w-3.5 h-3.5" /> {formatType === 'image' ? 'hd picture saver' : 'fast transcode'}
        </span>
      </div>

      {/* Format Selection Buttons */}
      <div className={`grid ${isImageOnly ? 'grid-cols-1' : 'grid-cols-3'} gap-2.5`}>
        {!isImageOnly && (
          <>
            <button
              type="button"
              onClick={() => setFormatType('video')}
              disabled={isDownloading || disabled}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border ${
                formatType === 'video'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <Film className="w-4 h-4 shrink-0" />
              <span>Video (MP4)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormatType('audio')}
              disabled={isDownloading || disabled}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border ${
                formatType === 'audio'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span>Audio (MP3)</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setFormatType('image')}
          disabled={isDownloading || disabled}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border ${
            formatType === 'image'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <ImageIcon className="w-4 h-4 shrink-0" />
          <span>{isImageOnly ? 'Picture (High Resolution)' : 'Picture / Cover'}</span>
        </button>
      </div>

      {/* Quality dropdown for video */}
      {formatType === 'video' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <label
            htmlFor="quality-select"
            className="text-xs sm:text-sm text-neutral-300 font-medium flex items-center gap-1.5"
          >
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
        <div className="py-2 px-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-xs text-neutral-400 flex items-center justify-between">
          <span>High quality audio extraction (320kbps / best VBR MP3)</span>
          <span className="text-emerald-400 font-mono text-[11px]">.mp3</span>
        </div>
      )}

      {/* Picture Format & Selection options */}
      {formatType === 'image' && (
        <div className="flex flex-col gap-3 pt-1">
          {images.length > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label
                htmlFor="picture-index-select"
                className="text-xs sm:text-sm text-neutral-300 font-medium flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                Selected Picture:
              </label>
              <select
                id="picture-index-select"
                value={selectedImageIndex}
                onChange={e => onSelectImageIndex && onSelectImageIndex(parseInt(e.target.value, 10))}
                disabled={isDownloading || disabled}
                className="w-full sm:w-60 py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
              >
                {images.map((img, idx) => (
                  <option key={idx} value={idx}>
                    {img.label || `Picture #${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="image-format-select"
              className="text-xs sm:text-sm text-neutral-300 font-medium flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              Picture Format:
            </label>

            <select
              id="image-format-select"
              value={imageFormat}
              onChange={e => setImageFormat(e.target.value)}
              disabled={isDownloading || disabled}
              aria-label="Picture Format"
              className="w-full sm:w-60 py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            >
              <option value="jpg">JPG (High Compatibility)</option>
              <option value="png">PNG (Lossless Quality)</option>
              <option value="webp">WebP (Modern HD)</option>
              <option value="original">Original File Format</option>
            </select>
          </div>
        </div>
      )}

      {/* Download Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
        <button
          type="button"
          onClick={() => handleDownloadClick(false)}
          disabled={isDownloading || disabled}
          className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-neutral-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          <Download className="w-5 h-5" />
          <span>
            {formatType === 'audio'
              ? 'Download MP3 Audio'
              : formatType === 'image'
              ? images.length > 1
                ? `Download Picture #${selectedImageIndex + 1} (${imageFormat.toUpperCase()})`
                : `Download Picture (${imageFormat.toUpperCase()})`
              : 'Download MP4 Video'}
          </span>
        </button>

        {formatType === 'image' && images.length > 1 && (
          <button
            type="button"
            onClick={() => handleDownloadClick(true)}
            disabled={isDownloading || disabled}
            className="py-3.5 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.99] text-emerald-300 border border-emerald-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Layers className="w-4 h-4" />
            <span>Save All ({images.length})</span>
          </button>
        )}
      </div>
    </div>
  );
}
