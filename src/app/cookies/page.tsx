import Link from "next/link";

export default function CookiesPage() {
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:py-20">
        <p className="text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
          Legal
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
          Politica de Cookies
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Ultima actualizacion: 30 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-neutral-400">
          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              1. Que son las Cookies
            </h2>
            <p>
              Las cookies son pequenos archivos de texto que se almacenan en tu
              navegador cuando visitas un sitio web. Permiten al sitio recordar
              tus preferencias y mejorar tu experiencia de navegacion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              2. Cookies Esenciales
            </h2>
            <p className="mb-3">
              Estas cookies son necesarias para el funcionamiento basico de Folio
              y no pueden desactivarse.
            </p>
            <CookieTable
              cookies={[
                {
                  name: "sb-*-auth-token",
                  purpose: "Autenticacion de sesion (Supabase)",
                  duration: "30 dias",
                },
                {
                  name: "folio-locale",
                  purpose: "Preferencia de idioma del usuario",
                  duration: "1 ano",
                },
                {
                  name: "folio-cookies-accepted",
                  purpose: "Registro de aceptacion de cookies",
                  duration: "Permanente",
                },
                {
                  name: "folio-cookies-rejected",
                  purpose: "Registro de rechazo de cookies",
                  duration: "Permanente",
                },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              3. Cookies de Analitica
            </h2>
            <p className="mb-3">
              Estas cookies se activan solo si aceptas las cookies de analitica
              en el banner. Nos ayudan a entender como se usa Folio para mejorar
              el producto.
            </p>
            <CookieTable
              cookies={[
                {
                  name: "ph_*",
                  purpose: "PostHog — analitica de uso anonimizada",
                  duration: "1 ano",
                },
              ]}
            />
            <p className="mt-3">
              PostHog (proveedor de analitica) procesa los datos en
              infraestructura de la Union Europea / Estados Unidos. No se
              recopilan datos identificables si rechazas las cookies de
              analitica.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              4. Como Gestionar las Cookies
            </h2>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>
                <span className="text-neutral-300">Banner de cookies</span> —
                Puedes aceptar o rechazar las cookies de analitica cuando
                visitas Folio por primera vez.
              </li>
              <li>
                <span className="text-neutral-300">Navegador</span> — Puedes
                borrar las cookies en la configuracion de tu navegador en
                cualquier momento.
              </li>
              <li>
                <span className="text-neutral-300">Cambiar preferencia</span> —
                Elimina las cookies de Folio en tu navegador y recarga la pagina
                para ver el banner de nuevo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              5. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre cookies, puedes escribirnos a{" "}
              <a
                href="mailto:privacy@identy.cloud"
                className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
              >
                privacy@identy.cloud
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="flex items-center justify-center py-8">
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
}

function CookieTable({ cookies }: { cookies: CookieRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500">
            <th className="py-2 pr-4 font-medium">Nombre</th>
            <th className="py-2 pr-4 font-medium">Proposito</th>
            <th className="py-2 font-medium">Duracion</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((c) => (
            <tr key={c.name} className="border-b border-neutral-800/50">
              <td className="py-2 pr-4 font-mono text-neutral-300">{c.name}</td>
              <td className="py-2 pr-4">{c.purpose}</td>
              <td className="py-2 text-neutral-500">{c.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
