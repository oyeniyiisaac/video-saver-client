import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
    if (isIPhoneOrIPad) {
      setIsIOS(true);
    }

    // Listen for beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSTip(true);
    }
  };

  if (isDismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-900/95 backdrop-blur-md border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 text-neutral-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
          <Smartphone className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-semibold text-white tracking-tight">
            Install Video Saver
          </p>
          <p className="text-[11px] text-neutral-400 truncate">
            {showIOSTip
              ? 'Tap Share then "Add to Home Screen"'
              : 'Add to home screen for instant access'}
          </p>
        </div>

        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
