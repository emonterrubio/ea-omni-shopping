"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAllProducts, type CatalogProduct } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Header } from "@/components/layout/Header";
import { MainNavigation } from "@/components/layout/MainNavigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ProductCardProps } from "@/types/ProductCardProps";

function toProductCard(product: CatalogProduct): ProductCardProps {
  return {
    brand: product.brand,
    model: product.model,
    category: product.category,
    description: product.description,
    card_description: product.card_description,
    features: product.features || "",
    image: product.image,
    price: product.price,
    recommended: Boolean(product.recommended),
  };
}

function localFilter(products: CatalogProduct[], q: string): CatalogProduct[] {
  const needle = q.toLowerCase();
  return products.filter((p) =>
    Object.values(p).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(needle),
    ),
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const feature = searchParams.get("feature");
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFound, setTotalFound] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (q) {
        try {
          const response = await fetch("/api/ai-product-search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q }),
          });
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setResults(data.results);
            setTotalFound(data.totalFound || data.results.length);
          } else {
            const fallback = localFilter(getAllProducts(), q);
            setResults(fallback);
            setTotalFound(fallback.length);
          }
        } catch {
          const fallback = localFilter(getAllProducts(), q);
          setResults(fallback);
          setTotalFound(fallback.length);
        }
      } else {
        let filteredResults = getAllProducts();
        if (brand) {
          filteredResults = filteredResults.filter(
            (p) => p.brand.toLowerCase() === brand.toLowerCase(),
          );
        }
        if (category) {
          filteredResults = filteredResults.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase(),
          );
        }
        if (feature) {
          filteredResults = filteredResults.filter((p) =>
            Object.values(p).some(
              (val) =>
                typeof val === "string" &&
                val.toLowerCase().includes(feature.toLowerCase()),
            ),
          );
        }
        setResults(filteredResults);
        setTotalFound(filteredResults.length);
      }
      setLoading(false);
    };

    fetchResults();
  }, [q, brand, category, feature]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MainNavigation />
      <main className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 mb-16">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mb-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium">
            Search results for:{" "}
            <span className="font-medium text-blue-600">
              {q || brand || category || feature || "All"}
            </span>
          </h2>
          <span className="text-gray-600 text-base font-regular">
            {totalFound} item{totalFound === 1 ? "" : "s"} found
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No products found.</div>
          ) : (
            results.map((product, idx) => (
              <ProductCard key={`${product.model}-${idx}`} product={toProductCard(product)} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
