import Link from "next/link";
import { ProductCard, Product } from "@/components/product/product-card";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Best Sellers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our most loved pieces, chosen by you. Discover the styles that everyone is talking about.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/collections/best-sellers" 
            className="inline-block border-2 border-foreground text-foreground hover:bg-brand hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
