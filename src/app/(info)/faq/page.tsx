import { Metadata } from "next";
import Content from "@/content/faq.mdx";

export const metadata: Metadata = {
  title: "FAQ | Fashion SF",
  description: "Frequently asked questions.",
};

export const dynamic = "force-static";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
