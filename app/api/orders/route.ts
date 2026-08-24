import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrderAsync, getDBDataAsync } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('phq_admin_session');
    if (!session || session.value !== 'active_admin_session_token') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await getDBDataAsync();
    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.customerName || !body.customerPhone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing customer details or cart items' }, { status: 400 });
    }

    const order = await createOrderAsync({
      customerName: String(body.customerName).trim(),
      customerPhone: String(body.customerPhone).trim(),
      phone: String(body.customerPhone).trim(),
      customerEmail: String(body.customerEmail || '').trim(),
      orderType: body.orderType === 'pickup' ? 'pickup' : 'delivery',
      deliveryOption: body.orderType === 'pickup' ? 'pickup' : 'delivery',
      address: String(body.address || '').trim(),
      landmark: String(body.landmark || '').trim(),
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: 'pending',
      subtotal: Number(body.subtotal) || 0,
      tax: Number(body.tax) || 0,
      deliveryFee: Number(body.deliveryFee) || 0,
      discount: Number(body.discount) || 0,
      total: Number(body.total) || 0,
      items: body.items,
      notes: String(body.notes || '').trim(),
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to place order' }, { status: 500 });
  }
}
