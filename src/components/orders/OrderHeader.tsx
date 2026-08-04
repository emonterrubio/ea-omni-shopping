import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/orders';
import { OrderStatus } from './OrderStatus';

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <div className="bg-gray-100 px-6 lg:px-8 py-4 border-b border-gray-200">
      {/* Mobile: Card Layout */}
      <div className="lg:hidden">
        <div>
          {/* Order Details Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Row 1 */}
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Number</span>
              <span className="text-sm lg:text-base text-gray-900 font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Date</span>
              <span className="text-sm lg:text-base text-gray-900 font-bold">{order.orderDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-sm lg:text-base text-gray-900 font-bold">{order.orderedFor}</span>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-sm lg:text-base text-gray-900 font-bold">{order.orderedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Total</span>
              <span className="text-sm lg:text-base text-gray-900 font-bold">${order.total.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              {/* Empty space for grid alignment */}
            </div>
          </div>
          
          {/* Action Links Section */}
          <div className="flex items-center">
            <Link 
              href={`/orders/details?orderId=${order.id}`} 
              className="text-base font-regular text-blue-600 hover:text-blue-800"
            >
              View order details
            </Link>
            <div className="mx-4 h-4 w-px bg-gray-400"></div>
            <Link
              href={`/orders/track?orderId=${order.id}`}
              className="text-base font-regular text-blue-600 hover:text-blue-800"
            >
              Track package
            </Link>
          </div>
        </div>
      </div>
      
      {/* Desktop: Original Layout */}
      <div className="hidden lg:block">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col md:flex-row sm:items-center gap-6 md:gap-10 text-base">
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order number</span>
              <span className="text-sm xl:text-base text-gray-600 font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order submitted</span>
              <span className="text-sm xl:text-base text-gray-600 font-bold">{order.orderDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-sm xl:text-base text-gray-900 font-bold">{order.orderedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-sm xl:text-base text-gray-900 font-bold">{order.orderedFor}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Total</span>
              <span className="text-sm xl:text-base text-gray-900 font-bold">${order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4 ml-4 lg:ml-12 xl:ml-28">
            <Link href={`/orders/details?orderId=${order.id}`} className="text-sm xl:text-base font-regular text-blue-600 hover:text-blue-800">View Order Details</Link>
            <div className="mr-2 ml-2 hidden h-6 w-px bg-gray-400 sm:block"></div>
            <Link href={`/orders/track?orderId=${order.id}`} className="text-left text-sm xl:text-base font-regular text-blue-600 hover:text-blue-800">Track Order</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 