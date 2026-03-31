"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Star } from "@phosphor-icons/react";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-hover text-xs font-semibold tracking-wide text-white">
      {initials}
    </div>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} weight="fill" className="text-amber-400" />
      ))}
    </div>
  );
}

export function LandingTestimonials() {
  const { t } = useTranslation();
  const l = t.landing;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll("[data-testimonial-card]");
            cards.forEach((card, i) => {
              (card as HTMLElement).style.transitionDelay = `${i * 120}ms`;
              card.classList.add("visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    { quote: l.testimonial1Quote, name: l.testimonial1Name, title: l.testimonial1Title, company: l.testimonial1Company },
    { quote: l.testimonial2Quote, name: l.testimonial2Name, title: l.testimonial2Title, company: l.testimonial2Company },
    { quote: l.testimonial3Quote, name: l.testimonial3Name, title: l.testimonial3Title, company: l.testimonial3Company },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
      {/* Radial gradient overlays for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,76,41,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,76,41,0.03),transparent_50%)]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #1B2D4F 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating geometric shapes — desktop only */}
      <div className="absolute top-[18%] right-[7%] hidden h-16 w-16 rotate-45 border border-accent/8 animate-float lg:block" />
      <div
        className="absolute bottom-[22%] left-[5%] hidden h-10 w-10 rotate-12 border border-navy/6 animate-float lg:block"
        style={{ animationDelay: "2.5s" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
          {l.testimonialsLabel}
        </p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {l.testimonialsHeading}
        </h2>

        {/* Glow-pulse accent divider */}
        <div className="mx-auto mt-4 h-px w-10 bg-accent animate-glow-pulse sm:w-14" />

        <div
          ref={containerRef}
          className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:mt-20 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
        >
          {testimonials.map((item) => (
            <div
              key={item.name}
              data-testimonial-card
              className="fade-up-element group min-w-[85vw] snap-center border-l-2 border-l-accent/30 border border-silver/60 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5 sm:min-w-[60vw] sm:p-8 lg:min-w-0"
            >
              <Stars />
              <p className="mt-4 text-sm leading-relaxed text-slate sm:mt-5">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-silver/40 pt-5">
                <Avatar name={item.name} />
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[11px] tracking-[0.15em] text-steel uppercase">
                    {item.title}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
