import { NextResponse } from 'next/server';
import { getDBDataAsync, saveDBDataAsync, getOrderById, verifyAdminSessionCookie } from '@/lib/db';
import { Order } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getDBDataAsync();
  const { id } = await params;
  const decodedId = decodeURIComponent(id || '');
  const order = getOrderById(decodedId);

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = verifyAdminSessionCookie(request.headers.get('cookie'));
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = await getDBDataAsync();

    if (!Array.isArray(data.orders)) data.orders = [];
    const orderIndex = data.orders.findIndex((o: Order) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = {
      ...data.orders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    data.orders[orderIndex] = updatedOrder;
    await saveDBDataAsync(data);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = verifyAdminSessionCookie(request.headers.get('cookie'));
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = await getDBDataAsync();

    if (!Array.isArray(data.orders)) data.orders = [];
    const orderIndex = data.orders.findIndex((o: Order) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (body.orderStatus) {
      data.orders[orderIndex].orderStatus = body.orderStatus;
      data.orders[orderIndex].status = body.orderStatus;
      if (body.orderStatus === 'Delivered') {
        data.orders[orderIndex].paymentStatus = 'paid';
      }
    }
    if (body.paymentStatus) {
      data.orders[orderIndex].paymentStatus = body.paymentStatus;
    }

    data.orders[orderIndex].updatedAt = new Date().toISOString();
    await saveDBDataAsync(data);

    return NextResponse.json({ success: true, order: data.orders[orderIndex] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = verifyAdminSessionCookie(request.headers.get('cookie'));
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await getDBDataAsync();

    if (!Array.isArray(data.orders)) data.orders = [];
    const orderIndex = data.orders.findIndex((o: Order) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const deletedOrder = data.orders.splice(orderIndex, 1)[0];
    await saveDBDataAsync(data);

    return NextResponse.json({ success: true, deletedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete order' }, { status: 500 });
  }
}

