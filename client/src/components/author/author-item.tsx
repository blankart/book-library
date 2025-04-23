import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorItemProps {
  id: string;
  name: string;
  booksCount: number;
}

export function AuthorItem({ id, name, booksCount }: AuthorItemProps) {
  return (
    <Link
      to="/author/$id"
      params={{ id }}
      className="w-full h-full bg-white shadow-lg shadow-slate-300 p-4 block hover:shadow-xl transition-shadow"
      viewTransition
    >
      <img
        src={"https://picsum.photos/200?random=" + id}
        className="w-full aspect-square bg-slate-200 rounded-full"
      />
      <p className="font-semibold mt-2 text-center">{name}</p>
      <p className="text-slate-600 text-center">
        Published {booksCount} book{booksCount === 1 ? null : "s"}
      </p>
    </Link>
  );
}

export function AuthorSkeleton() {
  return (
    <Skeleton
      className="w-full h-full bg-slate-300"
      data-testid="author-skeleton"
    >
      <div className="w-full aspect-square rounded-full" />
      <div className="font-semibold mt-2 opacity-0 text-center">Loading...</div>
      <div className="text-slate-600 opacity-0 text-center">Loading...</div>
    </Skeleton>
  );
}
