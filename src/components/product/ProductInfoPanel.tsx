import React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Dropdown } from '../ui/ProductDropdown';
import { useCurrency } from '../CurrencyContext';

interface ProductInfoPanelProps {
  brand: string;
  title: string;
  sku: string;
  price: number;
  price_cad?: number;
  price_eur?: number;
  available: boolean;
  deliveryTime: string;
  description: string;
  quantity: number;
  category?: string;
  intendedFor?: string;
  notSuitableFor?: string;
  bestFor?: string;
  idealFor?: string;
  product?: any;
  onQuantityChange?: (qty: number) => void;
  onAddToCart?: () => void;
  onCompare?: () => void;
}

export function ProductInfoPanel({
  brand,
  title,
  sku,
  price,
  price_cad,
  price_eur,
  available,
  deliveryTime,
  description,
  quantity,
  category,
  intendedFor,
  notSuitableFor,
  bestFor,
  idealFor,
  product,
  onQuantityChange,
  onAddToCart,
  onCompare,
}: ProductInfoPanelProps) {
  const { currency, getCurrencySymbol } = useCurrency();
  return (
    <div className="flex flex-col gap-3">
      <div>
        {/* brand */}
        <Link href={`/catalog/brand/${encodeURIComponent(brand)}`} className="text-lg font-regular text-blue-600 hover:underline block">
          {brand}
        </Link>
        {/* title */}
        <h1 className="text-4xl lg:text-5xl font-regular tracking-normal">{title}</h1>
      </div>
      {/* price */}
      <div className="space-y-1">
        {(() => {
          let displayPrice: number;
          switch (currency) {
            case 'USD':
              displayPrice = price;
              break;
            case 'CAD':
              displayPrice = price_cad || Math.round(price * 1.35);
              break;
            case 'EUR':
              displayPrice = price_eur || Math.round(price * 0.85);
              break;
            default:
              displayPrice = price;
          }
          return (
            <div className="text-2xl lg:text-3xl font-regular">
              {getCurrencySymbol()}{displayPrice ? Math.round(displayPrice).toLocaleString() : '0'}<span className="text-sm lg:text-base font-normal text-gray-500"> {currency}</span>
            </div>
          );
        })()}
      </div>
      {/* Description */}
      <div className="text-base text-gray-800 leading-snug">
        {description}
        {bestFor && !["keyboard", "mouse", "webcam", "mouse & keyboard", "trackpad"].includes(category?.toLowerCase() || "") && (
          <span> Best for {bestFor.toLowerCase()}</span>
        )}
        {intendedFor && !["keyboard", "mouse", "webcam", "mouse & keyboard", "trackpad"].includes(category?.toLowerCase() || "") && (
          <span> Intended for {intendedFor.toLowerCase()}</span>
        )}
        {idealFor && !["keyboard", "mouse", "webcam", "mouse & keyboard", "trackpad"].includes(category?.toLowerCase() || "") && (
          <span> Ideal for {idealFor.toLowerCase()}</span>
        )}
      </div>
      
      {/* Not Suitable For Banner - Only show for laptops */}
      {notSuitableFor && category?.toLowerCase() === "laptop" && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex items-start">
            <div>
              <p className="text-base font-bold text-yellow-800 leading-tight">
                Not suitable for
              </p>
              <p className="text-sm text-yellow-700">
                {notSuitableFor}
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        {/* Availability */}
        <div className={`font-base font-regular ${
          (product?.quantity_in_stock || Math.floor(Math.random() * 10) + 1) <= 2 
            ? 'text-red-600' 
            : 'text-green-600'
        }`}>
          {product?.quantity_in_stock || Math.floor(Math.random() * 10) + 1} units in stock
        </div>
        {/* Delivery time */}
        <div className="text-gray-600 text-base">Delivery time: <span className="font-bold">{deliveryTime}</span></div>
      </div>
      {/* Quantity */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>Quantity:</span>
          <Dropdown
            value={quantity.toString()}
            onChange={(value) => onQuantityChange && onQuantityChange(Number(value))}
            options={
              category === "Laptops" || category === "Laptop" || category === "Desktops" || category === "Desktop"
                ? [{ value: "1", label: "1" }]
                : category === "Monitors" || category === "Monitor"
                ? [
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" }
                  ]
                : [
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" }
                  ]
            }
            className="w-20"
            disabled={category === "Laptops" || category === "Laptop" || category === "Desktops" || category === "Desktop"}
          />
        </div>
      </div>
      {/* quantity limits */}
      {(category === "Laptops" || category === "Laptop" || category === "Desktops" || category === "Desktop") && (
        <span className="text-sm text-gray-500 italic ml-0">Limited to 1 workstation per order*</span>
      )}
      {(category === "Monitors" || category === "Monitor") && (
        <span className="text-sm text-gray-500 italic ml-0">Limited to 4 monitors per order*</span>
      )}
      {/* add to cart and compare buttons */}
      <div className="flex gap-2 mt-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors rounded-md font-medium" onClick={onAddToCart}>Add to Cart</button>
        <button className="flex-1 bg-blue-50 text-blue-600 rounded-md py-2 font-medium hover:bg-blue-100 transition text-center" onClick={onCompare}>Compare</button>
      </div>
      {/* disclaimers */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
        <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
          <Info className="w-4 h-4 text-blue-600 mr-2" />
          Important Information
        </h4>
        <div className="space-y-1 text-sm text-gray-700">
          {/* laptop */}
          {category?.toLowerCase() === "laptop" ? (
            <>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">*Team Orders:</span> Please place a separate order for each employee's workstation (limited to 1 unit per order).
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Availability:</span> Stock levels are subject to change without notice.
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Final Price:</span> The displayed price excludes shipping and any applicable fees, which are calculated at checkout.
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Battery Life:</span> Actual performance will vary with usage, screen brightness, and applications.
                </div>
              </div>
            </>
          ) : category?.toLowerCase() === "monitor" ? (
            <>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Team Orders:</span> Please place a separate order for each employee (limited to 4 units per order).
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Availability:</span> Stock levels are subject to change without notice.
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Final Price:</span> The displayed price excludes shipping and any applicable fees, which are calculated at checkout.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Team Orders:</span> Please place a separate order for each employee (limited to 2 docking stations, 2 headsets, 5 keyboards/mice, 1 webcam per order).
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Availability:</span> Stock levels are subject to change without notice.
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Final Price:</span> The displayed price excludes shipping and any applicable fees, which are calculated at checkout.
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Setup:</span> Some peripherals may require additional software installation or driver updates.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 