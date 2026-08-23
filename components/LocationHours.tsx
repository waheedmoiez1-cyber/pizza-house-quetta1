'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation, Flame, Check, Copy, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { StoreSettings } from '@/lib/types';

interface LocationHoursProps {
  settings?: StoreSettings;
}

export default function LocationHours({ settings }: LocationHoursProps) {
  const phone = settings?.phone || '0300-1234567';
  const address = settings?.address || 'Toghi Road, Quetta, Balochistan, Pakistan';
  const hours = settings?.hours || 'Daily, 10:00 AM – 12:00 AM';

  const [copied, setCopied] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    // Check if open now based on Pakistan Standard Time (UTC+5)
    const checkOpenStatus = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pktTime = new Date(utc + 3600000 * 5);
      const hour = pktTime.getHours();
      const open = hour >= 10 || hour === 0;
      setIsOpenNow(open);
    };

    checkOpenStatus();
    const timer = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schedule = [
    { day: 'Monday', time: '10:00 AM - 12:00 AM' },
    { day: 'Tuesday', time: '10:00 AM - 12:00 AM' },
    { day: 'Wednesday', time: '10:00 AM - 12:00 AM' },
    { day: 'Thursday', time: '10:00 AM - 12:00 AM' },
    { day: 'Friday', time: '10:00 AM - 12:00 AM' },
    { day: 'Saturday', time: '10:00 AM - 12:00 AM' },
    { day: 'Sunday', time: '10:00 AM - 12:00 AM' },
  ];

  return (
    <section id="location" className="py-20 sm:py-28 bg-[var(--color-dark)] relative border-t border-[var(--color-border)] scroll-mt-16 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text & Hours */}
          <ScrollReveal direction="left" duration={0.7}>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] text-xs font-bold uppercase tracking-wider border border-red-500/30">
                  <MapPin className="w-3.5 h-3.5" />
                  Visit Us In Quetta
                </div>

                {/* Real-time Status Badge */}
                {isOpenNow ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open Now • Closes at Midnight
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Opens at 10:00 AM
                  </div>
                )}
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase mb-4">
                Location & <span className="text-[#F4B93B]">Opening Hours</span>
              </h2>

              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed mb-8">
                Come dine in for piping hot pizzas straight from the deck oven or order speedy home delivery across Quetta. Located conveniently on Toghi Road!
              </p>

              {/* Address & Phone Cards */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-amber-400/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#C8102E] text-white shrink-0 shadow-lg shadow-red-600/30">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-sm">Restaurant Address</h4>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{address}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyAddress}
                    className="p-2.5 min-h-[40px] rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)] shrink-0 flex items-center gap-1 text-xs font-bold"
                    title="Copy address to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-amber-400/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#F4B93B] text-[#111111] shrink-0 shadow-lg shadow-amber-500/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-sm">Direct Phone Orders</h4>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{phone} (Hotline)</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                    className="px-4 py-2.5 min-h-[40px] rounded-xl bg-[#F4B93B] hover:bg-[#F6C75E] text-[#111111] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md flex items-center justify-center"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* Weekly Schedule Table */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                  <span className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F4B93B]" />
                    Weekly Operating Schedule
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Open 7 Days A Week
                  </span>
                </div>

                <div className="space-y-2">
                  {schedule.map((s) => (
                    <div key={s.day} className="flex justify-between text-xs py-1">
                      <span className="text-[var(--color-text-secondary)] font-medium">{s.day}</span>
                      <span className="text-[var(--color-text-primary)] font-bold">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Map Card */}
          <ScrollReveal direction="right" duration={0.7} delay={0.2}>
            <div className="relative h-[500px] rounded-3xl overflow-hidden glass-card shadow-2xl bg-black/60 flex flex-col justify-between p-8 border border-[var(--color-border)]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/60 to-transparent" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-4 py-2 rounded-full glass-panel text-[#F4B93B] font-bold text-xs border border-[#F4B93B]/30 flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-3.5 h-3.5" />
                  Live Outlet Location
                </span>
              </div>

              <div className="relative z-10 glass-panel p-6 rounded-3xl border border-[var(--color-border)] shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#C8102E] text-white flex items-center justify-center font-bold shadow-lg shadow-red-600/30">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">Pizza House Quetta</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">Toghi Road, Quetta</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed font-medium">
                  Fastest delivery coverage across Toghi Road, Serena Hotel Area, Civil Station, Jinnah Road & Cantonment.
                </p>

                <a
                  href="https://maps.google.com/?q=Toghi+Road+Quetta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#F4B93B] to-[#e2a82d] hover:from-[#e2a82d] hover:to-[#F4B93B] text-[#111111] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-102 active:scale-98"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions in Google Maps</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
