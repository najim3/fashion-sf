import { Metadata } from "next";
import Content from "@/content/return-policy.mdx";

export const metadata: Metadata = {
  title: "Return Policy | Fashion SF",
  description: "Learn about our return and refund policies.",
};

export const dynamic = "force-static";

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
