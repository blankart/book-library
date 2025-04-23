import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  const mockHandlePageChange = vi.fn();

  beforeEach(() => {
    mockHandlePageChange.mockClear();
  });

  it("renders pagination with correct number of pages", () => {
    render(
      <Pagination
        totalPages={5}
        page={1}
        handlePageChange={mockHandlePageChange}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders ellipsis when there are many pages", () => {
    render(
      <Pagination
        totalPages={10}
        page={5}
        handlePageChange={mockHandlePageChange}
      />
    );

    const ellipsis = screen.getAllByText("More pages");
    expect(ellipsis).toHaveLength(2);
  });

  it("calls handlePageChange when clicking on a page number", () => {
    render(
      <Pagination
        totalPages={5}
        page={1}
        handlePageChange={mockHandlePageChange}
      />
    );

    fireEvent.click(screen.getByText("2"));
    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  it("marks current page as active", () => {
    render(
      <Pagination
        totalPages={5}
        page={3}
        handlePageChange={mockHandlePageChange}
      />
    );

    const activePage = screen.getByText("3");
    expect(activePage).toHaveAttribute("data-active", "true");
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        totalPages={5}
        page={1}
        handlePageChange={mockHandlePageChange}
      />
    );

    const prevButton = screen.getByText("Previous").closest("a");
    expect(prevButton).toHaveClass("pointer-events-none");
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        totalPages={5}
        page={5}
        handlePageChange={mockHandlePageChange}
      />
    );

    const nextButton = screen.getByText("Next").closest("a");
    expect(nextButton).toHaveClass("pointer-events-none");
  });

  it("handles single page correctly", () => {
    render(
      <Pagination
        totalPages={1}
        page={1}
        handlePageChange={mockHandlePageChange}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });
});
