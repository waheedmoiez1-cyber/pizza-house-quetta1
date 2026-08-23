'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, CookingPot, MessageSquare } from 'lucide-react';
import { Order } from '@/lib/types';

interface KitchenTicketModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function KitchenTicketModal({ order, isOpen, onClose }: KitchenTicketModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const deliveryType = order.deliveryOption || order.orderType || 'delivery';
  const customerPhone = order.customerPhone || order.phone || 'N/A';
  const customerAddress = order.address || 'Pickup from Store';

  const formattedWhatsAppText = encodeURIComponent(
    `*KITCHEN ORDER TICKET (KOT)* 🍳\n` +
    `*Ticket #:* ${order.orderNumber || order.id}\n` +
    `*Time:* ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n` +
    `*Type:* ${deliveryType.toUpperCase()}\n` +
    `*Customer:* ${order.customerName} (${customerPhone})\n` +
    `*Address:* ${customerAddress}\n\n` +
    `*ITEMS TO PREPARE:*\n` +
    order.items
      .map(
        (i, idx) =>
          `${idx + 1}. *[x${i.quantity}] ${i.name}* (${i.selectedSize || 'Standard'})\n` +
          (i.selectedAddOns?.length ? `   Add-ons: ${i.selectedAddOns.join(', ')}\n` : '')
      )
      .join('\n') +
    (order.notes ? `\n*Cooking Notes:* ${order.notes}` : '')
  );

  const whatsappUrl = `https://wa.me/923001234567?text=${formattedWhatsAppText}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#FFF8ED] text-[#111111] rounded-3xl p-6 shadow-2xl relative border-2 border-[#111111]/20 print:p-0 print:border-none print:shadow-none"
        >
          {/* Header Controls (Hidden on print) */}
          <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-[#111111]/20 print:hidden">
            <div className="flex items-center gap-2 text-[#C8102E] font-bold text-xs uppercase tracking-wider">
              <CookingPot className="w-5 h-5" />
              <span>Kitchen Order Ticket (KOT)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#111111]/10 hover:bg-[#111111]/20 text-[#111111] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Printable Ticket Receipt */}
          <div className="font-mono space-y-4">
            {/* Header */}
            <div className="text-center border-b border-dashed border-[#111111]/40 pb-3">
              <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#C8102E]">
                PIZZA HOUSE QUETTA
              </h2>
              <p className="text-[11px] font-bold text-[#111111]/70">KITCHEN PRODUCTION SLIP</p>
              <div className="mt-2 text-xs font-black bg-[#C8102E] text-white py-1 px-3 rounded-full inline-block">
                ORDER #{order.orderNumber || order.id}
              </div>
            </div>

            {/* Meta details */}
            <div className="text-xs space-y-1 bg-[#111111]/5 p-3 rounded-xl border border-[#111111]/10">
              <div className="flex justify-between">
                <span className="font-bold">Date & Time:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Delivery Option:</span>
                <span className="font-black uppercase text-[#C8102E]">{deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Customer:</span>
                <span>{order.customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Address:</span>
                <span className="truncate max-w-[200px]">{customerAddress}</span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider mb-2 text-[#111111]/80">
                Items to Prepare ({order.items.reduce((a, b) => a + b.quantity, 0)} qty)
              </div>

              <div className="divide-y divide-dashed divide-[#111111]/30">
                {order.items.map((item: any, idx) => {
                  const itemName = item.item?.name || item.name || 'Delicious Item';
                  const sizeName = typeof item.selectedSize === 'object' ? item.selectedSize?.name : (item.selectedSize || item.size || '');
                  const price = item.unitPrice || item.price || 0;
                  const qty = item.quantity || 1;
                  const itemTotal = item.totalPrice || (price * qty);

                  return (
                    <div key={idx} className="py-2.5 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-[#111111]">
                          [{qty}x] {itemName}
                        </span>
                        {sizeName && (
                          <p className="text-xs font-semibold text-[#C8102E]">
                            Size: {sizeName}
                          </p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-[11px] text-[#111111]/70">
                            Add-ons: {Array.isArray(item.selectedAddOns) ? item.selectedAddOns.map((a: any) => typeof a === 'object' ? a.name : a).join(', ') : ''}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-xs shrink-0">
                        Rs. {itemTotal.toLocaleString('en-PK')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs">
                <strong className="text-amber-900 block font-bold mb-0.5">Kitchen Special Notes:</strong>
                <p className="italic text-amber-950">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}

            {/* Total Footer */}
            <div className="pt-3 border-t-2 border-black flex justify-between items-center text-sm font-black">
              <span>TOTAL ORDER AMOUNT:</span>
              <span className="text-base text-[#C8102E]">
                Rs. {order.total.toLocaleString('en-PK')}
              </span>
            </div>
          </div>

          {/* Action Buttons (Hidden on print) */}
          <div className="mt-6 grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forward to Kitchen</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
