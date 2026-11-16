import React from 'react';

const PLATFORMS = [
  { name: 'YouTube', color: 'hover:border-red-500/50 hover:text-red-400' },
  { name: 'TikTok', color: 'hover:border-cyan-400/50 hover:text-cyan-300' },
  { name: 'Instagram', color: 'hover:border-pink-500/50 hover:text-pink-400' },
  { name: 'Pinterest', color: 'hover:border-rose-500/50 hover:text-rose-400' },
  { name: 'X/Twitter', color: 'hover:border-neutral-400/50 hover:text-white' },
  { name: 'Facebook', color: 'hover:border-blue-500/50 hover:text-blue-400' },
  { name: 'Reddit', color: 'hover:border-orange-500/50 hover:text-orange-400' },
  { name: 'Threads', color: 'hover:border-neutral-300/50 hover:text-neutral-200' },
  { name: 'Bluesky', color: 'hover:border-sky-400/50 hover:text-sky-300' },
  { name: 'Unsplash / Web', color: 'hover:border-emerald-400/50 hover:text-emerald-300' },
  { name: 'Twitch', color: 'hover:border-purple-500/50 hover:text-purple-400' },
  { name: 'SoundCloud', color: 'hover:border-amber-500/50 hover:text-amber-400' },
];

export function PlatformChips({ onSelectPlatform }) {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 pb-3">
      <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mr-1 select-none">
        Videos, Audio & Pictures:
      </span>
      {PLATFORMS.map(p => (
        <button
          key={p.name}
          type="button"
          onClick={() => onSelectPlatform && onSelectPlatform(p.name)}
          className={`px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 transition-all duration-200 select-none ${p.color}`}
          title={`Supports ${p.name}`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
