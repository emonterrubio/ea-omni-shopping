import { Order, OrderItem } from '@/types/orders';
import { calculateTax } from './taxCalculation';

export interface OrderTotals {
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export interface OrderTotalsByCurrency {
  usd: OrderTotals;
  cad: OrderTotals;
  eur: OrderTotals;
}

/**
 * Centralized function to calculate order totals
 * This ensures consistency across all components
 */
export function calculateOrderTotals(order: Order): OrderTotalsByCurrency {
  // Calculate subtotal from items (USD base)
  const subtotal_usd = order.items.reduce((sum: number, item: any) => {
    const price = typeof item.price_usd === 'string' 
      ? parseFloat((item.price_usd as string).replace(/,/g, '')) 
      : (item.price_usd as number);
    return sum + (price * item.quantity);
  }, 0);

  // Get shipping type and location for tax calculation with proper error handling
  const shippingTypeEnum = order.shippingAddress?.type === 'residential' ? 'residential' : 'office';
  const shippingLocation = order.shippingAddress?.address || '';
  
  // Calculate tax (USD base)
  const tax_usd = calculateTax(subtotal_usd, shippingTypeEnum, shippingLocation);
  
  // Shipping is free for orders
  const shippingCost_usd = 0;
  
  // Calculate total (USD)
  const total_usd = subtotal_usd + tax_usd + shippingCost_usd;
  
  // Debug logging
  console.log('OrderCalculations Debug:', {
    subtotal_usd,
    tax_usd,
    shippingCost_usd,
    total_usd,
    shippingTypeEnum,
    shippingLocation
  });

  // Calculate CAD conversions
  const subtotal_cad = Math.round(subtotal_usd * 1.35);
  const tax_cad = Math.round(tax_usd * 1.35);
  const shippingCost_cad = Math.round(shippingCost_usd * 1.35);
  const total_cad = subtotal_cad + tax_cad + shippingCost_cad;

  // Calculate EUR conversions
  const subtotal_eur = Math.round(subtotal_usd * 0.85);
  const tax_eur = Math.round(tax_usd * 0.85);
  const shippingCost_eur = Math.round(shippingCost_usd * 0.85);
  const total_eur = subtotal_eur + tax_eur + shippingCost_eur;

  return {
    usd: {
      subtotal: subtotal_usd,
      tax: tax_usd,
      shippingCost: shippingCost_usd,
      total: total_usd
    },
    cad: {
      subtotal: subtotal_cad,
      tax: tax_cad,
      shippingCost: shippingCost_cad,
      total: total_cad
    },
    eur: {
      subtotal: subtotal_eur,
      tax: tax_eur,
      shippingCost: shippingCost_eur,
      total: total_eur
    }
  };
}

/**
 * Get totals for a specific currency
 */
export function getTotalsForCurrency(order: Order, currency: 'USD' | 'CAD' | 'EUR'): OrderTotals {
  const allTotals = calculateOrderTotals(order);
  return allTotals[currency.toLowerCase() as keyof OrderTotalsByCurrency];
}
