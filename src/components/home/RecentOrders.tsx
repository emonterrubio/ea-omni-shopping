"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Truck } from "lucide-react";
import { getOrders, updateAllOrdersStatus } from "@/services/orders";
import { Order } from "@/types/orders";
import { OrderStatus, OrderStatusType } from "../orders/OrderStatus";

interface RecentOrdersProps {
  maxOrders?: number;
}

  // Helper function to format date with abbreviated month
  const formatDateWithAbbreviatedMonth = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, try to extract month from existing format
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

export function RecentOrders({ maxOrders = 2 }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Update all orders to pending-approval status
    updateAllOrdersStatus('pending-approval');
    
    const userOrders = getOrders();
    // Sort by order date (newest first) and take the most recent orders
    const sortedOrders = userOrders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, maxOrders)
      .map(order => ({ ...order, status: 'pending-approval' as const })); // Force status
    setOrders(sortedOrders);
  }, [maxOrders]);

  // Helper function to assign status to orders
  const getOrderStatus = (order: Order): OrderStatusType => {
    // For now, all orders are set to pending-approval
    return 'pending-approval';
  };

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  if (orders.length === 0) {
    return (
      // Empty State
      <section className="my-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Orders</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <PackageSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your recent orders here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/catalog"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Catalog
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Popular categories to explore:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Laptops", "Monitors", "Docking Stations", "Headsets"].map((category) => {
                  // Convert category names to URL slugs
                  const getCategorySlug = (categoryName: string): string => {
                    switch (categoryName.toLowerCase()) {
                      case 'laptops':
                        return 'laptops';
                      case 'monitors':
                        return 'monitors';
                      case 'docking stations':
                        return 'docking-stations';
                      case 'headsets':
                        return 'headsets';
                      default:
                        return categoryName.toLowerCase().replace(/\s+/g, '-');
                    }
                  };
                  
                  return (
                    <Link
                      key={category}
                      href={`/catalog/${getCategorySlug(category)}`}
                      className="px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {category}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    // Recent Orders
    <section className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-regular text-gray-900">Your Recent Orders</h2>
        <Link
          href="/orders"
          className="text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors"
        >
          See all
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {orders.map((order) => {
          const firstItem = order.items[0];
          return (
            <div key={order.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                {/* Left side: Product Image and Info */}
                <div className="flex items-center lg:items-center space-x-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={firstItem.image}
                      alt={firstItem.model}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  
                  {/* Product Name and Order Number */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-lg font-regular leading-tight text-gray-900 truncate">
                      {firstItem.model}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/orders/details?orderId=${order.id}`}
                        className="text-sm lg:text-base text-blue-600 hover:text-blue-800 font-regular transition-colors"
                      >
                        Order #{order.orderNumber}
                      </Link>
                      <Link
                        href={`/orders/track/${order.id}`}
                        className="inline-flex items-center text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        Track
                      </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row text-left sm:gap-2">
                      <p className="text-sm text-gray-800">
                        {order.items.length} items total
                      </p>
                      {/* vertical divider */}
                      <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                      <div className="flex flex-col lg:flex-row lg:gap-1">
                        <p className="text-sm text-gray-800">
                          Ordered on <span className="font-bold">{formatDateWithAbbreviatedMonth(order.orderDate)}</span>
                        </p>
                        <p className="text-sm text-gray-800">
                          for <span className="font-bold">{order.orderedFor}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status - Desktop: Right side, Mobile: Bottom */}
                <div className="flex flex-col items-center lg:items-end text-right mt-3 lg:mt-0">
                  <OrderStatus 
                    status={getOrderStatus(order)} 
                    showIcon={true}
                    deliveryDate={getOrderStatus(order) === 'order-delivered' ? 'Dec 15, 2024' : undefined}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
} 