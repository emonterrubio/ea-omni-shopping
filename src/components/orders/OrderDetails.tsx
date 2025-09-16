import React from 'react';
import { BillingInfo, ShippingInfo, OrderItem } from './types';
import { OrderProductList } from './OrderProductList';
import { useCurrency } from '../CurrencyContext';

interface OrderDetailsProps {
  orderNumber: string;
  orderDate: string;
  billing: BillingInfo;
  shipping: ShippingInfo;
  shippingType: string;
  total: number;
  items: OrderItem[];
}

export function OrderDetails({ 
  orderNumber, 
  orderDate, 
  billing, 
  shipping, 
  shippingType, 
  total,
  items
}: OrderDetailsProps) {
  const { currency } = useCurrency();
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 px-3 lg:px-0">
      {/* Order Details Header */}
      <div className="px-4 lg:px-8 py-6">   
        {/* Order Number Header */}
        <div className="text-lg font-regular text-gray-900 mb-4">{'Order'.toUpperCase()} # {orderNumber}</div>
        <div className="border-b border-gray-200"></div>
        
        {/* Mobile: Two-column grid layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered for</span>
              <span className="text-base text-gray-900 font-regular">{shipping.firstName} {shipping.lastName}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Ordered by</span>
              <span className="text-base text-gray-900 font-regular">{billing.name} {billing.lastName}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Submitted</span>
              <span className="text-base text-gray-900 font-regular">{orderDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-regular text-sm text-gray-700">Order Total</span>
              <span className="text-base text-gray-900 font-regular">
                ${total.toLocaleString()} 
                <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
              </span>
            </div>
            <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">
              Shipping to {shippingType === 'residential' ? 'Residential' : 'Office'} &nbsp;
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
              {billing.name} {billing.lastName}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">Ordered for</h2>
            <div className="text-base font-bold text-gray-900">
              {shipping.firstName} {shipping.lastName}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">Order submitted</h2>
            <div className="text-base font-bold text-gray-900">{orderDate}</div>
          </div>
          <div className="flex flex-col">
              <span className="text-base font-regular text-gray-900">Order Total</span>
              <span className="text-base font-bold text-gray-900">
                ${total.toLocaleString()} 
                <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
              </span>
            </div>
          <div className="flex flex-col">
            <h2 className="text-base font-regular text-gray-900">
              Shipping to {shippingType === 'residential' ? 'Residential' : 'Office'} &nbsp;
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
        <OrderProductList items={items} />
      </div>
      
    </div>
  );
}
