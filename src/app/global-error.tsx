"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Something went wrong!</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            A critical error occurred. We have been notified. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-8 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
