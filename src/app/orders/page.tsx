"use client";

import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { OrderList } from '@/components/orders/OrderList';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function OrdersPage() {
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
      <OrderList />
      
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