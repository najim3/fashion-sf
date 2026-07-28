"use client";

import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import { Toaster } from "@/components/shared/toast";
import { ReactNode } from "react";

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || "2024-04";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ShopifyProvider
      storeDomain={`http://${storeDomain}`}
      storefrontToken={storefrontToken}
      storefrontApiVersion={apiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </ShopifyProvider>
  );
}
