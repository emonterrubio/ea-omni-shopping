"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { OrderSummary } from "@/components/ui/OrderSummary";
import { CartContext } from "@/components/CartContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { OrderDetailsHeader } from "@/components/orders/OrderDetailsHeader";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { OrderProductList } from "@/components/orders/OrderProductList";
import { OrderActions } from "@/components/orders/OrderActions";
import { calculateTax } from "@/services/taxCalculation";

function generateOrderNumber() {
  return `112-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    console.log('OrderDetails - order:', order, 'orderId:', order?.id);
  }, [order]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      // Viewing an existing order (either from URL or from checkout)
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const existingOrder = savedOrders.find((order: any) => order.id === orderId);
      
      if (existingOrder) {
        console.log('Found order by ID:', existingOrder);
        setOrderNumber(existingOrder.orderNumber);
        setOrderDate(existingOrder.orderDate);
        
        // Convert the saved order back to the format expected by the page
        const orderedByParts = existingOrder.orderedBy.split(' ');
        const orderedForParts = existingOrder.orderedFor.split(' ');
        
        console.log('Ordered by parts:', orderedByParts);
        console.log('Ordered for parts:', orderedForParts);
        
        // Parse shipping address back into components
        let parsedAddress = {
          address1: existingOrder.shippingAddress.address,
          city: '',
          state: '',
          zip: '',
          country: ''
        };
        
        if (existingOrder.shippingAddress.type === 'residential') {
          // Parse residential address: "address1, city, country zip"
          const addressParts = existingOrder.shippingAddress.address.split(', ');
          if (addressParts.length >= 3) {
            parsedAddress.address1 = addressParts[0];
            parsedAddress.city = addressParts[1];
            const lastPart = addressParts[2];
            const zipMatch = lastPart.match(/(\d{5})/);
            if (zipMatch) {
              parsedAddress.zip = zipMatch[1];
              parsedAddress.country = lastPart.replace(/\d{5}/, '').trim();
            } else {
              parsedAddress.country = lastPart;
            }
          }
        }
        
        const convertedOrder = {
          id: existingOrder.id,
          billing: {
            name: orderedByParts[0] || '',
            lastName: orderedByParts.slice(1).join(' ') || ''
          },
          shipping: {
            firstName: orderedForParts[0] || '',
            lastName: orderedForParts.slice(1).join(' ') || '',
            ...parsedAddress
          },
          shippingType: existingOrder.shippingAddress.type,
          items: existingOrder.items,
          subtotal: existingOrder.total,
          shippingCost: 0,
          total: existingOrder.total
        };
        console.log('Converted order:', convertedOrder);
        setOrder(convertedOrder);
      } else {
        console.log('Order not found by ID:', orderId);
        console.log('Available orders:', savedOrders);
      }
    } else {
      // New order from checkout
      const orderData = localStorage.getItem("devSetupOrder");
      if (orderData) {
        const parsed = JSON.parse(orderData);
        
        // Get the actual order data from the saved orders
        const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const latestOrder = savedOrders[0]; // Most recent order
        
        if (latestOrder) {
          console.log('Found latest order:', latestOrder);
          // Use the processed order data that includes orderedFor
          setOrderNumber(latestOrder.orderNumber);
          setOrderDate(latestOrder.orderDate);
          
          // Convert the processed order back to the format expected by the page
          const orderedByParts = latestOrder.orderedBy.split(' ');
          const orderedForParts = latestOrder.orderedFor.split(' ');
          
          console.log('Ordered by parts:', orderedByParts);
          console.log('Ordered for parts:', orderedForParts);
          
          // Parse shipping address back into components
          let parsedAddress = {
            address1: latestOrder.shippingAddress.address,
            city: '',
            state: '',
            zip: '',
            country: ''
          };
          
          if (latestOrder.shippingAddress.type === 'residential') {
            // Parse residential address: "address1, city, country zip"
            const addressParts = latestOrder.shippingAddress.address.split(', ');
            if (addressParts.length >= 3) {
              parsedAddress.address1 = addressParts[0];
              parsedAddress.city = addressParts[1];
              const lastPart = addressParts[2];
              const zipMatch = lastPart.match(/(\d{5})/);
              if (zipMatch) {
                parsedAddress.zip = zipMatch[1];
                parsedAddress.country = lastPart.replace(/\d{5}/, '').trim();
              } else {
                parsedAddress.country = lastPart;
              }
            }
          }
          
          const convertedOrder = {
            id: latestOrder.id,
            billing: {
              name: orderedByParts[0] || '',
              lastName: orderedByParts.slice(1).join(' ') || ''
            },
            shipping: {
              firstName: orderedForParts[0] || '',
              lastName: orderedForParts.slice(1).join(' ') || '',
              ...parsedAddress
            },
            shippingType: latestOrder.shippingAddress.type,
            items: latestOrder.items,
            subtotal: latestOrder.total,
            shippingCost: 0,
            total: latestOrder.total
          };
          console.log('Converted order:', convertedOrder);
          setOrder(convertedOrder);
        } else {
          // Fallback to checkout form data if no processed order found
          setOrder(parsed);
          setOrderNumber(generateOrderNumber());
          setOrderDate(new Date().toLocaleDateString("en-US", { 
            day: "2-digit", 
            month: "long", 
            year: "numeric" 
          }) + " at " + new Date().toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
          }) + " PST");
        }
        
        // Clear order data and cart/selection
        localStorage.removeItem("devSetupOrder");
        localStorage.removeItem("devSetupCart");
        clearCart(); // Hide cart bubble after order is confirmed
      }
    }
  }, [clearCart]);

  if (!order) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-semibold mb-4">No Order Found</h1>
          <p className="mb-6 text-gray-600">It looks like you haven't placed an order yet.</p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </PageLayout>
    );
  }

  const { billing, shipping, shippingType, items, subtotal, shippingCost, total } = order;
  // Calculate tax based on shipping location
  const tax = calculateTax(subtotal, shippingType, shipping.officeLocation || shipping.zip || '');

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "My Orders", href: "/orders" },
          { label: `ORDER #${orderNumber}`, isActive: true }
        ]}
        className="mb-6"
      />

      {/* Order Details Header */}
      <OrderDetailsHeader orderNumber={orderNumber} orderDate={orderDate} />

      {/* Combined Order Details and Product List */}
      <OrderDetails
        orderNumber={orderNumber}
        orderDate={orderDate}
        billing={billing}
        shipping={shipping}
        shippingType={shippingType}
        total={total}
        items={items}
      />
      <div className="flex justify-end">
        {/* Order Summary */}
        <div className="w-full max-w-md lg:w-2/3">
          <OrderSummary
              subtotal_usd={subtotal}
              subtotal_cad={Math.round(subtotal * 1.35)}
              tax_usd={tax}
              tax_cad={Math.round(tax * 1.35)}
              shippingCost_usd={shippingCost}
              shippingCost_cad={Math.round(shippingCost * 1.35)}
              total_usd={subtotal + tax + shippingCost}
              total_cad={Math.round((subtotal + tax + shippingCost) * 1.35)}
              itemCount={items.length}
              showCheckoutButton={false}
              showContinueShopping={false}
            />
        </div>
      </div>

      
      {/* Continue Shopping Button */}
      <OrderActions />
    </PageLayout>

  );
} 