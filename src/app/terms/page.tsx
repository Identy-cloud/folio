import Link from "next/link";

export default function TermsPage() {
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
          Terminos de Servicio
        </h1>
        <p className="mt-4 text-sm text-silver/50">
          Ultima actualizacion: 28 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-silver/70">
          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              1. Aceptacion de los Terminos
            </h2>
            <p>
              Al acceder y utilizar Folio, la plataforma de presentaciones
              de Identy Cloud, aceptas quedar vinculado por estos Terminos de Servicio.
              Si no estas de acuerdo con alguno de estos terminos, no debes utilizar
              el servicio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
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
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
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
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              4. Uso Aceptable
            </h2>
            <p className="mb-3">
              Al utilizar Folio te comprometes a no:
            </p>
            <ul className="list-inside list-disc space-y-1 text-silver/50">
              <li>Subir contenido ilegal, difamatorio u ofensivo</li>
              <li>Intentar acceder a cuentas o datos de otros usuarios</li>
              <li>Utilizar el servicio para distribuir malware o spam</li>
              <li>Realizar ingenieria inversa sobre la plataforma</li>
              <li>Sobrecargar deliberadamente la infraestructura del servicio</li>
              <li>Revender el acceso al servicio sin autorizacion</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
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
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
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
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
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
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              8. Suscripciones, Cancelacion y Reembolsos
            </h2>
            <p className="mb-3">
              Folio ofrece planes de suscripcion de pago (Pro, Team) ademas del plan
              gratuito. Al suscribirte:
            </p>
            <ul className="list-inside list-disc space-y-1 text-silver/50">
              <li>
                <span className="text-silver">Facturacion</span> — Los pagos se procesan
                de forma recurrente (mensual o anual) a traves de Stripe.
              </li>
              <li>
                <span className="text-silver">Cancelacion</span> — Puedes cancelar tu
                suscripcion en cualquier momento desde el portal de facturacion (accesible
                desde tu perfil). La cancelacion sera efectiva al final del periodo de
                facturacion actual y conservaras el acceso hasta esa fecha.
              </li>
              <li>
                <span className="text-silver">Reembolsos</span> — No ofrecemos reembolsos
                proporcionales por periodos parciales. Si cancelas, no se te cobrara en el
                siguiente ciclo de facturacion.
              </li>
              <li>
                <span className="text-silver">Cambio de plan</span> — Puedes cambiar de
                plan en cualquier momento. El nuevo precio se aplicara en el siguiente ciclo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              9. Edad Minima
            </h2>
            <p>
              Debes tener al menos 13 anos para crear una cuenta en Folio. Si eres menor
              de 16 anos y resides en el Espacio Economico Europeo, necesitas el
              consentimiento de un padre o tutor legal. Al crear una cuenta, declaras que
              cumples con este requisito de edad.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              10. Ley Aplicable y Jurisdiccion
            </h2>
            <p>
              Estos terminos se rigen por las leyes de Espana. Para cualquier controversia
              derivada del uso de Folio, las partes se someten a la jurisdiccion de los
              juzgados y tribunales de Madrid, Espana, salvo que la normativa de proteccion
              al consumidor de tu pais de residencia establezca otra cosa.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              11. Resolucion de Disputas
            </h2>
            <p>
              Antes de iniciar cualquier procedimiento legal, te animamos a contactarnos
              en legal@identy.cloud para intentar resolver la disputa de forma amistosa.
              Si resides en la Union Europea, tambien puedes utilizar la plataforma de
              resolucion de litigios en linea de la Comision Europea en{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver underline underline-offset-4 hover:text-white transition-colors"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              12. Cambios en los Terminos
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos terminos en cualquier momento.
              Te notificaremos de cambios sustanciales por correo electronico o mediante un
              aviso visible en la plataforma. El uso continuado del servicio tras la
              notificacion constituye la aceptacion de los nuevos terminos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg tracking-tight text-silver">
              13. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre estos terminos, puedes escribirnos a{" "}
              <a
                href="mailto:legal@identy.cloud"
                className="text-silver underline underline-offset-4 hover:text-white transition-colors"
              >
                legal@identy.cloud
              </a>
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
