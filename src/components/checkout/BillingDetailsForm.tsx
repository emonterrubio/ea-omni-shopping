import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/ui/Tooltip';
interface BillingDetailsFormProps {
  value: {
    requestedBy: string;
    onBehalfOf: string;
    businessUnit: string;
    department: string;
    projectCode: string;
    fpaApprover: string;
    businessOwner: string;
    businessJustification: string;
  };
  onChange: (val: any) => void;
}

export function BillingDetailsForm({ value, onChange }: BillingDetailsFormProps) {
  const [touched, setTouched] = useState<any>({});
  const [errors, setErrors] = useState<any>({});



  const requiredFields = ['requestedBy', 'onBehalfOf', 'businessUnit', 'department', 'projectCode', 'fpaApprover', 'businessOwner'];

  const validate = (field: string, val: any) => {
    if (requiredFields.includes(field)) {
      if (!val || val.trim() === '') {
        return 'This field is required.';
      }
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: val } = e.target;
    onChange((prev: any) => ({ ...prev, [name]: val }));
    if (touched[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: validate(name, val) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: val } = e.target;
    setTouched((prev: any) => ({ ...prev, [name]: true }));
    setErrors((prev: any) => ({ ...prev, [name]: validate(name, val) }));
  };
  return (
    <div className="px-2 py-2 sm:px-6 sm:py-4">
      <h3 className="text-2xl font-regular mb-4">Billing Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Requested by */}
        <div>
          <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              Requested by<span className="text-red-500">*</span>
              <Tooltip content="This field is automatically populated and cannot be edited.">
                <InformationCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
              </Tooltip>
            </div>
          </label>
          <input 
            type="text" 
            id="requestedBy" 
            name="requestedBy" 
            className="block w-full rounded-sm bg-gray-50 px-3 py-2 text-base text-gray-600 border border-gray-300 cursor-not-allowed sm:text-sm/6" 
            value={value.requestedBy} 
            readOnly 
            disabled
          />
        </div>
        {/* On behalf of */}
        <div>
          <label htmlFor="onBehalfOf" className="block text-sm font-medium text-gray-700 mb-1">
            On behalf of<span className="text-red-500">*</span>
          </label>
          <input type="text" id="onBehalfOf" name="onBehalfOf" placeholder="Enter name" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.onBehalfOf} onChange={handleChange} onBlur={handleBlur} />
          {touched.onBehalfOf && errors.onBehalfOf && <p className="text-red-500 text-xs mt-1">{errors.onBehalfOf}</p>}
        </div>
        {/* Business Unit */}
        <div>
          <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700 mb-1">Business Unit<span className="text-red-500">*</span></label>
          <input type="text" id="businessUnit" name="businessUnit" placeholder="Enter business unit" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.businessUnit} onChange={handleChange} onBlur={handleBlur} />
          {touched.businessUnit && errors.businessUnit && <p className="text-red-500 text-xs mt-1">{errors.businessUnit}</p>}
        </div>
        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department<span className="text-red-500">*</span></label>
          <input type="text" id="department" name="department" placeholder="Enter department" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.department} onChange={handleChange} onBlur={handleBlur} />
          {touched.department && errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>
        {/* Project Code */}
        <div>
          <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              Project Code<span className="text-red-500">*</span>
              <Tooltip content="This optional code assigns the purchase to a specific project budget. Please leave the default value '000000' unless your Finance Partner has instructed you to use a specific code.">
                <InformationCircleIcon className="h-4 w-4 text-gray-600 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </div>
          </label>
          <input type="text" id="projectCode" name="projectCode" placeholder="Enter project code" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.projectCode} onChange={handleChange} onBlur={handleBlur} />
          {touched.projectCode && errors.projectCode && <p className="text-red-500 text-xs mt-1">{errors.projectCode}</p>}
        </div>
        {/* FP&A Approver and Business Owner - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FP&A Approver */}
          <div>
            <label htmlFor="fpaApprover" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                Finance Approver<span className="text-red-500">*</span>
                <Tooltip content="This is the designated Finance Partner for your selected department. They will be the first approver for this purchase.">
                  <InformationCircleIcon className="h-4 w-4 text-gray-600 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </div>
            </label>
            <input type="text" id="fpaApprover" name="fpaApprover" placeholder="Enter FP&A approver name" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.fpaApprover} onChange={handleChange} onBlur={handleBlur} />
            {touched.fpaApprover && errors.fpaApprover && <p className="text-red-500 text-xs mt-1">{errors.fpaApprover}</p>}
          </div>
          {/* Business Owner */}
          <div>
            <label htmlFor="businessOwner" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                Budget Owner<span className="text-red-500">*</span>
                <Tooltip content="This is the designated Budget Owner for your selected department. They provide the final approval for this purchase.">
                  <InformationCircleIcon className="h-4 w-4 text-gray-600 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </div>
            </label>
            <input type="text" id="businessOwner" name="businessOwner" placeholder="Enter business owner name" className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.businessOwner} onChange={handleChange} onBlur={handleBlur} />
            {touched.businessOwner && errors.businessOwner && <p className="text-red-500 text-xs mt-1">{errors.businessOwner}</p>}
          </div>
        </div>
        {/* Business Justification */}
        <div className="sm:col-span-2">
          <label htmlFor="businessJustification" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              Business Justification
              <Tooltip content="Justification for the equipment requested is highly recommended as it will inform the approval decision from Finance and Budget Owner." maxWidth="260px">
                <InformationCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
              </Tooltip>
            </div>
          </label>
          <textarea id="businessJustification" name="businessJustification" placeholder="Type your notes here." rows={4} className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-blue-600 sm:text-sm/6" value={value.businessJustification} onChange={handleChange}></textarea>
        </div>
      </div>
    </div>
  );
} 