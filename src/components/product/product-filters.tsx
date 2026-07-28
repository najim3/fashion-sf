"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock filter categories
const FILTER_CATEGORIES = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "t-shirts", label: "T-Shirts" },
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "accessories", label: "Accessories" },
    ]
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "s", label: "Small" },
      { value: "m", label: "Medium" },
      { value: "l", label: "Large" },
      { value: "xl", label: "X-Large" },
    ]
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
      { value: "blue", label: "Blue" },
      { value: "red", label: "Red" },
    ]
  }
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    size: true,
    color: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterChange = (categoryId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(categoryId);

    if (currentValues.includes(value)) {
      params.delete(categoryId);
      // Re-add others
      currentValues.filter(v => v !== value).forEach(v => params.append(categoryId, v));
    } else {
      params.append(categoryId, value);
    }
    
    // Reset pagination when filtering
    params.delete("after");
    params.delete("before");
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_CATEGORIES.forEach(cat => params.delete(cat.id));
    params.delete("after");
    params.delete("before");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeFilterCount = FILTER_CATEGORIES.reduce((count, cat) => {
    return count + searchParams.getAll(cat.id).length;
  }, 0);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 py-2 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium rounded-md transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none md:w-64 md:flex-shrink-0 md:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Header (Mobile) */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <h2 className="text-lg font-medium">Filters</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-0 md:pr-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="hidden md:block text-lg font-medium">Filters</h2>
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-black hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-6">
              {FILTER_CATEGORIES.map((category) => (
                <div key={category.id} className="border-b pb-4">
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900"
                  >
                    {category.name}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      openSections[category.id] ? "rotate-180" : ""
                    )} />
                  </button>
                  
                  {openSections[category.id] && (
                    <div className="pt-4 space-y-3">
                      {category.options.map((option) => {
                        const isChecked = searchParams.getAll(category.id).includes(option.value);
                        return (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${category.id}-${option.value}`}
                              name={`${category.id}[]`}
                              value={option.value}
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleFilterChange(category.id, option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                            />
                            <label
                              htmlFor={`filter-${category.id}-${option.value}`}
                              className="ml-3 text-sm text-gray-600 cursor-pointer flex-1"
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer (Mobile) */}
          <div className="p-4 border-t md:hidden">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-black text-white py-3 rounded-md font-medium"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
