'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Edit3 } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export default function EditOrderModal({ order, isOpen, onClose, onOrderUpdated }: EditOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'completed' | 'failed'>('pending');
  const [total, setTotal] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || '');
      setPhone(order.customerPhone || order.phone || '');
      setAddress(order.address || '');
      setStatus(order.orderStatus || order.status || 'Pending');
      setPaymentStatus(order.paymentStatus || 'pending');
      setTotal(order.total || 0);
      setNotes(order.notes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone: phone,
          phone,
          address,
          orderStatus: status,
          status,
          paymentStatus,
          total: Number(total),
          notes,
        }),
      });

      if (res.ok) {
        onOrderUpdated();
        onClose();
      } else {
        setError('Failed to update order in database.');
      }
    } catch (err) {
      setError('Network error saving order modifications.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white/15 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full glass-panel hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[#F4B93B] font-bold text-xs uppercase tracking-wider mb-2">
            <Edit3 className="w-4 h-4" />
            <span>Admin Order Editor</span>
          </div>

          <h3 className="font-heading text-2xl font-bold text-white mb-6 uppercase">
            Edit Order <span className="text-[#C8102E]">#{order.orderNumber || order.id}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            {/* Order Status & Payment Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                >
                  <option value="Pending" className="bg-[#111111]">Pending</option>
                  <option value="Preparing" className="bg-[#111111]">Preparing in Kitchen</option>
                  <option value="Out for Delivery" className="bg-[#111111]">Out for Delivery</option>
                  <option value="Delivered" className="bg-[#111111]">Delivered / Completed</option>
                  <option value="Cancelled" className="bg-[#111111]">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e: any) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                >
                  <option value="pending" className="bg-[#111111]">Unpaid (Pending COD)</option>
                  <option value="paid" className="bg-[#111111]">Paid (Completed)</option>
                  <option value="failed" className="bg-[#111111]">Failed</option>
                </select>
              </div>
            </div>

            {/* Order Total Price */}
            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Order Total (PKR)
              </label>
              <input
                type="number"
                required
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Internal / Cooking Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 text-white text-xs font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-[#C8102E] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Order Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
