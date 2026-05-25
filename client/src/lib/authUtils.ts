import { apiRequest, queryClient } from "@/lib/queryClient";

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/logout");
  queryClient.clear();
  window.location.href = "/";
}