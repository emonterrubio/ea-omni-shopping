import React, { useState } from 'react';

interface Spec {
  label: string;
  value: any;
}

interface ProductSpecsTableProps {
  specs?: Spec[];
  category?: string;
}

export function ProductSpecsTable({ specs = [], category }: ProductSpecsTableProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + "...";
    }
    return String(value);
  };

  const shouldSpanFullWidth = (spec: Spec): boolean => {
    const value = String(spec.value);
    return value.length > 80 || spec.label === "Description" || spec.label === "Not Suitable For" || spec.label === "Suitable For" || spec.label === "Features";
  };

  // Define basic specifications
  const basicSpecLabels = [
    "Category",
    "Operating System", 
    "Screen Size",
    "Portability Rating",
    "Typical Battery Life",
    "Performance Rating",
    "Features"
  ];

  // Only laptops should show basic/advanced toggle, all other products show all specs in one panel
  const isLaptop = category && category.toLowerCase() === 'laptop';
  
  // Define specs to exclude from technical specifications
  const excludedSpecLabels = ["Intended For", "Best For"];
  
  // For non-laptops, also exclude "Not Suitable For"
  const nonLaptopExcludedSpecLabels = !isLaptop 
    ? [...excludedSpecLabels, "Not Suitable For"]
    : excludedSpecLabels;
  
  // Split specs into basic and advanced (only for laptops)
  const basicSpecs = isLaptop 
    ? specs.filter(spec => basicSpecLabels.includes(spec.label) && spec.value && !excludedSpecLabels.includes(spec.label))
    : [];
  const advancedSpecs = isLaptop 
    ? specs.filter(spec => !basicSpecLabels.includes(spec.label) && spec.value && !excludedSpecLabels.includes(spec.label))
    : specs.filter(spec => spec.value && !nonLaptopExcludedSpecLabels.includes(spec.label));

  const SpecSection = ({ specs }: { specs: Spec[] }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {specs.length > 0 ? (
            specs.map((spec, idx) => {
              // Calculate if this is the last row
              const isLastRow = idx >= specs.length - (specs.length % 2 === 0 ? 2 : 1);
              return (
                <div className={`border-b border-gray-200 pb-3 ${isLastRow ? 'border-b-0 pb-0' : ''}`} key={idx}>
                  <div className="text-base font-bold tracking-wide">{spec.label}</div>
                  <div className="text-base text-gray-800">{spec.value}</div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-gray-400">No specifications available.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-normal mb-4">Technical Specifications</h2>
      
      {/* Toggle Switch - Only show for laptops */}
      {isLaptop && (
        <div className="mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'advanced'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      )}
      
      {/* Specifications Table */}
      {isLaptop ? (
        activeTab === 'basic' ? (
          <SpecSection specs={basicSpecs} />
        ) : (
          <SpecSection specs={advancedSpecs} />
        )
      ) : (
        <SpecSection specs={advancedSpecs} />
      )}
    </div>
  );
} 