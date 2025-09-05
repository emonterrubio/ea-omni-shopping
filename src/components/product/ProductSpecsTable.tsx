import React from 'react';

interface Spec {
  label: string;
  value: any;
}

interface ProductSpecsTableProps {
  specs?: Spec[];
}

export function ProductSpecsTable({ specs = [] }: ProductSpecsTableProps) {
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
    return value.length > 80 || spec.label === "Description" || spec.label === "Intended For" || spec.label === "Not Suitable For" || spec.label === "Suitable For";
  };

  return (
    <div>
      <h2 className="text-2xl font-normal mb-4">Technical Specifications</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {specs.length > 0 ? (
            specs.filter(s => s.value).map((spec, idx) => (
              <div className="border-b border-gray-200 pb-3 last:border-b-0" key={idx}>
                <div className="text-base font-bold tracking-wide">{spec.label}</div>
                <div className="text-base text-gray-800">{spec.value}</div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-gray-400">No specifications available.</div>
          )}
        </div>
      </div>
    </div>
  );
} 