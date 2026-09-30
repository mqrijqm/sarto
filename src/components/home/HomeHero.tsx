"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { Rich } from "../Rich";
import { Logo } from "../Logo";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const FRAMES = ["hero-1", "hero-2", "hero-3"];

/**
 * Loader ("WHERE your WEDDING [prozor] SUIT BECOMES art." + procenat) koji se
 * pretapa u fullscreen hero. Hero je "video" od 3 kadra: sporo zumiranje + pretapanje.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [frame, setFrame] = useState(0);
  const lenis = useLenis();

  // loader samo pri prvom ulasku u sesiji
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("sarto:intro") === "1";
    } catch {}
    if (seen || prefersReducedMotion()) setShowLoader(false);
  }, []);

  // smena kadrova
  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const heroIn = () =>
        gsap
          .timeline()
          .fromTo(q("[data-hero-logo]"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out" })
          .fromTo(q("[data-hero-tag] [data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0.25)
          .fromTo(q("[data-hero-chev]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.8);

      if (!showLoader) {
        heroIn();
        return;
      }
      lenis?.stop();
      const win = q("[data-win]")[0] as HTMLElement;
      const counter = { v: 0 };
      const pct = q("[data-pct]")[0];
      const bar = q("[data-bar]")[0];

      // čekaj da se prvi kadar učita (ali min 1.6s da loader "diše")
      const img = new Image();
      img.src = m(FRAMES[0]);
      const ready = new Promise<void>((res) => {
        if (img.complete) res();
        img.onload = () => res();
        img.onerror = () => res();
      });

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(q("[data-ltext] [data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.07 }, 0)
        .fromTo(win, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out" }, 0.3)
        .to(counter, {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            pct.textContent = `${Math.round(counter.v)}%`;
            gsap.set(bar, { scaleX: counter.v / 100 });
          },
        }, 0.1)
        .addLabel("out")
        .to(q("[data-ltop]"), { yPercent: -60, autoAlpha: 0, duration: 1.1, ease: "expo.inOut" }, "out")
        .to(q("[data-lbot]"), { yPercent: 60, autoAlpha: 0, duration: 1.1, ease: "expo.inOut" }, "out")
        .to(q("[data-lmeta]"), { autoAlpha: 0, duration: 0.5 }, "out")
        // prozor raste do okvira sa marginom, pa do punog ekrana
        .to(win, {
          top: 26, left: 42, right: 42, bottom: 26, width: "auto", height: "auto",
          xPercent: 0, yPercent: 0, x: 0, y: 0,
          duration: 1.2, ease: "expo.inOut",
        }, "out+=0.1")
        .to(win, { top: 0, left: 0, right: 0, bottom: 0, duration: 1, ease: "expo.inOut" }, ">-0.1")
        .add(() => {
          heroIn();
        }, ">-0.35")
        .to(q("[data-loader]"), { autoAlpha: 0, duration: 0.5 }, ">+0.1")
        .add(() => {
          try {
            sessionStorage.setItem("sarto:intro", "1");
          } catch {}
          lenis?.start();
          setShowLoader(false);
        });

      tl.tweenTo("out").then(() => ready.then(() => tl.play()));
      return () => {
        lenis?.start();
      };
    },
    { scope: root, dependencies: [showLoader, lenis] },
  );

  return (
    <section ref={root} data-header="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#3a1d10] text-paper">
      {/* "video" */}
      <div className="absolute inset-0">
        {FRAMES.map((f, i) => (
          <div
            key={f}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-[var(--ease-custom)]"
            style={{ opacity: frame === i ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m(f)}
              alt=""
              className="h-full w-full object-cover"
              style={{
                transform: frame === i ? "scale(1)" : "scale(1.08)",
                transition: "transform 7s cubic-bezier(.25,.1,.25,1)",
              }}
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_52%,rgba(0,0,0,0.28),rgba(0,0,0,0)_70%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-g text-center">
        <h1 className="sr-only">SARTO — Custom sculpture of your wedding suit</h1>
        <div data-hero-logo className="invisible">
          <Logo className="w-[min(250px,58vw)]" />
        </div>
        <p data-hero-tag className="mt-[10px] text-[clamp(18px,1.6vw,23px)] leading-[1.1] tracking-[-0.01em]">
          <span className="mask">
            <span data-line className="rt-line">
              <Rich text="_Custom_ SCULPTURE _of your_ WEDDING SUIT" dot={false} />
              <span className="rt-dot" />
            </span>
          </span>
        </p>
      </div>
      <button
        data-hero-chev
        aria-label="Scroll down"
        onClick={() => lenis?.scrollTo(window.innerHeight, { duration: 1.6 })}
        className="invisible absolute bottom-[24px] left-1/2 z-10 -translate-x-1/2 p-2"
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </button>

      {showLoader && <Loader />}
    </section>
  );
}

function Loader() {
  return (
    <div data-loader className="fixed inset-0 z-[60] bg-beige text-[#6f6a66]">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div data-ltop className="t-header" data-ltext>
          <Rich text={"WHERE\n_your_ WEDDING"} lines />
        </div>
        <div className="h-[clamp(96px,15.5vh,140px)] w-[clamp(150px,15.5vw,222px)] my-[28px]" />
        <div data-lbot className="t-header" data-ltext>
          <Rich text={"SUIT\nBECOMES _art._"} lines />
        </div>
      </div>
      {/* prozor sa slikom — raste u hero */}
      <div
        data-win
        className="absolute left-1/2 top-1/2 h-[clamp(96px,15.5vh,140px)] w-[clamp(150px,15.5vw,222px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m("hero-1")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div data-lmeta className="absolute inset-x-[30px] bottom-[30px] text-ink max-md:inset-x-[16px]">
        <p data-pct className="t-small mb-[12px] text-right">
          0%
        </p>
        <div data-bar className="h-px origin-left scale-x-0 bg-ink" />
      </div>
    </div>
  );
}
