import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { queryClient } from "@/api-client";
import { Button } from "@/components/ui/button";
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
import { BookItem } from "@/components/book/book-item";
import { BookNotFound } from "@/components/book/book-not-found";
import { BookPageSkeleton } from "@/components/book/book-page-skeleton";

export const Route = createFileRoute("/book/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: bookData, isLoading: isLoadingBook } = queryClient.useQuery(
    "get",
    "/book/{id}",
    { params: { path: { id } } }
  );

  const { mutateAsync: deleteBook, isPending: isDeletingBook } =
    queryClient.useMutation("delete", "/book/{id}");

  const handleDelete = async () => {
    await deleteBook({ params: { path: { id } } });
    navigate({ to: "/" });
  };

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <section className="w-[min(100%,800px)] gap-10 mx-auto grid grid-cols-1 sm:grid-cols-2 p-4">
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

        {isLoadingBook ? (
          <BookPageSkeleton />
        ) : bookData ? (
          <>
            <BookItem {...bookData} />

            <div className="flex flex-col gap-4 justify-between">
              <div className="bg-white p-6 shadow-lg shadow-slate-300">
                <h2 className="text-xl font-semibold mb-2">Book Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Title:</span> {bookData.title}
                  </p>
                  <p>
                    <span className="font-medium">Author:</span>{" "}
                    <Link
                      to="/author/$id"
                      params={{ id: bookData.authorId }}
                      className="text-slate-600 hover:text-slate-800"
                      viewTransition
                    >
                      {bookData.author.name}
                    </Link>
                  </p>
                  <p>
                    <span className="font-medium">Added:</span>{" "}
                    {new Date(bookData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/book/$id/edit"
                  params={{ id: bookData.id }}
                  className="flex-1"
                  viewTransition
                >
                  <Button className="w-full rounded-none">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Book
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-none"
                      disabled={isDeletingBook}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Book
                      {isDeletingBook && <span className="ml-2">...</span>}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the book "{bookData.title}" from the library.
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
          </>
        ) : (
          <BookNotFound />
        )}
      </section>
    </main>
  );
}
