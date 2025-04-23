import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookItem, BookSkeleton } from "./book-item";

describe("BookItem", () => {
  const mockProps = {
    id: "123",
    title: "Test Book",
    author: {
      name: "Test Author",
    },
  };

  it("renders book item with correct props", () => {
    render(<BookItem {...mockProps} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("123")
    );
  });

  it("renders correct link to book page", () => {
    render(<BookItem {...mockProps} />);

    const link = screen.getByText("Test Book").closest("a");
    expect(link).toHaveAttribute("href", "/book/123");
  });

  it("renders book skeleton", () => {
    render(<BookSkeleton />);

    const skeleton = screen.getByTestId("book-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("bg-slate-300");

    // Check if skeleton has the correct structure
    expect(
      skeleton.querySelector(".w-full.aspect-\\[3\\/4\\]")
    ).toBeInTheDocument();
    expect(skeleton.querySelector(".font-semibold")).toBeInTheDocument();
    expect(skeleton.querySelector(".text-slate-600")).toBeInTheDocument();
  });
});
