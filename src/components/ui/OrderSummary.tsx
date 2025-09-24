import React from 'react';
import { useCurrency } from '../CurrencyContext';

interface OrderSummaryProps {
  subtotal_usd: number;
  subtotal_cad?: number;
  subtotal_eur?: number;
  tax_usd?: number;
  tax_cad?: number;
  tax_eur?: number;
  shippingCost_usd: number;
  shippingCost_cad?: number;
  shippingCost_eur?: number;
  costCenter?: string;
  total_usd: number;
  total_cad?: number;
  total_eur?: number;
  onCheckout?: () => void;
  checkoutButtonText?: string;
  showCheckoutButton?: boolean;
  disabled?: boolean;
  className?: string;
  itemCount?: number;
  showContinueShopping?: boolean;
  onContinueShopping?: () => void;
  showTax?: boolean; // New prop to control tax display
}

export function OrderSummary({
  subtotal_usd,
  subtotal_cad,
  subtotal_eur,
  tax_usd = 0,
  tax_cad,
  tax_eur,
  shippingCost_usd,
  shippingCost_cad,
  shippingCost_eur,
  costCenter,
  total_usd,
  total_cad,
  total_eur,
  onCheckout,
  checkoutButtonText = "Proceed to checkout",
  showCheckoutButton = true,
  disabled = false,
  className = "",
  itemCount,
  showContinueShopping = true,
  onContinueShopping,
  showTax = true
}: OrderSummaryProps) {
  const { currency, getCurrencySymbol } = useCurrency();
  return (
    <div className={`lg:min-w-72 bg-white rounded-md border border-gray-200 p-6 h-fit ${className}`}>
      <div>
        <h3 className="text-2xl font-regular tracking-normal mb-4">Order Summary</h3>
        <div className="flex justify-between font-regular text-gray-800 mb-2">
          <span>Subtotal {itemCount ? `(${itemCount} items)` : ''}</span>
          <div className="text-right">
            {(() => {
              let amount: number;
              switch (currency) {
                case 'USD':
                  amount = subtotal_usd;
                  break;
                case 'CAD':
                  amount = subtotal_cad || Math.round(subtotal_usd * 1.35);
                  break;
                case 'EUR':
                  amount = subtotal_eur || Math.round(subtotal_usd * 0.85);
                  break;
                default:
                  amount = subtotal_usd;
              }
              return (
                <div className="text-base font-regular text-gray-600">
                  {getCurrencySymbol()}{Math.round(amount).toLocaleString()} 
                  <span className="text-xs font-normal text-gray-600"> {currency}</span>
                </div>
              );
            })()}
          </div>
        </div>
        {/* Tax section - Hidden but functionality preserved */}
        {/* {showTax && ((currency === 'USD' && tax_usd !== undefined) || (currency === 'CAD' && tax_cad !== undefined) || (currency === 'EUR' && tax_eur !== undefined)) && (
          <div className="flex justify-between font-regular text-gray-800 mb-2">
            <span>Tax</span>
            <div className="text-right">
              {(() => {
                let amount: number;
                switch (currency) {
                  case 'USD':
                    amount = tax_usd;
                    break;
                  case 'CAD':
                    amount = tax_cad || Math.round(tax_usd * 1.35);
                    break;
                  case 'EUR':
                    amount = tax_eur || Math.round(tax_usd * 0.85);
                    break;
                  default:
                    amount = tax_usd;
                }
                return (
                  <div className="text-base font-regular text-gray-600">
                    {getCurrencySymbol()}{Math.round(amount).toLocaleString()} 
                    <span className="text-xs font-normal text-gray-600"> {currency}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        )} */}
        {/* Shipping section - Hidden but functionality preserved */}
        {/* <div className="flex justify-between font-regular text-gray-800 mb-2">
          <span>Shipping</span>
          <div className="text-right">
            {(() => {
              let amount: number;
              switch (currency) {
                case 'USD':
                  amount = shippingCost_usd;
                  break;
                case 'CAD':
                  amount = shippingCost_cad || Math.round(shippingCost_usd * 1.35);
                  break;
                case 'EUR':
                  amount = shippingCost_eur || Math.round(shippingCost_usd * 0.85);
                  break;
                default:
                  amount = shippingCost_usd;
              }
              return (
                <div className="text-base font-regular text-gray-600">
                  {amount === 0 ? 'Free' : (
                    <>
                      {getCurrencySymbol()}{Math.round(amount).toLocaleString()}
                      <span className="text-xs text-gray-600 font-normal"> {currency}</span>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div> */}

        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Total</span>
          <div className="text-right">
            {(() => {
              let amount: number;
              switch (currency) {
                case 'USD':
                  amount = total_usd;
                  break;
                case 'CAD':
                  amount = total_cad || Math.round(total_usd * 1.35);
                  break;
                case 'EUR':
                  amount = total_eur || Math.round(total_usd * 0.85);
                  break;
                default:
                  amount = total_usd;
              }
              return (
                <div className="text-xl font-bold text-gray-600">
                  {getCurrencySymbol()}{Math.round(amount).toLocaleString()} 
                  <span className="text-xs font-normal text-gray-600"> {currency}</span>
                </div>
              );
            })()}
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