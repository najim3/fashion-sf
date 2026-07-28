import { Metadata } from "next";
import Content from "@/content/privacy-policy.mdx";

export const metadata: Metadata = {
  title: "Privacy Policy | Fashion SF",
  description: "Learn how we handle your personal information.",
};

export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Content />
    </div>
  );
}
