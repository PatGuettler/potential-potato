import { QueryClient, QueryFunction } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function parse(res: Response) {
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, body?.message || res.statusText);
  return body;
}

/** Calls the API and returns the parsed JSON body, throwing ApiError with the server's message on failure. */
export async function apiRequest<T = any>(method: string, url: string, data?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data !== undefined ? { "Content-Type": "application/json" } : {},
    body: data !== undefined ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  return parse(res);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: { on401: UnauthorizedBehavior }) => QueryFunction<T> =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, { credentials: "include" });
    if (on401 === "returnNull" && res.status === 401) return null;
    return parse(res);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

/** Swaps the signed-in user and drops every other cached response so nothing leaks between accounts. */
export function setSignedInUser(user: unknown) {
  queryClient.setQueryData(["/api/auth/user"], user);
  queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "/api/auth/user" });
}
