import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/shopify/queries/collections";

export const metadata: Metadata = {
  title: "Collections | Fashion SF",
  description: "Browse all our curated collections.",
};

export default async function CollectionsPage() {
  const collections = await getCollections({ first: 50 });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
        All Collections
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection: any) => (
          <Link 
            key={collection.id} 
            href={`/collections/${collection.handle}`}
            className="group relative aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            {collection.image ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200" />
            )}
            <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-2xl font-display font-bold tracking-wider uppercase text-center px-4 drop-shadow-md">
                {collection.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
