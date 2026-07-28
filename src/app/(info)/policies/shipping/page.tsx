import { Metadata } from "next";
import Content from "@/content/shipping-policy.mdx";

export const metadata: Metadata = {
  title: "Shipping Policy | Fashion SF",
  description: "Learn about our shipping rates and policies.",
};

export const dynamic = "force-static";

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
