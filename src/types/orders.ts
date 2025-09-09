export interface OrderItem {
  model: string;
  brand: string;
  image: string;
  description: string;
  price_usd: number;
  price_cad?: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderedBy: string;
  orderedFor: string;
  shippingAddress: {
    type: 'residential' | 'office';
    address: string;
  };
  status: 'pending' | 'delivered' | 'in-transit';
  deliveryDate?: string;
  items: OrderItem[];
  total: number;
} 