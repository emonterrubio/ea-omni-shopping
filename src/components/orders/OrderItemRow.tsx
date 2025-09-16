import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderItem } from '@/types/orders';
import { CartContext } from '@/components/CartContext';

interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const { addToCart } = useContext(CartContext);

  const handleBuyAgain = () => {
    addToCart({
      model: item.model,
      brand: item.brand,
      image: item.image,
      price_usd: item.price_usd,
      price_cad: item.price_cad,
      quantity: item.quantity,
      recommended: false,
      description: item.description,
      card_description: item.description,
    });
  };

  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Mobile Layout: Vertical Stacking */}
      <div className="flex flex-col items-center gap-2 sm:hidden">
        {/* Product Image - Centered on mobile */}
        <div className="w-32 h-24 relative flex-shrink-0">
          <Image 
            src={item.image} 
            alt={item.model} 
            fill 
            className="object-contain rounded" 
          />
        </div>

        {/* Product Details - Stacked below image on mobile */}
        <div className="text-center w-full">
          <Link 
            href={`/product/${encodeURIComponent(item.model)}?from=orders`}
            className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors block"
          >
            {item.brand} {item.model}
          </Link>
          <div className="text-sm text-gray-800 mt-1">
            {item.description}
          </div>
          
          {/* Action Buttons - Below description on mobile */}
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={handleBuyAgain}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Buy it again
            </button>
            <Link
              href={`/product/${encodeURIComponent(item.model)}`}
              className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition-colors"
            >
              View Item
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Horizontal Layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Product Image - Left side on desktop */}
        <div className="w-16 h-12 relative flex-shrink-0">
          <Image 
            src={item.image} 
            alt={item.model} 
            fill 
            className="object-contain rounded" 
          />
        </div>

        {/* Product Details - Right side on desktop */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/product/${encodeURIComponent(item.model)}?from=orders`}
                className="text-lg font-regular text-gray-900 hover:text-blue-600 truncate transition-colors"
              >
                {item.brand} {item.model}
              </Link>
              <div className="text-sm text-gray-800">
                {item.description}
              </div>
            </div>
            
            {/* Action Buttons - Far right on desktop */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleBuyAgain}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    Buy it again
                  </button>
                  <Link
                    href={`/product/${encodeURIComponent(item.model)}`}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition-colors"
                  >
                    View Item
                  </Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
} 