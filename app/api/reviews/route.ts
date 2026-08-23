import { NextResponse } from 'next/server';
import { getDBData, saveDBData, getDBDataAsync } from '@/lib/db';

export async function GET() {
  const data = await getDBDataAsync();
  return NextResponse.json(data.reviews || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, rating, comment, itemOrdered } = body;

    const sanitizedName = String(name || '').trim().slice(0, 100);
    const sanitizedComment = String(comment || '').trim().slice(0, 1000);
    const sanitizedLocation = String(location || 'Quetta').trim().slice(0, 100);
    const sanitizedItem = String(itemOrdered || 'Pizza House Special').trim().slice(0, 100);

    if (!sanitizedName || !sanitizedComment) {
      return NextResponse.json(
        { error: 'Name and review comment are required' },
        { status: 400 }
      );
    }

    const rawRating = Number(rating);
    const validRating = Number.isFinite(rawRating) ? Math.min(Math.max(Math.round(rawRating), 1), 5) : 5;

    const data = getDBData();
    if (!data.reviews) {
      data.reviews = [];
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      name: sanitizedName,
      location: sanitizedLocation || 'Quetta',
      rating: validRating,
      comment: sanitizedComment,
      itemOrdered: sanitizedItem || 'Pizza House Special',
      date: 'Just now',
      createdAt: new Date().toISOString(),
    };

    data.reviews.unshift(newReview);
    saveDBData(data);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save review' },
      { status: 500 }
    );
  }
}
