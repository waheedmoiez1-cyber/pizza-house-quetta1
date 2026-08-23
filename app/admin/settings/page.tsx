'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check, Sparkles, Store, Phone, MapPin, DollarSign, Megaphone } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return <div className="py-20 text-center text-white/60">Loading Store Settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
          Website & Store <span className="text-[#F4B93B]">Settings</span>
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Customize brand info, phone number, operating hours, delivery fees, taxes, and live announcement banners.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Website & Store settings updated successfully! Live website refreshed.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Store Info */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="font-heading text-lg font-bold text-[#F4B93B] uppercase tracking-wider flex items-center gap-2">
            <Store className="w-5 h-5" /> Brand & Location Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Store Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Tagline
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Restaurant Location Address
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Phone Number (Hotline)
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                required
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isOpen}
                onChange={(e) => setSettings({ ...settings, isOpen: e.target.checked })}
                className="w-5 h-5 accent-[#C8102E] rounded"
              />
              <div>
                <span className="font-bold text-white text-sm block">Store Open Status</span>
                <span className="text-xs text-white/50">
                  {settings.isOpen ? 'Store is accepting online orders' : 'Store is currently CLOSED'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Delivery & Taxes */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="font-heading text-lg font-bold text-[#F4B93B] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Delivery Fees & Tax Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Flat Delivery Fee (PKR)
              </label>
              <input
                type="number"
                required
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Free Delivery Order Minimum (PKR)
              </label>
              <input
                type="number"
                required
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Announcement Bar */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="font-heading text-lg font-bold text-[#F4B93B] uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="w-5 h-5" /> Live Announcement Banner
          </h3>

          <div className="text-xs space-y-4">
            <div>
              <label className="font-bold uppercase tracking-wider text-white/70 block mb-2">
                Top Announcement Banner Text
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#C8102E]"
                placeholder="e.g. Free delivery on all orders over Rs. 1500!"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="w-5 h-5 accent-[#C8102E] rounded"
              />
              <span className="font-bold text-white text-xs">Show Top Announcement Banner on Public Website</span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:scale-[1.01] transition-transform"
        >
          <Save className="w-5 h-5" />
          <span>Save All Settings</span>
        </button>
      </form>
    </div>
  );
}
