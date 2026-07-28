"use client";

import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      title="Product Not Found"
      message="We couldn't load the details for this product. It may have been removed or is currently unavailable."
    />
  );
}
