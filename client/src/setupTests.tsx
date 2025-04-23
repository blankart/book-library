import { type LinkProps } from "@tanstack/react-router";
import "@testing-library/jest-dom";
import { afterAll, beforeAll } from "vitest";
import { vi } from "vitest";

beforeAll(() => {
  vi.mock("@tanstack/react-router", () => ({
    Link: ({ to, params, viewTransition, ...props }: LinkProps) => (
      <a
        href={
          to
            ? Object.keys(params || {}).reduce(
                (prev, curr) => prev.replace(`$${curr}`, (params as any)[curr]),
                to
              )
            : undefined
        }
        {...(props as any)}
      ></a>
    ),
  }));
});

afterAll(() => {
  vi.resetAllMocks();
});
