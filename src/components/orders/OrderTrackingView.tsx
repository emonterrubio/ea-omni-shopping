"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Clock,
  Copy,
  CheckCheck,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SafeProductImage } from "@/components/ui/SafeProductImage";
import type { Order } from "@/types/orders";
import {
  buildTrackingViewModel,
  getOrderById,
  type TrackingStep,
  type TrackingViewModel,
} from "@/lib/order-tracking";

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: TrackingViewModel["badgeTone"];
}) {
  const styles =
    tone === "delivered"
      ? "bg-green-50 text-green-700"
      : tone === "in-transit"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-800";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${styles}`}
    >
      {tone === "delivered" ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : tone === "in-transit" ? (
        <Truck className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Clock className="h-4 w-4" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function StepIcon({ step }: { step: TrackingStep }) {
  if (step.status === "complete") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-heritageBlue text-white">
        <Check className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }
  if (step.status === "current") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-heritageBlue bg-white">
        <span className="h-2.5 w-2.5 rounded-full bg-heritageBlue" />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
      <span className="h-2 w-2 rounded-full bg-gray-300" />
    </span>
  );
}

function DeliveryMapCard({ label }: { label: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative h-44 w-full bg-[#e8eef5]">
        <svg
          viewBox="0 0 400 180"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="400" height="180" fill="#dbe4f0" />
          <path d="M0 40 H400" stroke="#c5d2e3" strokeWidth="8" />
          <path d="M0 90 H400" stroke="#c5d2e3" strokeWidth="10" />
          <path d="M0 140 H400" stroke="#c5d2e3" strokeWidth="6" />
          <path d="M60 0 V180" stroke="#c5d2e3" strokeWidth="8" />
          <path d="M180 0 V180" stroke="#b7c7db" strokeWidth="12" />
          <path d="M300 0 V180" stroke="#c5d2e3" strokeWidth="7" />
          <circle cx="200" cy="95" r="18" fill="#255AF6" opacity="0.9" />
          <circle cx="200" cy="95" r="7" fill="white" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 bg-gray-900/85 px-3 py-2 text-center text-sm font-medium text-white">
          {label}
        </div>
      </div>
    </div>
  );
}

export function OrderTrackingView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<TrackingViewModel | null>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = getOrderById(orderId);
    setOrder(found);
    setTracking(found ? buildTrackingViewModel(found) : null);
    setReady(true);
  }, [orderId]);

  const copyTrackingNumber = async () => {
    if (!tracking?.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(tracking.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!ready) {
    return (
      <PageLayout>
        <p className="text-gray-600">Loading tracking details…</p>
      </PageLayout>
    );
  }

  if (!order || !tracking) {
    return (
      <PageLayout>
        <Breadcrumb
          items={[
            { label: "My Orders", href: "/orders" },
            { label: "Track Order", isActive: true },
          ]}
          className="mb-6"
        />
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Order not found</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t find that order in this browser. Open My Orders and try Track Order again.
          </p>
          <Link
            href="/orders"
            className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Back to My Orders
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: "My Orders", href: "/orders" },
          {
            label: `ORDER #${order.orderNumber}`,
            href: `/orders/details?orderId=${order.id}`,
          },
          { label: "Track Order", isActive: true },
        ]}
        className="mb-6"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900">Track Order</h1>
          <p className="mt-1 text-base text-gray-600">
            Order Number:{" "}
            <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
          </p>
        </div>
        <StatusBadge label={tracking.badgeLabel} tone={tracking.badgeTone} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order status stepper */}
          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="mb-5 text-xl font-medium text-gray-900">Order Status</h2>
            <ol className="space-y-0">
              {tracking.steps.map((step, index) => {
                const isLast = index === tracking.steps.length - 1;
                return (
                  <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {!isLast && (
                      <span
                        className={`absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-0.5 ${
                          step.status === "complete" ? "bg-heritageBlue" : "bg-gray-200"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative z-[1] flex-shrink-0">
                      <StepIcon step={step} />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3
                            className={`text-base font-semibold ${
                              step.status === "upcoming" ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`mt-1 text-sm leading-relaxed ${
                              step.status === "upcoming" ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                        {step.timestamp && (
                          <span className="flex-shrink-0 text-sm text-gray-500 sm:pl-4">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Tracking information */}
          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-medium text-gray-900">Tracking Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-sm text-gray-600">Tracking Number</p>
                <div className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2.5">
                  <code className="flex-1 truncate text-sm font-medium text-gray-900">
                    {tracking.trackingNumber}
                  </code>
                  <button
                    type="button"
                    onClick={() => void copyTrackingNumber()}
                    className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                    aria-label="Copy tracking number"
                  >
                    {copied ? (
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm text-gray-600">Carrier</p>
                <div className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2.5">
                  <Package className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-900">{tracking.carrier}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Product details */}
          <section className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 sm:px-6">
              <div className="hidden sm:grid sm:grid-cols-[1fr_5rem_7rem] sm:gap-4">
                <span className="text-sm font-semibold text-gray-900">Product Details</span>
                <span className="text-sm font-semibold text-gray-900 text-center">Quantity</span>
                <span className="text-sm font-semibold text-gray-900 text-right">Price</span>
              </div>
              <h2 className="sm:hidden text-base font-semibold text-gray-900">Product Details</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li
                  key={`${item.brand}-${item.model}`}
                  className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[1fr_5rem_7rem] sm:items-center sm:gap-4 sm:px-6"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-16 flex-shrink-0">
                      <SafeProductImage
                        src={item.image}
                        model={item.model}
                        brand={item.brand}
                        alt={item.model}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {item.brand} {item.model}
                      </p>
                      {item.description && (
                        <p className="truncate text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 sm:text-center">
                    <span className="sm:hidden text-gray-500">Qty </span>
                    {item.quantity || 1}
                  </p>
                  <p className="text-sm font-medium text-gray-900 sm:text-right">
                    $
                    {(typeof item.price === "number" ? item.price : Number(item.price) || 0)
                      .toLocaleString()}{" "}
                    <span className="font-normal text-gray-500">USD</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-gray-900">
              <MapPin className="h-4 w-4 text-gray-500" aria-hidden="true" />
              Delivery Location
            </h2>
            <DeliveryMapCard label={tracking.locationLabel} />
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Shipping Address</h3>
              <p className="text-sm text-gray-700">
                {order.orderedFor}
                <br />
                {order.shippingAddress.type === "office" ? "Office Location: " : ""}
                {order.shippingAddress.address}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Order Information</h3>
              <p className="text-sm text-gray-700">
                <span className="text-gray-500">Ordered by:</span> {order.orderedBy}
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-500">Order Date:</span> {order.orderDate}
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-500">Order Number:</span> #{order.orderNumber}
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">
                  Subtotal ({tracking.itemCount} item{tracking.itemCount === 1 ? "" : "s"})
                </dt>
                <dd className="font-medium text-gray-900">
                  ${tracking.subtotal.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">
                  ${tracking.tax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">
                  {tracking.shipping === 0 ? "Free" : `$${tracking.shipping.toLocaleString()}`}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-gray-100 pt-3 text-base">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-bold text-gray-900">
                  ${tracking.total.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-gray-500">USD</span>
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </PageLayout>
  );
}
