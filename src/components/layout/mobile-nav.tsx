"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: "New Arrivals", href: "/collections/new-arrivals" },
  { name: "Men", href: "/collections/men" },
  { name: "Women", href: "/collections/women" },
  { name: "Accessories", href: "/collections/accessories" },
  { name: "Account", href: "/account" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand/50 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-background z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-display font-bold text-xl tracking-tighter">Menu</span>
              <button onClick={onClose} className="p-2 -mr-2 text-foreground">
                <X className="w-5 h-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 text-lg font-medium hover:bg-muted border-b border-border text-foreground"
                  >
                    {item.name}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
