import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthorItem } from "@/components/author/author-item";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { queryClient } from "@/api-client";
import clsx from "clsx";
import { useEffect } from "react";
import { AuthorNotFound } from "@/components/author/author-not-found";
import { AuthorPageSkeleton } from "@/components/author/author-page-skeleton";

export const Route = createFileRoute("/author_/$id/edit")({
  component: RouteComponent,
});

type FormData = { name: string };

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const {
    data: authorData,
    isLoading: isLoadingAuthor,
    isSuccess: isLoadingAuthorSuccess,
  } = queryClient.useQuery("get", "/author/{id}", { params: { path: { id } } });

  const { mutateAsync: updateAuthor, isPending: isUpdatingAuthor } =
    queryClient.useMutation("patch", "/author/{id}");

  const form = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: authorData?.name || "",
    },
  });

  useEffect(() => {
    if (!isLoadingAuthorSuccess) return;
    form.reset({
      name: authorData?.name || "",
    });
  }, [isLoadingAuthorSuccess, authorData]);

  const onSubmit = async (data: FormData) => {
    await updateAuthor({
      params: { path: { id } },
      body: { name: data.name },
    });
    navigate({ to: "/author/$id", params: { id } });
  };

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <section className="w-[min(100%,800px)] gap-10 mx-auto grid grid-cols-2 p-4">
        <div className="col-span-2">
          <Link
            to="/author/$id"
            params={{ id }}
            className="text-xl font-bold flex gap-4 items-center"
            viewTransition
          >
            <ArrowLeft />
            Back to Author
          </Link>
        </div>

        {isLoadingAuthor ? (
          <AuthorPageSkeleton />
        ) : authorData ? (
          <>
            <AuthorItem
              id={authorData.id}
              name={form.watch("name") || authorData.name}
              booksCount={authorData.booksCount}
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={clsx(
                  "flex flex-col justify-between",
                  form.formState.isSubmitting && "pointer-events-none"
                )}
              >
                <div className="flex flex-col gap-4">
                  <h1 className="font-bold text-3xl">Edit Author</h1>
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{
                      required: {
                        value: true,
                        message: "Author name is required.",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white p-6 shadow-lg shadow-slate-300 placeholder:text-slate-400 !text-lg placeholder:text-lg !rounded-none w-[min(500px,100%)]"
                            placeholder="Author Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  disabled={isUpdatingAuthor}
                  size="lg"
                  className="rounded-none cursor-pointer"
                >
                  Save Changes
                  {isUpdatingAuthor && <Loader className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <AuthorNotFound />
        )}
      </section>
    </main>
  );
}
