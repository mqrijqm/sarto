import { Reveal } from "./Reveal";
import { m } from "@/content/site";

/** Slika sa reveal animacijom (clip + zoom-out). `name` = fajl iz /public/media bez ekstenzije. */
export function Media({ name, alt = "", className = "", priority }: { name: string; alt?: string; className?: string; priority?: boolean }) {
  return (
    <Reveal mode="media" className={`media ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m(name)} alt={alt} loading={priority ? "eager" : "lazy"} />
    </Reveal>
  );
}
