"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { hardwareData } from "@/data/eaProductData";
import { ComparisonProductCard } from "@/components/product/ProductComparisonCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { SupportBanner } from "@/components/product/SupportBanner";
import { ArrowLeft } from "lucide-react";
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
  switch (product.category) {
    case "Hardware":
      return [
        { label: "Processor", value: product.cpu },
        { label: "Memory", value: product.memory },
        { label: "Storage", value: product.storage },
        { label: "Display", value: product.display },
        { label: "Graphics", value: product.graphics },
        { label: "Operating System", value: product.operating_system },
        { label: "Ports", value: product.ports },
        { label: "Battery", value: product.battery },
        { label: "Other", value: product.other },
      ];
    case "Monitors":
      return [
        { label: "Model", value: product.model },
        { label: "Resolution", value: product.display_resolution },
        { label: "Aspect Ratio", value: product.aspect_ratio },
        { label: "Display Type", value: product.display_type },
        { label: "Touchscreen", value: product.touchscreen },
        { label: "Curvature", value: product.curvature },
        { label: "Pixel Density", value: product.pixel_density },
        { label: "Refresh Rate", value: product.refresh_rate },
      ];
    case "Headphones":
      return [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model },
        { label: "Connectivity", value: product.connectivity },
        { label: "Controls", value: product.controls },
        { label: "Battery", value: product.battery },
        { label: "Headphone Jack", value: product.headphone_jack },
        { label: "Charging", value: product.charging },
        { label: "Features", value: product.features },
      ];
    case "Mice":
      return [
        { label: "Model", value: product.model },
        { label: "DPI", value: product.dpi },
        { label: "Connection", value: product.connection },
        { label: "Battery", value: product.battery },
        { label: "Features", value: product.features },
        { label: "Connectivity", value: product.connectivity },
        { label: "Button Quantity", value: product.button_quantity },
        { label: "Compatibility", value: product.compatibility },
      ];
    case "Keyboards":
      return [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model },
        { label: "Connectivity", value: product.connectivity },
        { label: "Compatibility", value: product.compatibility },
        { label: "Number of Keys", value: product.number_keys },
        { label: "Battery", value: product.battery },
        { label: "Features", value: product.features },
      ];
    case "Webcams":
      return [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model },
        { label: "Video Resolution", value: product.video_resolution },
        { label: "Display Resolution", value: product.display_resolution },
        { label: "Image Aspect Ratio", value: product.image_aspect_ratio },
        { label: "Image Capture Rate", value: product.image_capture_rate },
        { label: "Supported Image Format", value: product.supported_image_format },
        { label: "Supported Audio Format", value: product.supported_audio_format },
        { label: "Supported Video Format", value: product.supported_video_format },
      ];
    case "Docking Stations":
      return [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model },
        { label: "Ports", value: product.ports },
        { label: "Power", value: product.power },
        { label: "Dimensions", value: product.dimensions },
        { label: "Weight", value: product.weight },
      ];
    case "Backpacks":
      return [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model },
        { label: "Size", value: product.size },
        { label: "Capacity", value: product.capacity },
        { label: "Features", value: product.features },
      ];
    default:
      return [];
  }
}

export default function CartItemComparePage() {
  const params = useParams();
  const router = useRouter();
  
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

  const handleBackClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/cart');
    }
  };

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
        <button
          onClick={handleBackClick}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mb-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        
        <div className="text-left">
          <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4">Compare with similar items</h1>
          <h4 className="font-base text-gray-600 mb-8">Compare {selectedProduct.brand} {selectedProduct.model} with similar products to make the best choice.</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div key={product.model} className="flex flex-col items-center">
              <ComparisonProductCard
                image={product.image}
                brand={product.brand}
                model={product.model}
                description={product.description || product.card_description || ""}
                card_description={product.card_description}
                features={product.features || ""}
                subFeatures={product.features ? product.features.split(',').map((f: string) => f.trim()) : []}
                price_usd={product.price}
                chip={product.cpu || product.category || ""}
                specs={getProductSpecs(product)}
              />
            </div>
          ))}
        </div>
        <SupportBanner />
    </PageLayout>
  );
} 