import type { paths as Paths } from "./types";
import createFetchClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";

export const client = createFetchClient<Paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export const queryClient = createQueryClient(client);
