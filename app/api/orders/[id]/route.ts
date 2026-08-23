import { NextResponse } from 'next/server';
import { getDBData, saveDBData, getOrderById, verifyAdminSessionCookie } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const data = getDBData();

    const orderIndex = data.orders.findIndex((o) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = {
      ...data.orders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    data.orders[orderIndex] = updatedOrder;
    saveDBData(data);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const data = getDBData();

    const orderIndex = data.orders.findIndex((o) => o.id === id || o.orderNumber === id);

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
    saveDBData(data);

    return NextResponse.json({ success: true, order: data.orders[orderIndex] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const data = getDBData();

    const orderIndex = data.orders.findIndex((o) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const deletedOrder = data.orders.splice(orderIndex, 1)[0];
    saveDBData(data);

    return NextResponse.json({ success: true, deletedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

