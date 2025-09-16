import React from 'react';
import { CheckCircle, Clock, Truck, PackageSearch } from 'lucide-react';

export type OrderStatusType = 
  | "pending-approval" 
  | "order-sent-to-vendor" 
  | "order-shipped" 
  | "order-delivered";

interface OrderStatusProps {
  status: OrderStatusType;
  showIcon?: boolean;
  className?: string;
}

export function OrderStatus({ 
  status, 
  showIcon = true, 
  className = "" 
}: OrderStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending-approval':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'Pending approval',
          date: ''
        };
      case 'order-sent-to-vendor':
        return {
          icon: PackageSearch,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Order sent to vendor',
          date: ''
        };
      case 'order-shipped':
        return {
          icon: Truck,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          text: 'Order shipped',
          date: ''
        };
      case 'order-delivered':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Order delivered',
          date: ''
        };
      default:
        console.warn('Unknown order status:', status);
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Unknown status',
          date: ''
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${className}`}>
      {showIcon && <IconComponent className={`w-4 h-4 ${config.color}`} />}
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text} {config.date}
      </span>
    </div>
  );
} 