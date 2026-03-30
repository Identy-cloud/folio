"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LandingTestimonials() {
  const { t } = useTranslation();
  const l = t.landing;

  const testimonials = [
    {
      quote: l.testimonial1Quote,
      name: l.testimonial1Name,
      title: l.testimonial1Title,
      company: l.testimonial1Company,
    },
    {
      quote: l.testimonial2Quote,
      name: l.testimonial2Name,
      title: l.testimonial2Title,
      company: l.testimonial2Company,
    },
    {
      quote: l.testimonial3Quote,
      name: l.testimonial3Name,
      title: l.testimonial3Title,
      company: l.testimonial3Company,
    },
  ];

  return (
    <section className="border-t border-neutral-800 px-4 py-16 sm:px-8 sm:py-24">
      <p className="text-center text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
        {l.testimonialsLabel}
      </p>
      <h2 className="mt-3 text-center font-display text-3xl tracking-tight sm:text-5xl">
        {l.testimonialsHeading}
      </h2>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="border border-neutral-800 p-6"
          >
            <p className="text-sm leading-relaxed text-neutral-300">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide">
                {item.name}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
                {item.title}, {item.company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
