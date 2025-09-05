import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

interface DropdownOption {
  value: string;
  label: string;
  key?: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  disabled = false
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option 
            key={option.key || `${option.value}-${index}`} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
};
