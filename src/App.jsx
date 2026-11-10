import React, { useState } from 'react';
import { useDownloader } from './hooks/useDownloader.js';
import { UrlInput } from './components/UrlInput.jsx';
import { PlatformChips } from './components/PlatformChips.jsx';
import { ErrorMessage } from './components/ErrorMessage.jsx';
import { PreviewCard } from './components/PreviewCard.jsx';
import { FormatPicker } from './components/FormatPicker.jsx';
import { ProgressBar } from './components/ProgressBar.jsx';
import { Footer } from './components/Footer.jsx';
import { DownloadCloud, ArrowLeft } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const {
    status,
    mediaInfo,
    progress,
    error,
    downloadedFileName,
    fetchMedia,
    startDownload,
    reset,
    setError,
  } = useDownloader();

  const handleFetch = (submittedUrl) => {
    fetchMedia(submittedUrl);
  };

  const handlePlatformSelect = (platformName) => {
    // Helpful guide if user clicks a platform chip
    if (!url) {
      setUrl('');
    }
  };

  const handleStartDownload = ({ type, height }) => {
    startDownload({ type, height });
  };

  const isBusy = status === 'fetching' || status === 'preparing' || status === 'downloading';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background ambient subtle glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 max-w-3xl mx-auto w-full">
        {/* Header Branding */}
        <header className="text-center mb-8 sm:mb-10 w-full">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800/80 mb-4 shadow-inner">
            <DownloadCloud className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-neutral-300 tracking-wide">
              Fast, Private & Ad-Free
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-100 font-sans">
            Video <span className="text-emerald-400">Saver</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Download high quality videos or extract MP3 audio from any link in seconds.
          </p>
        </header>

        {/* Input & Form Container */}
        <div className="w-full flex flex-col items-center">
          <UrlInput
            url={url}
            setUrl={setUrl}
            onSubmit={handleFetch}
            isLoading={status === 'fetching'}
            disabled={status === 'preparing' || status === 'downloading'}
          />

          {/* Inline Error Message */}
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />

          {/* Platform Badges */}
          <PlatformChips onSelectPlatform={handlePlatformSelect} />
        </div>

        {/* Dynamic State Panels */}
        <div className="w-full mt-4 flex flex-col gap-5">
          {/* Active Download / Progress Box */}
          {(status === 'preparing' || status === 'downloading' || status === 'done') && (
            <ProgressBar
              status={status}
              progress={progress}
              filename={downloadedFileName}
              duration={mediaInfo?.duration || 0}
              onReset={() => {
                reset();
                setUrl('');
              }}
            />
          )}

          {/* Media Preview Card */}
          {mediaInfo && (
            <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Media Preview
                </span>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isBusy}
                  className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose different video</span>
                </button>
              </div>

              <PreviewCard info={mediaInfo} />

              <FormatPicker
                heights={mediaInfo.heights}
                onDownload={handleStartDownload}
                isDownloading={status === 'preparing' || status === 'downloading'}
                disabled={isBusy}
              />
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
