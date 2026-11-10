import api from './axios.js';

/**
 * Helper to parse filename from Content-Disposition header
 */
function extractFilename(contentDisposition, fallbackTitle, type) {
  const defaultExt = type === 'audio' ? '.mp3' : '.mp4';

  if (contentDisposition) {
    // 1. Try RFC 5987 filename*
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        // Continue to fallback
      }
    }

    // 2. Try standard filename="value"
    const standardMatch = contentDisposition.match(/filename="?([^";\n]+)"?/i);
    if (standardMatch && standardMatch[1]) {
      return standardMatch[1].trim();
    }
  }

  // 3. Fallback to sanitized title
  const safeTitle = (fallbackTitle || 'download')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ');

  return safeTitle.endsWith(defaultExt) ? safeTitle : `${safeTitle}${defaultExt}`;
}

/**
 * Fetch video/media info
 * POST /api/info
 */
export async function getInfo(url) {
  const response = await api.post('/info', { url });
  return response.data;
}

/**
 * Download media file with progress tracking
 * POST /api/download
 */
export async function downloadFile({ url, type, height, title }, onProgress) {
  try {
    const response = await api.post(
      '/download',
      { url, type, height, title },
      {
        responseType: 'blob',
        timeout: 0, // No timeout for media downloads
        onDownloadProgress: progressEvent => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      }
    );

    const disposition = response.headers['content-disposition'];
    const filename = extractFilename(disposition, title, type);

    return {
      blob: response.data,
      filename,
    };
  } catch (err) {
    // If response was a Blob (e.g., 400/422/500 JSON sent with responseType 'blob'), read the error message
    if (err.originalError?.response?.data instanceof Blob) {
      try {
        const text = await err.originalError.response.data.text();
        const parsed = JSON.parse(text);
        if (parsed.error) {
          throw new Error(parsed.error);
        }
      } catch (parseErr) {
        if (parseErr.message && parseErr !== err) {
          throw parseErr;
        }
      }
    }
    throw err;
  }
}

/**
 * Fetch global saver statistics
 * GET /api/stats
 */
export async function getStats() {
  const response = await api.get('/stats');
  return response.data;
}
