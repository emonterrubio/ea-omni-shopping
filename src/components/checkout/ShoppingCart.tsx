import React, { useState, useEffect, useContext } from 'react';
import { SummaryProductCard } from './SummaryProductCard';
import { CartItemCard } from './CartItemCard';
import { OrderSummary } from '../ui/OrderSummary';
import { CostCenter } from '../ui/CostCenter';
import { ProductCard } from '../ui/ProductCard';
import { SquarePen } from "lucide-react";
import { CartContext } from '../CartContext';
import { useCurrency } from '../CurrencyContext';
import { useRouter } from 'next/navigation';
import { hardwareData } from '../../data/eaProductData';
import dockingStationData from '../../data/ea_dockingStation_data.json';
import { PlatformInfoBanner } from '../ui/PlatformInfoBanner';

// This should be a shared type, but for now, we define it here.
interface Item {
  model: string;
  brand: string;
  description?: string;
  image: string;
  price_usd: number | string;
  recommended: boolean;
  quantity?: number;
}

interface ShoppingCartProps {
  selectedItems: Item[];
  onEdit: () => void;
  onCheckout: (costCenter?: string, shippingMethod?: 'free' | 'express') => void;
  onRemove?: (model: string) => void;
}

export function ShoppingCart({ selectedItems, onEdit, onCheckout, onRemove }: ShoppingCartProps) {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { currency } = useCurrency();
  const router = useRouter();
  const [costCenter, setCostCenter] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'free' | 'express'>('free');

  // Function to get related items based on cart items
  const getRelatedItems = () => {
    // Get all available products from the unified data source
    const allProducts = hardwareData.map(product => ({
      brand: product.manufacturer,
      model: product.model,
      category: product.category,
      description: (product as any).description || `${product.manufacturer} ${product.model}`,
      card_description: (product as any).description || `${product.manufacturer} ${product.model}`,
      features: (product as any).description || `${product.manufacturer} ${product.model}`,
      image: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`,
      price_usd: product.price_usd as number,
      price_cad: (product as any).price_cad,
      recommended: true,
    }));

    // Get compatible docking stations based on cart items
    const compatibleDocks: any[] = [];
    
    // For each cart item, find its compatible docking station
    for (const cartItem of cart) {
      // Find the full product data to get the dock field
      const fullProductData = hardwareData.find(p => p.model === cartItem.model);
      if (fullProductData && (fullProductData as any).dock) {
        const dockModel = (fullProductData as any).dock;
        // Find compatible dock by matching model names (handle different naming conventions)
        const compatibleDock = dockingStationData.find(dock => 
          dock.model === dockModel || 
          dock.model.includes(dockModel) || 
          dockModel.includes(dock.model.split(' ').pop() || '') // Match by last part of model name
        );
        
        if (compatibleDock && !compatibleDocks.some(d => d.model === compatibleDock.model)) {
          compatibleDocks.push({
            brand: compatibleDock.manufacturer,
            model: compatibleDock.model,
            category: compatibleDock.category,
            description: compatibleDock.description || `${compatibleDock.manufacturer} ${compatibleDock.model}`,
            card_description: compatibleDock.description || `${compatibleDock.manufacturer} ${compatibleDock.model}`,
            features: compatibleDock.description || `${compatibleDock.manufacturer} ${compatibleDock.model}`,
            image: compatibleDock.image || `/images/${compatibleDock.manufacturer.toLowerCase()}_${compatibleDock.model.toLowerCase().replace(/\s+/g, "_")}.png`,
            price_usd: compatibleDock.price_usd as number,
            price_cad: (compatibleDock as any).price_cad,
            recommended: true,
          });
        }
      }
    }

    // If we have compatible docks, return them (up to 3)
    if (compatibleDocks.length > 0) {
      return compatibleDocks.slice(0, 3);
    }

    // Fallback to original logic if no compatible docks found
    const cartBrands = cart.map(item => item.brand);
    const cartCategories = cart.map(item => (item as any).category || 'Laptops');

    const relatedItems = allProducts
      .filter(product => 
        !cart.some(cartItem => cartItem.model === product.model) &&
        (cartBrands.includes(product.brand) || cartCategories.includes(product.category))
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return relatedItems;
  };

  // Use cartItems from context instead of local state
  const cart = cartItems.length > 0 ? cartItems : selectedItems.map(item => ({ ...item, quantity: item.quantity || 1 }));

  const relatedItems = getRelatedItems();

  const handleQuantityChange = (model: string, quantity: number) => {
    updateQuantity(model, quantity);
  };

  const handleRemove = (model: string) => {
    if (onRemove) {
      // Use the external remove function (e.g., from CartContext)
      onRemove(model);
    } else {
      // Use CartContext remove function
      removeFromCart(model);
    }
  };

  const handleCompare = (model: string) => {
    router.push(`/compare/cart-item/${encodeURIComponent(model)}`);
  };

  const handleCostCenterChange = (newCostCenter: string) => {
    setCostCenter(newCostCenter);
  };

  const subtotal = cart.reduce((sum, item) => {
    let price = 0;
    if (typeof item.price_usd === 'string') {
      price = Number((item.price_usd as string).replace(/,/g, ''));
    } else if (typeof item.price_usd === 'number') {
      price = item.price_usd;
    }
    return sum + price * (item.quantity || 1);
  }, 0);

  const subtotal_cad = cart.reduce((sum, item) => {
    const price_cad = (item as any).price_cad;
    if (price_cad && typeof price_cad === 'number') {
      return sum + price_cad * (item.quantity || 1);
    }
    return sum;
  }, 0);

  const tax = Math.round((subtotal * 0.047) * 100) / 100; // 4.7% tax rate, rounded to 2 decimal places
  const tax_cad = subtotal_cad > 0 ? Math.round((subtotal_cad * 0.047) * 100) / 100 : 0;
  const shippingCost = shippingMethod === 'express' ? 14 : 0;
  const shippingCost_cad = shippingMethod === 'express' ? 19 : 0; // Approximate CAD conversion
  const total = Math.round((subtotal + tax + shippingCost) * 100) / 100; // Total rounded to 2 decimal places
  const total_cad = subtotal_cad > 0 ? Math.round((subtotal_cad + tax_cad + shippingCost_cad) * 100) / 100 : 0;

  return (
    <div>
      {/* Header */}
      <div className="text-left">
        <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-2">Shopping Cart</h1>
        <h4 className="font-base text-gray-800 mb-8">Review your items and proceed to checkout.</h4>
      </div>
      {/* Platform Info Banner */}
      <PlatformInfoBanner />
      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left Column: Products and Shipping */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-regular">Items in cart ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})</h2>
          </div>
          {/* Products */}
          <div className="bg-white rounded-lg border border-gray-200 px-4">
            {cart.map(item => (
              <CartItemCard
                key={item.model}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                onCompare={handleCompare}
              />
            ))}
          </div>

          {/* Shipping Method */}
          <div className="mt-4">
            <h3 className="text-2xl font-medium tracking-normal mb-4">Shipping Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${shippingMethod === 'free' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300'}`}>
                <input type="radio" name="shipping" value="free" checked={shippingMethod === 'free'} onChange={() => setShippingMethod('free')} className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-gray-800">Free Shipping</p>
                  <p className="text-sm text-gray-500">7-20 days</p>
                </div>
                <p className="text-lg font-regular text-gray-800">$0 <span className="text-sm text-gray-500 font-normal">{currency}</span></p>
              </label>
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300'}`}>
                <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-gray-800">Express Shipping</p>
                  <p className="text-sm text-gray-500">1-3 days</p>
                </div>
                <p className="text-lg font-regular text-gray-800">
                  {currency === 'USD' ? '$14' : '$19'} <span className="text-sm text-gray-500 font-normal">{currency}</span>
                </p>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Cost Center and Order Checkout */}
        <div className="flex flex-col gap-4">
          {/* Cost Center */}
          {/* <CostCenter 
            value={costCenter}
            onChange={handleCostCenterChange}
          /> */}
          <OrderSummary
            subtotal_usd={subtotal}
            subtotal_cad={subtotal_cad > 0 ? subtotal_cad : undefined}
            tax_usd={tax}
            tax_cad={tax_cad > 0 ? tax_cad : undefined}
            shippingCost_usd={shippingCost}
            shippingCost_cad={shippingCost_cad > 0 ? shippingCost_cad : undefined}
            costCenter={costCenter}
            total_usd={total}
            total_cad={total_cad > 0 ? total_cad : undefined}
            itemCount={cartItems.length}
            onCheckout={() => onCheckout(costCenter, shippingMethod)}
            showContinueShopping={true}
            onContinueShopping={() => router.push('/catalog')}
            showTax={false}
          />
        </div>
      </div>

      {/* Continue Shopping - Full Width */}
      {relatedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-medium tracking-normal mb-4">Continue Shopping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedItems.map((product, idx) => (
              <ProductCard 
                key={`${product.model}-${idx}`} 
                product={{
                  model: product.model,
                  manufacturer: product.brand,
                  brand: product.brand,
                  category: product.category,
                  description: product.description,
                  card_description: product.card_description,
                  image: product.image,
                  price_usd: product.price_usd,
                  price_cad: product.price_cad,
                  recommended: product.recommended,
                }} 
                fromCatalog={true} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 