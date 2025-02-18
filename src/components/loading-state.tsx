import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  title?: string
  skeletonCount?: number
  skeletonHeight?: number
}

export function LoadingState({
  title = "Memuat data...",
  skeletonCount = 3,
  skeletonHeight = 24
}: LoadingStateProps) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        <div className="text-lg text-gray-500">{title}</div>
        <div className="w-full max-w-3xl space-y-4">
          {[...Array(skeletonCount)].map((_, i) => (
            <Skeleton key={i} className={`w-full h-${skeletonHeight}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
