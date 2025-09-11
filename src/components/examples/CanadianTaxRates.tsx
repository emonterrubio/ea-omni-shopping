import React from 'react';
import { getAllOfficeLocations } from '@/services/taxCalculation';

/**
 * Component showing detailed tax breakdown for Canadian office locations
 */
export function CanadianTaxRates() {
  const allLocations = getAllOfficeLocations();
  const canadianLocations = allLocations.filter(office => 
    ['AB', 'QC', 'BC'].includes(office.state)
  );

  const getTaxBreakdown = (office: any) => {
    switch (office.state) {
      case 'AB': // Alberta
        return { gst: 5.0, pst: 0, qst: 0, total: office.taxRate * 100 };
      case 'QC': // Quebec
        return { gst: 5.0, pst: 0, qst: 9.975, total: office.taxRate * 100 };
      case 'BC': // British Columbia
        return { gst: 5.0, pst: 7.0, qst: 0, total: office.taxRate * 100 };
      default:
        return { gst: 0, pst: 0, qst: 0, total: 0 };
    }
  };

  const getProvinceName = (state: string) => {
    switch (state) {
      case 'AB': return 'Alberta';
      case 'QC': return 'Quebec';
      case 'BC': return 'British Columbia';
      default: return state;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Canadian Office Locations & Tax Rates</h3>
      
      <div className="space-y-4">
        {canadianLocations.map((office) => {
          const breakdown = getTaxBreakdown(office);
          const provinceName = getProvinceName(office.state);
          
          return (
            <div key={office.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{office.name}</h4>
                  <p className="text-sm text-gray-600">{provinceName}, Canada</p>
                  <p className="text-xs text-gray-500">Postal Code: {office.zipCode}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {breakdown.total.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Total Tax Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">GST</div>
                  <div className="text-blue-600 font-semibold">{breakdown.gst.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Federal</div>
                </div>
                
                {breakdown.pst > 0 && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">PST</div>
                    <div className="text-green-600 font-semibold">{breakdown.pst.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Provincial</div>
                  </div>
                )}
                
                {breakdown.qst > 0 && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">QST</div>
                    <div className="text-purple-600 font-semibold">{breakdown.qst.toFixed(2)}%</div>
                    <div className="text-xs text-gray-600">Quebec Sales Tax</div>
                  </div>
                )}
                
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-gray-900">Total</div>
                  <div className="text-blue-600 font-semibold">{breakdown.total.toFixed(2)}%</div>
                  <div className="text-xs text-gray-600">Combined</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2">Tax Calculation Notes:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>GST (Goods and Services Tax):</strong> Federal tax applied to all Canadian locations</li>
          <li>• <strong>PST (Provincial Sales Tax):</strong> Applied in British Columbia (7%)</li>
          <li>• <strong>QST (Quebec Sales Tax):</strong> Applied in Quebec (9.975%) instead of PST</li>
          <li>• <strong>Alberta:</strong> Only GST applies (no provincial sales tax)</li>
          <li>• Tax rates are automatically calculated based on the selected office location</li>
        </ul>
      </div>
    </div>
  );
}
