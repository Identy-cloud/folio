import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">
          FOLIO
        </Link>
        <Link
          href="/"
          className="text-xs tracking-[0.25em] text-silver/70 uppercase hover:text-white transition-colors"
        >
          Volver
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:py-20">
        <p className="text-[10px] tracking-[0.5em] text-silver/50 uppercase">
          Legal
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
          Accesibilidad
        </h1>
        <p className="mt-4 text-sm text-silver/50">
          Ultima actualizacion: 30 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-silver/70">
          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              1. Nuestro Compromiso
            </h2>
            <p>
              En Folio nos comprometemos a garantizar que nuestra plataforma sea
              accesible para todas las personas, independientemente de sus
              capacidades. Trabajamos de forma continua para mejorar la
              experiencia de usuario y aplicar las pautas de accesibilidad
              pertinentes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              2. Nivel de Conformidad
            </h2>
            <p>
              Folio aspira a cumplir de forma parcial con las{" "}
              <strong className="text-silver">
                Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA
              </strong>
              . Conformidad parcial significa que algunas partes del contenido no
              cumplen completamente con el estandar.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              3. Limitaciones Conocidas
            </h2>
            <p className="mb-3">
              A pesar de nuestros esfuerzos, algunas areas de Folio presentan
              limitaciones de accesibilidad conocidas:
            </p>
            <ul className="list-inside list-disc space-y-2 text-silver/50">
              <li>
                <span className="text-silver">Editor de canvas</span> — La
                manipulacion de elementos mediante arrastrar y soltar no es
                totalmente operable con teclado.
              </li>
              <li>
                <span className="text-silver">Viewer de presentaciones</span>{" "}
                — Algunos gestos tactiles no tienen alternativas de teclado
                equivalentes.
              </li>
              <li>
                <span className="text-silver">Contraste de colores</span> —
                Ciertos temas pueden no alcanzar la relacion de contraste 4.5:1
                en todos los elementos decorativos.
              </li>
              <li>
                <span className="text-silver">Lectores de pantalla</span> —
                El contenido generado dinamicamente en el canvas puede no
                anunciarse correctamente en todos los lectores de pantalla.
              </li>
              <li>
                <span className="text-silver">Textos en imagenes</span> —
                Las imagenes subidas por usuarios pueden carecer de texto
                alternativo descriptivo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              4. Medidas de Accesibilidad Implementadas
            </h2>
            <ul className="list-inside list-disc space-y-2 text-silver/50">
              <li>Estructura semantica con HTML5 y roles ARIA donde corresponde.</li>
              <li>Navegacion completa mediante teclado en dashboard y formularios.</li>
              <li>Atajos de teclado documentados para las acciones principales del editor.</li>
              <li>Textos alternativos en imagenes del sistema.</li>
              <li>Diseno responsive que se adapta a diferentes tamanos de pantalla.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              5. Contacto
            </h2>
            <p>
              Si encuentras barreras de accesibilidad en Folio o necesitas la
              informacion en un formato alternativo, contactanos en{" "}
              <a
                href="mailto:accessibility@identy.cloud"
                className="text-silver underline underline-offset-4 hover:text-white transition-colors"
              >
                accessibility@identy.cloud
              </a>
              . Nos comprometemos a responder en un plazo maximo de 5 dias
              laborables e intentar resolver el problema reportado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              6. Entorno de Evaluacion
            </h2>
            <p>
              Esta declaracion fue preparada el 30 de marzo de 2026. La
              accesibilidad de Folio fue evaluada internamente mediante pruebas
              manuales con teclado, lector de pantalla (VoiceOver) y
              herramientas automatizadas (axe DevTools, Lighthouse).
            </p>
          </section>
        </div>
      </main>

      <footer className="flex items-center justify-center py-8">
        <p className="text-[10px] tracking-[0.3em] text-silver/40 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}
