import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

interface BookItemProps {
  id: string;
  title: string;
  author: {
    name: string;
  };
}

export function BookItem({ id, title, author }: BookItemProps) {
  return (
    <Link
      to="/book/$id"
      params={{ id }}
      className="w-full h-full bg-white shadow-lg shadow-slate-300 p-4 block hover:shadow-xl transition-shadow"
      viewTransition
    >
      <img
        src={"https://picsum.photos/200/300?random=" + id}
        className="w-full aspect-[3/4] bg-slate-200"
      />
      <p className="font-semibold mt-2">{title}</p>
      <p className="text-slate-600">{author.name}</p>
    </Link>
  );
}

export function BookSkeleton() {
  return (
    <Skeleton
      className="w-full h-full bg-slate-300"
      data-testid="book-skeleton"
    >
      <div className="w-full aspect-[3/4]" />
      <div className="font-semibold mt-2 opacity-0">Loading...</div>
      <div className="text-slate-600 opacity-0">Loading...</div>
    </Skeleton>
  );
}
