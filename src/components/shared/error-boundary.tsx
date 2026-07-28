"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export function ErrorBoundary({ 
  error, 
  reset, 
  title = "Something went wrong", 
  message = "We encountered an unexpected error while trying to load this page." 
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
        <AlertTriangle className="w-10 h-10" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
        {title}
      </h1>
      
      <p className="text-gray-600 max-w-md mb-8">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 bg-gray-100 text-gray-900 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
