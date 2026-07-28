import { Metadata } from "next";
import Content from "@/content/terms.mdx";

export const metadata: Metadata = {
  title: "Terms of Service | Fashion SF",
  description: "Read our terms of service.",
};

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
