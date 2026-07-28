import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: "men",
    title: "Men's Collection",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1287&auto=format&fit=crop",
    href: "/collections/men"
  },
  {
    id: "women",
    title: "Women's Collection",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop",
    href: "/collections/women"
  },
  {
    id: "accessories",
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
    href: "/collections/accessories"
  },
  {
    id: "new",
    title: "New Arrivals",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471&auto=format&fit=crop",
    href: "/collections/new-arrivals"
  }
];

export function FeaturedCollections() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={collection.href}
              className="group relative h-96 overflow-hidden bg-gray-100 block"
            >
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-display font-bold text-white mb-2">{collection.title}</h3>
                <span className="inline-block border-b-2 border-white text-white font-medium pb-1 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
