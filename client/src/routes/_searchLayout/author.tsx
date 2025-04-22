import type { paths } from "@/api-client/types";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthorItem, AuthorSkeleton } from "@/components/author/author-item";
import { queryClient } from "@/api-client";
import { Pagination } from "@/components/common/pagination";

type AuthorSearchType = Pick<
  NonNullable<paths["/book/"]["get"]["parameters"]["query"]>,
  "q" | "page"
>;

export const Route = createFileRoute("/_searchLayout/author")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): AuthorSearchType => {
    return {
      q: String(search.q || ""),
      page: Math.max(Number(search.page || 0), 1),
    };
  },
});

function RouteComponent() {
  const { q, page } = Route.useSearch();
  const navigate = useNavigate();
  const { data: authorsData, isLoading: isLoadingAuthors } =
    queryClient.useQuery("get", "/author/", {
      params: { query: { q, page, limit: 10 } },
    });

  const handlePageChange = (newPage: number) => {
    navigate({
      to: "/author",
      search: { q, page: newPage },
    });
  };

  return (
    <section className="container mx-auto my-10">
      <div className="mb-4">
        {q ? (
          <h2 className="text-lg">
            Search Result for: <b>"{q}"</b>
          </h2>
        ) : (
          <h2 className="text-2xl font-bold">Authors</h2>
        )}
        <p className="text-slate-600">
          Showing {authorsData?.result.length || 0} results. Page {page} out of{" "}
          {Math.max(authorsData?.totalPages || 0, 1)}
        </p>
      </div>

      {isLoadingAuthors ? (
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <AuthorSkeleton key={i} />
          ))}
        </div>
      ) : authorsData?.result.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              No authors found...
            </h2>
            <p className="text-slate-600 mt-2">
              Start by adding your first author to the collection
            </p>
          </div>
          <Link
            to="/author/new"
            className="bg-slate-400 rounded-none hover:bg-slate-500 text-white px-6 py-3 text-lg"
            viewTransition
          >
            Add a New Author
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-4">
            {authorsData?.result.map((author) => (
              <AuthorItem key={author.id} {...author} />
            ))}
          </div>
          {authorsData?.totalPages && authorsData.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                totalPages={authorsData.totalPages}
                handlePageChange={handlePageChange}
                page={page}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
