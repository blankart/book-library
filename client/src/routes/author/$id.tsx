import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { queryClient } from "@/api-client";
import { Button } from "@/components/ui/button";
import { AuthorItem } from "@/components/author/author-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AuthorNotFound } from "@/components/author/author-not-found";
import { AuthorPageSkeleton } from "@/components/author/author-page-skeleton";
import { BookItem } from "@/components/book/book-item";

export const Route = createFileRoute("/author/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: authorData, isLoading: isLoadingAuthor } = queryClient.useQuery(
    "get",
    "/author/{id}",
    { params: { path: { id } } }
  );

  const { mutateAsync: deleteAuthor, isPending: isDeletingAuthor } =
    queryClient.useMutation("delete", "/author/{id}");

  const { data: booksData, isLoading: isLoadingBooks } = queryClient.useQuery(
    "get",
    "/book/",
    { params: { query: { authorId: id } } }
  );

  const handleDelete = async () => {
    await deleteAuthor({ params: { path: { id } } });
    navigate({ to: "/" });
  };

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <section className="@container w-[min(100%,800px)] gap-10 mx-auto grid grid-cols-1 sm:grid-cols-2 p-4">
        <div className="col-span-1 sm:col-span-2 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold flex gap-4 items-center"
            viewTransition
          >
            <ArrowLeft />
            Back to Home
          </Link>
        </div>

        {isLoadingAuthor ? (
          <AuthorPageSkeleton />
        ) : authorData ? (
          <>
            <div className="flex flex-col items-center gap-4">
              <AuthorItem {...authorData} />
            </div>

            <div className="flex flex-col gap-4 justify-between">
              <div className="bg-white p-6 shadow-lg shadow-slate-300">
                <h2 className="text-xl font-semibold mb-2">Author Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {authorData.name}
                  </p>
                  <p>
                    <span className="font-medium">Added:</span>{" "}
                    {new Date(authorData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/author/$id/edit"
                  params={{ id: authorData.id }}
                  className="flex-1"
                  viewTransition
                >
                  <Button className="w-full rounded-none">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Author
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-none"
                      disabled={isDeletingAuthor}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Author
                      {isDeletingAuthor && <span className="ml-2">...</span>}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the author "{authorData.name}" and all their
                        books from the library.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {!!booksData?.result?.length && (
              <>
                <h2 className="text-xl font-bold">Published Books</h2>
                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 @lg:grid-cols-2 @xl:grid-cols-3 gap-4">
                  {booksData?.result.map((book) => (
                    <BookItem key={book.id} {...book} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <AuthorNotFound />
        )}
      </section>
    </main>
  );
}
