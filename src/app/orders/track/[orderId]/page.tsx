"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { MapPin, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getOrderById, updateAllOrdersStatus } from "@/services/orders";
import { Order } from "@/types/orders";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { OrderStatus } from "@/components/orders/OrderStatus";
import { OrderProductList } from "@/components/orders/OrderProductList";
import { useCurrency } from "@/components/CurrencyContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  date?: string;
  time?: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { currency } = useCurrency();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  // Function to get approver name based on order details
  const getApproverName = (order: Order): string => {
    // You can customize this logic based on your business rules
    // For now, we'll use a simple mapping based on order characteristics
    
    const approvers = [
      "Sarah Johnson",
      "Michael Chen", 
      "Emily Rodriguez",
      "David Thompson",
      "Lisa Anderson"
    ];
    
    // Use order ID to consistently assign the same approver to the same order
    const hash = order.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return approvers[Math.abs(hash) % approvers.length];
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Update all orders to pending-approval status first
        updateAllOrdersStatus('pending-approval');
        
        // Then fetch the order with updated status
        const orderData = getOrderById(orderId);
        if (orderData) {
          console.log('Order status being passed to OrderStatus:', orderData.status);
          console.log('Order data:', orderData);
          
          // Force the status to be pending-approval if it's not already
          const updatedOrder = { ...orderData, status: 'pending-approval' as const };
          console.log('Updated order with forced status:', updatedOrder);
          
          setOrder(updatedOrder);
          setTrackingSteps(getTrackingSteps(updatedOrder));
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Generate tracking steps based on order status
  const getTrackingSteps = (order: Order): TrackingStep[] => {
    const statusOrder = [
      "pending-approval",
      "order-sent-to-vendor", 
      "order-shipped",
      "order-delivered"
    ];

    const approverName = getApproverName(order);

    const statusConfig = {
      "pending-approval": {
        label: "Pending Approval",
        description: `Your order is being reviewed for approval by ${approverName}`
      },
      "order-sent-to-vendor": {
        label: "Order Sent to Vendor",
        description: "Order has been approved and sent to the vendor"
      },
      "order-shipped": {
        label: "Order Shipped",
        description: "Your order is on its way"
      },
      "order-delivered": {
        label: "Order Delivered",
        description: "Your order has been delivered"
      }
    };

    const currentStatusIndex = statusOrder.indexOf(order.status);
    
    return statusOrder.map((status, index) => {
      const config = statusConfig[status as keyof typeof statusConfig];
      const isCompleted = index < currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      
      // Generate dynamic dates based on order date
      const orderDate = new Date(order.orderDate);
      const stepDate = new Date(orderDate);
      stepDate.setDate(stepDate.getDate() + index);
      
      return {
        id: status,
        label: config.label,
        description: config.description,
        completed: isCompleted,
        current: isCurrent,
        date: (isCompleted || isCurrent) ? stepDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined,
        time: (isCompleted || isCurrent) ? stepDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : undefined
      };
    });
  };

  // Generate tracking number (mock implementation)
  const getTrackingNumber = (orderId: string): string => {
    // In a real app, this would come from the order data or shipping service
    const carrier = Math.random() > 0.5 ? "UPS" : "FedEx";
    const trackingId = orderId.replace(/-/g, "").substring(0, 12).toUpperCase();
    return `${carrier}-${trackingId}`;
  };

  // Get status icon
  const getStatusIcon = (step: TrackingStep) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (step.current) {
      return <CheckCircle className="w-6 h-6 text-blue-600" />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !order) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">{error || "The order you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const trackingNumber = getTrackingNumber(orderId);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-1">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "My Orders", href: "/orders" },
              { label: `ORDER #${order.orderNumber}`, href: `/orders/details?orderId=${order.id}` },
              { label: "Track Order", isActive: true }
            ]}
            className="mb-6"
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Header */}
            <div className="text-left">
              <h1 className="text-5xl font-regular text-gray-900 mb-2">Track Order</h1>
              <h4 className="text-xl font-regular text-gray-800 my-4">Order #{order.orderNumber}</h4>
            </div>
            {/* Order Status */}
            <div className="mt-4 sm:mt-0">
              <OrderStatus 
                status={order.status} 
                showIcon={true}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Side - Tracking Timeline */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              
              {/* Tracking Timeline */}
              <div className="space-y-4">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-3">
                    {/* Status Icon */}
                    <div className="shrink-0">
                      {getStatusIcon(step)}
                    </div>
                    
                    {/* Status Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-bold ${
                          step.completed ? 'text-gray-900' : 
                          step.current ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        {step.date && step.time && (
                          <span className="text-sm text-gray-700">
                            {step.date} at {step.time}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        step.completed ? 'text-gray-700' : 
                        step.current ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                      {trackingNumber}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier
                  </label>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {trackingNumber.startsWith('UPS') ? 'UPS' : 'FedEx'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Order Product List */}
              <OrderProductList items={order.items} />
            </div>
          </div>

          {/* Right Side - Map and Address Information */}
          <div className="lg:col-span-4 space-y-4">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Location</h3>
              
              {/* Map Placeholder */}
              <MapPlaceholder 
                address={order.shippingAddress.address}
                className="h-64 mb-4"
              />
              
              {/* Address Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gray-700 mb-2">Shipping Address</h4>
                  <div className="text-base text-gray-900">
                    <p>{order.orderedFor}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.shippingAddress.type === 'residential' ? 'Residential Address' : 'Office Location'}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-gray-700 mb-2">Order Information</h4>
                  <div className="text-base text-gray-900 space-y-2">
                    <div>
                      <p className="font-regular text-xs text-gray-500">Ordered by</p>
                      <p>{order.orderedBy}</p>
                    </div>
                    <div>
                      <p className="font-regular text-xs text-gray-500">Order Date</p>
                      <p>{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="font-regular text-xs text-gray-500">Order Number</p>
                      <p>{order.orderNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-1">
                {(() => {
                  // Calculate subtotal based on currency
                  const subtotal = currency === 'USD' 
                    ? order.items.reduce((sum, item) => sum + (item.price_usd * item.quantity), 0)
                    : order.items.reduce((sum, item) => sum + ((item.price_cad || item.price_usd) * item.quantity), 0);
                  
                  // Calculate tax (assuming 10% for USD, 15% for CAD)
                  const taxRate = currency === 'USD' ? 0.10 : 0.15;
                  const tax = subtotal * taxRate;
                  
                  // Shipping is typically free for orders
                  const shipping = 0;
                  
                  // Calculate total
                  const total = subtotal + tax + shipping;
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal ({order.items.length} items)</span>
                        <div className="text-right">
                          <div className="text-lg font-medium text-gray-900">
                            ${Math.round(subtotal).toLocaleString()} 
                            <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tax</span>
                        <div className="text-right">
                          <div className="text-base font-medium text-gray-900">
                            ${Math.round(tax).toLocaleString()} 
                            <span className="text-xs font-normal text-gray-600 ml-1">{currency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Shipping</span>
                        <div className="text-right">
                          <div className="text-base font-medium text-gray-900">
                            Free
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-base font-bold text-gray-900">Total</span>
                          <div className="text-right">
                            <div className="text-base font-bold text-gray-900">
                              ${Math.round(total).toLocaleString()} 
                              <span className="text-sm font-normal text-gray-600 ml-1">{currency}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
