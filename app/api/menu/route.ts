import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, addMenuItem, getCategories } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const items = getMenuItems(category, search);
    const categories = getCategories();

    return NextResponse.json({
      success: true,
      items,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic session cookie verification
    const session = request.cookies.get('phq_admin_session');
    if (!session || session.value !== 'active_admin_session_token') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = addMenuItem({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: body.categoryId,
      price: Number(body.price),
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      isBestseller: Boolean(body.isBestseller),
      isPopular: Boolean(body.isPopular),
      isSpicy: Boolean(body.isSpicy),
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      rating: 4.8,
      prepTime: body.prepTime || '15-20 min',
      sizes: body.sizes || [],
      addOns: body.addOns || [],
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
