'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Clock, ChefHat, Truck, Home, CheckCircle2, Phone, MapPin, AlertCircle, RefreshCw, Printer, Edit, Trash2, MessageSquare, Search, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import EditOrderModal from '@/components/EditOrderModal';
import KitchenTicketModal from '@/components/KitchenTicketModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [kitchenOrder, setKitchenOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000); // Polling every 4 sec
    return () => clearInterval(interval);
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI Update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        fetchOrders();
      }
    } catch (err) {
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNo: string) => {
    if (!confirm(`Are you sure you want to permanently delete Order #${orderNo}?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert(data.error || 'Failed to delete order.');
      }
    } catch (err) {
      alert('Error deleting order.');
    }
  };

  const getCustomerWhatsAppUrl = (order: Order) => {
    const rawPhone = order.customerPhone || order.phone || '';
    const digits = rawPhone.replace(/\D/g, '');
    let formattedPhone = digits;
    if (digits.startsWith('0')) {
      formattedPhone = `92${digits.slice(1)}`;
    } else if (!digits.startsWith('92')) {
      formattedPhone = `92${digits}`;
    }

    const orderNo = order.orderNumber || order.id;
    let msg = '';
    if (order.orderStatus === 'Preparing') {
      msg = `Hi ${order.customerName}! Your order #${orderNo} is now being prepared in our kitchen at Pizza House Quetta 🍕`;
    } else if (order.orderStatus === 'Out for Delivery') {
      msg = `Hi ${order.customerName}! Great news! Order #${orderNo} is out for delivery with our rider. Hot slice coming your way! 🚚`;
    } else if (order.orderStatus === 'Delivered') {
      msg = `Hi ${order.customerName}! Order #${orderNo} has been marked completed/delivered! Enjoy your hot meal! Thank you for choosing Pizza House Quetta 🌟`;
    } else if (order.orderStatus === 'Cancelled') {
      msg = `Hi ${order.customerName}! Order #${orderNo} has been cancelled. Please contact hotline 0300-1234567 for any questions.`;
    } else {
      msg = `Hi ${order.customerName}! Status update for your Pizza House Quetta Order #${orderNo}: Current Status is ${order.orderStatus}.`;
    }

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status Filter
      if (selectedStatus !== 'all') {
        const orderSt = (order.orderStatus || order.status || '').toLowerCase();
        if (orderSt !== selectedStatus.toLowerCase()) return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchNo = (order.orderNumber || order.id || '').toLowerCase().includes(q);
        const matchName = (order.customerName || '').toLowerCase().includes(q);
        const matchPhone = (order.customerPhone || order.phone || '').toLowerCase().includes(q);
        const matchAddress = (order.address || '').toLowerCase().includes(q);
        if (!matchNo && !matchName && !matchPhone && !matchAddress) return false;
      }

      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
            Live Order <span className="text-[#F4B93B]">Monitor & Workflow</span>
            <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" title="Live Server Sync Active" />
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Real-time customer orders, Kitchen Slip printing, order management & WhatsApp notifications.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Orders Now</span>
        </button>
      </div>

      {/* Search Bar & Status Filter Tabs */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Name, Phone, Address..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/50 text-white placeholder-white/40 text-xs font-medium border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#F4B93B] hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          {['all', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => {
            const count =
              status === 'all'
                ? orders.length
                : orders.filter((o) => (o.orderStatus || o.status || '').toLowerCase() === status.toLowerCase()).length;
            const isActive = selectedStatus.toLowerCase() === status.toLowerCase();

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid / List */}
      {loading ? (
        <div className="py-20 text-center text-white/60">Syncing Admin Orders Database...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/10 p-8">
          <ShoppingBag className="w-12 h-12 text-[#F4B93B] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-white mb-1">No Orders Found</h3>
          <p className="text-xs text-white/60">
            No orders matching filter &ldquo;{selectedStatus}&rdquo; {searchQuery ? `and query "${searchQuery}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const currentStatus = order.orderStatus || order.status || 'Pending';
            const orderNo = order.orderNumber || order.id;

            return (
              <div
                key={order.id}
                className="bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative"
              >
                <div>
                  {/* Top header & Actions */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                    <div>
                      <span className="font-heading text-lg font-bold text-[#F4B93B]">
                        #{orderNo}
                      </span>
                      <span className="text-[10px] text-white/50 block">
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-bold text-xs uppercase shadow-md ${
                          currentStatus === 'Delivered'
                            ? 'bg-green-600'
                            : currentStatus === 'Out for Delivery'
                            ? 'bg-purple-600'
                            : currentStatus === 'Preparing'
                            ? 'bg-blue-600'
                            : currentStatus === 'Cancelled'
                            ? 'bg-red-900'
                            : 'bg-[#C8102E]'
                        }`}
                      >
                        {currentStatus}
                      </span>

                      {/* Edit Order */}
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete Order */}
                      <button
                        onClick={() => handleDeleteOrder(order.id, orderNo)}
                        className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors border border-red-500/30"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-1.5 text-xs text-white/80 mb-4 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{order.customerName}</span>
                      <a
                        href={`tel:${order.customerPhone || order.phone}`}
                        className="text-[#F4B93B] hover:underline text-[11px] font-normal flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {order.customerPhone || order.phone}
                      </a>
                    </div>

                    {order.address && (
                      <p className="text-[11px] text-white/70 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-[#C8102E] shrink-0 mt-0.5" />
                        <span>{order.address} {order.landmark ? `(Landmark: ${order.landmark})` : ''}</span>
                      </p>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-white/50 pt-1">
                      <span>Type: <strong className="text-white uppercase">{order.orderType || order.deliveryOption || 'Delivery'}</strong></span>
                      <span>Payment: <strong className="text-[#F4B93B] uppercase">{order.paymentMethod?.toUpperCase()} ({order.paymentStatus || 'Pending'})</strong></span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-bold uppercase text-white/50 tracking-wider">Ordered Items</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-white/90">
                        <span>
                          <strong className="text-[#F4B93B]">{item.quantity}x</strong> {item.name}{' '}
                          {item.selectedSize ? `(${item.selectedSize})` : ''}
                        </span>
                        <span className="font-bold">Rs. {(item.totalPrice || (item.price * item.quantity)).toLocaleString('en-PK')}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                      <span>Total Amount</span>
                      <span className="text-[#F4B93B]">Rs. {order.total.toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>

                {/* Kitchen & WhatsApp Actions */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Print Kitchen Slip */}
                    <button
                      onClick={() => setKitchenOrder(order)}
                      className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all shadow-md"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Kitchen Slip</span>
                    </button>

                    {/* Send WhatsApp Status Alert */}
                    <a
                      href={getCustomerWhatsAppUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-green-500/30 transition-all shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Alert</span>
                    </a>
                  </div>

                  {/* Status Update Buttons */}
                  <div>
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">
                      Update Workflow Status:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Pending')}
                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          currentStatus === 'Pending'
                            ? 'bg-[#F4B93B] text-[#1A1A1A] border-[#F4B93B]'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          currentStatus === 'Preparing'
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        Kitchen
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          currentStatus === 'Out for Delivery'
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        On Delivery
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          currentStatus === 'Delivered'
                            ? 'bg-green-600 text-white border-green-500'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        Delivered
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          currentStatus === 'Cancelled'
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Order Modal */}
      <EditOrderModal
        order={editingOrder}
        isOpen={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        onOrderUpdated={fetchOrders}
      />

      {/* Kitchen Ticket Modal */}
      <KitchenTicketModal
        order={kitchenOrder}
        isOpen={Boolean(kitchenOrder)}
        onClose={() => setKitchenOrder(null)}
      />
    </div>
  );
}
