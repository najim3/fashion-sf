"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
  values: string[];
}

interface VariantSelectorProps {
  options: Option[];
  variants: any[];
}

export function VariantSelector({ options, variants }: VariantSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If there's only one option and it's default, don't show selector
  if (options.length === 1 && options[0].values.length === 1 && options[0].values[0] === "Default Title") {
    return null;
  }

  const handleOptionChange = (optionName: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(optionName.toLowerCase(), value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const optionNameLowerCase = option.name.toLowerCase();
        const currentSelectedValue = searchParams.get(optionNameLowerCase) || option.values[0];

        return (
          <div key={option.id}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-foreground">{option.name}</h3>
              <span className="text-sm text-muted-foreground">{currentSelectedValue}</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isSelected = currentSelectedValue === value;
                
                // Color swatches
                if (optionNameLowerCase === "color" || optionNameLowerCase === "colour") {
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      title={value}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        isSelected ? "border-foreground p-0.5" : "border-transparent hover:border-border"
                      )}
                    >
                      <span 
                        className="block w-full h-full rounded-full border border-border"
                        style={{ backgroundColor: value.toLowerCase().replace(" ", "") }}
                      />
                    </button>
                  );
                }

                // Normal buttons (Size, Material, etc)
                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={cn(
                      "min-w-[3rem] px-3 py-2 text-sm border rounded-md transition-colors",
                      isSelected
                        ? "border-foreground bg-brand text-brand-foreground font-medium"
                        : "border-border bg-background text-foreground hover:border-gray-900"
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
