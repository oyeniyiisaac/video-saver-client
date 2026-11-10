import React, { useEffect, useState } from 'react';
import { getStats } from '../api/videoApi.js';
import { ShieldCheck, Video } from 'lucide-react';

export function Footer() {
  const [totalDownloads, setTotalDownloads] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getStats()
      .then(data => {
        if (isMounted && data && typeof data.totalDownloads === 'number') {
          setTotalDownloads(data.totalDownloads);
        }
      })
      .catch(() => {
        // If it fails, hide silently per requirement
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="w-full mt-auto py-8 px-4 border-t border-neutral-900 text-neutral-500 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Counter */}
        <div className="flex items-center gap-2">
          {totalDownloads !== null && totalDownloads > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-emerald-400 font-bold">{totalDownloads.toLocaleString()}</strong> videos saved
              </span>
            </div>
          ) : (
            <div className="text-neutral-500 text-xs font-medium">
              Video Saver &bull; Free & Open Web Downloader
            </div>
          )}
        </div>

        {/* Legal Disclaimer */}
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs text-center sm:text-right">
          <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Only download content you own or have permission to save.</span>
        </div>
      </div>
    </footer>
  );
}
