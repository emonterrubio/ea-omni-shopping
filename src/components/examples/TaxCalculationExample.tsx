import React from 'react';
import { calculateTax, getAllOfficeLocations, getTaxRate } from '@/services/taxCalculation';

/**
 * Example component demonstrating tax calculation based on office locations
 */
export function TaxCalculationExample() {
  const officeLocations = getAllOfficeLocations();
  const sampleSubtotal = 1000; // $1000 example order

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculation by Office Location</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-700 mb-2">Sample Order: ${sampleSubtotal.toLocaleString()}</h4>
          <div className="space-y-2">
            {officeLocations.map((office) => {
              const tax = calculateTax(sampleSubtotal, 'office', office.name);
              const taxRate = getTaxRate('office', office.name);
              const total = sampleSubtotal + tax;
              
              return (
                <div key={office.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="font-medium text-gray-900">{office.name}</div>
                    <div className="text-sm text-gray-600">
                      {office.state} ({office.zipCode}) - {(taxRate * 100).toFixed(2)}% tax rate
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">+${tax.toFixed(2)} tax</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded border">
          <h4 className="font-medium text-blue-900 mb-2">Implementation Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tax is calculated based on the selected office location</li>
            <li>• Tax rates include both state and local taxes</li>
            <li>• Tax is only shown in checkout, not in shopping cart</li>
            <li>• For residential addresses, default tax rate is applied</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded border">
          <h4 className="font-medium text-green-900 mb-2">Office Locations & Tax Rates:</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-green-800 mb-1">US Locations:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                {officeLocations.filter(office => !['AB', 'QC', 'BC'].includes(office.state)).map((office) => (
                  <div key={office.name} className="flex justify-between">
                    <span>{office.name}, {office.state}</span>
                    <span className="font-medium">{(office.taxRate * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-green-800 mb-1">Canadian Locations:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                {officeLocations.filter(office => ['AB', 'QC', 'BC'].includes(office.state)).map((office) => (
                  <div key={office.name} className="flex justify-between">
                    <span>{office.name}, {office.state}</span>
                    <span className="font-medium">{(office.taxRate * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
