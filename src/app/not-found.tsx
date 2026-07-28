import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-8xl font-display font-bold text-gray-900 tracking-tighter">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">Page not found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been removed or is temporarily unavailable.
      </p>
      
      {/* TODO: Add search link and popular collections once implemented */}
      
      <div className="mt-8">
        <Link 
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-black px-8 text-sm font-medium text-white hover:bg-black/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
