import Link from "next/link";

export default function TermsPage() {
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
          Terminos de Servicio
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Ultima actualizacion: 28 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-neutral-400">
          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              1. Aceptacion de los Terminos
            </h2>
            <p>
              Al acceder y utilizar Folio, la plataforma de presentaciones editoriales
              de Identy Cloud, aceptas quedar vinculado por estos Terminos de Servicio.
              Si no estas de acuerdo con alguno de estos terminos, no debes utilizar
              el servicio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              2. Cuenta de Usuario
            </h2>
            <p>
              Para utilizar Folio necesitas crear una cuenta proporcionando informacion
              veraz y actualizada. Eres responsable de mantener la confidencialidad de
              tus credenciales de acceso y de todas las actividades que ocurran bajo tu
              cuenta. Debes notificarnos de inmediato cualquier uso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              3. Propiedad del Contenido
            </h2>
            <p>
              Tu conservas todos los derechos sobre el contenido que creas en Folio,
              incluyendo presentaciones, textos, imagenes y demas material. Identy Cloud
              no reclama propiedad sobre tu contenido. Al utilizar el servicio, nos
              otorgas una licencia limitada para alojar, mostrar y transmitir tu contenido
              unicamente con el fin de operar la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              4. Uso Aceptable
            </h2>
            <p className="mb-3">
              Al utilizar Folio te comprometes a no:
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-500">
              <li>Subir contenido ilegal, difamatorio u ofensivo</li>
              <li>Intentar acceder a cuentas o datos de otros usuarios</li>
              <li>Utilizar el servicio para distribuir malware o spam</li>
              <li>Realizar ingenieria inversa sobre la plataforma</li>
              <li>Sobrecargar deliberadamente la infraestructura del servicio</li>
              <li>Revender el acceso al servicio sin autorizacion</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              5. Propiedad Intelectual
            </h2>
            <p>
              Folio, su codigo, diseno, logotipos y marca son propiedad exclusiva de
              Identy Cloud. Los temas, plantillas y elementos de diseno incluidos en la
              plataforma estan protegidos por derechos de autor. Puedes utilizarlos dentro
              de tus presentaciones pero no redistribuirlos de forma independiente.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              6. Limitacion de Responsabilidad
            </h2>
            <p>
              Folio se proporciona &quot;tal cual&quot; sin garantias de ningun tipo, expresas o
              implicitas. Identy Cloud no sera responsable por danos indirectos,
              incidentales, especiales o consecuentes derivados del uso o la imposibilidad
              de uso del servicio, incluyendo la perdida de datos o beneficios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              7. Terminacion
            </h2>
            <p>
              Podemos suspender o cancelar tu cuenta si violas estos terminos. Tu puedes
              eliminar tu cuenta en cualquier momento desde la configuracion de tu perfil.
              Tras la terminacion, tu contenido sera eliminado de nuestros servidores en un
              plazo de 30 dias, salvo que la ley exija su conservacion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              8. Cambios en los Terminos
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos terminos en cualquier momento.
              Te notificaremos de cambios sustanciales por correo electronico o mediante un
              aviso visible en la plataforma. El uso continuado del servicio tras la
              notificacion constituye la aceptacion de los nuevos terminos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
              9. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre estos terminos, puedes escribirnos a{" "}
              <a
                href="mailto:legal@identy.cloud"
                className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
              >
                legal@identy.cloud
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
