import { Skeleton } from "../ui/skeleton";
import { AuthorSkeleton } from "./author-item";

interface AuthorPageSkeletonProps {}

export function AuthorPageSkeleton({}: AuthorPageSkeletonProps) {
  return (
    <>
      <AuthorSkeleton />
      <div className="flex flex-col gap-4 justify-between">
        <Skeleton className="w-full h-64 bg-slate-300" />
        <Skeleton className="w-full h-8 bg-slate-300" />
      </div>
    </>
  );
}
