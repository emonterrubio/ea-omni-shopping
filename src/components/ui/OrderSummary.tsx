import React from 'react';
import { useCurrency } from '../CurrencyContext';

interface OrderSummaryProps {
  subtotal_usd: number;
  subtotal_cad?: number;
  tax_usd?: number;
  tax_cad?: number;
  shippingCost_usd: number;
  shippingCost_cad?: number;
  costCenter?: string;
  total_usd: number;
  total_cad?: number;
  onCheckout?: () => void;
  checkoutButtonText?: string;
  showCheckoutButton?: boolean;
  disabled?: boolean;
  className?: string;
  itemCount?: number;
  showContinueShopping?: boolean;
  onContinueShopping?: () => void;
}

export function OrderSummary({
  subtotal_usd,
  subtotal_cad,
  tax_usd = 0,
  tax_cad,
  shippingCost_usd,
  shippingCost_cad,
  costCenter,
  total_usd,
  total_cad,
  onCheckout,
  checkoutButtonText = "Proceed to checkout",
  showCheckoutButton = true,
  disabled = false,
  className = "",
  itemCount,
  showContinueShopping = true,
  onContinueShopping
}: OrderSummaryProps) {
  const { currency } = useCurrency();
  return (
    <div className={`lg:min-w-72 bg-white rounded-md border border-gray-200 p-6 h-fit ${className}`}>
      <div>
        <h3 className="text-2xl font-regular tracking-normal mb-4">Order Summary</h3>
        <div className="flex justify-between font-regular text-gray-800 mb-2">
          <span>Subtotal {itemCount ? `(${itemCount} items)` : ''}</span>
          <div className="text-right">
            {currency === 'USD' ? (
              <div className="text-lg font-regular text-gray-600">${Math.round(subtotal_usd).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span></div>
            ) : (
              <div className="text-lg font-regular text-gray-600">${Math.round(subtotal_cad || 0).toLocaleString()} <span className="text-xs font-normal text-gray-600">CAD</span></div>
            )}
          </div>
        </div>
        {((currency === 'USD' && tax_usd > 0) || (currency === 'CAD' && (tax_cad || 0) > 0)) && (
          <div className="flex justify-between font-regular text-gray-800 mb-2">
            <span>Tax</span>
            <div className="text-right">
              {currency === 'USD' ? (
                <div className="text-lg font-regular text-gray-600">${Math.round(tax_usd).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span></div>
              ) : (
                <div className="text-lg font-regular text-gray-600">${Math.round(tax_cad || 0).toLocaleString()} <span className="text-xs font-normal text-gray-600">CAD</span></div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between font-regular text-gray-800 mb-2">
          <span>Shipping</span>
          <div className="text-right">
            {currency === 'USD' ? (
              <div className="text-base font-regular text-gray-600">
                {shippingCost_usd === 0 ? 'Free' : (
                  <>
                    ${Math.round(shippingCost_usd).toLocaleString()}
                    <span className="text-xs text-gray-600 font-normal"> USD</span>
                  </>
                )}
              </div>
            ) : (
              <div className="text-base font-regular text-gray-600">
                {(shippingCost_cad || 0) === 0 ? 'Free' : (
                  <>
                    ${Math.round(shippingCost_cad || 0).toLocaleString()}
                    <span className="text-xs text-gray-600 font-normal"> CAD</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* {costCenter && (
          <div className="flex justify-between text-gray-800 mb-2">
            <span>Cost Center</span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="font-bold">{costCenter}</span>
                <button className="text-blue-600 text-sm hover:underline">Edit</button>
              </div>
            </div>
          </div>
        )} */}
        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Total</span>
          <div className="text-right">
            {currency === 'USD' ? (
              <div className="text-xl font-bold text-gray-600">${Math.round(total_usd).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span></div>
            ) : (
              <div className="text-xl font-bold text-gray-600">${Math.round(total_cad || 0).toLocaleString()} <span className="text-xs font-normal text-gray-600">CAD</span></div>
            )}
          </div>
        </div>
        

      </div>
      <div className="mt-1">
      {showCheckoutButton && onCheckout && (
                <button 
          onClick={onCheckout}
          disabled={disabled}
          className={`w-full mt-4 text-base py-2 font-medium rounded-md transition ${
            disabled 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {checkoutButtonText}
        </button>
      )}
      
      {showContinueShopping && onContinueShopping && (
        <button 
          onClick={onContinueShopping}
          className="w-full mt-2 flex-1 bg-blue-50 text-blue-600 text-base rounded-md py-2 font-medium hover:bg-blue-100 transition text-center"
        >
          Continue shopping
        </button>
      )}
      </div>
    </div>
  );
} 