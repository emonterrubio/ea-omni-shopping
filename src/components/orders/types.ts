export interface OrderItem {
  model: string;
  brand: string;
  description?: string;
  card_description?: string;
  image: string;
  price_usd: number | string;
  price_cad?: number;
  quantity: number;
}

export interface BillingInfo {
  name: string;
  lastName: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
