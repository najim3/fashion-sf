export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface SEOProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: string;
  secondaryImage?: string;
  price?: { amount: string; currencyCode: string } | null;
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  availableForSale?: boolean;
  vendor?: string;
}

export function generateProductJsonLd(product: SEOProduct) {
  const images = [product.image, product.secondaryImage].filter(Boolean);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images,
    offers: {
      "@type": "Offer",
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: product.price?.amount,
      priceCurrency: product.price?.currencyCode,
    },
    ...(product.vendor && { brand: { "@type": "Brand", name: product.vendor } }),
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fashion SF",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`, // Placeholder logo URL
    sameAs: [
      "https://www.instagram.com/fashionsf",
      "https://www.twitter.com/fashionsf",
    ],
  };
}

export function generateCollectionJsonLd(collection: { title: string; description?: string; handle: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description || `Browse the ${collection.title} collection at Fashion SF.`,
    url: `${siteUrl}/collections/${collection.handle}`,
  };
}
