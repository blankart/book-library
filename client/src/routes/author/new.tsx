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

export const Route = createFileRoute("/author/new")({
  component: RouteComponent,
});

type FormData = { name: string };

function RouteComponent() {
  const form = useForm<FormData>({ mode: "onBlur" });
  const navigate = useNavigate();

  const { mutateAsync: createAuthor, isPending: isCreatingAuthor } =
    queryClient.useMutation("post", "/author/");

  const onSubmit = async (data: FormData) => {
    const newAuthor = await createAuthor({
      body: { name: data.name },
    });
    navigate({ to: "/author/$id", params: { id: newAuthor.id } });
  };

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <section className="w-[min(100%,800px)] gap-10 mx-auto grid grid-cols-1 sm:grid-cols-2 p-4">
        <div className="col-span-1 sm:col-span-2">
          <Link
            to="/"
            className="text-xl font-bold flex gap-4 items-center"
            viewTransition
          >
            <ArrowLeft />
            Back to Home
          </Link>
        </div>
        <div>
          <AuthorItem
            id="new-author-id"
            name={form.watch("name") || "<NO NAME>"}
            booksCount={0}
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={clsx(
              "flex flex-col justify-between",
              form.formState.isSubmitting && "pointer-events-none"
            )}
          >
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-3xl">Add Author</h1>
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
              disabled={isCreatingAuthor}
              size="lg"
              className="rounded-none cursor-pointer"
            >
              Create
              {isCreatingAuthor && <Loader className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
