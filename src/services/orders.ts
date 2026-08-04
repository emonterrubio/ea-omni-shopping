import { Order, OrderItem } from '@/types/orders';
import { resolveProductImage } from '@/lib/product-image';

/** Bump this to invalidate stale demo orders in localStorage. */
const ORDERS_STORAGE_KEY = 'userOrders_v2';
const LEGACY_ORDERS_STORAGE_KEYS = ['userOrders'];

function discardLegacyOrders(): void {
  if (typeof window === 'undefined') return;
  for (const key of LEGACY_ORDERS_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

export function generateOrderNumber(): string {
  return `112-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function normalizeOrderItem(item: OrderItem): OrderItem {
  return {
    ...item,
    image: resolveProductImage(item.model, item.image, item.brand),
  };
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    items: (order.items || []).map(normalizeOrderItem),
  };
}

export function createOrderFromCheckout(
  billing: any,
  shipping: any,
  shippingType: 'residential' | 'office',
  items: any[],
  subtotal: number,
  shippingCost: number,
  total: number
): Order {
  const orderNumber = generateOrderNumber();
  const orderDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const orderItems: OrderItem[] = items.map((item) => ({
    model: item.model,
    brand: item.brand,
    image: resolveProductImage(item.model, item.image, item.brand),
    description: item.card_description || item.description || '',
    price:
      typeof item.price === 'string'
        ? parseFloat(item.price.replace(/,/g, ''))
        : item.price,
    quantity: item.quantity,
  }));

  let shippingAddress = '';
  if (shippingType === 'residential') {
    shippingAddress = `${shipping.address1}, ${shipping.city}, ${shipping.country} ${shipping.zip}`;
  } else {
    shippingAddress = `${shipping.officeLocation}`;
  }

  const orderedBy = `${billing.requestedBy}`;
  const orderedFor =
    shippingType === 'residential'
      ? `${shipping.firstName} ${shipping.lastName}`
      : `${shipping.officeFirstName} ${shipping.officeLastName}`;

  return {
    id: Date.now().toString(),
    orderNumber,
    orderDate,
    orderedBy,
    orderedFor,
    shippingAddress: {
      type: shippingType,
      address: shippingAddress,
    },
    status: 'pending',
    items: orderItems,
    total,
  };
}

export function saveOrder(order: Order): void {
  const existingOrders = getOrders();
  const updatedOrders = [normalizeOrder(order), ...existingOrders];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
}

export function getOrders(): Order[] {
  try {
    discardLegacyOrders();
    const ordersData = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!ordersData) return [];
    const parsed = JSON.parse(ordersData);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeOrder);
  } catch {
    return [];
  }
}

export function clearOrders(): void {
  discardLegacyOrders();
  localStorage.removeItem(ORDERS_STORAGE_KEY);
}

export function clearOrdersForTesting(): void {
  clearOrders();
}

export function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'delivered' | 'in-transit',
  deliveryDate?: string,
): void {
  const orders = getOrders();
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status, deliveryDate };
    }
    return order;
  });
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
}
