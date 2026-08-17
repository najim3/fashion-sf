"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background image placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Hero"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-6"
        >
          Elevate Your Style
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl"
        >
          Discover our new Spring/Summer collection. Premium materials, modern cuts, and timeless elegance for the contemporary wardrobe.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            href="/collections/new-arrivals" 
            className="bg-background text-foreground hover:bg-muted px-8 py-4 rounded-full font-medium transition-colors text-center"
          >
            Shop New Arrivals
          </Link>
          <Link 
            href="/collections/all" 
            className="bg-transparent border border-white text-white hover:bg-background/10 px-8 py-4 rounded-full font-medium transition-colors text-center"
          >
            View All Collections
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
