import { queryClient } from "@/api-client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookItem, BookSkeleton } from "@/components/book/book-item";
import { AuthorItem, AuthorSkeleton } from "@/components/author/author-item";
import { BookEmptySection } from "@/components/book/book-empty-section";
import { AuthorEmptySection } from "@/components/author/author-empty-section";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_searchLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: booksData, isLoading: isLoadingBooks } = queryClient.useQuery(
    "get",
    "/book/",
    { params: { query: { limit: 10 } } }
  );
  const { data: authorsData, isLoading: isLoadingAuthors } =
    queryClient.useQuery("get", "/author/", {
      params: { query: { limit: 6 } },
    });

  return (
    <>
      <section className="container p-4 mx-auto my-10">
        <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
        {isLoadingBooks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        ) : booksData?.result.length === 0 ? (
          <BookEmptySection />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {booksData?.result.map((book) => (
                <BookItem key={book.id} {...book} />
              ))}
            </div>

            {(booksData?.totalPages || 0) > 1 && (
              <div className="flex justify-end w-full">
                <Link to="/book" className="flex items-center gap-2 p-4">
                  Explore More Books <ArrowRight />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="container p-4 mx-auto my-10">
        <h2 className="text-2xl font-bold mb-4">Featured Authors</h2>
        {isLoadingAuthors ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <AuthorSkeleton key={i} />
            ))}
          </div>
        ) : authorsData?.result.length === 0 ? (
          <AuthorEmptySection />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {authorsData?.result.map((author) => (
                <AuthorItem key={author.id} {...author} />
              ))}
            </div>

            {(authorsData?.totalPages || 0) > 1 && (
              <div className="flex justify-end w-full">
                <Link to="/author" className="flex items-center gap-2 p-4">
                  Explore More Authors <ArrowRight />
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
