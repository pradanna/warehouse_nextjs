import clsx from "clsx";

// components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("bg-gray-200 animate-pulse rounded-md", className)} />
  );
}
