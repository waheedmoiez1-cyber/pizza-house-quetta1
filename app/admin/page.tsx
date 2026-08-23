'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Utensils, AlertCircle, ArrowUpRight, Clock, ChefHat, Truck, CheckCircle2 } from 'lucide-react';
import { Order, MenuItem, StoreSettings } from '@/lib/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, menuRes, settingsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/menu'),
          fetch('/api/settings'),
        ]);

        const ordersData = await ordersRes.json();
        const menuData = await menuRes.json();
        const settingsData = await settingsRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (menuData.success) setItems(menuData.items);
        if (settingsData.success) setSettings(settingsData.settings);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length;
  const inStockCount = items.filter((i) => i.isAvailable).length;

  if (loading) {
    return (
      <div className="py-20 text-center text-white/60">
        <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Admin Metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white">
          Dashboard <span className="text-[#F4B93B]">Overview</span>
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Real-time metrics, order updates, and inventory highlights for Pizza House Quetta.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase font-semibold">Total Revenue</p>
            <h3 className="text-2xl font-bold text-[#F4B93B] mt-1">
              Rs. {totalRevenue.toLocaleString('en-PK')}
            </h3>
            <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Live from Orders
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F4B93B]/20 text-[#F4B93B]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase font-semibold">Total Customer Orders</p>
            <h3 className="text-2xl font-bold text-white mt-1">{orders.length}</h3>
            <p className="text-[10px] text-[#F4B93B] mt-1 font-semibold">
              {pendingOrdersCount} Active In-Kitchen
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#C8102E]/20 text-[#C8102E]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase font-semibold">Menu Catalog Items</p>
            <h3 className="text-2xl font-bold text-white mt-1">{items.length}</h3>
            <p className="text-[10px] text-green-400 mt-1 font-semibold">
              {inStockCount} In Stock / {items.length - inStockCount} Out of Stock
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 text-white">
            <Utensils className="w-6 h-6 text-[#F4B93B]" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase font-semibold">Store Status</p>
            <h3 className={`text-xl font-bold mt-1 ${settings?.isOpen ? 'text-green-400' : 'text-red-400'}`}>
              {settings?.isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}
            </h3>
            <p className="text-[10px] text-white/60 mt-1">{settings?.hours}</p>
          </div>
          <div className={`p-3 rounded-xl ${settings?.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Incoming Orders List */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-bold text-white uppercase">
            Recent Customer Orders
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs text-[#F4B93B] font-bold hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-white/50 py-8 text-center">No orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Order Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80 font-medium">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5">
                    <td className="py-3 font-bold text-[#F4B93B]">{order.orderNumber}</td>
                    <td className="py-3">
                      <div>
                        <span className="font-semibold text-white block">{order.customerName}</span>
                        <span className="text-[10px] text-white/50">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3 font-bold text-white">Rs. {order.total}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-white font-bold text-[10px] uppercase">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white/50 text-[10px]">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
