'use client';

import { use } from 'react';
import OrderTrackerPage from '../page';

export default function TrackByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderTrackerPage />;
}
