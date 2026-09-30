"use client";

import Link from "next/link";
import { Rich } from "./Rich";
import { useT, type Loc } from "@/lib/i18n";

type Props = {
  label: Loc; // Rich markup, npr "_Start your_ COMMISSION" ili { bs, en }
  href?: string;
  onClick?: () => void;
  variant?: "light" | "frost" | "dark";
  block?: boolean;
  className?: string;
  type?: "button" | "submit";
};

/** Dugme sa "roll" hover efektom: tekst odlazi gore, kopija dolazi odozdo. */
export function Button({ label, href, onClick, variant = "light", block, className = "", type = "button" }: Props) {
  const cls = `btn ${variant === "frost" ? "btn--frost" : ""} ${variant === "dark" ? "btn--dark" : ""} ${
    block ? "btn--block" : ""
  } ${className}`;
  const inner = <RollText label={label} />;
  if (href)
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function RollText({ label: raw }: { label: Loc }) {
  const t = useT();
  const label = t(raw);
  return (
    <span className="roll">
      <span className="roll__inner">
        <span className="block">
          <Rich text={label} dot={false} />
        </span>
        <span className="roll__copy" aria-hidden>
          <Rich text={label} dot={false} />
        </span>
      </span>
    </span>
  );
}
