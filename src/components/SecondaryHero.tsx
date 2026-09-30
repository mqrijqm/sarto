import { Reveal } from "./Reveal";
import { Rich } from "./Rich";

/** Eyebrow + ogroman naslov, centriran. Isti blok koristi skoro svaka stranica. */
export function SecondaryHero({
  eyebrow,
  title,
  body,
  className = "",
  size = "header",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
  size?: "header" | "xl";
}) {
  return (
    <section className={`px-g text-center ${className}`}>
      <Reveal>
        {eyebrow && (
          <p className="t-eyebrow mb-[38px] max-md:mb-[24px]">
            <span className="mask">
              <span data-line className="rt-line">
                <Rich text={eyebrow} dot={false} />
              </span>
            </span>
          </p>
        )}
        <h2 className={size === "xl" ? "t-header-xl" : "t-header"}>
          <Rich text={title} lines />
        </h2>
      </Reveal>
      {body && (
        <Reveal mode="fade" className="t-body mx-auto mt-[70px] max-w-[360px] max-md:mt-[40px]">
          <p>{body}</p>
        </Reveal>
      )}
    </section>
  );
}
