"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { name: "New Arrivals", href: "/collections/new-arrivals" },
  { name: "Men", href: "/collections/men" },
  { name: "Women", href: "/collections/women" },
  { name: "Accessories", href: "/collections/accessories" },
];

export function MegaMenu() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <nav className="h-full flex items-center" onMouseLeave={() => setActiveItem(null)}>
      <ul className="flex items-center gap-6">
        {MENU_ITEMS.map((item) => (
          <li key={item.name} className="h-full">
            <Link 
              href={item.href}
              className="text-sm font-medium hover:text-gray-600 py-6 text-gray-900"
              onMouseEnter={() => setActiveItem(item.name)}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white border-b shadow-lg"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold mb-4">{activeItem} Categories</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="#" className="hover:text-black">Clothing</Link></li>
                    <li><Link href="#" className="hover:text-black">Shoes</Link></li>
                    <li><Link href="#" className="hover:text-black">Accessories</Link></li>
                    <li><Link href="#" className="hover:text-black">Sale</Link></li>
                  </ul>
                </div>
                <div className="col-span-3 bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                  <span className="text-gray-400">Featured items for {activeItem} will go here</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
