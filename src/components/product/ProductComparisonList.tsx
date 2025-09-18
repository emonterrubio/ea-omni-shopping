import React from 'react';
import { ComparisonProductCard } from './ProductComparisonCard';

interface Product {
  image?: string;
  brand: string;
  model: string;
  display_name?: string;
  description?: string;
  card_description?: string;
  features?: string;
  price_usd: number;
  price_cad?: number;
  price_eur?: number;
  processor?: string;
  category?: string;
  [key: string]: any;
}

interface ProductComparisonListProps {
  products: Product[];
  getProductSpecs: (product: Product) => { label: string; value: any }[];
  noBackground?: boolean; // New prop to control card background and shadow
}

export function ProductComparisonList({ products, getProductSpecs, noBackground = false }: ProductComparisonListProps) {
  if (!products || products.length === 0) return null;
  return (
    <div className={noBackground ? "" : "mt-8"}>
      {!noBackground && <h2 className="text-2xl font-medium mb-4">Compare with similar items</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {products.map((p: Product, idx: number) => (
          <ComparisonProductCard
            key={p.model + idx}
            image={p.image || 'https://placehold.co/400x300?text=Product'}
            brand={p.brand}
            model={p.model}
            display_name={p.display_name}
            category={p.category}
            description={p.description || ''}
            card_description={p.card_description}
            features={p.features || ''}
            subFeatures={p.features ? p.features.split(',').map((f: string) => f.trim()) : []}
            price_usd={p.price_usd}
            price_cad={p.price_cad}
            price_eur={p.price_eur}
            chip={p.category?.toLowerCase() === 'monitor' ? p.model : (p.cpu || p.processor || p.category || '')}
            specs={getProductSpecs ? getProductSpecs(p) : []}
            noBackground={noBackground}
          />
        ))}
      </div>
    </div>
  );
} 