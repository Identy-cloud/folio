import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "",
    description: "Para empezar a crear presentaciones con estilo editorial.",
    features: [
      "5 presentaciones",
      "100 MB de almacenamiento",
      "Compartir con enlace publico",
      "5 temas editoriales",
      "Editor completo",
      "Exportar como imagen",
    ],
    cta: "Empezar gratis",
    href: "/login",
    highlighted: false,
    available: true,
  },
  {
    name: "Pro",
    price: "12",
    period: "/mes",
    description: "Para profesionales que necesitan mas capacidad y control.",
    features: [
      "Presentaciones ilimitadas",
      "10 GB de almacenamiento",
      "Temas personalizados",
      "Exportar a PDF",
      "Sin marca de agua Folio",
      "Soporte prioritario",
    ],
    cta: "Proximamente",
    href: "#",
    highlighted: true,
    available: false,
  },
  {
    name: "Team",
    price: "29",
    period: "/mes por miembro",
    description: "Para equipos que colaboran en presentaciones en tiempo real.",
    features: [
      "Todo lo de Pro",
      "Colaboracion en tiempo real",
      "Workspace de equipo",
      "Controles de administracion",
      "Roles y permisos",
      "Facturacion centralizada",
    ],
    cta: "Proximamente",
    href: "#",
    highlighted: false,
    available: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">
          FOLIO
        </Link>
        <Link
          href="/"
          className="text-xs tracking-[0.25em] text-neutral-400 uppercase hover:text-white transition-colors"
        >
          Volver
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:py-20">
        <p className="text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
          Planes
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl lg:text-7xl">
          Elige tu plan
        </h1>
        <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-neutral-400">
          Comienza gratis y escala cuando lo necesites. Sin compromisos,
          sin sorpresas.
        </p>

        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col border p-6 sm:p-8 ${
                tier.highlighted
                  ? "border-neutral-400 bg-[#1c1c1c]"
                  : "border-neutral-800 bg-[#1a1a1a]"
              }`}
            >
              <div>
                <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">
                  {tier.name}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl tracking-tight sm:text-5xl">
                    ${tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-neutral-500">{tier.period}</span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-neutral-400"
                  >
                    <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 bg-neutral-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {tier.available ? (
                  <Link
                    href={tier.href}
                    className="block w-full bg-white py-3 text-center text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors"
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <span className="block w-full border border-neutral-700 py-3 text-center text-xs tracking-[0.25em] text-neutral-500 uppercase cursor-default">
                    {tier.cta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-neutral-600">
          Todos los precios en USD. Impuestos no incluidos.
        </p>
      </main>

      <footer className="flex items-center justify-center py-8">
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}
