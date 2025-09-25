"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { hardwareData } from "@/data/eaProductData";
import { ProductComparisonList } from "@/components/product/ProductComparisonList";
import { PageLayout } from "@/components/layout/PageLayout";
import { SupportBanner } from "@/components/product/SupportBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";

function findProductByModel(model: string): any {
  // First try to find the product by exact model match
  let product = hardwareData.find(p => p.model === model);
  
  // If not found, try to find by URL slug format (lowercase with hyphens)
  if (!product) {
    product = hardwareData.find(p =>
      p.model.toLowerCase().replace(/\s+/g, "-") === model.toLowerCase()
    );
  }
  
  if (product) {
    return {
      ...product,
      category: product.category || "Hardware",
      card_description: (product as any).description || `${product.manufacturer} ${product.model}`,
      processor: (product as any).cpu || "",
      memory: (product as any).memory || "",
      storage: (product as any).storage || "",
      display: (product as any).screen_size || "",
      graphics: (product as any).gpu || "",
      operating_system: (product as any).os || "",
      ports: (product as any).ports || "",
      battery: (product as any).battery || "",
      other: (product as any).description || "",
      features: (product as any).description || `${product.manufacturer} ${product.model}`,
    };
  }

  return null;
}

function getProductSpecs(product: any) {
  const specs = [];
  
  // Common specs for all products
  specs.push({ label: "Manufacturer", value: product.manufacturer });
  specs.push({ label: "Model", value: product.model });
  specs.push({ label: "Category", value: product.category });
  
  // Add category-specific specs
  switch (product.category.toLowerCase()) {
    case "laptop":
      // Operating System
      if ((product as any).os) specs.push({ label: "Operating System", value: (product as any).os });
      
      // Screen Size
      if ((product as any).screen_size) specs.push({ label: "Screen Size", value: (product as any).screen_size });
      
      // Portability Rating
      if ((product as any).portability_rating) specs.push({ label: "Portability Rating", value: (product as any).portability_rating });
      
      // Typical Battery Life
      if ((product as any).battery_life_description) specs.push({ label: "Typical Battery Life", value: (product as any).battery_life_description });
      
      // Performance Rating
      if ((product as any).performance_rating) specs.push({ label: "Performance Rating", value: (product as any).performance_rating });
      
      // Weight
      if ((product as any).weight_lbs) specs.push({ label: "Weight", value: `${(product as any).weight_lbs} lbs` });
      
      // CPU
      if ((product as any).cpu) specs.push({ label: "CPU", value: (product as any).cpu });
      
      // GPU
      if ((product as any).gpu) specs.push({ label: "GPU", value: (product as any).gpu });
      
      // Memory
      if ((product as any).memory) specs.push({ label: "Memory", value: (product as any).memory });
      
      // Storage
      if ((product as any).storage) specs.push({ label: "Storage", value: (product as any).storage });
      
      // Display specifications
      if ((product as any).display) {
        const display = (product as any).display;
        if (display.panel) specs.push({ label: "Display Panel", value: display.panel });
        if (display.resolution) specs.push({ label: "Display Resolution", value: display.resolution });
        if (display.refresh_rate) specs.push({ label: "Display Refresh Rate", value: display.refresh_rate });
        if (display.brightness_nits) specs.push({ label: "Display Peak Brightness", value: `${display.brightness_nits} nits` });
        if (display.hdr) specs.push({ label: "Display HDR", value: display.hdr });
        if (display.touch) specs.push({ label: "Display Touch", value: display.touch });
      }
      
      // Ports
      if ((product as any).ports && Array.isArray((product as any).ports)) {
        specs.push({ label: "Ports", value: (product as any).ports.join(", ") });
      }
      
      // Power
      if ((product as any).power_watt) specs.push({ label: "Power", value: `${(product as any).power_watt}W` });
      
      // Warranty (placeholder - not in current data)
      specs.push({ label: "Warranty", value: "1 Year Limited" });
      
      // Compatible Docking Station
      if ((product as any).dock) specs.push({ label: "Compatible Docking Station", value: (product as any).dock });
      
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
}

export default function CartItemComparePage() {
  const params = useParams();
  
  const modelParam = params.model;
  const model = Array.isArray(modelParam)
    ? decodeURIComponent(modelParam[0])
    : decodeURIComponent(modelParam || "");

  const selectedProduct = findProductByModel(model);
  
  const comparisonProducts = useMemo(() => {
    if (!selectedProduct) return [];

    // Get comparison product models first
    let comparisonModels: string[] = [];
    
    // Find similar products (same category, different brand)
    const allModels = hardwareData.map(p => p.model);
    
    // Exclude current product
    const otherModels = allModels.filter(m => m !== selectedProduct.model);
    
    // Find products from same category first
    const sameCategoryModels = otherModels.filter(model => {
      const product = findProductByModel(model);
      return product && product.category === selectedProduct.category;
    });
    
    // Find products from different categories
    const otherCategoryModels = otherModels.filter(model => {
      const product = findProductByModel(model);
      return product && product.category !== selectedProduct.category;
    });
    
    // Compose final comparison models (2 similar + 1 different)
    comparisonModels = [...sameCategoryModels, ...otherCategoryModels].slice(0, 2);
    
    // Convert models to full product objects using findProductByModel
    const comparisonProducts = comparisonModels
      .map(model => findProductByModel(model))
      .filter(product => product !== null);
    
    return comparisonProducts;
  }, [selectedProduct]);


  if (!selectedProduct) {
    return (
      <PageLayout>
        <div className="text-2xl font-semibold text-gray-700 mb-4">Product Not Found</div>
        <Link href="/cart" className="text-blue-600 hover:text-blue-800 font-medium">Back to Cart</Link>
      </PageLayout>
    );
  }

  const allProducts = [selectedProduct, ...comparisonProducts];

  return (
    <PageLayout>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Shopping Cart", href: "/cart" },
            { label: `Compare ${selectedProduct.model}`, isActive: true }
          ]}
          className="mb-8"
        />
        
        <div className="text-left">
          <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4">Compare with similar items</h1>
          <h4 className="font-base text-gray-600 mb-8">Compare {selectedProduct.brand} {selectedProduct.model} with similar products to make the best choice.</h4>
        </div>
        
        <ProductComparisonList 
          products={allProducts.map(p => ({
            ...p, // Spread all product properties
            brand: p.manufacturer,
            model: p.model,
            display_name: (p as any).display_name,
            category: p.category,
            cpu: (p as any).cpu,
            description: (p as any).description || `${p.manufacturer} ${p.model}`,
            card_description: (p as any).intended_for ? 
              `${(p as any).description || `${p.manufacturer} ${p.model}`} Intended for ${(p as any).intended_for}` : 
              (p as any).description || `${p.manufacturer} ${p.model}`,
            price_usd: (p as any).price_usd || (p as any).ea_estimated_price_usd,
            price_cad: (p as any).price_cad,
            price_eur: (p as any).price_eur,
            image: p.image || `/images/${p.manufacturer.toLowerCase()}_${p.model.toLowerCase().replace(/\s+/g, "_")}.png`,
            features: (p as any).description || `${p.manufacturer} ${p.model}`,
            recommended: true
          }))} 
          getProductSpecs={(product: any) => getProductSpecs(product)} 
          noBackground={true} 
        />
        <SupportBanner />
    </PageLayout>
  );
} 