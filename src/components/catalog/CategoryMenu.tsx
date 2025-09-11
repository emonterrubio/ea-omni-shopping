import React from "react";
import { ChevronRight } from "lucide-react";
import { categories, mouseData, keyboardData, mouseKeyboardComboData, webcamDataExport } from "../../data/eaProductData";
import { eaProductData } from "../../data/eaProductData";
import { useRouter } from "next/navigation";

interface CategoryMenuProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryMenu({ selectedCategory, onCategorySelect }: CategoryMenuProps) {
  const router = useRouter();
  
  const getCategoryCount = (categoryName: string): number => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case "laptops":
        return eaProductData.laptops.length;
      case "monitors":
        return eaProductData.monitors.length;
      case "docking stations":
        return eaProductData.dockingStations.length;
      case "headsets":
        return eaProductData.headsets.length;
      case "mice and keyboards":
        return mouseData.length + keyboardData.length + mouseKeyboardComboData.length;
      case "webcams":
        return webcamDataExport.length;
      default:
        return 0;
    }
  };

  const getTotalCount = (): number => {
    return eaProductData.laptops.length + 
           eaProductData.monitors.length + 
           eaProductData.dockingStations.length + 
           eaProductData.headsets.length +
           mouseData.length +
           keyboardData.length +
           mouseKeyboardComboData.length +
           webcamDataExport.length;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
      <div className="space-y-0">
        <button
          onClick={() => router.push("/catalog")}
          className={`w-full flex items-center justify-between px-3 py-2 text-left rounded transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-start">
            <span className="leading-tight">All</span>
            <span className="text-xs text-gray-500">
              {getTotalCount()} items
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
        
        {categories.map((category: any) => {
          const count = getCategoryCount(category.name);
          // Convert plural category names to URL slugs
          const getCategorySlug = (pluralName: string): string => {
            switch (pluralName.toLowerCase()) {
              case 'laptops':
                return 'laptops';
              case 'monitors':
                return 'monitors';
              case 'docking stations':
                return 'docking-stations';
              case 'headsets':
                return 'headsets';
              case 'mice and keyboards':
                return 'mice-keyboard';
              case 'webcams':
                return 'webcams';
              default:
                return pluralName.toLowerCase().replace(/\s+/g, '-');
            }
          };
          
          // Convert plural category names to singular for filtering
          const getSingularCategory = (pluralName: string): string => {
            switch (pluralName.toLowerCase()) {
              case 'laptops':
                return 'laptop';
              case 'monitors':
                return 'monitor';
              case 'docking stations':
                return 'docking station';
              case 'headsets':
                return 'headset';
              case 'mice and keyboards':
                return 'mice and keyboards';
              case 'webcams':
                return 'webcam';
              default:
                return pluralName.toLowerCase();
            }
          };
          
          return (
            <button
              key={category.name}
              onClick={() => router.push(`/catalog/${getCategorySlug(category.name)}`)}
              className={`w-full flex items-center justify-between px-3 py-2 mr-4 text-left rounded transition-colors ${
                selectedCategory === getSingularCategory(category.name)
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <div className="flex flex-col items-start">
                <span>{category.name}</span>
                <span className="text-xs text-gray-500">{count} items</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
