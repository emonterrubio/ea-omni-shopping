"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { getAllProducts, type CatalogProduct } from "@/data/products";
import { resolveProductImage } from "@/lib/product-image";

const MAX_SUGGESTIONS = 8;
const DEBOUNCE_MS = 150;

type ScoredProduct = CatalogProduct & { score: number };

function scoreProduct(product: CatalogProduct, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const brand = product.brand.toLowerCase();
  const model = product.model.toLowerCase();
  const category = (product.category || "").toLowerCase();
  const description = (
    product.card_description ||
    product.description ||
    ""
  ).toLowerCase();
  const haystack = `${brand} ${model} ${category} ${description}`;
  const words = q.split(/\s+/).filter(Boolean);

  let score = 0;
  if (model === q) score += 100;
  if (model.startsWith(q)) score += 50;
  if (model.includes(q)) score += 30;
  if (brand === q || brand.startsWith(q)) score += 40;
  if (brand.includes(q)) score += 20;
  if (category.includes(q)) score += 15;
  if (description.includes(q)) score += 8;

  const allWordsMatch = words.every((word) => haystack.includes(word));
  if (allWordsMatch) score += 25 * words.length;

  return score;
}

function searchCatalog(query: string): ScoredProduct[] {
  const q = query.trim();
  if (q.length < 1) return [];

  return getAllProducts()
    .map((product) => ({ ...product, score: scoreProduct(product, q) }))
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score || a.model.localeCompare(b.model))
    .slice(0, MAX_SUGGESTIONS);
}

interface HeaderSearchProps {
  className?: string;
}

export function HeaderSearch({ className = "" }: HeaderSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputId = useId();
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(
    () => searchCatalog(debouncedQuery),
    [debouncedQuery],
  );

  useEffect(() => {
    setActiveIndex(-1);
    setOpen(debouncedQuery.trim().length > 0 && suggestions.length > 0);
  }, [debouncedQuery, suggestions.length]);

  useEffect(() => {
    if (!mobileOpen) return;
    mobileInputRef.current?.focus();
  }, [mobileOpen]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const goToResults = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const goToProduct = (model: string) => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
    router.push(`/product/${encodeURIComponent(model)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setOpen(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setOpen(true);
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goToProduct(suggestions[activeIndex].model);
        return;
      }
      goToResults(query);
    }
  };

  const renderSuggestions = (menuId: string) =>
    open && suggestions.length > 0 ? (
      <ul
        id={menuId}
        role="listbox"
        className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-[70] max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl"
      >
        <li className="sticky top-0 z-10 border-b border-gray-100 bg-white">
          <button
            type="button"
            className="w-full px-3 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
            onClick={() => goToResults(query)}
          >
            See all results for “{query.trim()}”
          </button>
        </li>
        {suggestions.map((product, index) => {
          const image = resolveProductImage(
            product.model,
            product.image,
            product.brand,
          );
          const isActive = index === activeIndex;
          return (
            <li key={`${product.brand}-${product.model}`} role="option" aria-selected={isActive}>
              <button
                type="button"
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToProduct(product.model)}
              >
                <div className="relative h-10 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.brand} {product.model}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {product.category}
                    {typeof product.price === "number"
                      ? ` · $${product.price.toLocaleString()}`
                      : ""}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  const inputProps = {
    type: "search" as const,
    value: query,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setOpen(true);
    },
    onKeyDown,
    onFocus: () => {
      if (query.trim() && suggestions.length > 0) setOpen(true);
    },
    placeholder: "Search",
    autoComplete: "off",
    autoCorrect: "off",
    spellCheck: false,
    role: "combobox" as const,
    "aria-autocomplete": "list" as const,
    "aria-expanded": open,
    "aria-controls": listId,
  };

  return (
    <div ref={rootRef} className={`relative flex items-center justify-end ${className}`}>
      {/* Desktop search bar */}
      <form
        className="relative hidden md:block w-full"
        onSubmit={(event) => {
          event.preventDefault();
          goToResults(query);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search catalog
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          {...inputProps}
          id={inputId}
          ref={desktopInputRef}
          className="w-full rounded-md border-0 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {renderSuggestions(listId)}
      </form>

      {/* Mobile search icon */}
      <button
        type="button"
        className="md:hidden p-2 text-white hover:text-gray-100"
        aria-label={mobileOpen ? "Close search" : "Open search"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
      </button>

      {/* Mobile expanded search panel */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[65] bg-black/40 md:hidden"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 right-0 top-[4.75rem] z-[70] border-b border-gray-200 bg-white p-3 shadow-lg md:hidden">
            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
                goToResults(query);
              }}
            >
              <label htmlFor={`${inputId}-mobile`} className="sr-only">
                Search catalog
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                {...inputProps}
                id={`${inputId}-mobile`}
                ref={mobileInputRef}
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {query && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    mobileInputRef.current?.focus();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {renderSuggestions(`${listId}-mobile`)}
            </form>
            <p className="mt-2 text-center text-xs text-gray-500">
              Press Enter to search the full catalog
            </p>
          </div>
        </>
      )}
    </div>
  );
}
