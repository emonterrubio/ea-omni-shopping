"use client";

import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { hardwareData } from "../../../data/eaProductData";
import { EAProductType } from "../../../types";
import { PageLayout } from "@/components/layout/PageLayout";
import { CheckCircle, AlertCircle, ArrowLeft, Box, Undo2 } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { CartContext } from "@/components/CartContext";
import { ComparisonProductCard } from "@/components/product/ProductComparisonCard";
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfoPanel } from '@/components/product/ProductInfoPanel';
import { ProductSpecsTable } from '@/components/product/ProductSpecsTable';
import { RequestHardwareBanner } from '@/components/product/RequestHardwareBanner';
import { ProductComparisonList } from '@/components/product/ProductComparisonList';
import { SupportBanner } from '@/components/product/SupportBanner';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Dropdown } from '@/components/ui/Dropdown';
import { useCurrency } from '@/components/CurrencyContext';

function getCategoryPlural(category: string): string {
  // Convert category to plural form
  switch (category.toLowerCase()) {
    case 'laptop':
      return 'Laptops';
    case 'monitor':
      return 'Monitors';
    case 'docking station':
      return 'Docking Stations';
    case 'headset':
      return 'Headsets';
    case 'webcam':
      return 'Webcams';
    case 'trackpad':
      return 'Mice';
    default:
      // For any other categories, just add 's' and capitalize first letter
      return category.charAt(0).toUpperCase() + category.slice(1) + 's';
  }
}

