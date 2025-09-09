"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { hardwareData } from "@/data/eaProductData";

interface Product {
  image?: string;
  brand: string;
  model: string;
  description?: string;
  card_description?: string;
  features?: string;
  price: number;
  processor?: string;
  category?: string;
  [key: string]: any;
}
import { ComparisonProductCard } from "@/components/product/ProductComparisonCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { SupportBanner } from "@/components/product/SupportBanner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CompareClient() {
  const searchParams = useSearchParams();
  const modelsParam = searchParams.get("models");
  const brandParam = searchParams.get("brand");

  const selectedProducts = useMemo(() => {
    let filtered = hardwareData;
    if (brandParam) {
      filtered = hardwareData.filter((product: any) => product.manufacturer.toLowerCase() === brandParam.toLowerCase());
    }
    if (modelsParam) {
      const models = modelsParam.split(",").map(decodeURIComponent);
      const products = models
        .map((model) => filtered.find((p: any) => p.model === model))
        .filter((p): p is any => p !== undefined);
      return products;
    }
    // Otherwise, randomize 3 from the filtered brand
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [modelsParam, brandParam]);

  return (
    <PageLayout>
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <div className="text-left">
          <h1 className="text-5xl font-medium text-gray-900 mt-6 mb-4">Compare with similar items</h1>
          <h4 className="font-base text-gray-600 mb-8">Compare processor speed, battery life, and portability to find your ideal laptop.</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {selectedProducts.filter(Boolean).map((product) => (
            <div key={product.model} className="flex flex-col items-center h-full">
              <ComparisonProductCard
                image={product.image || 'https://placehold.co/400x300?text=Product'}
                brand={product.manufacturer}
                model={product.model}
                description={product.description || ''}
                card_description={product.description || ''}
                features={product.description || ''}
                subFeatures={product.description ? product.description.split(',').map((f: string) => f.trim()) : []}
                price_usd={product.price_usd}
                chip={product.cpu || product.os || product.category || ''}
                specs={[]}
              />
            </div>
          ))}
        </div>
        <SupportBanner />
    </PageLayout>
  );
} 