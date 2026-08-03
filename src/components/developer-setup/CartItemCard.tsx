import React from 'react';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SafeProductImage } from '@/components/ui/SafeProductImage';

interface CartItemCardProps {
  item: {
    model: string;
    brand: string;
    description?: string;
    card_description?: string;
    image: string;
    price: number | string;
    recommended?: boolean;
    quantity: number;

    category?: string;
  };
  onQuantityChange: (model: string, quantity: number) => void;
  onRemove: (model: string) => void;
  onCompare: (model: string) => void;
}

export function CartItemCard({ item, onQuantityChange, onRemove, onCompare }: CartItemCardProps) {
  // Helper function to infer category from model name if not provided
  const inferCategory = (model: string): string => {
    const name = model.toLowerCase();
    if (name.includes("macbook") || name.includes("latitude") || name.includes("xps") || name.includes("surface") || name.includes("laptop") || name.includes("thinkpad") || name.includes("yoga")) return "Laptops";
    if (name.includes("tower") || name.includes("precision") || name.includes("desktop") || name.includes("thinkcentre")) return "Desktops";
    return "Other";
  };
  
  // Check if item is a laptop or desktop (to disable + button)
  const itemCategory = item.category || inferCategory(item.model);
  const isLaptopOrDesktop = itemCategory === 'Laptops' || itemCategory === 'Desktops';
  
  const handleQuantityChange = (newQuantity: number) => {
    // Enforce quantity limits based on product category
    if (isLaptopOrDesktop && newQuantity > 1) {
      newQuantity = 1;
    } else if (newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > 10) {
      newQuantity = 10;
    }
    
    onQuantityChange(item.model, newQuantity);
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      return `$${Number(price.replace(/,/g, '')).toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };



  return (
    <div className="flex flex-col sm:flex-row items-center sm:gap-4 py-6 px-2 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="w-36 h-36 sm:w-24 sm:h-24 mb-2 sm:mb-0 flex-shrink-0 relative mx-auto sm:mx-0">
        <SafeProductImage
          src={item.image}
          model={item.model}
          alt={item.model}
          fill
          className="object-contain rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 w-full sm:w-auto relative">
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Desktop Price - positioned to the right */}
            <div className="hidden sm:block absolute top-0 right-0">
              <p className="text-xl font-medium text-gray-900">
                {formatPrice(item.price)}<span className="text-base font-normal text-gray-500"> USD</span>
              </p>
            </div>
            <h3 className="text-xl font-medium text-gray-900 sm:w-4/5">
              <Link 
                href={`/product/${encodeURIComponent(item.model)}`}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {item.brand} {item.model}
              </Link>
            </h3>
            {(item.card_description || item.description) && (
              <p className="text-sm text-gray-600 mb-1 sm:w-4/5">{item.card_description || item.description}</p>
            )}
            {/* Price - Mobile: below description, Desktop: to the right */}
            <div className="block sm:hidden mb-1">
              <p className="text-xl font-medium text-gray-900">
                {formatPrice(item.price)}<span className="text-sm text-gray-500 font-normal"> USD</span>
              </p>
            </div>
            {/* Quantity Controls and Action Links */}
            <div className="flex flex-row gap-4 py-2">
              {/* Quantity Controls */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-1">
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  {/* Remove button */}
                  <button
                    onClick={() => item.quantity === 1 ? onRemove(item.model) : handleQuantityChange(item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-4 h-4" />
                    ) : (
                      "-"
                    )}
                  </button>
                  {/* Quantity */}
                  <span className="px-2 py-1 text-gray-900 font-medium min-w-[2rem] text-sm text-center">
                    {item.quantity}
                  </span>
                  {/* Add button */}
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= 10 || isLaptopOrDesktop}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Action Links */}
                <div className="flex items-center text-sm ">
                  <button
                    onClick={() => onRemove(item.model)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Delete
                  </button>
                  <span className="mx-2 text-gray-400">|</span>
                  <button
                    onClick={() => onCompare(item.model)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span className="hidden lg:inline">Compare with similar items</span>
                    <span className="lg:hidden">Compare</span>
                  </button>
                </div>
            </div>
              {/* Limited to 1 per order */}
              {isLaptopOrDesktop && (
                <p className="text-xs text-gray-500 italic">
                  Limited to 1 per order
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
} 