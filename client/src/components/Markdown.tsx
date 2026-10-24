import { Fragment, type ReactNode } from "react";

/** Renders **bold**, *italic* and `code` inline. Output is React elements, so lesson text can never inject HTML. */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="px-1 py-0.5 rounded bg-muted text-sm">{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** A small, safe Markdown subset: headings, paragraphs, bullet/numbered lists and fenced code. */
export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={blocks.length} className="bg-muted rounded-lg p-3 text-sm overflow-x-auto">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const cls = level <= 2 ? "text-lg font-semibold mt-4" : "font-semibold mt-3";
      blocks.push(<h3 key={blocks.length} className={cls}>{inline(heading[2])}</h3>);
      i++;
      continue;
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*•]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*•]|\d+\.)\s+/, ""));
        i++;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag key={blocks.length} className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-1`}>
          {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </ListTag>,
      );
      continue;
    }
    // A line that is only bold text reads as a sub-heading in the bundled lessons.
    if (/^\*\*[^*]+\*\*:?$/.test(line.trim())) {
      blocks.push(<h3 key={blocks.length} className="font-semibold mt-4">{line.trim().replace(/^\*\*|\*\*:?$/g, "")}</h3>);
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*([-*•]|\d+\.)\s+)/.test(lines[i])) {
      para.push(lines[i++]);
    }
    if (para.length === 0) para.push(lines[i++]);
    blocks.push(<p key={blocks.length}>{inline(para.join(" "))}</p>);
  }

  return <div className={`space-y-3 leading-relaxed ${className}`}>{blocks}</div>;
}
