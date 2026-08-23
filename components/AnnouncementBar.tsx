'use client';

import { useState } from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

interface AnnouncementBarProps {
  settings?: StoreSettings;
}

export default function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (dismissed || !settings?.announcementActive || !settings?.announcementText) {
    return null;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md relative z-50 border-b border-red-400/20">
      <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
        <Sparkles className="w-4 h-4 text-[#F4B93B] animate-pulse shrink-0" />
        <span className="font-semibold">{settings.announcementText}</span>
        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 hover:bg-black/50 text-[11px] font-extrabold text-[#F4B93B] border border-amber-300/30 transition-all active:scale-95 ml-1"
          title="Click to copy promo code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-300" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>USE: WELCOME10</span>
            </>
          )}
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white shrink-0 ml-2 min-h-[28px] min-w-[28px] flex items-center justify-center"
        aria-label="Dismiss announcement banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
