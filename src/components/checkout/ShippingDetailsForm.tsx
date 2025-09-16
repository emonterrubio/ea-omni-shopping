import { ChevronDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '../ui/Tooltip';

interface ShippingDetailsFormProps {
  value: any;
  onChange: (val: any) => void;
  shippingType: 'residential' | 'office';
  setShippingType: (type: 'residential' | 'office') => void;
}

export function ShippingDetailsForm({ value, onChange, shippingType, setShippingType }: ShippingDetailsFormProps) {
  const [touched, setTouched] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const requiredFieldsResidential = [
    'firstName',
    'lastName',
    'address1',
    'country',
    'city',
    'zip',
    'phone',
  ];
  const requiredFieldsOffice = [
    'officeFirstName',
    'officeLastName',
    'officeLocation',
  ];

  const validate = (field: string, val: any) => {
    if (
      (shippingType === 'residential' && requiredFieldsResidential.includes(field)) ||
      (shippingType === 'office' && requiredFieldsOffice.includes(field))
    ) {
      if (!val || val.trim() === '') {
        return 'This field is required.';
      }
      if (field === 'zip') {
        if (!/^\d{5}$/.test(val)) {
          return 'ZIP code must be exactly 5 digits.';
        }
      }
      if (field === 'phone') {
        // Accepts (123)4567890, (123) 456-7890, (123)456-7890, (123) 4567890
        const phonePattern = /^\(\d{3}\)[ ]?\d{3}-?\d{4}$/;
        if (!phonePattern.test(val)) {
          return 'Phone must be 10 digits with area code in parentheses, e.g., (123) 456-7890.';
        }
      }
    }
    return '';
  };

  const formatPhone = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value: val } = e.target;
    let newValue = val;
    if (name === 'phone') {
      newValue = formatPhone(val);
    }
    onChange((prev: any) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: validate(name, newValue) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value: val } = e.target;
    setTouched((prev: any) => ({ ...prev, [name]: true }));
    setErrors((prev: any) => ({ ...prev, [name]: validate(name, val) }));
  };

  return (
    <div className="px-2 py-2 sm:px-6 sm:py-4">
      <h3 className="text-2xl font-regular mb-4">Shipping Details</h3>
      <div className="space-y-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="shippingType" value="office" checked={shippingType === 'office'} onChange={() => setShippingType('office')} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
          <span className="ml-2 text-sm font-medium text-gray-700">Ship to office for IT setup</span>
          <Tooltip content="Your local IT team will set everything up before you receive it - no setup needed on your end." maxWidth="240px">
            <InformationCircleIcon className="w-4 h-4 text-gray-600 cursor-help ml-1" />
          </Tooltip>
        </label>
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="shippingType" value="residential" checked={shippingType === 'residential'} onChange={() => setShippingType('residential')} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
          <span className="ml-2 text-sm font-medium text-gray-700">Ship to home for remote setup</span>
          <Tooltip 
            content="We'll help you set up your operating system and standard work apps remotely. You'll need to install any specialized team software yourself (or ask IT for help if needed). Setup typically takes 30-40 minutes with a good internet connection. With slower or unstable internet, it could take several hours. If your internet isn't reliable, we recommend choosing office delivery instead."
            maxWidth="300px"
          >
            <InformationCircleIcon className="w-4 h-4 text-gray-600 cursor-help ml-1" />
          </Tooltip>
        </label>
      </div>
      {shippingType === 'residential' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
            <input type="text" id="firstName" name="firstName" placeholder="John" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.firstName} onChange={handleChange} onBlur={handleBlur} />
            {touched.firstName && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
            <input type="text" id="lastName" name="lastName" placeholder="Smith" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.lastName} onChange={handleChange} onBlur={handleBlur} />
            {touched.lastName && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
            <input type="text" id="address1" name="address1" placeholder="1234 Broadway Ln" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.address1} onChange={handleChange} onBlur={handleBlur} />
            {touched.address1 && errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
            <input type="text" id="address2" name="address2" placeholder="Apt 1" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.address2} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country<span className="text-red-500">*</span></label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="country"
                name="country"
                value={value.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="">Country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
            {touched.country && errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Town/City<span className="text-red-500">*</span></label>
            <input type="text" id="city" name="city" placeholder="Brooklyn" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.city} onChange={handleChange} onBlur={handleBlur} />
            {touched.city && errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">Zip Code<span className="text-red-500">*</span></label>
            <input type="text" id="zip" name="zip" placeholder="11201" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.zip} onChange={handleChange} onBlur={handleBlur} />
            {touched.zip && errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
            <input type="tel" id="phone" name="phone" placeholder="+1 (132) 445-3333" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.phone} onChange={handleChange} onBlur={handleBlur} />
            {touched.phone && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shippingInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea id="shippingInfo" name="shippingInfo" placeholder="Type your notes here" rows={4} className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.shippingInfo} onChange={handleChange}></textarea>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="officeFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
            <input type="text" id="officeFirstName" name="officeFirstName" placeholder="Janet" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.officeFirstName} onChange={handleChange} onBlur={handleBlur} />
            {touched.officeFirstName && errors.officeFirstName && <p className="text-red-500 text-xs mt-1">{errors.officeFirstName}</p>}
          </div>
          <div>
            <label htmlFor="officeLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
            <input type="text" id="officeLastName" name="officeLastName" placeholder="Smith" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.officeLastName} onChange={handleChange} onBlur={handleBlur} />
            {touched.officeLastName && errors.officeLastName && <p className="text-red-500 text-xs mt-1">{errors.officeLastName}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-700 mb-1">Office Location<span className="text-red-500">*</span></label>
            <div className="mt-2 grid grid-cols-1">
              <select id="officeLocation" name="officeLocation" className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-indigo-600 sm:text-sm/6" value={value.officeLocation} onChange={handleChange} onBlur={handleBlur}>
                <option value="">Select</option>
                <optgroup label="US Locations">
                  <option>Austin</option>
                  <option>Kirkland</option>
                  <option>Los Angeles - Chatsworth</option>
                  <option>Los Angeles - Del Rey</option>
                  <option>Orlando</option>
                  <option>Redwood Shores</option>
                </optgroup>
                <optgroup label="Canadian Locations">
                  <option>Edmonton</option>
                  <option>Montreal</option>
                  <option>Vancouver</option>
                  <option>Vancouver - Great Northern Way</option>
                  <option>Victoria</option>
                </optgroup>
              </select>
              <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            {touched.officeLocation && errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="officeShippingInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
            <textarea id="officeShippingInfo" name="officeShippingInfo" placeholder="Additional information" rows={4} className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.officeShippingInfo} onChange={handleChange}></textarea>
          </div>
        </div>
      )}
    </div>
  );
} 