import { useState, useCallback } from 'react';
import { getInfo, downloadFile } from '../api/videoApi.js';

export function useDownloader() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'fetching' | 'ready' | 'preparing' | 'downloading' | 'done' | 'error'
  const [mediaInfo, setMediaInfo] = useState(null);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [error, setError] = useState(null);
  const [downloadedFileName, setDownloadedFileName] = useState('');

  /**
   * Fetch media info from link
   */
  const fetchMedia = useCallback(async rawUrl => {
    if (!rawUrl || !rawUrl.trim()) {
      setError('Please enter or paste a valid video or music link.');
      setStatus('error');
      return;
    }

    try {
      setError(null);
      setStatus('fetching');
      setMediaInfo(null);
      setProgress(0);

      const info = await getInfo(rawUrl.trim());
      setMediaInfo({
        ...info,
        originalUrl: rawUrl.trim(),
      });
      setStatus('ready');
    } catch (err) {
      console.error('[useDownloader] fetchMedia error:', err);
      setError(err.message || 'Failed to retrieve media information.');
      setStatus('error');
    }
  }, []);

  /**
   * Start preparing & downloading selected format
   */
  const startDownload = useCallback(
    async ({ type = 'video', height = null }) => {
      if (!mediaInfo || !mediaInfo.originalUrl) {
        setError('No media link loaded. Please fetch a video first.');
        setStatus('error');
        return;
      }

      try {
        setError(null);
        setStatus('preparing');
        setProgress(0);

        let hasReceivedBytes = false;

        const { blob, filename } = await downloadFile(
          {
            url: mediaInfo.originalUrl,
            type,
            height,
            title: mediaInfo.title,
          },
          progressEvent => {
            if (!hasReceivedBytes && progressEvent.loaded > 0) {
              hasReceivedBytes = true;
              setStatus('downloading');
            }

            if (progressEvent.total) {
              const percent = Math.min(
                100,
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
              setProgress(percent);
            }
          }
        );

        // Trigger browser save
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        setDownloadedFileName(filename);
        setStatus('done');
      } catch (err) {
        console.error('[useDownloader] startDownload error:', err);
        setError(err.message || 'Download failed.');
        setStatus('error');
      }
    },
    [mediaInfo]
  );

  /**
   * Reset downloader state
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setMediaInfo(null);
    setProgress(0);
    setError(null);
    setDownloadedFileName('');
  }, []);

  return {
    status,
    mediaInfo,
    progress,
    error,
    downloadedFileName,
    fetchMedia,
    startDownload,
    reset,
    setError,
  };
}
