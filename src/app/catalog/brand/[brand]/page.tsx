"use client";

import { hardwareData } from "@/data/eaProductData";
import { ProductCard } from "@/components/ui/ProductCard";
import { PlatformInfoBanner } from "@/components/ui/PlatformInfoBanner";
import { Header } from "@/components/layout/Header";
import { MainNavigation } from "@/components/layout/MainNavigation";
import Link from "next/link";
import { ArrowLeft, Filter, SortAsc } from "lucide-react";
import { useState, useRef, useEffect, use } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EAProductType } from "@/types";

export default function BrandCatalogPage({ params }: { params: Promise<{ brand: string }> }) {
  const resolvedParams = use(params);
  const brand = decodeURIComponent(resolvedParams.brand);

  // Filter products by brand
  const brandProducts = hardwareData.filter((product) => 
    product.manufacturer.toLowerCase() === brand.toLowerCase()
  );

  // Get available categories for this brand
  const availableCategories = Array.from(new Set(brandProducts.map(product => product.category)));
  
  // Map category names to filter values
  const categoryFilterMap: { [key: string]: string } = {
    'Laptop': 'laptop',
    'Monitor': 'monitor',
    'Docking Station': 'docking station',
    'Headset': 'headset'
  };

  const [sortOption, setSortOption] = useState("all");
  const [filterOption, setFilterOption] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node) &&
        showFilterMenu
      ) {
        setShowFilterMenu(false);
      }
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node) &&
        showSortMenu
      ) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterMenu, showSortMenu]);

  // Filter logic
  let filteredProducts = brandProducts;
  if (filterOption !== "all") {
    // Find the category name that matches the filter value
    const selectedCategory = Object.keys(categoryFilterMap).find(
      key => categoryFilterMap[key] === filterOption
    );
    
    if (selectedCategory) {
      filteredProducts = brandProducts.filter((product) =>
        product.category === selectedCategory
      );
    }
  }
  
  // Reset filter if the selected category is no longer available
  useEffect(() => {
    if (filterOption !== "all") {
      const selectedCategory = Object.keys(categoryFilterMap).find(
        key => categoryFilterMap[key] === filterOption
      );
      if (!selectedCategory || !availableCategories.includes(selectedCategory)) {
        setFilterOption("all");
      }
    }
  }, [availableCategories, filterOption, categoryFilterMap]);

  // Sorting logic
  let sortedProducts = filteredProducts;
  if (sortOption === "price-low") {
    sortedProducts = [...filteredProducts].sort((a, b) => a.price_usd - b.price_usd);
  } else if (sortOption === "price-high") {
    sortedProducts = [...filteredProducts].sort((a, b) => b.price_usd - a.price_usd);
  } else if (sortOption === "az") {
    sortedProducts = [...filteredProducts].sort((a, b) => a.model.localeCompare(b.model));
  } else if (sortOption === "za") {
    sortedProducts = [...filteredProducts].sort((a, b) => b.model.localeCompare(a.model));
  } // 'all' just shows the original order

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MainNavigation />
      <main className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 mb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Catalog", href: "/catalog" },
            { label: brand, isActive: true }
          ]}
          className="mb-6"
        />
        
        <div className="text-left">
          <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-2">{brand} Products</h1>
          <h4 className="font-base text-gray-800 mb-8">Browse all {brand} products and find the perfect item for your needs.</h4>
        </div>
        
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap w-full">
          <div className="text-base font-regular text-gray-900 min-w-max">{sortedProducts.length} item{sortedProducts.length === 1 ? "" : "s"} found</div>
          {/* Desktop filter/sort dropdowns */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div>
              <label htmlFor="filter" className="mr-2 text-base font-regular text-gray-700">Filter by:</label>
              <select
                id="filter"
                value={filterOption}
                onChange={e => setFilterOption(e.target.value)}
                className="w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="all">All</option>
                {availableCategories.map(category => {
                  const filterValue = categoryFilterMap[category];
                  if (filterValue) {
                    return (
                      <option key={filterValue} value={filterValue}>
                        {category}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="mr-2 text-base font-regular text-gray-700">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="all">All</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
          {/* Mobile filter/sort icons */}
          <div className="flex md:hidden items-center gap-4 ml-auto relative">
            <button
              aria-label="Filter"
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setShowFilterMenu((v) => !v)}
            >
              <Filter className="w-6 h-6" />
            </button>
            <button
              aria-label="Sort"
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setShowSortMenu((v) => !v)}
            >
              <SortAsc className="w-6 h-6" />
            </button>
            {/* Filter menu */}
            {showFilterMenu && (
              <div ref={filterMenuRef} className="absolute right-12 top-10 z-50 bg-white border border-gray-200 rounded shadow-md w-40">
                <button
                  key="all"
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterOption === "all" ? "bg-gray-100 font-semibold" : ""}`}
                  onClick={() => { setFilterOption("all"); setShowFilterMenu(false); }}
                >
                  All
                </button>
                {availableCategories.map(category => {
                  const filterValue = categoryFilterMap[category];
                  if (filterValue) {
                    return (
                      <button
                        key={filterValue}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterOption === filterValue ? "bg-gray-100 font-semibold" : ""}`}
                        onClick={() => { setFilterOption(filterValue); setShowFilterMenu(false); }}
                      >
                        {category}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            )}
            {/* Sort menu */}
            {showSortMenu && (
              <div ref={sortMenuRef} className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded shadow-md w-40">
                {[
                  { value: "all", label: "All" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "az", label: "A-Z" },
                  { value: "za", label: "Z-A" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOption === opt.value ? "bg-gray-100 font-semibold" : ""}`}
                    onClick={() => { setSortOption(opt.value); setShowSortMenu(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <PlatformInfoBanner />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedProducts.map((product, idx) => (
            <ProductCard 
              key={`${product.model}-${idx}`} 
              product={{
                manufacturer: product.manufacturer,
                model: product.model,
                display_name: (product as any).display_name,
                category: product.category,
                description: (product as any).description || '',
                card_description: (product as any).description || '',
                features: (product as any).description || '',
                image: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`,
                price_usd: product.price_usd,
                recommended: false,
              }} 
            />
          ))}
        </div>
      </main>
    </div>
  );
} 