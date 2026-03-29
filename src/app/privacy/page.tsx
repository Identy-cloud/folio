import Link from "next/link";

export default function PrivacyPage() {
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
          Politica de Privacidad
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Ultima actualizacion: 28 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-neutral-400">
          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              1. Datos que Recopilamos
            </h2>
            <p className="mb-3">
              Identy Cloud recopila la informacion minima necesaria para operar Folio:
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>Datos de cuenta: nombre, direccion de correo electronico</li>
              <li>Contenido de usuario: presentaciones, slides, elementos e imagenes que creas</li>
              <li>Datos de uso: paginas visitadas, acciones en el editor, marcas de tiempo</li>
              <li>Datos tecnicos: tipo de navegador, sistema operativo, direccion IP</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              2. Como Usamos tus Datos
            </h2>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>Operar y mantener la plataforma Folio</li>
              <li>Autenticar tu identidad y proteger tu cuenta</li>
              <li>Almacenar y servir tu contenido (presentaciones, imagenes)</li>
              <li>Mejorar el rendimiento y la experiencia del producto</li>
              <li>Comunicarte cambios importantes en el servicio</li>
            </ul>
            <p className="mt-3">
              No vendemos tus datos personales a terceros. No utilizamos tu contenido
              para entrenar modelos de inteligencia artificial.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              3. Cookies
            </h2>
            <p>
              Folio utiliza cookies esenciales para la autenticacion y el funcionamiento
              de la sesion. No utilizamos cookies de rastreo publicitario. Las cookies de
              sesion se eliminan al cerrar el navegador. Las cookies de autenticacion
              persistente tienen una duracion maxima de 30 dias.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              4. Servicios de Terceros
            </h2>
            <p className="mb-3">
              Para operar Folio, utilizamos los siguientes proveedores de confianza:
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>
                <span className="text-neutral-300">Supabase</span> — Autenticacion de usuarios
                y base de datos. Los datos se alojan en infraestructura segura con cifrado en
                reposo.
              </li>
              <li>
                <span className="text-neutral-300">Cloudflare R2</span> — Almacenamiento de
                imagenes y archivos subidos por los usuarios. Los archivos se sirven a traves
                de la red global de Cloudflare.
              </li>
              <li>
                <span className="text-neutral-300">Vercel</span> — Alojamiento y despliegue de
                la aplicacion web. El trafico se gestiona mediante la infraestructura edge de
                Vercel.
              </li>
            </ul>
            <p className="mt-3">
              Cada proveedor opera bajo sus propias politicas de privacidad y cumple con
              estandares de seguridad de la industria.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              5. Retencion de Datos
            </h2>
            <p>
              Conservamos tus datos mientras tu cuenta este activa. Si eliminas tu cuenta,
              borraremos tus datos personales y contenido en un plazo de 30 dias. Podemos
              conservar registros anonimizados con fines estadisticos. Las copias de seguridad
              se eliminan de forma automatica en un ciclo de 90 dias.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              6. Tus Derechos (GDPR)
            </h2>
            <p className="mb-3">
              Si resides en el Espacio Economico Europeo, tienes los siguientes derechos:
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>
                <span className="text-neutral-300">Acceso</span> — Solicitar una copia de todos
                los datos personales que tenemos sobre ti
              </li>
              <li>
                <span className="text-neutral-300">Rectificacion</span> — Corregir datos
                personales inexactos o incompletos
              </li>
              <li>
                <span className="text-neutral-300">Eliminacion</span> — Solicitar la eliminacion
                de tus datos personales y contenido
              </li>
              <li>
                <span className="text-neutral-300">Exportacion</span> — Obtener tus datos en un
                formato estructurado y legible por maquina
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, contacta con nosotros en la
              direccion indicada al final de esta politica.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              7. Medidas de Seguridad
            </h2>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>Cifrado en transito (TLS) para todas las comunicaciones</li>
              <li>Cifrado en reposo para datos almacenados</li>
              <li>Autenticacion segura con tokens de sesion de duracion limitada</li>
              <li>Aislamiento de datos entre usuarios y workspaces</li>
              <li>Auditorias de seguridad periodicas de la infraestructura</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              8. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con tu privacidad o tus datos, puedes
              escribirnos a{" "}
              <a
                href="mailto:privacy@identy.cloud"
                className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
              >
                privacy@identy.cloud
              </a>
            </p>
            <p className="mt-3 text-neutral-500">
              Identy Cloud — Responsable del tratamiento de datos
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