function findProductByModel(model: string): any {
  // First try to find the product by exact model match
  let product = hardwareData.find(p => p.model === model);
  
  // If not found, try to find by URL slug format (lowercase with hyphens)
  if (!product) {
    product = hardwareData.find(p => 
      p.model.toLowerCase().replace(/\s+/g, "-") === model.toLowerCase()
    );
  }
  
  return product || null;
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

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency } = useCurrency();
  const from = searchParams.get("from");

  const modelParam = params.model;
  const model = Array.isArray(modelParam)
    ? decodeURIComponent(modelParam[0])
    : decodeURIComponent(modelParam || "");

  const product = findProductByModel(model);
  const specs = product ? getProductSpecs(product) : [];

  // --- Comparison logic with brand/manufacturer-based selection ---
  const [selectedComparisonProducts, setSelectedComparisonProducts] = useState<any[]>([]);
  
  // Use only the hardware data for comparison
  const others = useMemo(() => {
    const filtered = hardwareData.filter(p => p.model !== product?.model);
    // Debug: Check if Magic Trackpad is in the data
    if (product?.model === 'Magic Mouse') {
      console.log('Magic Trackpad in hardwareData:', hardwareData.find(p => p.model === 'Magic Trackpad'));
      console.log('Others after filtering:', filtered.map(p => p.model));
    }
    return filtered;
  }, [product?.model]);
  
  // Available products for dropdown (same category as current product, with related categories for input devices)
  const availableProducts = useMemo(() => {
    const currentCategory = product?.category?.toLowerCase();
    
    // For input devices, include related categories
    const relatedCategories = (currentCategory: string) => {
      switch (currentCategory) {
        case 'mouse':
          return ['mouse', 'trackpad'];
        case 'trackpad':
          return ['trackpad', 'mouse'];
        case 'keyboard':
          return ['keyboard', 'mouse & keyboard'];
        case 'mouse & keyboard':
          return ['mouse & keyboard', 'keyboard', 'mouse'];
        default:
          return [currentCategory];
      }
    };
    
    const allowedCategories = relatedCategories(currentCategory);
    const filteredProducts = others.filter(p => allowedCategories.includes(p.category.toLowerCase()));
    
    // Debug: Check what's happening with Magic Trackpad specifically
    if (product?.model === 'Magic Mouse') {
      console.log('Current category:', currentCategory);
      console.log('Allowed categories:', allowedCategories);
      console.log('Magic Trackpad category:', others.find(p => p.model === 'Magic Trackpad')?.category);
      console.log('Magic Trackpad category lowercase:', others.find(p => p.model === 'Magic Trackpad')?.category?.toLowerCase());
      console.log('Is Magic Trackpad included?', allowedCategories.includes(others.find(p => p.model === 'Magic Trackpad')?.category?.toLowerCase() || ''));
      console.log('Filtered products:', filteredProducts.map(p => `${p.model} (${p.category})`));
    }
    
    return filteredProducts;
  }, [others, product?.category]);
  
  // Brand/manufacturer-based comparison products: current item in middle, same brand products preferred
  const defaultComparisonProducts = useMemo(() => {
    if (!product) return [];
    
    const currentBrand = product?.manufacturer?.toLowerCase();
    // Use availableProducts instead of filtering by exact category - this includes related categories
    const sameCategoryProducts = availableProducts;
    
    // Debug: Check what's happening in defaultComparisonProducts
    if (product?.model === 'Magic Mouse') {
      console.log('=== defaultComparisonProducts Debug ===');
      console.log('Current brand:', currentBrand);
      console.log('Same category products (Mouse only):', sameCategoryProducts.map(p => `${p.model} (${p.manufacturer})`));
      console.log('Available products (Mouse + TrackPad):', availableProducts.map(p => `${p.model} (${p.manufacturer})`));
    }
    
    // Group products by brand/manufacturer
    const productsByBrand = sameCategoryProducts.reduce((acc, product) => {
      const brand = product?.manufacturer?.toLowerCase() || 'unknown';
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(product);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Select products from the same brand first, then different brands if needed
    const selectedProducts = [];
    
    // First priority: products from the same brand (excluding current product)
    const sameBrandProducts = productsByBrand[currentBrand] || [];
    const otherSameBrandProducts = sameBrandProducts.filter(p => p.model !== product?.model);
    
    // Add same brand products first
    for (let i = 0; i < Math.min(2, otherSameBrandProducts.length); i++) {
      selectedProducts.push(otherSameBrandProducts[i]);
    }
    
    // If we need more products and don't have enough from same brand, add from different brands
    if (selectedProducts.length < 2) {
      const otherBrands = Object.keys(productsByBrand).filter(brand => brand !== currentBrand);
      
      for (const brand of otherBrands) {
        if (selectedProducts.length >= 2) break;
        const brandProducts = productsByBrand[brand];
        if (brandProducts.length > 0) {
          selectedProducts.push(brandProducts[0]);
        }
      }
    }
    
    // Return in order: [same brand product 1, current, same brand product 2 or different brand]
    const comparisonProducts = [];
    if (selectedProducts[0]) comparisonProducts.push(selectedProducts[0]);
    comparisonProducts.push(product); // Current product in middle
    if (selectedProducts[1]) comparisonProducts.push(selectedProducts[1]);
    
    if (product?.model === 'Magic Mouse') {
      console.log('Selected products:', selectedProducts.map(p => `${p.model} (${p.brand})`));
      console.log('Final comparisonProducts:', comparisonProducts.map(p => `${p.model} (${p.brand})`));
      console.log('=== End defaultComparisonProducts Debug ===');
    }
    
    return comparisonProducts;
  }, [product, others, availableProducts]);

  // Initialize selected products with default ones
  useEffect(() => {
    if (defaultComparisonProducts.length > 0) {
      setSelectedComparisonProducts(defaultComparisonProducts);
    }
  }, [defaultComparisonProducts]);

  const handleComparisonProductChange = (dropdownIndex: number, modelValue: string) => {
    if (modelValue === "") {
      // Reset to default comparison products
      setSelectedComparisonProducts(defaultComparisonProducts);
    } else {
      const selectedProduct = availableProducts.find(p => p.model === modelValue);
      if (selectedProduct) {
        const newSelected = [...selectedComparisonProducts];
        
        // dropdownIndex 0 = first comparison product (index 0)
        // dropdownIndex 1 = second comparison product (index 2) 
        const targetIndex = dropdownIndex === 0 ? 0 : 2;
        
        if (targetIndex < newSelected.length) {
          newSelected[targetIndex] = selectedProduct;
          setSelectedComparisonProducts(newSelected);
        }
      }
    }
  };

  // Use selected products for comparison, fallback to default
  const comparisonProducts = selectedComparisonProducts.length > 0 ? selectedComparisonProducts : defaultComparisonProducts;
  
  // Create the display order: [current product, comparison products]
  const displayProducts = [
    comparisonProducts[1], // Current product (leftmost)
    ...comparisonProducts.filter((_, index) => index !== 1) // All other products (excluding current at index 1)
  ].filter(Boolean); // Remove any undefined values
  

  // Transform available products for dropdown
  const dropdownOptions = useMemo(() => availableProducts.map((product) => {
    const displayPrice = currency === 'USD' 
      ? (product.price_usd || (product as any).ea_estimated_price_usd || 0)
      : (product.price_cad || (product.price_usd || (product as any).ea_estimated_price_usd || 0) * 1.35);
    
    return {
      value: product.model,
      label: `${product.manufacturer} ${(product as any).display_name && product.category?.toLowerCase() === 'monitor'
        ? (product as any).display_name
        : (product as any).display_name && product.model && 
          !(product as any).display_name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(product.model.toLowerCase().replace(/[^a-z0-9]/g, '')) && 
          !product.model.toLowerCase().replace(/[^a-z0-9]/g, '').includes((product as any).display_name.toLowerCase().replace(/[^a-z0-9]/g, '')) ? `${(product as any).display_name} (${product.model})` : (product as any).display_name || product.model} - $${Math.round(displayPrice).toLocaleString()} ${currency}`,
    };
  }), [availableProducts, currency]);

  const handleBackClick = () => {
    // Use browser back navigation if there's history, otherwise fallback to home
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const compareSectionRef = useRef<HTMLDivElement>(null);

  // Ensure quantity is 1 for laptops and desktops
  React.useEffect(() => {
    if (product && (product.category === "Laptops" || product.category === "Desktops")) {
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <PageLayout>
        <div className="text-2xl font-semibold text-gray-700 mb-4">Product Not Found</div>
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Back to Home</Link>
      </PageLayout>
    );
  }

  // Unified eligibility logic: eligible if price exists
  const isEligible = Boolean((product as any).price_usd || (product as any).ea_estimated_price_usd);

  return (
    <PageLayout>   
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Catalog", href: "/catalog" },
            { 
              label: getCategoryPlural(product.category || "Products"), 
              href: `/category/${product.category?.toLowerCase() === 'trackpad' ? 'mouse' : product.category?.toLowerCase()}` 
            },
            { label: product.model, isActive: true }
          ]}
          className="mb-8"
        />
        <div className="flex flex-col md:flex-row space-x-0 gap-8">
          <div className="flex-1">
            <ProductImageGallery mainImage={product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`} />
          </div>
          <div className="flex-1">
            <ProductInfoPanel
              brand={product.manufacturer}
              title={(product as any).display_name && product.category?.toLowerCase() === 'monitor'
                ? (product as any).display_name
                : (product as any).display_name && product.model && 
                  !(product as any).display_name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(product.model.toLowerCase().replace(/[^a-z0-9]/g, '')) && 
                  !product.model.toLowerCase().replace(/[^a-z0-9]/g, '').includes((product as any).display_name.toLowerCase().replace(/[^a-z0-9]/g, ''))
                  ? `${(product as any).display_name} (${product.model})` 
                  : (product as any).display_name || product.model}
              sku={product.model}
              price={(product as any).price_usd || (product as any).ea_estimated_price_usd}
              price_cad={(product as any).price_cad}
              available={isEligible}
              deliveryTime={"within 5 business days"}
              description={product.description || `${product.manufacturer} ${product.model}`}
              quantity={quantity}
              category={product.category}
              intendedFor={(product as any).intended_for}
              notSuitableFor={(product as any).not_suitable_for}
              bestFor={(product as any).best_for}
              idealFor={(product as any).ideal_for}
              product={product}
              onQuantityChange={setQuantity}
              onAddToCart={() => {
                addToCart({
                  model: product.model,
                  brand: product.manufacturer,
                  image: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`,
                  price_usd: (product as any).price_usd || (product as any).ea_estimated_price_usd,
                  price_cad: (product as any).price_cad,
                  quantity,
                  recommended: true,
                  description: product.description || `${product.manufacturer} ${product.model}`,
                  card_description: product.description || `${product.manufacturer} ${product.model}`,
                  category: product.category,
                });
              }}
              onCompare={() => {
                if (compareSectionRef.current) {
                  compareSectionRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          </div>
        </div>
        <div className="mt-6">
          <ProductSpecsTable specs={specs} category={product.category} />
        </div>
        <RequestHardwareBanner />
        {/* --- Comparison Cards --- */}
          <div ref={compareSectionRef}>
            <h2 className="text-2xl font-medium mt-8 mb-4">Compare with similar items</h2>
            
            {/* Product Selection Dropdowns */}
            {availableProducts.length > 0 && (
              <div className="mb-6">
                <div className={`grid grid-cols-1 gap-4 items-end md:grid-cols-${displayProducts.length}`}>
                  {/* Left - Current product (disabled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Product</label>
                    <div className="w-full appearance-none rounded-md bg-gray-100 py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 sm:text-sm/6 cursor-not-allowed">
                      {product?.manufacturer} {product?.model} - ${currency === 'USD' ? Math.round(product?.price_usd || 0).toLocaleString() : Math.round(product?.price_cad || 0).toLocaleString()} {currency}
                    </div>
                  </div>
                  
                  {/* Dropdowns for comparison products */}
                  {displayProducts.slice(1).map((_, index) => (
                    <div key={index}>
                      <div className="h-6 mb-2"></div>
                      <Dropdown
                        value={displayProducts[index + 1]?.model || ""}
                        onChange={(value) => handleComparisonProductChange(index, value)}
                        options={dropdownOptions}
                        placeholder="Select a product..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {displayProducts.length > 0 && (
              <ProductComparisonList products={displayProducts.map(p => ({
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
                image: p.image || `/images/${p.manufacturer.toLowerCase()}_${p.model.toLowerCase().replace(/\s+/g, "_")}.png`,
                features: (p as any).description || `${p.manufacturer} ${p.model}`,
                recommended: true
              }))} getProductSpecs={(product: any) => getProductSpecs(product)} noBackground={true} />
            )}
          </div>
        
        <SupportBanner />
    </PageLayout>
  );
} 