/** SARTO wordmark — SVG tekst u Marcellus-u, skalira se bez gubitka oštrine. */
export function Logo({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 250 64" className={className} role="img" aria-label="SARTO">
      <text
        x="125"
        y="54"
        textAnchor="middle"
        fill={color}
        style={{ fontFamily: "var(--font-marcellus)", fontSize: 66, letterSpacing: "-0.01em" }}
      >
        SARTO
      </text>
    </svg>
  );
}
