import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('phq_admin_session');
    if (!session || session.value !== 'active_admin_session_token') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing customer details or cart items' }, { status: 400 });
    }

    const order = createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      orderType: body.orderType || 'delivery',
      address: body.address || '',
      landmark: body.landmark || '',
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: 'pending',
      subtotal: Number(body.subtotal) || 0,
      tax: Number(body.tax) || 0,
      deliveryFee: Number(body.deliveryFee) || 0,
      discount: Number(body.discount) || 0,
      total: Number(body.total) || 0,
      items: body.items,
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
