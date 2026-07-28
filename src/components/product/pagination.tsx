"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
}

export function Pagination({ pageInfo }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleNavigate = (direction: "next" | "prev") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (direction === "next" && pageInfo.endCursor) {
      params.set("after", pageInfo.endCursor);
      params.delete("before");
    } else if (direction === "prev" && pageInfo.startCursor) {
      params.set("before", pageInfo.startCursor);
      params.delete("after");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!pageInfo.hasNextPage && !pageInfo.hasPreviousPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={() => handleNavigate("prev")}
        disabled={!pageInfo.hasPreviousPage}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border rounded-md transition-colors",
          pageInfo.hasPreviousPage 
            ? "border-gray-300 hover:bg-gray-50 text-gray-900" 
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <button
        onClick={() => handleNavigate("next")}
        disabled={!pageInfo.hasNextPage}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border rounded-md transition-colors",
          pageInfo.hasNextPage 
            ? "border-gray-300 hover:bg-gray-50 text-gray-900" 
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
