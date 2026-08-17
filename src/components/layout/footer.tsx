"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-muted border-t border-border pt-12 sm:pt-16 pb-10 sm:pb-12 text-foreground">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="font-display font-bold text-2xl tracking-tighter inline-block text-foreground hover:opacity-80 transition-opacity"
            >
              FASHION SF
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Discover the latest trends in modern apparel, footwear, and accessories. Dedicated to premium quality and contemporary fashion aesthetics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories Accordion / Column */}
          <div className="sm:col-span-1 lg:col-span-2 border-b border-border/60 sm:border-none pb-4 sm:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("categories")}
              className="w-full flex items-center justify-between sm:cursor-default font-display font-bold text-sm uppercase tracking-wider py-2 sm:py-0 sm:mb-4 text-foreground text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              aria-expanded={!!openSections["categories"]}
              aria-controls="footer-categories"
            >
              <span>Shop Categories</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200 sm:hidden",
                  openSections["categories"] && "rotate-180"
                )}
              />
            </button>
            <ul
              id="footer-categories"
              className={cn(
                "space-y-2.5 text-sm text-muted-foreground pt-2 sm:pt-0 transition-all duration-200",
                openSections["categories"] ? "block" : "hidden sm:block"
              )}
            >
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/men" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Men's Apparel
                </Link>
              </li>
              <li>
                <Link href="/collections/women" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Women's Apparel
                </Link>
              </li>
              <li>
                <Link href="/collections/accessories" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Accordion / Column */}
          <div className="sm:col-span-1 lg:col-span-2 border-b border-border/60 sm:border-none pb-4 sm:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("support")}
              className="w-full flex items-center justify-between sm:cursor-default font-display font-bold text-sm uppercase tracking-wider py-2 sm:py-0 sm:mb-4 text-foreground text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              aria-expanded={!!openSections["support"]}
              aria-controls="footer-support"
            >
              <span>Customer Support</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200 sm:hidden",
                  openSections["support"] && "rotate-180"
                )}
              />
            </button>
            <ul
              id="footer-support"
              className={cn(
                "space-y-2.5 text-sm text-muted-foreground pt-2 sm:pt-0 transition-all duration-200",
                openSections["support"] ? "block" : "hidden sm:block"
              )}
            >
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-foreground transition-colors inline-block py-1 sm:py-0">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 pt-2 sm:pt-0">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Stay Connected
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Subscribe for exclusive drops, early sale access, and styling tips.
            </p>
            {subscribed ? (
              <div className="bg-brand/10 border border-brand/20 text-brand p-3.5 rounded-md text-xs font-medium text-center max-w-md">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 min-h-[44px] border border-border rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-background text-foreground placeholder:text-muted-foreground/70"
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="shrink-0 min-h-[44px] bg-brand text-brand-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm flex items-center justify-center"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Fashion SF. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/policies/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/policies/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Accepted Payment Methods */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/80">Secure Checkout</span>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 font-bold text-[10px] tracking-tight">
              <span className="px-2 py-1 bg-background border border-border rounded">VISA</span>
              <span className="px-2 py-1 bg-background border border-border rounded">MC</span>
              <span className="px-2 py-1 bg-background border border-border rounded">AMEX</span>
              <span className="px-2 py-1 bg-background border border-border rounded">PAYPAL</span>
              <span className="px-2 py-1 bg-background border border-border rounded">APPLE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  );
}

function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}

