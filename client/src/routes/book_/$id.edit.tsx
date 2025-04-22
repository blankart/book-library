import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, ChevronsUpDown, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { queryClient } from "@/api-client";
import { useCallback, useEffect, useState } from "react";
import { useDebounceCallback } from "@/hooks/use-debounced-callback";
import { BookItem } from "@/components/book/book-item";
import clsx from "clsx";
import { BookNotFound } from "@/components/book/book-not-found";
import { BookPageSkeleton } from "@/components/book/book-page-skeleton";

export const Route = createFileRoute("/book_/$id/edit")({
  component: RouteComponent,
});

type FormData = {
  title: string;
  authorId: string;
  author: string;
};

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [authorOptionsOpen, setAuthorOptionsOpen] = useState(false);

  const {
    data: bookData,
    isLoading: isLoadingBook,
    isSuccess: isLoadingBookSuccess,
  } = queryClient.useQuery("get", "/book/{id}", { params: { path: { id } } });

  const { data: authorsData, isLoading: isAuthorsLoading } =
    queryClient.useQuery("get", "/author/", { params: { query: { q } } });

  const { mutateAsync: updateBook, isPending: isUpdatingBook } =
    queryClient.useMutation("patch", "/book/{id}");

  const { mutateAsync: createAuthor, isPending: isCreatingAuthor } =
    queryClient.useMutation("post", "/author/");

  const handleAuthorInputChange = useDebounceCallback(
    useCallback((input) => setQ(input), []),
    400
  );

  const form = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      title: bookData?.title || "",
      authorId: bookData?.authorId || "",
      author: bookData?.author.name || "",
    },
  });

  useEffect(() => {
    if (!isLoadingBookSuccess) return;
    form.reset({
      title: bookData?.title || "",
      authorId: bookData?.authorId || "",
      author: bookData?.author.name || "",
    });
  }, [isLoadingBookSuccess, bookData]);

  const onSubmit = async (data: FormData) => {
    await updateBook({
      params: { path: { id } },
      body: { title: data.title, authorId: data.authorId },
    });
    navigate({ to: "/book/$id", params: { id } });
  };

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <section className="w-[min(100%,800px)] gap-10 mx-auto grid grid-cols-2 p-4">
        <div className="col-span-2">
          <Link
            to="/book/$id"
            params={{ id }}
            className="text-xl font-bold flex gap-4 items-center"
            viewTransition
          >
            <ArrowLeft />
            Back to Book
          </Link>
        </div>

        {isLoadingBook ? (
          <BookPageSkeleton />
        ) : bookData ? (
          <>
            <BookItem
              id={bookData.id}
              title={form.watch("title") || bookData.title}
              author={{ name: form.watch("author") || bookData.author.name }}
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
                  <h1 className="font-bold text-3xl">Edit Book</h1>
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{
                      required: {
                        value: true,
                        message: "Book title is required.",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white p-6 shadow-lg shadow-slate-300 placeholder:text-slate-400 !text-lg placeholder:text-lg !rounded-none w-[min(500px,100%)]"
                            placeholder="Book Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authorId"
                    rules={{
                      required: {
                        value: true,
                        message: "Book author is required.",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Author</FormLabel>
                        <Popover
                          open={authorOptionsOpen}
                          onOpenChange={setAuthorOptionsOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full rounded-none bg-white p-6 shadow-lg shadow-slate-300 !text-lg !pl-6 justify-between",
                                  !field.value && "!text-slate-400"
                                )}
                              >
                                {field.value
                                  ? form.watch("author") || "Select author"
                                  : "Select author"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command shouldFilter={false}>
                              <CommandInput
                                onValueChange={(v) => {
                                  handleAuthorInputChange(v);
                                }}
                                placeholder="Search author..."
                                className="h-9"
                              />
                              <CommandList>
                                {isAuthorsLoading ? (
                                  <CommandEmpty>Loading...</CommandEmpty>
                                ) : (
                                  <CommandEmpty className="flex text-sm flex-col items-center p-2">
                                    No author found.{" "}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="!cursor-pointer text-blue-600"
                                      disabled={isCreatingAuthor}
                                      onClick={async () => {
                                        const data = await createAuthor({
                                          body: { name: q },
                                        });

                                        form.setValue("author", data.name);
                                        form.setValue("authorId", data.id);
                                        setAuthorOptionsOpen(false);
                                        setQ("");
                                      }}
                                    >
                                      Create{" "}
                                      {isCreatingAuthor && (
                                        <Loader className="animate-spin" />
                                      )}
                                    </Button>
                                  </CommandEmpty>
                                )}
                                <CommandGroup>
                                  {authorsData?.result.map((author) => (
                                    <CommandItem
                                      value={author.id}
                                      key={author.id}
                                      onSelect={() => {
                                        form.setValue("authorId", author.id);
                                        form.setValue("author", author.name);
                                        setAuthorOptionsOpen(false);
                                      }}
                                    >
                                      {author.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          author.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  disabled={isUpdatingBook}
                  size="lg"
                  className="rounded-none cursor-pointer"
                >
                  Save Changes
                  {isUpdatingBook && <Loader className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <BookNotFound />
        )}
      </section>
    </main>
  );
}
