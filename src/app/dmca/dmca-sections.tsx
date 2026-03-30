export function DmcaSections() {
  return (
    <div className="mt-12 space-y-10 text-sm leading-relaxed text-neutral-400">
      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          1. Politica General
        </h2>
        <p>
          Folio (operado por Identy Cloud) respeta la propiedad intelectual de
          terceros y espera que sus usuarios hagan lo mismo. En cumplimiento con
          la Digital Millennium Copyright Act (DMCA) de Estados Unidos y la
          legislacion aplicable, responderemos a las notificaciones de presunta
          infraccion de derechos de autor que cumplan con los requisitos legales.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          2. Agente Designado DMCA
        </h2>
        <p className="mb-3">
          Las notificaciones de infraccion deben enviarse al agente designado:
        </p>
        <div className="border border-neutral-800 p-4 text-xs leading-relaxed">
          <p className="text-neutral-200">Identy Cloud — Agente DMCA</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:dmca@identy.cloud"
              className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
            >
              dmca@identy.cloud
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          3. Procedimiento de Notificacion
        </h2>
        <p className="mb-3">
          Para presentar una notificacion valida de infraccion (takedown), debe
          incluir:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-neutral-500">
          <li>Identificacion de la obra protegida que considera infringida.</li>
          <li>
            Identificacion del material infractor en Folio, incluyendo URL o
            informacion suficiente para localizarlo.
          </li>
          <li>Datos de contacto del reclamante (nombre, direccion, telefono, email).</li>
          <li>
            Declaracion de buena fe de que el uso del material no esta autorizado
            por el titular, su agente o la ley.
          </li>
          <li>
            Declaracion bajo pena de perjurio de que la informacion es exacta y
            que usted es el titular o esta autorizado a actuar en su nombre.
          </li>
          <li>Firma fisica o electronica del titular o su representante.</li>
        </ol>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          4. Contra-Notificacion
        </h2>
        <p className="mb-3">
          Si crees que tu contenido fue retirado por error, puedes enviar una
          contra-notificacion que incluya:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-neutral-500">
          <li>Identificacion del material retirado y su ubicacion original.</li>
          <li>
            Declaracion bajo pena de perjurio de que el material fue retirado
            por error o identificacion incorrecta.
          </li>
          <li>Tu nombre, direccion, telefono y email.</li>
          <li>
            Consentimiento a la jurisdiccion del tribunal federal de tu distrito
            y aceptacion de notificaciones del reclamante original.
          </li>
          <li>Tu firma fisica o electronica.</li>
        </ol>
        <p className="mt-3">
          Tras recibir una contra-notificacion valida, reenviaremos una copia al
          reclamante original. Si este no presenta una accion judicial en un
          plazo de 10 a 14 dias laborables, restauraremos el contenido.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          5. Politica de Infractores Reincidentes
        </h2>
        <p>
          Folio se reserva el derecho de desactivar y/o cancelar las cuentas de
          usuarios que infrinjan repetidamente los derechos de autor de terceros.
          Consideramos reincidente a cualquier usuario que reciba tres o mas
          notificaciones validas de infraccion.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
          6. Contacto
        </h2>
        <p>
          Para consultas generales sobre derechos de autor, escribe a{" "}
          <a
            href="mailto:dmca@identy.cloud"
            className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
          >
            dmca@identy.cloud
          </a>
        </p>
      </section>
    </div>
  );
}
