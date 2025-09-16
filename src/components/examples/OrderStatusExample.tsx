import React from 'react';
import { OrderStatus, OrderStatusType } from '../orders/OrderStatus';

/**
 * Example component demonstrating the OrderStatus component with all 4 status types
 * This can be used as a reference for implementing order statuses throughout the app
 */
export function OrderStatusExample() {
  const statuses: OrderStatusType[] = [
    'pending-approval',
    'order-sent-to-vendor', 
    'order-shipped',
    'order-delivered'
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Examples</h3>
      <div className="space-y-4">
        {statuses.map((status) => (
          <div key={status} className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-600">
              {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
            </div>
            <OrderStatus 
              status={status} 
              showIcon={true}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Examples:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><code>&lt;OrderStatus status="pending-approval" /&gt;</code></div>
          <div><code>&lt;OrderStatus status="order-sent-to-vendor" showIcon={false} /&gt;</code></div>
          <div><code>&lt;OrderStatus status="order-delivered" /&gt;</code></div>
        </div>
      </div>
    </div>
  );
}
