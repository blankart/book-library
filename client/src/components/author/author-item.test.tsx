import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthorItem, AuthorSkeleton } from "./author-item";

describe("AuthorItem", () => {
  const mockProps = {
    id: "123",
    name: "Test Author",
    booksCount: 5,
  };

  it("renders author item with correct props", () => {
    render(<AuthorItem {...mockProps} />);

    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("Published 5 books")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("123")
    );
  });

  it("renders singular form for one book", () => {
    render(<AuthorItem {...mockProps} booksCount={1} />);

    expect(screen.getByText("Published 1 book")).toBeInTheDocument();
  });

  it("renders author skeleton", () => {
    render(<AuthorSkeleton />);

    const skeleton = screen.getByTestId("author-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("bg-slate-300");

    // Check if skeleton has the correct structure
    expect(
      skeleton.querySelector(".w-full.aspect-square.rounded-full")
    ).toBeInTheDocument();
    expect(skeleton.querySelector(".font-semibold")).toBeInTheDocument();
    expect(skeleton.querySelector(".text-slate-600")).toBeInTheDocument();
  });
});
