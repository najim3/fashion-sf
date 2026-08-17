import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex">
      <ol className="flex items-center space-x-1 sm:space-x-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium line-clamp-1" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.url} className="hover:text-foreground transition-colors line-clamp-1 max-w-[150px] sm:max-w-[200px]">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
