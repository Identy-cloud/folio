import { LegalLayout, LegalSectionHeading, LegalList, LegalLink } from "@/components/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Politica de Cookies"
      lastUpdated="Ultima actualizacion: 30 de marzo de 2026"
    >
      <section>
        <LegalSectionHeading>1. Que son las Cookies</LegalSectionHeading>
        <p>
          Las cookies son pequenos archivos de texto que se almacenan en tu
          navegador cuando visitas un sitio web. Permiten al sitio recordar
          tus preferencias y mejorar tu experiencia de navegacion.
        </p>
      </section>

      <section>
        <LegalSectionHeading>2. Cookies Esenciales</LegalSectionHeading>
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
        <LegalSectionHeading>3. Cookies de Analitica</LegalSectionHeading>
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
        <LegalSectionHeading>4. Como Gestionar las Cookies</LegalSectionHeading>
        <LegalList>
          <li>
            <span className="text-navy font-medium">Banner de cookies</span> —
            Puedes aceptar o rechazar las cookies de analitica cuando
            visitas Folio por primera vez.
          </li>
          <li>
            <span className="text-navy font-medium">Navegador</span> — Puedes
            borrar las cookies en la configuracion de tu navegador en
            cualquier momento.
          </li>
          <li>
            <span className="text-navy font-medium">Cambiar preferencia</span> —
            Elimina las cookies de Folio en tu navegador y recarga la pagina
            para ver el banner de nuevo.
          </li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>5. Contacto</LegalSectionHeading>
        <p>
          Para cualquier consulta sobre cookies, puedes escribirnos a{" "}
          <LegalLink href="mailto:privacy@identy.cloud">
            privacy@identy.cloud
          </LegalLink>
        </p>
      </section>
    </LegalLayout>
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
          <tr className="border-b border-silver/40 text-steel">
            <th className="py-2 pr-4 font-medium">Nombre</th>
            <th className="py-2 pr-4 font-medium">Proposito</th>
            <th className="py-2 font-medium">Duracion</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((c) => (
            <tr key={c.name} className="border-b border-silver/30">
              <td className="py-2 pr-4 font-mono text-navy">{c.name}</td>
              <td className="py-2 pr-4">{c.purpose}</td>
              <td className="py-2 text-steel">{c.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
