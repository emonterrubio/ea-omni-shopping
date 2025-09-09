"use client";
import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { hardwareData } from "@/data/eaProductData";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardProps } from "@/types/ProductCardProps";
import { Header } from "@/components/layout/Header";
import { MainNavigation } from "@/components/layout/MainNavigation";
import { ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Dropdown } from "@/components/ui/Dropdown";

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

function getProductsForCategory(category: string): ProductCardProps[] {
  // Filter products by category from the unified hardwareData
  const categoryProducts = hardwareData.filter(product => {
    const productCategory = product.category.toLowerCase();
    const targetCategory = category.toLowerCase();
    
    // Special case: when filtering for "mouse", also include "trackpad"
    if (targetCategory === 'mouse') {
      return productCategory === 'mouse' || productCategory === 'trackpad';
    }
    
    return productCategory === targetCategory;
  });

  // Map to ProductCardProps format
  return categoryProducts.map(product => ({
    manufacturer: product.manufacturer,
    model: product.model,
    display_name: (product as any).display_name,
    category: product.category,
    description: (product as any).description || `${product.manufacturer} ${product.model}`,
    card_description: (product as any).description || `${product.manufacturer} ${product.model}`,
    features: (product as any).description || `${product.manufacturer} ${product.model}`,
    image: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`,
    price_usd: product.price_usd,
    price_cad: (product as any).price_cad,
    recommended: false,
  }));
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryParam = typeof resolvedParams.category === "string" ? resolvedParams.category : Array.isArray(resolvedParams.category) ? resolvedParams.category[0] : "";
  // Decode URL-encoded category name (e.g., "docking%20stations" -> "docking stations")
  const category = decodeURIComponent(categoryParam);
  const products: ProductCardProps[] = getProductsForCategory(category);

  // --- Brand Filter & Sort State ---
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Unique brands for filter dropdown
  const brands = Array.from(new Set(products.map(p => p.manufacturer)));

  // Dropdown options
  const brandOptions = [
    { value: "all", label: "All Brands" },
    ...brands.sort().map(brand => ({
      value: brand,
      label: brand
    }))
  ];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "az", label: "A-Z" },
    { value: "za", label: "Z-A" }
  ];

  // --- Filtering ---
  let filteredProducts = brandFilter === "all" ? products : products.filter(p => p.manufacturer === brandFilter);

  // --- Sorting ---
  let sortedProducts = [...filteredProducts];
  if (sortOption === "price-low") {
    sortedProducts.sort((a, b) => a.price_usd - b.price_usd);
  } else if (sortOption === "price-high") {
    sortedProducts.sort((a, b) => b.price_usd - a.price_usd);
  } else if (sortOption === "az") {
    sortedProducts.sort((a, b) => a.model.localeCompare(b.model));
  } else if (sortOption === "za") {
    sortedProducts.sort((a, b) => b.model.localeCompare(a.model));
  }

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [brandFilter, sortOption]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MainNavigation />
      <main className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 mb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Catalog", href: "/catalog" },
            { label: getCategoryPlural(category), isActive: true }
          ]}
          className="mb-6"
        />
        
        <div className="text-left">
          <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4 capitalize">{getCategoryPlural(category)} <span className="normal-case">available</span></h1>
          <h4 className="font-base text-gray-600 mb-8">Boost your productivity with high-performance equipment.</h4>
        </div>
        
        {/* --- Filter & Sort Controls (match catalog page) --- */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap w-full">
          <div className="text-sm font-regular text-gray-900 min-w-max">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} item{sortedProducts.length === 1 ? "" : "s"}
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="brand-filter" className="text-sm font-regular text-gray-700 whitespace-nowrap">Filter by:</label>
              <Dropdown
                value={brandFilter}
                onChange={setBrandFilter}
                options={brandOptions}
                placeholder="Select a brand..."
                className="min-w-[160px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-regular text-gray-700 whitespace-nowrap">Sort by:</label>
              <Dropdown
                value={sortOption}
                onChange={setSortOption}
                options={sortOptions}
                placeholder="Select sort option..."
                className="min-w-[140px]"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full font-medium text-lg text-center text-gray-500 mt-12">No products found in this category.</div>
          ) : (
            paginatedProducts.map((product, idx) => (
              <ProductCard key={`${product.model}-${idx}`} product={product} />
            ))
          )}
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
} 