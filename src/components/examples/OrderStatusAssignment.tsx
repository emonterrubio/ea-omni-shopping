import React from 'react';
import { OrderStatus, OrderStatusType } from '../orders/OrderStatus';
import { Order } from '@/types/orders';

/**
 * Example component showing different ways to assign order statuses
 */
export function OrderStatusAssignment() {
  // Example orders with different statuses
  const exampleOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      orderDate: 'Dec 1, 2024',
      orderedBy: 'John Doe',
      orderedFor: 'Jane Smith',
      shippingAddress: { type: 'residential', address: '123 Main St' },
      status: 'pending-approval',
      items: [],
      total: 299.99
    },
    {
      id: '2', 
      orderNumber: 'ORD-002',
      orderDate: 'Nov 28, 2024',
      orderedBy: 'Alice Johnson',
      orderedFor: 'Bob Wilson',
      shippingAddress: { type: 'office', address: '456 Office Blvd' },
      status: 'order-sent-to-vendor',
      items: [],
      total: 599.99
    },
    {
      id: '3',
      orderNumber: 'ORD-003', 
      orderDate: 'Nov 25, 2024',
      orderedBy: 'Charlie Brown',
      orderedFor: 'Diana Prince',
      shippingAddress: { type: 'residential', address: '789 Home Ave' },
      status: 'order-shipped',
      items: [],
      total: 899.99
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      orderDate: 'Nov 20, 2024', 
      orderedBy: 'Eve Adams',
      orderedFor: 'Frank Miller',
      shippingAddress: { type: 'office', address: '321 Business St' },
      status: 'order-delivered',
      deliveryDate: 'Dec 15, 2024',
      items: [],
      total: 1299.99
    }
  ];

  // Method 1: Use the status directly from the order data
  const renderDirectStatus = (order: Order) => (
    <OrderStatus 
      status={order.status} 
      showIcon={true}
      deliveryDate={order.deliveryDate}
    />
  );

  // Method 2: Assign status based on order date (older = more progressed)
  const getStatusByDate = (order: Order): OrderStatusType => {
    const orderDate = new Date(order.orderDate);
    const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceOrder >= 14) return 'order-delivered';
    if (daysSinceOrder >= 7) return 'order-shipped';
    if (daysSinceOrder >= 3) return 'order-sent-to-vendor';
    return 'pending-approval';
  };

  // Method 3: Assign status based on order total (higher value = faster processing)
  const getStatusByValue = (order: Order): OrderStatusType => {
    if (order.total >= 1000) return 'order-delivered';
    if (order.total >= 500) return 'order-shipped';
    if (order.total >= 200) return 'order-sent-to-vendor';
    return 'pending-approval';
  };

  // Method 4: Random assignment for demo purposes
  const getRandomStatus = (): OrderStatusType => {
    const statuses: OrderStatusType[] = [
      'pending-approval',
      'order-sent-to-vendor',
      'order-shipped', 
      'order-delivered'
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Assignment Methods</h3>
      
      <div className="space-y-6">
        {/* Method 1: Direct from data */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Method 1: Direct from Order Data</h4>
          <div className="space-y-2">
            {exampleOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-white rounded border">
                <span className="w-20 text-sm text-gray-600">{order.orderNumber}:</span>
                {renderDirectStatus(order)}
              </div>
            ))}
          </div>
        </div>

        {/* Method 2: Based on date */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Method 2: Based on Order Date</h4>
          <div className="space-y-2">
            {exampleOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-white rounded border">
                <span className="w-20 text-sm text-gray-600">{order.orderNumber}:</span>
                <OrderStatus 
                  status={getStatusByDate(order)} 
                  showIcon={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Method 3: Based on value */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Method 3: Based on Order Value</h4>
          <div className="space-y-2">
            {exampleOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-white rounded border">
                <span className="w-20 text-sm text-gray-600">{order.orderNumber}:</span>
                <OrderStatus 
                  status={getStatusByValue(order)} 
                  showIcon={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Method 4: Random */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Method 4: Random Assignment</h4>
          <div className="space-y-2">
            {exampleOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-white rounded border">
                <span className="w-20 text-sm text-gray-600">{order.orderNumber}:</span>
                <OrderStatus 
                  status={getRandomStatus()} 
                  showIcon={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation in RecentOrders:</h4>
        <div className="text-xs text-gray-600 bg-gray-100 p-3 rounded">
          <pre>{`// In RecentOrders component:
const getOrderStatus = (order: Order): OrderStatusType => {
  // Customize this logic based on your business rules
  const orderIndex = orders.findIndex(o => o.id === order.id);
  const statuses: OrderStatusType[] = [
    'pending-approval',
    'order-sent-to-vendor', 
    'order-shipped',
    'order-delivered'
  ];
  return statuses[orderIndex % statuses.length];
};

// Then use it:
<OrderStatus 
  status={getOrderStatus(order)} 
  showIcon={true}
  deliveryDate={getOrderStatus(order) === 'order-delivered' ? 'Dec 15, 2024' : undefined}
/>`}</pre>
        </div>
      </div>
    </div>
  );
}
