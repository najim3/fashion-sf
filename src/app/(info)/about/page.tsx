import { Metadata } from "next";
import Content from "@/content/about.mdx";

export const metadata: Metadata = {
  title: "About Us | Fashion SF",
  description: "Learn more about our mission and values.",
};

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
