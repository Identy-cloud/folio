"use client";

import { useTranslation } from "@/lib/i18n/context";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-hover text-xs font-semibold tracking-wide text-white">
      {initials}
    </div>
  );
}

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
    <section className="bg-[#FAFAFA] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
          {l.testimonialsLabel}
        </p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {l.testimonialsHeading}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group border border-silver/60 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5"
            >
              <span className="block font-display text-5xl leading-none text-accent/20 transition-colors duration-300 group-hover:text-accent/40">
                &ldquo;
              </span>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {item.quote}
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-silver/40 pt-5">
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
