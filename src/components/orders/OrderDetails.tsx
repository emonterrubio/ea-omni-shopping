import React from 'react';
import { BillingInfo, ShippingInfo, OrderItem } from './types';
import { OrderProductList } from './OrderProductList';
import { OrderStatus } from './OrderStatus';
import { useCurrency } from '../CurrencyContext';
import { getTotalsForCurrency } from '@/services/orderCalculations';
import { Order } from '@/types/orders';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { currency, getCurrencySymbol } = useCurrency();
  
  // Debug logging to see what's in the order data
  console.log('OrderDetails Debug - Order data:', {
    orderedBy: order.orderedBy,
    orderedFor: order.orderedFor,
    orderDate: order.orderDate,
    shippingAddress: order.shippingAddress,
    items: order.items?.length
  });
  
  // Use centralized calculation service
  const totals = getTotalsForCurrency(order, currency);
  const calculatedTotal = Math.round(totals.total);
  
  // Create a ShippingInfo object from the order data for display purposes
  const addressString = order.shippingAddress?.address || '';
  const shippingAddressParts = addressString ? addressString.split(', ') : [];
  const shipping = {
    firstName: 'Unknown',
    lastName: 'User',
    address1: shippingAddressParts[0] || '',
    city: shippingAddressParts[1] || '',
    state: shippingAddressParts[2] || '',
    zip: shippingAddressParts[3] || '',
    country: shippingAddressParts[4] || ''
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 px-3 lg:px-0">
      {/* Order Details Header */}
      <div className="px-4 lg:px-8 py-6">   
        {/* Order Number Header with Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-lg font-regular text-gray-900">{'Order'.toUpperCase()} # {order.orderNumber}</div>
          <div className="flex-shrink-0">
            <OrderStatus status={order.status} showIcon={true} />
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
        
        {/* Mobile: Two-column grid layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-base text-gray-900 font-regular">{order.orderedFor}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-base text-gray-900 font-regular">{order.orderedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Submitted</span>
              <span className="text-base text-gray-900 font-regular">{order.orderDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Total</span>
              <span className="text-base text-gray-900 font-regular">
                {getCurrencySymbol()}{Math.round(calculatedTotal).toLocaleString()} 
                <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
              </span>
            </div>
            <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">
              Shipping to {order.shippingAddress?.type === 'residential' ? 'Residential' : 'Office'} &nbsp;
            </h2>
            <div className="text-base font-bold text-gray-900">
              {shipping.address1}
              {shipping.city && `, ${shipping.city}`}
              {shipping.state && `, ${shipping.state}`}
              {shipping.zip && ` ${shipping.zip}`}
              {shipping.country && `, ${shipping.country}`}
            </div>
          </div>
          </div>
        </div>
        
        {/* Desktop: Original horizontal layout */}
        <div className="hidden lg:flex mt-4 gap-12">
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">Ordered by</h2>
            <div className="text-base font-bold text-gray-900">
              {order.orderedBy}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">Ordered for</h2>
            <div className="text-base font-bold text-gray-900">
              {order.orderedFor}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">Order submitted</h2>
            <div className="text-base font-bold text-gray-900">{order.orderDate}</div>
          </div>
          <div className="flex flex-col">
              <span className="text-base font-regular text-gray-900">Order Total</span>
              <span className="text-base font-bold text-gray-900">
                {getCurrencySymbol()}{Math.round(calculatedTotal).toLocaleString()} 
                <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
              </span>
            </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">
              Shipping to {order.shippingAddress?.type === 'residential' ? 'Residential' : 'Office'} &nbsp;
            </h2>
            <div className="text-base font-bold text-gray-900">
              {shipping.address1}
              {shipping.city && `, ${shipping.city}`}
              {shipping.state && `, ${shipping.state}`}
              {shipping.zip && ` ${shipping.zip}`}
              {shipping.country && `, ${shipping.country}`}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Section */}
      <div className="px-4 lg:px-8 pb-3 lg:pb-4">
        <OrderProductList items={order.items} />
      </div>
      
    </div>
  );
}
