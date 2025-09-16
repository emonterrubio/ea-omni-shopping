export interface OrderItem {
  model: string;
  brand: string;
  image: string;
  description: string;
  price_usd: number;
  price_cad?: number;
  quantity: number;
  display_name?: string;
  category?: string;
  card_description?: string;
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
  status: 'pending-approval' | 'order-sent-to-vendor' | 'order-shipped' | 'order-delivered';
  deliveryDate?: string;
  items: OrderItem[];
  total: number;
} 