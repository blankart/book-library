interface AuthorNotFoundProps {}

export function AuthorNotFound({}: AuthorNotFoundProps) {
  return (
    <div className="col-span-2 text-center h-[min(100dvh,500px)] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-slate-800">
        Author not found
      </h2>
      <p className="text-slate-600 mt-2">
        The author you're looking for doesn't exist
      </p>
    </div>
  );
}
