import path from "path";

/** Root for data files (lessons CSV, progress). Override in tests via STEMGENIUS_DATA_DIR. */
export function getDataDir(): string {
  return process.env.STEMGENIUS_DATA_DIR ?? process.cwd();
}

/** Path to users.json. Override in tests via STEMGENIUS_USERS_FILE. */
export function getUsersFilePath(): string {
  return process.env.STEMGENIUS_USERS_FILE ?? path.join(getDataDir(), "users.json");
}
