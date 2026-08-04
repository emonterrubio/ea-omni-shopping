"use client";

import { Suspense } from "react";
import { OrderTrackingView } from "@/components/orders/OrderTrackingView";
import { PageLayout } from "@/components/layout/PageLayout";

function TrackOrderFallback() {
  return (
    <PageLayout>
      <p className="text-gray-600">Loading tracking details…</p>
    </PageLayout>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderFallback />}>
      <OrderTrackingView />
    </Suspense>
  );
}
