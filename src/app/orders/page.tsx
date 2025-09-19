"use client";

import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { OrderList } from '@/components/orders/OrderList';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getOrders } from '@/services/orders';
import { Order } from '@/types/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Add minimum loading duration to make it feel intentional
    const startTime = Date.now();
    const minLoadingDuration = 1200; // 1.2 seconds minimum
    
    // Helper function to ensure minimum loading duration
    const finishLoading = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadingDuration - elapsed);
      setTimeout(() => setIsLoading(false), remaining);
    };
    
    const userOrders = getOrders();
    setOrders(userOrders);
    finishLoading();
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Loading Orders...</h1>
          <p className="text-gray-600">Please wait while we fetch your orders.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "My Orders", isActive: true }
        ]}
        className="mb-6"
      />
      
      <div className="text-left">
        <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4">My Orders</h1>
        <h4 className="font-base font-regular text-gray-600 mb-8">
          Track your orders and reorder items you've purchased before
        </h4>
      </div>
      <OrderList orders={orders} />
      
      {/* Continue Shopping Button */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link
            href="/catalog"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 