import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import { type paths } from "@/api-client/types.d";
import { useDebounceCallback } from "@/hooks/use-debounced-callback";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchType = Pick<
  NonNullable<paths["/book/"]["get"]["parameters"]["query"]>,
  "q"
>;

export const Route = createFileRoute("/_searchLayout")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchType => ({
    ...(String(search.q || "") && { q: String(search.q || "") }),
  }),
});

function RouteComponent() {
  const { q } = Route.useSearch();
  const [searchBy, setSearchBy] = useState<"author" | "book">("book");
  const navigate = useNavigate();

  const handleSearch = useDebounceCallback(
    useCallback(
      (value: string) => {
        if (!value) return navigate({ to: "/" });

        navigate({
          to: searchBy === "author" ? "/author" : "/book",
          search: { q: value },
        });
      },
      [navigate, searchBy]
    ),
    400
  );

  return (
    <main>
      <section className="mt-20">
        <Link to="/" viewTransition>
          <h1 className="mx-auto text-center container text-5xl mb-5 font-bold text-slate-800">
            Book Library
          </h1>
        </Link>
      </section>

      <section className="container mx-auto flex justify-center gap-2 items-center py-4">
        <Input
          defaultValue={q}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="bg-white p-6 shadow-lg shadow-slate-300 placeholder:text-slate-400 !text-lg placeholder:text-lg !rounded-none w-[min(500px,100%)]"
          placeholder="Search for books, authors..."
        />
        <Select
          defaultValue="book"
          value={searchBy}
          onValueChange={(s) => {
            setSearchBy(s as any);
          }}
        >
          <SelectTrigger className="bg-white p-6 shadow-lg shadow-slate-300 text-lg !rounded-none w-[min(200px,100%)] [&[data-placeholder]]:text-slate-400">
            <SelectValue className="text-amber-100" placeholder="Search by" />
          </SelectTrigger>
          <SelectContent className="!rounded-none">
            <SelectGroup>
              <SelectLabel>Search for</SelectLabel>
              <SelectItem className="text-slate-600" value="author">
                Author
              </SelectItem>
              <SelectItem className="text-slate-600" value="book">
                Book
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      <div className="container mx-auto gap-2 flex items-center justify-end">
        <Link to="/book/new" viewTransition>
          <Button variant="outline" className="cursor-pointer rounded-none">
            New Book
            <Plus />
          </Button>
        </Link>

        <Link to="/author/new" viewTransition>
          <Button className="cursor-pointer rounded-none">
            New Author
            <Plus />
          </Button>
        </Link>
      </div>

      <Outlet />
    </main>
  );
}
