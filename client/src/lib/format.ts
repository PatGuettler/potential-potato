export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const future = diff < 0;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const label =
    mins < 1 ? "just now" :
    mins < 60 ? `${mins} min` :
    mins < 60 * 24 ? `${Math.round(mins / 60)} hr` :
    `${Math.round(mins / 1440)} day${Math.round(mins / 1440) === 1 ? "" : "s"}`;
  if (label === "just now") return label;
  return future ? `in ${label}` : `${label} ago`;
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fullName(u: { firstName?: string; lastName?: string; username?: string } | null | undefined) {
  if (!u) return "";
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username || "";
}

export function initials(u: { firstName?: string; lastName?: string; username?: string } | null | undefined) {
  const name = fullName(u);
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

export function pct(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : `${value}%`;
}

/** Triggers a CSV download in the browser. */
export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  const escape = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  downloadFile(filename, rows.map((r) => r.map(escape).join(",")).join("\n"), "text/csv");
}

export function downloadFile(filename: string, contents: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const categoryStyle: Record<string, { icon: string; text: string; bg: string; gradient: string }> = {
  science: { icon: "fas fa-microscope", text: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950", gradient: "from-blue-500 to-indigo-600" },
  technology: { icon: "fas fa-laptop-code", text: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-950", gradient: "from-purple-500 to-pink-600" },
  engineering: { icon: "fas fa-cogs", text: "text-green-600", bg: "bg-green-100 dark:bg-green-950", gradient: "from-green-500 to-teal-600" },
  mathematics: { icon: "fas fa-calculator", text: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-950", gradient: "from-orange-500 to-red-500" },
};

export const fallbackCategoryStyle = { icon: "fas fa-book", text: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800", gradient: "from-slate-500 to-slate-700" };

export const styleFor = (categoryId: string | undefined) => (categoryId && categoryStyle[categoryId]) || fallbackCategoryStyle;
