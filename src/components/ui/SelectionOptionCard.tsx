import React from 'react';

interface SelectionOptionCardProps {
  title: string;
  specs: string;
  eligible?: boolean;
  recommended?: boolean;
  selected: boolean;
  onSelect: () => void;
  radioName: string;
  image?: string;
}

export function SelectionOptionCard({
  title,
  specs,
  eligible = true,
  recommended = false,
  selected,
  onSelect,
  radioName,
  image,
}: SelectionOptionCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition ${
        selected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400' : 'border-gray-200 bg-white'
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
    >
      {/* Image section */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-contain mr-4 flex-shrink-0"
        />
      )}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
          <span className="font-medium text-lg">{title}</span>
          <div className="mb-1">
            {recommended && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-sm">
              Recommended
            </span>
          )}
        </div>         </div>
          
        <div className="text-normal text-sm text-gray-600">{specs}</div>   
      </div>
      <input
        type="radio"
        checked={selected}
        onChange={onSelect}
        name={radioName}
        className="form-radio text-blue-600 h-5 w-5 ml-4"
        tabIndex={-1}
        aria-label={`Select ${title}`}
      />
    </div>
  );
} 