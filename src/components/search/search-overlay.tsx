"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { getPredictiveSearchResults } from "@/lib/actions/search";
import { ProductPrice } from "@/components/product/product-price";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    queries: any[];
    products: any[];
    collections: any[];
  }>({ queries: [], products: [], collections: [] });
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fetch predictive results
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery) {
        setResults({ queries: [], products: [], collections: [] });
        return;
      }

      setIsLoading(true);
      try {
        const data = await getPredictiveSearchResults(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Save to recent
    const updatedRecents = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecents));
    
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    const updatedRecents = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecents));
    
    onClose();
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  if (!isOpen) return null;

  const hasResults = results.products.length > 0 || results.collections.length > 0 || results.queries.length > 0;

  return (
    <div className="fixed inset-0 z-[110] bg-background flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Header / Search Bar */}
      <div className="border-b border-border px-4 md:px-8 py-4 flex items-center gap-4">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
          <Search className="w-5 h-5 text-muted-foreground absolute left-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, collections..."
            className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl py-2 pl-10 pr-4 placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-0 p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
        <button
          onClick={onClose}
          className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground shrink-0"
        >
          Cancel
        </button>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="container mx-auto max-w-5xl">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : query && !hasResults ? (
            <div className="text-center py-20 text-muted-foreground">
              No results found for "{query}". Try checking your spelling or using less specific terms.
            </div>
          ) : query ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Suggestions */}
              {results.queries.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {results.queries.map((q, i) => (
                      <li key={i}>
                        <button 
                          onClick={() => handleSuggestionClick(q.text)}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline"
                        >
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <span dangerouslySetInnerHTML={{ __html: q.text.replace(new RegExp(`(${query})`, 'gi'), '<b>$1</b>') }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Collections */}
              {results.collections.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                    Collections
                  </h3>
                  <ul className="space-y-3">
                    {results.collections.map((c) => (
                      <li key={c.id}>
                        <Link 
                          href={`/collections/${c.handle}`}
                          onClick={onClose}
                          className="group flex items-center justify-between"
                        >
                          <span className="font-medium group-hover:underline">{c.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                    Products
                  </h3>
                  <div className="space-y-4">
                    {results.products.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/products/${p.handle}`}
                        onClick={onClose}
                        className="group flex gap-4 items-center"
                      >
                        <div className="w-16 h-20 bg-muted relative overflow-hidden flex-shrink-0">
                          {p.image && (
                            <Image 
                              src={p.image} 
                              alt={p.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:underline">{p.title}</h4>
                          <div className="mt-1 scale-90 origin-left">
                            <ProductPrice price={p.price} compareAtPrice={p.compareAtPrice} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSuggestionClick(query)}
                    className="mt-6 text-sm font-medium underline underline-offset-4 flex items-center gap-1 hover:text-muted-foreground transition-colors"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State / Recent Searches */
            <div className="max-w-md mx-auto mt-10">
              {recentSearches.length > 0 && (
                <>
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4 text-center">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-4 py-2 bg-muted hover:bg-muted rounded-full text-sm transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
