"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { OrderSummary } from "@/components/ui/OrderSummary";
import { CartContext } from "@/components/CartContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { OrderDetailsHeader } from "@/components/orders/OrderDetailsHeader";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { OrderActions } from "@/components/orders/OrderActions";
import type { BillingInfo, OrderItem, ShippingInfo } from "@/components/orders/types";

interface OrderViewModel {
  billing: BillingInfo;
  shipping: ShippingInfo;
  shippingType: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface SavedOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderedBy: string;
  orderedFor: string;
  shippingAddress: { type: string; address: string };
  items: OrderItem[];
  total: number;
}

function generateOrderNumber() {
  return `112-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function parseSavedOrder(existingOrder: SavedOrder): OrderViewModel {
  const orderedByParts = existingOrder.orderedBy.split(" ");
  const orderedForParts = existingOrder.orderedFor.split(" ");

  const parsedAddress = {
    address1: existingOrder.shippingAddress.address,
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  if (existingOrder.shippingAddress.type === "residential") {
    const addressParts = existingOrder.shippingAddress.address.split(", ");
    if (addressParts.length >= 3) {
      parsedAddress.address1 = addressParts[0];
      parsedAddress.city = addressParts[1];
      const lastPart = addressParts[2];
      const zipMatch = lastPart.match(/(\d{5})/);
      if (zipMatch) {
        parsedAddress.zip = zipMatch[1];
        parsedAddress.country = lastPart.replace(/\d{5}/, "").trim();
      } else {
        parsedAddress.country = lastPart;
      }
    }
  }

  return {
    billing: {
      name: orderedByParts[0] || "",
      lastName: orderedByParts.slice(1).join(" ") || "",
      requestedBy: existingOrder.orderedBy || "",
    },
    shipping: {
      firstName: orderedForParts[0] || "",
      lastName: orderedForParts.slice(1).join(" ") || "",
      ...parsedAddress,
    },
    shippingType: existingOrder.shippingAddress.type,
    items: existingOrder.items,
    subtotal: existingOrder.total,
    shippingCost: 0,
    total: existingOrder.total,
  };
}

function readSavedOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem("userOrders");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface OrderDetailsViewProps {
  showDetailsHeader?: boolean;
}

export function OrderDetailsView({ showDetailsHeader = false }: OrderDetailsViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderViewModel | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      const savedOrders = readSavedOrders();
      const existingOrder = savedOrders.find((o) => o.id === orderId);

      if (existingOrder) {
        setOrderNumber(existingOrder.orderNumber);
        setOrderDate(existingOrder.orderDate);
        setOrder(parseSavedOrder(existingOrder));
      }
      return;
    }

    const orderData = localStorage.getItem("devSetupOrder");
    if (!orderData) return;

    try {
      const parsed = JSON.parse(orderData) as OrderViewModel;
      const savedOrders = readSavedOrders();
      const latestOrder = savedOrders[0];

      if (latestOrder) {
        setOrderNumber(latestOrder.orderNumber);
        setOrderDate(latestOrder.orderDate);
        setOrder(parseSavedOrder(latestOrder));
      } else {
        setOrder(parsed);
        setOrderNumber(generateOrderNumber());
        setOrderDate(
          `${new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })} at ${new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })} PST`,
        );
      }

      localStorage.removeItem("devSetupOrder");
      localStorage.removeItem("devSetupCart");
      clearCart();
    } catch (error) {
      console.error("Error loading checkout order:", error);
    }
  }, [clearCart]);

  if (!order) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-semibold mb-4">No Order Found</h1>
          <p className="mb-6 text-gray-600">It looks like you haven&apos;t placed an order yet.</p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
            onClick={() => router.push("/")}
            type="button"
          >
            Back to Home
          </button>
        </div>
      </PageLayout>
    );
  }

  const { billing, shipping, shippingType, items, subtotal, shippingCost, total } = order;
  const tax = Math.round(subtotal * 0.0725 * 100) / 100;

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: "My Orders", href: "/orders" },
          { label: `ORDER #${orderNumber}`, isActive: true },
        ]}
        className="mb-6"
      />

      {showDetailsHeader && (
        <OrderDetailsHeader orderNumber={orderNumber} orderDate={orderDate} />
      )}

      <OrderSummaryCard
        orderNumber={orderNumber}
        orderDate={orderDate}
        billing={billing}
        shipping={shipping}
        shippingType={shippingType}
        total={total}
        items={items}
      />

      <OrderSummary
        subtotal={subtotal}
        tax={tax}
        shippingCost={shippingCost}
        total={subtotal + tax + shippingCost}
        itemCount={items.length}
        showCheckoutButton={false}
        showContinueShopping={false}
      />

      <OrderActions />
    </PageLayout>
  );
}
