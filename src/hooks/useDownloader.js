import { useState, useCallback } from 'react';
import { getInfo, downloadFile } from '../api/videoApi.js';

function triggerBrowserSave(blob, filename) {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

export function useDownloader() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'fetching' | 'ready' | 'preparing' | 'downloading' | 'done' | 'error'
  const [mediaInfo, setMediaInfo] = useState(null);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [error, setError] = useState(null);
  const [downloadedFileName, setDownloadedFileName] = useState('');

  /**
   * Fetch media info (video, audio, or picture/gallery) from link
   */
  const fetchMedia = useCallback(async rawUrl => {
    if (!rawUrl || !rawUrl.trim()) {
      setError('Please enter or paste a valid video, music, or picture link.');
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
   * Start preparing & downloading selected format (video, audio, single picture, or all gallery pictures)
   */
  const startDownload = useCallback(
    async ({
      type = 'video',
      height = null,
      imageUrl = null,
      imageIndex = 0,
      imageFormat = 'jpg',
      downloadAll = false,
    }) => {
      if (!mediaInfo || !mediaInfo.originalUrl) {
        setError('No media link loaded. Please fetch a link first.');
        setStatus('error');
        return;
      }

      try {
        setError(null);
        setStatus('preparing');
        setProgress(0);

        // Batch download all pictures in a multi-image gallery/carousel
        if (type === 'image' && downloadAll && Array.isArray(mediaInfo.images) && mediaInfo.images.length > 1) {
          const totalImages = mediaInfo.images.length;
          setStatus('downloading');

          for (let i = 0; i < totalImages; i++) {
            const imgItem = mediaInfo.images[i];
            const itemTitle = `${mediaInfo.title || 'picture'}_${i + 1}`;
            const { blob, filename } = await downloadFile({
              url: mediaInfo.originalUrl,
              type: 'image',
              title: itemTitle,
              imageUrl: imgItem.url,
              imageIndex: i,
              imageFormat,
            });
            triggerBrowserSave(blob, filename);
            setProgress(Math.round(((i + 1) * 100) / totalImages));
          }

          setDownloadedFileName(`${totalImages} pictures (${imageFormat.toUpperCase()})`);
          setStatus('done');
          return;
        }

        let hasReceivedBytes = false;

        // Resolve target image URL if downloading a picture
        let resolvedImageUrl = imageUrl;
        if (type === 'image' && !resolvedImageUrl) {
          if (Array.isArray(mediaInfo.images) && mediaInfo.images.length > 0) {
            const chosen = mediaInfo.images[imageIndex] || mediaInfo.images[0];
            resolvedImageUrl = chosen.url;
          } else if (mediaInfo.thumbnail) {
            resolvedImageUrl = mediaInfo.thumbnail;
          }
        }

        const { blob, filename } = await downloadFile(
          {
            url: mediaInfo.originalUrl,
            type,
            height,
            title:
              type === 'image' && Array.isArray(mediaInfo.images) && mediaInfo.images.length > 1
                ? `${mediaInfo.title || 'picture'}_${imageIndex + 1}`
                : mediaInfo.title,
            imageUrl: resolvedImageUrl,
            imageIndex,
            imageFormat,
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

        triggerBrowserSave(blob, filename);
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
