import { NextResponse } from 'next/server';
import { getDBDataAsync, addReview } from '@/lib/db';

export async function GET() {
  try {
    const data = await getDBDataAsync();
    return NextResponse.json(data.reviews || []);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, rating, comment, itemOrdered, foodItem } = body;

    const sanitizedName = String(name || '').trim().slice(0, 100);
    const sanitizedComment = String(comment || '').trim().slice(0, 1000);
    const sanitizedLocation = String(location || 'Quetta').trim().slice(0, 100);
    const sanitizedItem = String(itemOrdered || foodItem || 'Pizza House Special').trim().slice(0, 100);

    if (!sanitizedName || !sanitizedComment) {
      return NextResponse.json(
        { success: false, error: 'Name and review comment are required' },
        { status: 400 }
      );
    }

    const rawRating = Number(rating);
    const validRating = Number.isFinite(rawRating) ? Math.min(Math.max(Math.round(rawRating), 1), 5) : 5;

    const newReview = addReview({
      name: sanitizedName,
      location: sanitizedLocation || 'Quetta',
      rating: validRating,
      comment: sanitizedComment,
      itemOrdered: sanitizedItem || 'Pizza House Special',
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      ...newReview,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save review' },
      { status: 500 }
    );
  }
}
