import { queryClient } from "@/api-client";
import { BookItem, BookSkeleton } from "@/components/book/book-item";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type paths } from "@/api-client/types.d";
import { Pagination } from "@/components/common/pagination";

type BookSearchType = Pick<
  NonNullable<paths["/book/"]["get"]["parameters"]["query"]>,
  "q" | "page"
>;

export const Route = createFileRoute("/_searchLayout/book")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookSearchType => {
    return {
      q: String(search.q || ""),
      page: Math.max(Number(search.page || 0), 1),
    };
  },
});

function RouteComponent() {
  const { q, page } = Route.useSearch();
  const navigate = useNavigate();
  const { data: booksData, isLoading: isLoadingBooks } = queryClient.useQuery(
    "get",
    "/book/",
    { params: { query: { q, page, limit: 10 } } }
  );

  const handlePageChange = (newPage: number) => {
    navigate({
      to: "/book",
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
          <h2 className="text-2xl font-bold">Book Collections</h2>
        )}
        <p className="text-slate-600">
          Showing {booksData?.result.length || 0} results. Page {page} out of{" "}
          {Math.max(booksData?.totalPages || 0, 1)}
        </p>
      </div>

      {isLoadingBooks ? (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      ) : booksData?.result.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              Nothing to see here...
            </h2>
            <p className="text-slate-600 mt-2">
              Start by adding your first book to the collection
            </p>
          </div>
          <Link
            to="/book/new"
            className="bg-slate-400 rounded-none hover:bg-slate-500 text-white px-6 py-3 text-lg"
            viewTransition
          >
            Add a New Book
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {booksData?.result.map((book) => (
              <BookItem key={book.id} {...book} />
            ))}
          </div>
          {booksData?.totalPages && booksData.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                totalPages={booksData.totalPages}
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
