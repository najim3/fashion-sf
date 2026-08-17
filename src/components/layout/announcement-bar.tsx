"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Note: Configurable text from environment variable can be passed here
  const text = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TEXT || "Free shipping on orders over $100. Shop Now!";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-brand text-brand-foreground overflow-hidden relative"
        >
          <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm font-medium relative">
            <p>{text}</p>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
