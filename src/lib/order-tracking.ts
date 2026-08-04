import type { Order } from "@/types/orders";
import { getOrders } from "@/services/orders";

export type TrackingStepStatus = "complete" | "current" | "upcoming";

export type TrackingStep = {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  status: TrackingStepStatus;
};

export type TrackingViewModel = {
  badgeLabel: string;
  badgeTone: "pending" | "in-transit" | "delivered";
  steps: TrackingStep[];
  trackingNumber: string;
  carrier: string;
  locationLabel: string;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

function digitsFromOrder(order: Order): string {
  const fromNumber = order.orderNumber.replace(/\D/g, "");
  const fromId = order.id.replace(/\D/g, "");
  const combined = `${fromNumber}${fromId}` || "175771539698";
  return combined.slice(-12).padStart(12, "0");
}

function locationLabel(order: Order): string {
  const address = order.shippingAddress?.address?.trim() || "Delivery address";
  // Prefer a short office-style label when address is a single location name
  if (!address.includes(",") && address.length <= 48) return address;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join(" - ");
  return parts[0] || address;
}

function timestampFromOrderDate(orderDate: string): string {
  // PoC placeholder timestamp derived from order date string
  const abbreviated = orderDate.replace(/,.*/, "").trim();
  return abbreviated ? `${abbreviated} at 12:00 AM` : "Sep 12 at 12:00 AM";
}

function computeTotals(order: Order) {
  const subtotal = order.items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : Number(item.price) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const tax = Math.round(subtotal * 0.047 * 100) / 100;
  const shipping = 0;
  const computedTotal = Math.round((subtotal + tax + shipping) * 100) / 100;
  // Prefer stored total when present so summary matches My Orders
  const total =
    typeof order.total === "number" && Number.isFinite(order.total)
      ? order.total
      : computedTotal;

  return {
    itemCount: order.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    shipping,
    total,
  };
}

export function getOrderById(orderId: string): Order | null {
  if (!orderId) return null;
  return getOrders().find((order) => order.id === orderId) || null;
}

export function buildTrackingViewModel(order: Order): TrackingViewModel {
  const totals = computeTotals(order);
  const approvalTs = timestampFromOrderDate(order.orderDate);

  const baseSteps: Omit<TrackingStep, "status" | "timestamp">[] = [
    {
      id: "pending-approval",
      title: "Pending Approval",
      description: `Your order is being reviewed for approval by ${order.orderedBy || "your manager"}.`,
    },
    {
      id: "sent-to-vendor",
      title: "Order Sent to Vendor",
      description: "Your order has been approved and sent to the vendor for fulfillment.",
    },
    {
      id: "shipped",
      title: "Order Shipped",
      description: "Your package is on the way with the carrier.",
    },
    {
      id: "delivered",
      title: "Order Delivered",
      description: order.deliveryDate
        ? `Delivered on ${order.deliveryDate}.`
        : "Your order will show as delivered once it arrives.",
    },
  ];

  let currentIndex = 0;
  let badgeLabel = "Pending approval";
  let badgeTone: TrackingViewModel["badgeTone"] = "pending";

  if (order.status === "in-transit") {
    currentIndex = 2;
    badgeLabel = "In transit";
    badgeTone = "in-transit";
  } else if (order.status === "delivered") {
    currentIndex = 3;
    badgeLabel = "Delivered";
    badgeTone = "delivered";
  }

  const steps: TrackingStep[] = baseSteps.map((step, index) => {
    let status: TrackingStepStatus = "upcoming";
    if (order.status === "delivered") {
      status = "complete";
    } else if (index < currentIndex) {
      status = "complete";
    } else if (index === currentIndex) {
      status = "current";
    }

    return {
      ...step,
      status,
      timestamp: index === 0 && status !== "upcoming" ? approvalTs : undefined,
    };
  });

  return {
    badgeLabel,
    badgeTone,
    steps,
    trackingNumber: `UPS-${digitsFromOrder(order)}`,
    carrier: "UPS",
    locationLabel: locationLabel(order),
    ...totals,
  };
}
