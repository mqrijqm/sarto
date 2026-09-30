import { Media } from "./Media";

/** Levo: velika sticky slika preko cele visine ekrana. Desno: sadržaj koji skroluje. */
export function SplitSticky({ image, alt, children, className = "" }: { image: string; alt: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`grid grid-cols-2 gap-[10px] px-g max-md:grid-cols-1 ${className}`}>
      <div className="max-md:hidden">
        <div className="sticky top-[10px] h-[calc(100svh-20px)]">
          <Media name={image} alt={alt} className="h-full" />
        </div>
      </div>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

/** Kartica: slika + rimski broj + sans naslov + tekst (Process koraci, About simbolika). */
export function NumberedCard({
  n,
  title,
  body,
  image,
  alt = "",
  upper,
}: {
  n: string;
  title: string;
  body: string;
  image: string;
  alt?: string;
  upper?: boolean;
}) {
  return (
    <article>
      <Media name={image} alt={alt} className="aspect-[335/460]" />
      <p className="t-body mt-[22px]">{n}</p>
      <h3 className={`t-sans-title mt-[20px] ${upper ? "uppercase" : ""}`}>{title}</h3>
      <p className="t-small mt-[34px] max-w-[300px] leading-[1.25]">{body}</p>
    </article>
  );
}
