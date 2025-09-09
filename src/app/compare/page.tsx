"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductComparisonList } from "@/components/product/ProductComparisonList";
import { hardwareData } from "@/data/eaProductData";
import { EAProductType } from "@/types";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Laptop } from 'lucide-react';

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<EAProductType[]>([]);
  
  // Get all available products for selection
  const availableProducts = hardwareData;
  
  // Initialize with first 3 products if none selected
  React.useEffect(() => {
    if (selectedProducts.length === 0 && availableProducts.length >= 3) {
      setSelectedProducts(availableProducts.slice(0, 3) as EAProductType[]);
    }
  }, [availableProducts, selectedProducts.length]);

  const handleProductChange = (index: number, productModel: string) => {
    if (productModel === "none") {
      // Remove the product at this index
      const newSelectedProducts = [...selectedProducts];
      newSelectedProducts[index] = null as any;
      setSelectedProducts(newSelectedProducts);
    } else {
      const product = availableProducts.find(p => p.model === productModel);
      if (product) {
        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts[index] = product as EAProductType;
        setSelectedProducts(newSelectedProducts);
      }
    }
  };

  const getProductSpecs = (product: any) => {
    const specs = [];
    
    // Common specs for all products
    specs.push({ label: "Manufacturer", value: product.manufacturer });
    specs.push({ label: "Model", value: product.model });
    specs.push({ label: "Category", value: product.category });
    
    // Add category-specific specs
    switch (product.category.toLowerCase()) {
      case "laptop":
        if ((product as any).os) specs.push({ label: "Operating System", value: (product as any).os });
        if ((product as any).cpu) specs.push({ label: "CPU", value: (product as any).cpu });
        if ((product as any).gpu) specs.push({ label: "GPU", value: (product as any).gpu });
        if ((product as any).memory) specs.push({ label: "Memory", value: (product as any).memory });
        if ((product as any).storage) specs.push({ label: "Storage", value: (product as any).storage });
        if ((product as any).screen_size) specs.push({ label: "Screen Size", value: (product as any).screen_size });
        if ((product as any).weight_lbs) specs.push({ label: "Weight", value: `${(product as any).weight_lbs} lbs` });
        if ((product as any).battery_life_hrs) specs.push({ label: "Battery Life", value: `${(product as any).battery_life_hrs} hours` });
        if ((product as any).battery_life_description) specs.push({ label: "Battery Rating", value: (product as any).battery_life_description });
        if ((product as any).performance_rating) specs.push({ label: "Performance Tier", value: (product as any).performance_rating });
        if ((product as any).power_watt) specs.push({ label: "Power Adapter", value: `${(product as any).power_watt}W` });
        if ((product as any).dock) specs.push({ label: "Compatible Dock", value: (product as any).dock });
        
        // Display specifications
        if ((product as any).display) {
          const display = (product as any).display;
          if (display.panel) specs.push({ label: "Display Panel", value: display.panel });
          if (display.resolution) specs.push({ label: "Display Resolution", value: display.resolution });
          if (display.refresh_rate) specs.push({ label: "Display Refresh Rate", value: display.refresh_rate });
          if (display.brightness_nits) specs.push({ label: "Brightness", value: `${display.brightness_nits} nits` });
          if (display.hdr) specs.push({ label: "HDR Support", value: display.hdr });
          if (display.touch) specs.push({ label: "Touch Support", value: display.touch });
        }
        
        // Ports
        if ((product as any).ports && Array.isArray((product as any).ports)) {
          specs.push({ label: "Ports", value: (product as any).ports.join(", ") });
        }
        break;
        
      case "monitor":
        if ((product as any).screen_size) specs.push({ label: "Screen Size", value: (product as any).screen_size });
        if ((product as any).resolution) specs.push({ label: "Resolution", value: (product as any).resolution });
        if ((product as any).aspect_ratio) specs.push({ label: "Aspect Ratio", value: (product as any).aspect_ratio });
        if ((product as any).panel) specs.push({ label: "Panel Type", value: (product as any).panel });
        if ((product as any).refresh_rate) specs.push({ label: "Refresh Rate", value: (product as any).refresh_rate });
        if ((product as any).response_time) specs.push({ label: "Response Time", value: (product as any).response_time });
        if ((product as any).hdr) specs.push({ label: "HDR Support", value: (product as any).hdr });
        if ((product as any).color_depth) specs.push({ label: "Color Depth", value: (product as any).color_depth });
        if ((product as any).features) specs.push({ label: "Features", value: (product as any).features });
        
        // Ports
        if ((product as any).ports && Array.isArray((product as any).ports)) {
          specs.push({ label: "Ports", value: (product as any).ports.join(", ") });
        }
        
        // Use cases
        if ((product as any).best_for) specs.push({ label: "Best For", value: (product as any).best_for });
        if ((product as any).intended_for) specs.push({ label: "Intended For", value: (product as any).intended_for });
        break;
        
      case "docking station":
        if ((product as any).compatibility) specs.push({ label: "Compatibility", value: (product as any).compatibility });
        if ((product as any).power_delivery_watt) specs.push({ label: "Power Delivery", value: `${(product as any).power_delivery_watt}W` });
        if ((product as any).max_monitors) specs.push({ label: "Max Monitors", value: (product as any).max_monitors });
        
        // Ports
        if ((product as any).ports && Array.isArray((product as any).ports)) {
          specs.push({ label: "Ports", value: (product as any).ports.join(", ") });
        }
        
        if ((product as any).intended_for) specs.push({ label: "Intended For", value: (product as any).intended_for });
        break;
        
      case "headset":
        if ((product as any).form_factor) specs.push({ label: "Form Factor", value: (product as any).form_factor });
        if ((product as any).connectivity) specs.push({ label: "Connectivity", value: (product as any).connectivity });
        if ((product as any).microphone) specs.push({ label: "Microphone", value: (product as any).microphone });
        if ((product as any).noise_cancellation) specs.push({ label: "Noise Cancellation", value: (product as any).noise_cancellation });
        if ((product as any).weight_g) specs.push({ label: "Weight", value: `${(product as any).weight_g}g` });
        if ((product as any).battery_life) specs.push({ label: "Battery Life", value: (product as any).battery_life });
        if ((product as any).intended_for) specs.push({ label: "Intended For", value: (product as any).intended_for });
        break;
        
      case "webcam":
        if ((product as any).resolution) specs.push({ label: "Resolution", value: (product as any).resolution });
        if ((product as any).windows) specs.push({ label: "Windows", value: (product as any).windows });
        if ((product as any).microphone) specs.push({ label: "Microphone", value: (product as any).microphone });
        if ((product as any).connectivity) specs.push({ label: "Connectivity", value: (product as any).connectivity });
        break;
        
      case "mouse":
      case "keyboard":
      case "mouse & keyboard":
      case "trackpad":
        if ((product as any).connectivity) specs.push({ label: "Connectivity", value: (product as any).connectivity });
        if ((product as any).keyboard_size_layout) specs.push({ label: "Keyboard Layout", value: (product as any).keyboard_size_layout });
        if ((product as any).mouse_buttons) specs.push({ label: "Mouse Buttons", value: (product as any).mouse_buttons });
        if ((product as any).power) specs.push({ label: "Power", value: (product as any).power });
        if ((product as any).intended_for) specs.push({ label: "Intended For", value: (product as any).intended_for });
        if ((product as any).not_suitable_for) specs.push({ label: "Not Suitable For", value: (product as any).not_suitable_for });
        break;
    }
    
    return specs;
  };

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Compare", isActive: true }
        ]}
        className="mb-8"
      />
    <div>
      <div className="text-left">
        <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4">Compare models</h1>
        <p className="text-base text-gray-600 mb-8">Compare processor speed, battery life, and portability to find your ideal laptop.</p>
      </div>
        
        {/* Product Selection Dropdowns */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative">
                <select
                  value={selectedProducts[index] ? selectedProducts[index].model : (selectedProducts[index] === null ? "none" : "")}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  className="w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value="">Select a product...</option>
                  <option value="none">None</option>
                  {availableProducts.map((product, productIndex) => (
                    <option key={`${product.manufacturer}-${product.model}-${product.price_usd || (product as any).ea_estimated_price_usd}-${productIndex}`} value={product.model}>
                      {product.manufacturer} {(product as any).display_name ? `${(product as any).display_name} (${product.model})` : product.model} - ${(product.price_usd || (product as any).ea_estimated_price_usd || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Results */}
        {selectedProducts.filter(p => p).length > 0 && (
          <div>
            <ProductComparisonList
              products={selectedProducts.filter(p => p).map(p => ({
                ...p,
                brand: p.manufacturer,
                model: p.model,
                category: p.category,
                cpu: (p as any).cpu,
                description: (p as any).description || `${p.manufacturer} ${p.model}`,
                card_description: (p as any).intended_for ? 
                  `${(p as any).description || `${p.manufacturer} ${p.model}`} Intended for ${(p as any).intended_for}` : 
                  (p as any).description || `${p.manufacturer} ${p.model}`,
                price_usd: p.price_usd,
                price_cad: (p as any).price_cad,
                image: p.image || `/images/${p.manufacturer.toLowerCase()}_${p.model.toLowerCase().replace(/\s+/g, "_")}.png`,
                features: (p as any).description || `${p.manufacturer} ${p.model}`,
                recommended: true
              }))}
              getProductSpecs={getProductSpecs}
              noBackground={true}
            />
          </div>
        )}

        {/* Empty State */}
        {selectedProducts.filter(p => p).length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-6">
            <Laptop className="w-24 h-24 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No products selected for comparison</h2>
            <p className="text-gray-600 mb-8">
              Use the dropdown selectors above to choose up to 3 products to compare side by side.
            </p>
          </div>
        )}
        
        {/* Need Help Section */}
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center mt-8">
          <div className="text-2xl font-medium mb-1">Need help?</div>
          <div className="mb-3 text-gray-600 text-center text-base">Talk to one of our IT experts</div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">Start a Conversation</button>
        </div>
      </div>
    </PageLayout>
  );
} 