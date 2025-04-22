import { BookItem } from "@/components/book/book-item";
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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronsUpDown, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { queryClient } from "@/api-client";
import { useCallback, useState } from "react";
import { useDebounceCallback } from "@/hooks/use-debounced-callback";
import clsx from "clsx";

export const Route = createFileRoute("/book/new")({
  component: RouteComponent,
});

type FormData = { title: string; authorId: string; author: string };

function RouteComponent() {
  const form = useForm<FormData>({ mode: "onBlur" });
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { data: authorsData, isLoading: isAuthorsLoading } =
    queryClient.useQuery("get", "/author/", {
      params: { query: { q } },
    });

  const [authorOptionsOpen, setAuthorOptionsOpen] = useState(false);

  const { mutateAsync: createAuthor, isPending: isCreatingAuthor } =
    queryClient.useMutation("post", "/author/");

  const { mutateAsync: createBook, isPending: isCreatingBook } =
    queryClient.useMutation("post", "/book/");

  const handleAuthorInputChange = useDebounceCallback(
    useCallback((input) => setQ(input), []),
    400
  );

  const onSubmit = async (data: FormData) => {
    const newBook = await createBook({
      body: { authorId: data.authorId, title: data.title },
    });
    navigate({ to: "/book/$id", params: { id: newBook.id } });
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
          <BookItem
            author={{ name: form.watch("author") || "<NO AUTHOR>" }}
            id="new-book-id"
            title={form.watch("title") || "<NO TITLE>"}
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
            <div className="flex flex-col gap-4 mb-10">
              <h1 className="font-bold text-3xl">Add Book</h1>
              <FormField
                control={form.control}
                name="title"
                rules={{
                  required: { value: true, message: "Book title is required." },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Title</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-white p-6 shadow-lg shadow-slate-300 placeholder:text-slate-400 !text-lg placeholder:text-lg !rounded-none"
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
                                {!!q && (
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
                                )}
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
              disabled={isCreatingBook}
              size="lg"
              className="rounded-none cursor-pointer"
            >
              Create
              {isCreatingBook && <Loader className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
