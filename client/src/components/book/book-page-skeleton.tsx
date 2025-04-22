import { Skeleton } from "../ui/skeleton";
import { BookSkeleton } from "./book-item";

interface BookPageSkeletonProps {}

export function BookPageSkeleton({}: BookPageSkeletonProps) {
  return (
    <>
      <BookSkeleton />

      <div className="flex flex-col gap-4 justify-between">
        <Skeleton className="w-full h-64 bg-slate-300" />
        <Skeleton className="w-full h-8 bg-slate-300" />
      </div>
    </>
  );
}
