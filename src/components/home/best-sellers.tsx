import Link from "next/link";
import { ProductCard, Product } from "@/components/product/product-card";

const MOCK_BEST_SELLERS: Product[] = [
  { id: "7", handle: "cashmere-sweater", title: "Cashmere Turtleneck", price: "$180.00", image: "https://images.unsplash.com/photo-1624378439575-d1ead6bb2d2d?q=80&w=1374&auto=format&fit=crop" },
  { id: "8", handle: "leather-tote", title: "Classic Leather Tote", price: "$210.00", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1374&auto=format&fit=crop" },
  { id: "9", handle: "tailored-blazer", title: "Tailored Wool Blazer", price: "$295.00", image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1472&auto=format&fit=crop" },
  { id: "10", handle: "pleated-skirt", title: "Midi Pleated Skirt", price: "$110.00", image: "https://images.unsplash.com/photo-1583391733958-6152b1b3fb49?q=80&w=1364&auto=format&fit=crop" },
  { id: "11", handle: "oxford-shirt", title: "Cotton Oxford Shirt", price: "$65.00", image: "https://images.unsplash.com/photo-1602810319428-019690571b5b?q=80&w=1470&auto=format&fit=crop" },
  { id: "12", handle: "straight-jeans", title: "Vintage Straight Jeans", price: "$145.00", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1374&auto=format&fit=crop" },
  { id: "13", handle: "chelsea-boots", title: "Suede Chelsea Boots", price: "$185.00", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1374&auto=format&fit=crop" },
  { id: "14", handle: "silk-scarf", title: "Printed Silk Scarf", price: "$45.00", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1415&auto=format&fit=crop" },
];

export function BestSellers() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Best Sellers</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our most loved pieces, chosen by you. Discover the styles that everyone is talking about.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {MOCK_BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/collections/best-sellers" 
            className="inline-block border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
