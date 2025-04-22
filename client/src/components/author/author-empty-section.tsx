import { Link } from "@tanstack/react-router";

interface AuthorEmptySectionProps {}

export function AuthorEmptySection({}: AuthorEmptySectionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          No authors available
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
  );
}
