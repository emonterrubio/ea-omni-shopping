import React from 'react';
import { ComparisonProductCard } from './ProductComparisonCard';
import type { CatalogProduct } from '@/data/products';

interface ProductComparisonListProps {
  products: CatalogProduct[];
  getProductSpecs: (product: CatalogProduct) => { label: string; value: unknown }[];
}

export function ProductComparisonList({ products, getProductSpecs }: ProductComparisonListProps) {
  if (!products || products.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {products.map((p, idx) => (
        <ComparisonProductCard
          key={p.model + idx}
          image={p.image || 'https://placehold.co/400x300?text=Product'}
          brand={p.brand}
          model={p.model}
          description={p.description || ''}
          card_description={p.card_description}
          features={p.features || ''}
          subFeatures={p.features ? p.features.split(',').map((f) => f.trim()) : []}
          price={p.price}
          chip={p.processor || p.category || ''}
          specs={getProductSpecs ? getProductSpecs(p) : []}
        />
      ))}
    </div>
  );
}
