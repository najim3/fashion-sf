"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Newest", value: "CREATED_AT-true" },
  { label: "Price: Low to High", value: "PRICE-false" },
  { label: "Price: High to Low", value: "PRICE-true" },
  { label: "Best Selling", value: "BEST_SELLING-true" },
];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSortKey = searchParams.get("sortKey") || "";
  const currentReverse = searchParams.get("reverse") || "";
  const currentValue = currentSortKey ? `${currentSortKey}-${currentReverse}` : "";
  
  const currentLabel = SORT_OPTIONS.find(opt => opt.value === currentValue)?.label || "Featured";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSort = (value: string) => {
    let url = pathname;
    
    if (!value) {
      // Clear sort params
      const params = new URLSearchParams(searchParams.toString());
      params.delete("sortKey");
      params.delete("reverse");
      url = `${pathname}?${params.toString()}`;
    } else {
      const [sortKey, reverse] = value.split("-");
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortKey", sortKey);
      params.set("reverse", reverse);
      url = `${pathname}?${params.toString()}`;
    }
    
    setIsOpen(false);
    router.push(url, { scroll: false });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-4 border border-border bg-background hover:bg-muted text-sm font-medium rounded-md transition-colors"
      >
        <span>Sort by: <span className="font-semibold">{currentLabel}</span></span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <ul className="py-1">
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleSort(option.value)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between transition-colors"
                >
                  <span className={option.value === currentValue ? "font-semibold" : ""}>
                    {option.label}
                  </span>
                  {option.value === currentValue && <Check className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
