import React from "react";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

import { FeaturedItems } from "./home/FeaturedItems";
import { RecommendedItems } from "./home/RecommendedItems";
import { RecentOrders } from "./home/RecentOrders";
import { MainNavigationClient } from "./layout/MainNavigationClient";
import { HeroBanner } from "./home/HeroBanner";
import { RequestHardwareBanner } from "./product/RequestHardwareBanner";
import { EAProductType } from "../types";

interface ITStorefrontProps {
  categories: any[];
  products: EAProductType[];
  quickActions: any[];
  eligibilityData: any;
}

function getRandomItems(arr: EAProductType[], n: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function getFeaturedProducts(products: EAProductType[], n = 6) {
  return getRandomItems(products, n);
}

function getRecommendedProducts(products: EAProductType[], n = 3) {
  // Filter for laptops and monitors as they're more suitable for recommendations
  const eligibleProducts = products.filter((product) => 
    product.category.toLowerCase() === 'laptop' || 
    product.category.toLowerCase() === 'monitor'
  );
  
  if (eligibleProducts.length === 0) {
    return { displayedProducts: getRandomItems(products, n), showCompareButton: products.length > 3 };
  }
  
  const brands = Array.from(new Set(eligibleProducts.map((p) => p.manufacturer)));
  const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
  const brandProducts = eligibleProducts.filter((p) => p.manufacturer === selectedBrand);
  const displayedProducts = getRandomItems(brandProducts, n);
  const showCompareButton = eligibleProducts.length > 3;
  return { displayedProducts, showCompareButton };
}

function getRandomHeroBanner(products: EAProductType[]) {
  // Filter for products that would make good hero banners (laptops, monitors)
  const heroEligibleProducts = products.filter(product => {
    const category = product.category?.toLowerCase() || '';
    return category === 'laptop' || category === 'monitor' || category === 'docking station' || category === 'headset';
  });

  if (heroEligibleProducts.length === 0) {
    // Fallback to any product if no eligible ones found
    return products[Math.floor(Math.random() * products.length)];
  }

  return heroEligibleProducts[Math.floor(Math.random() * heroEligibleProducts.length)];
}

function generateHeroBannerContent(product: EAProductType) {
  const brand = product.manufacturer || 'Premium';
  const model = product.model || 'Device';
  const category = product.category || 'Hardware';
  
  // Use the actual product descriptions when available
  const productDescription = product.description || '';
  
  // Generate dynamic content based on product type
  let title, subtitle, description;
  
  if (category.toLowerCase() === 'laptop') {
    title = `Featured ${category}`;
    subtitle = `${brand} ${model}`;
    description = productDescription || `Experience next-generation performance with cutting-edge technology. Perfect for productivity, creativity, and everything in between.`;
  } else if (category.toLowerCase() === 'monitor') {
    title = `Featured ${category}`;
    subtitle = `${brand} ${model}`;
    description = productDescription || `Immerse yourself in stunning visuals with our premium display technology. Enhanced productivity meets exceptional clarity.`;
  } else if (category.toLowerCase() === 'docking station') {
    title = `Featured ${category}`;
    subtitle = `${brand} ${model}`;
    description = productDescription || `Streamline your workspace with our advanced docking solutions. Connect, power, and organize with ease.`;
  } else if (category.toLowerCase() === 'headset') {
    title = `Featured ${category}`;
    subtitle = `${brand} ${model}`;
    description = productDescription || `Experience crystal-clear audio and exceptional comfort. Perfect for meetings, calls, and focused work.`;
  } else {
    title = `Featured ${category}`;
    subtitle = `${brand} ${model}`;
    description = productDescription || `Discover exceptional quality and performance. Designed to enhance your workflow and exceed expectations.`;
  }

  return {
    title,
    subtitle,
    description,
    buttonText: "See Details",
    buttonLink: `/product/${product.model.toLowerCase().replace(/\s+/g, "-")}?from=hero`,
    imageSrc: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, '_')}.png`,
    imageAlt: `${brand} ${model}`
  };
}

export function ITStorefront({
  categories,
  products,
  quickActions,
  eligibilityData,
}: ITStorefrontProps) {
  const featuredProducts = getFeaturedProducts(products);
  const { displayedProducts, showCompareButton } = getRecommendedProducts(products);
  // Generate dynamic hero banner content
  const randomHeroProduct = getRandomHeroBanner(products);
  const heroBannerContent = generateHeroBannerContent(randomHeroProduct);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
        <MainNavigationClient />
      </div>  
      <main className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          {/* Hero Banner */}
          <HeroBanner products={products} />
          {/* Recent Orders */}
          <RecentOrders maxOrders={2} />
          {/* <SearchBarClient /> */}
          {/* <Categories /> */}
          {/* <QuickActionsClient actions={quickActions} /> */}
          {/* Featured Items */}
          <FeaturedItems displayedProducts={featuredProducts} />
          {/* Recommended Items */}
          {/* <RecommendedItems displayedProducts={displayedProducts} showCompareButton={showCompareButton} /> */}
          {/* Request Hardware Banner */}
          <RequestHardwareBanner />
          {/* <EligibilityInfo data={eligibilityData} /> */}
      </main>
      <Footer />
    </div>
  );
} 