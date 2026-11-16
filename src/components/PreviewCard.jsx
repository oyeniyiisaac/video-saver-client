import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { getProxyImageUrl } from '../api/videoApi.js';

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

export function PreviewCard({
  info,
  selectedImageIndex = 0,
  onSelectImageIndex,
}) {
  const [useProxy, setUseProxy] = useState(false);
  const [imgError, setImgError] = useState(false);

  const images = Array.isArray(info?.images) ? info.images : [];
  const hasMultipleImages = images.length > 1;
  const activeImage = images[selectedImageIndex] || images[0] || null;
  const rawPreviewUrl = activeImage?.thumbnail || activeImage?.url || info?.thumbnail || null;

  useEffect(() => {
    setUseProxy(false);
    setImgError(false);
  }, [rawPreviewUrl, selectedImageIndex]);

  if (!info) return null;

  const displaySrc = rawPreviewUrl
    ? useProxy
      ? getProxyImageUrl(rawPreviewUrl)
      : rawPreviewUrl
    : null;

  const handleImageError = () => {
    if (!useProxy && rawPreviewUrl) {
      setUseProxy(true);
    } else {
      setImgError(true);
    }
  };

  const handlePrevImage = () => {
    if (!hasMultipleImages || !onSelectImageIndex) return;
    const nextIdx = (selectedImageIndex - 1 + images.length) % images.length;
    onSelectImageIndex(nextIdx);
  };

  const handleNextImage = () => {
    if (!hasMultipleImages || !onSelectImageIndex) return;
    const nextIdx = (selectedImageIndex + 1) % images.length;
    onSelectImageIndex(nextIdx);
  };

  const isImagePost = info.mediaType === 'image' || info.hasVideo === false;

  return (
    <div className="w-full rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm transition-all duration-300 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Thumbnail / Picture Preview */}
        <div className="relative w-full sm:w-60 aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/60 shrink-0 group">
          {displaySrc && !imgError ? (
            <img
              src={displaySrc}
              alt={info.title}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
              {isImagePost ? <ImageIcon className="w-8 h-8" /> : <Film className="w-8 h-8" />}
              <span className="text-xs">No preview</span>
            </div>
          )}

          {/* Prev/Next Controls for Multi-Image Galleries */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/75 text-white hover:bg-emerald-500 hover:text-neutral-950 transition-colors border border-neutral-700/60"
                title="Previous picture"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/75 text-white hover:bg-emerald-500 hover:text-neutral-950 transition-colors border border-neutral-700/60"
                title="Next picture"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Duration or Picture Count overlay badge */}
          {info.duration > 0 ? (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono text-neutral-200 border border-neutral-700/50 backdrop-blur-xs flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{formatDuration(info.duration)}</span>
            </div>
          ) : hasMultipleImages ? (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 backdrop-blur-xs flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>
                {selectedImageIndex + 1} / {images.length}
              </span>
            </div>
          ) : isImagePost ? (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 backdrop-blur-xs flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>Picture</span>
            </div>
          ) : null}

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

              {images.length > 0 && (
                <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
                  <ImageIcon className="w-4 h-4" />
                  <span>
                    {images.length > 1
                      ? `${images.length} Pictures Available`
                      : isImagePost
                      ? 'High-Res Picture'
                      : 'Picture / Cover Available'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-2 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isImagePost
                  ? 'Picture ready to download'
                  : 'Ready for video, audio, or picture download'}
              </span>
            </div>
            {activeImage?.width && activeImage?.height && (
              <span className="font-mono text-[11px] text-neutral-400">
                {activeImage.width}&times;{activeImage.height}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Image Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="pt-2 border-t border-neutral-800/70 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">
              Select picture from post ({selectedImageIndex + 1} of {images.length}):
            </span>
            <span className="text-emerald-400 text-[11px]">
              {activeImage?.label || `Picture #${selectedImageIndex + 1}`}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => {
              const isSelected = idx === selectedImageIndex;
              const thumbUrl = getProxyImageUrl(img.thumbnail || img.url);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectImageIndex && onSelectImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-105'
                      : 'border-neutral-800 opacity-65 hover:opacity-100 hover:border-neutral-600'
                  }`}
                  title={img.label || `Picture ${idx + 1}`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[10px] font-mono text-white">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
