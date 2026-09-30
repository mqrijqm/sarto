import { Button } from "./Button";
import { Reveal } from "./Reveal";

export function Reassurance({
  title = "Your story deserves\nto be sculpted",
  body = "We’d be honored to craft it with you.",
  className = "",
}: {
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <section className={`px-g py-[200px] text-center max-md:py-[120px] ${className}`}>
      <Reveal mode="fade">
        <h2 data-fade className="t-sans-title whitespace-pre-line">
          {title}
        </h2>
        <p data-fade className="t-body mt-[36px]">
          {body}
        </p>
        <div data-fade className="mt-[58px]">
          <Button label="_Start your_ COMMISSION" href="/order" />
        </div>
      </Reveal>
    </section>
  );
}
