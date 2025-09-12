import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/orders';
import { OrderStatus } from './OrderStatus';
import { useCurrency } from '../CurrencyContext';

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const { currency } = useCurrency();
  
  // Calculate CAD total if needed (assuming 1.35 conversion rate)
  const displayTotal = currency === 'CAD' 
    ? Math.round(order.total * 1.35) 
    : Math.round(order.total);

  // Format date to abbreviated format (e.g., "Sep 11, 2025")
  const formatAbbreviatedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, try to extract and abbreviate month from existing format
        const monthMatch = dateString.match(/^(\w+)\s+(\d+),\s+(\d+)/);
        if (monthMatch) {
          const month = monthMatch[1].substring(0, 3);
          const day = monthMatch[2];
          const year = monthMatch[3];
          return `${month} ${day}, ${year}`;
        }
        return dateString; // Return original if parsing fails
      }
      
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    } catch (error) {
      return dateString; // Return original if any error occurs
    }
  };
  return (
    <div className="bg-gray-100 px-5 lg:px-6 py-4 border-b border-gray-200">
      {/* Mobile: Card Layout */}
      <div className="lg:hidden">
        <div>
          {/* Order Details Section */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2 lg:gap-y-4 mb-4">
            {/* Row 1 */}
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Number</span>
              <span className="text-base text-gray-900 font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Date</span>
              <span className="text-base text-gray-900 font-bold">{formatAbbreviatedDate(order.orderDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-base text-gray-900 font-bold">{order.orderedFor}</span>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-base text-gray-900 font-bold">{order.orderedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Total</span>
              <span className="text-base text-gray-900 font-bold">${displayTotal.toLocaleString()}<span className="text-sm text-gray-500 font-normal"> {currency}</span></span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Shipping to</span>
              <span className="text-base text-gray-900 font-bold">
                {order.shippingAddress?.type === 'residential' ? 'Residential' : 'Office'}
              </span>
              <span className="text-sm text-gray-600">
                {order.shippingAddress?.address}
              </span>
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
              href={`/orders/track/${order.id}`}
              className="text-base font-regular text-blue-600 hover:text-blue-800"
            >
              Track package
            </Link>
          </div>
        </div>
      </div>
      
      {/* Desktop: Single Row Layout */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order number</span>
              <span className="text-base text-gray-900 font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order submitted</span>
              <span className="text-base text-gray-900 font-bold">{formatAbbreviatedDate(order.orderDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-base text-gray-900 font-bold">{order.orderedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-base text-gray-900 font-bold">{order.orderedFor}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Total</span>
              <span className="text-base text-gray-900 font-bold">${displayTotal.toLocaleString()}<span className="text-xs text-gray-500 font-normal"> {currency}</span></span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Shipping to</span>
              <span className="text-base text-gray-900 font-bold">
                {order.shippingAddress?.type === 'residential' ? 'Residential' : 'Office'}
              </span>
              <span className="text-sm text-gray-600 truncate max-w-24">
                {order.shippingAddress?.address}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Link href={`/orders/details?orderId=${order.id}`} className="text-base font-regular text-blue-600 hover:text-blue-800 whitespace-nowrap">View order details</Link>
            <div className="h-4 w-px bg-gray-400"></div>
            <Link 
              href={`/orders/track/${order.id}`}
              className="text-base font-regular text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Track order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 