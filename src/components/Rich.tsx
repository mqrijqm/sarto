import { Fragment } from "react";

/**
 * Mini-markup za naslove u stilu reference:
 *   "_where_ INNOVATION\n_meets_ CRAFTSMANSHIP."
 *   _reč_  -> kurziv (Cormorant italic)
 *   \n     -> novi red
 *   "."    na kraju reči -> dijamant tačka
 * `lines` => svaki red dobija masku za reveal animaciju.
 */
export function Rich({
  text,
  lines = false,
  dot = true,
}: {
  text: string;
  lines?: boolean;
  dot?: boolean;
}) {
  const rows = text.split("\n");
  return (
    <>
      {rows.map((row, r) => {
        const content = renderRow(row, dot);
        if (lines)
          return (
            <span className="mask" key={r}>
              <span className="rt-line" data-line>
                {content}
              </span>
            </span>
          );
        return (
          <Fragment key={r}>
            {content}
            {r < rows.length - 1 && <br />}
          </Fragment>
        );
      })}
    </>
  );
}

function renderRow(row: string, dot: boolean) {
  const parts = row.split(/(_[^_]+_)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("_") && p.endsWith("_")) {
      return (
        <span className="rt-i" key={i}>
          {withDot(p.slice(1, -1), dot)}
        </span>
      );
    }
    return <Fragment key={i}>{withDot(p, dot)}</Fragment>;
  });
}

function withDot(s: string, dot: boolean) {
  if (!dot || !/\.\s*$/.test(s)) return s;
  const body = s.replace(/\.\s*$/, "");
  return (
    <>
      {body}
      <span className="rt-dot" aria-hidden />
      <span className="sr-only">.</span>
    </>
  );
}
