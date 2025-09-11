import { CheckCircle, AlertCircle } from "lucide-react";
import React, { useContext } from "react";
import { CartContext, CartItem } from "@/components/CartContext";
import { useCurrency } from "@/components/CurrencyContext";
import Link from "next/link";

interface ComparisonProductCardProps {
  image: string;
  brand: string;
  model: string;
  display_name?: string;
  category?: string;
  description: string;
  card_description?: string;
  features: string;
  subFeatures: string[];
  price_usd: number;
  price_cad?: number;
  chip: string;
  specs: { label: string; value: any }[];
  noBackground?: boolean;
}

export function ComparisonProductCard({
  image,
  brand,
  model,
  display_name,
  category,
  description,
  card_description,
  features,
  subFeatures,
  price_usd,
  price_cad,
  chip,
  specs,
  noBackground = false,
}: ComparisonProductCardProps) {
  const { currency } = useCurrency();
  // Split features string into array by comma
  const featureList = features.split(',').map(f => f.trim());
  const isEligible = true;
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    console.log("[Comparison Debug] Adding to cart:", model, "Price:", price_usd, "Type:", typeof price_usd);
    const cartItem: CartItem = {
      model,
      brand,
      image,
      price_usd: price_usd,
      price_cad: price_cad,
      quantity: 1,
      recommended: isEligible,
      description,
      card_description,
      display_name,
      category,
    };
    addToCart(cartItem);
  };

  return (
    <div className={`w-full flex flex-col ${noBackground ? '' : 'bg-white rounded-2xl shadow-md'}`}>
      <div className="w-full text-center bg-gray-100 relative mb-3 p-4 pt-6">
        {/* Brand (clickable link) */}
        <Link href={`/catalog/brand/${encodeURIComponent(brand)}`} className="text-base font-regular text-blue-600 mb-2 hover:underline block">
          {brand}
        </Link>
        {/* Product Title (clickable link) */}
        <Link
          href={`/product/${encodeURIComponent(model)}`}
          className="block"
        >
          <h2 className="text-2xl font-medium pb-4 hover:text-blue-600 transition-colors cursor-pointer">
            {display_name && category?.toLowerCase() === 'monitor'
              ? display_name
              : display_name && model && 
                !display_name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(model.toLowerCase().replace(/[^a-z0-9]/g, '')) && 
                !model.toLowerCase().replace(/[^a-z0-9]/g, '').includes(display_name.toLowerCase().replace(/[^a-z0-9]/g, ''))
                ? `${display_name} (${model})` 
                : display_name || model}
          </h2>
        </Link>
        {/* Product Image */}
        <img src={image} alt={model} className="w-48 h-32 object-contain mx-auto mb-4" />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center text-center py-4 px-6 w-full">
        {/* Chip/Badge */}
        <div className="flex items-center mb-2">
          <span className="bg-gray-200 text-gray-900 text-xs px-2 py-1 rounded-md font-medium">{chip}</span>
        </div>
        {/* Description */}
        <div className="text-sm leading-snug font-medium text-gray-900 text-center mt-2">{card_description || description}</div>
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-6"></div>
        {/* Full Specs */}
        <div className="flex flex-col items-start w-full">
          <ul className="text-left mb-2 list-none">
            {specs.filter(s => s.value).map((spec, i) => (
              <li key={i} className="text-sm text-gray-800 mb-1 text-left ml-4 list-disc list-outside">
                <span className="font-semibold">{spec.label}:</span> {spec.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Footer anchored to bottom */}
      <div className="flex flex-col w-full items-center mt-auto space-y-2 pb-6 px-6">
        {/* <div className={`flex items-center font-medium text-sm ${isEligible ? "text-green-600" : "text-red-600"}`}>
          {isEligible ? <CheckCircle className="w-5 h-5 mr-1" /> : <AlertCircle className="w-5 h-5 mr-1" />}
          {isEligible ? "Available" : ""}
        </div>
        <div className="text-gray-600 text-sm">Recommended based on your role</div> */}
        {/* Price */}
        <div className="space-y-1">
          {currency === 'USD' ? (
            <div className="text-2xl font-semibold">${Math.round(price_usd).toLocaleString()}<span className="text-sm text-gray-500 font-normal"> USD</span></div>
          ) : (
            <div className="text-2xl font-semibold">${Math.round(price_cad || 0).toLocaleString()}<span className="text-sm text-gray-500 font-normal"> CAD</span></div>
          )}
        </div>
        {/* Add to Cart and View Details buttons */}
        <div className="flex gap-2 w-full pt-4">
          <button 
            className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${encodeURIComponent(model)}`}
            className="flex-1 bg-blue-50 text-blue-600 rounded-md py-2 font-medium hover:bg-blue-100 transition text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 