import type { ApiStore } from "../shared/core/api";

let counter = 0;
export const env = (store: ApiStore) => ({
  store,
  hashPassword: async (p: string) => `h:${p}`,
  verifyPassword: async (p: string, h: string) => h === `h:${p}`,
  newId: () => `id${++counter}`,
  sha256: async (t: string) => `sha:${t}`,
  randomToken: () => `tok${++counter}`,
  resetLink: (t: string) => `https://example.org/reset/${t}`,
  exposeResetLinks: true,
});

