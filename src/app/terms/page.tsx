import { LegalLayout, LegalSectionHeading, LegalList, LegalLink } from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Terminos de Servicio"
      lastUpdated="Ultima actualizacion: 28 de marzo de 2026"
    >
      <section>
        <LegalSectionHeading>1. Aceptacion de los Terminos</LegalSectionHeading>
        <p>
          Al acceder y utilizar Folio, la plataforma de presentaciones
          de Identy Cloud, aceptas quedar vinculado por estos Terminos de Servicio.
          Si no estas de acuerdo con alguno de estos terminos, no debes utilizar
          el servicio.
        </p>
      </section>

      <section>
        <LegalSectionHeading>2. Cuenta de Usuario</LegalSectionHeading>
        <p>
          Para utilizar Folio necesitas crear una cuenta proporcionando informacion
          veraz y actualizada. Eres responsable de mantener la confidencialidad de
          tus credenciales de acceso y de todas las actividades que ocurran bajo tu
          cuenta. Debes notificarnos de inmediato cualquier uso no autorizado.
        </p>
      </section>

      <section>
        <LegalSectionHeading>3. Propiedad del Contenido</LegalSectionHeading>
        <p>
          Tu conservas todos los derechos sobre el contenido que creas en Folio,
          incluyendo presentaciones, textos, imagenes y demas material. Identy Cloud
          no reclama propiedad sobre tu contenido. Al utilizar el servicio, nos
          otorgas una licencia limitada para alojar, mostrar y transmitir tu contenido
          unicamente con el fin de operar la plataforma.
        </p>
      </section>

      <section>
        <LegalSectionHeading>4. Uso Aceptable</LegalSectionHeading>
        <p className="mb-3">
          Al utilizar Folio te comprometes a no:
        </p>
        <LegalList>
          <li>Subir contenido ilegal, difamatorio u ofensivo</li>
          <li>Intentar acceder a cuentas o datos de otros usuarios</li>
          <li>Utilizar el servicio para distribuir malware o spam</li>
          <li>Realizar ingenieria inversa sobre la plataforma</li>
          <li>Sobrecargar deliberadamente la infraestructura del servicio</li>
          <li>Revender el acceso al servicio sin autorizacion</li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>5. Propiedad Intelectual</LegalSectionHeading>
        <p>
          Folio, su codigo, diseno, logotipos y marca son propiedad exclusiva de
          Identy Cloud. Los temas, plantillas y elementos de diseno incluidos en la
          plataforma estan protegidos por derechos de autor. Puedes utilizarlos dentro
          de tus presentaciones pero no redistribuirlos de forma independiente.
        </p>
      </section>

      <section>
        <LegalSectionHeading>6. Limitacion de Responsabilidad</LegalSectionHeading>
        <p>
          Folio se proporciona &quot;tal cual&quot; sin garantias de ningun tipo, expresas o
          implicitas. Identy Cloud no sera responsable por danos indirectos,
          incidentales, especiales o consecuentes derivados del uso o la imposibilidad
          de uso del servicio, incluyendo la perdida de datos o beneficios.
        </p>
      </section>

      <section>
        <LegalSectionHeading>7. Terminacion</LegalSectionHeading>
        <p>
          Podemos suspender o cancelar tu cuenta si violas estos terminos. Tu puedes
          eliminar tu cuenta en cualquier momento desde la configuracion de tu perfil.
          Tras la terminacion, tu contenido sera eliminado de nuestros servidores en un
          plazo de 30 dias, salvo que la ley exija su conservacion.
        </p>
      </section>

      <section>
        <LegalSectionHeading>8. Suscripciones, Cancelacion y Reembolsos</LegalSectionHeading>
        <p className="mb-3">
          Folio ofrece planes de suscripcion de pago (Pro, Team) ademas del plan
          gratuito. Al suscribirte:
        </p>
        <LegalList>
          <li>
            <span className="text-navy font-medium">Facturacion</span> — Los pagos se procesan
            de forma recurrente (mensual o anual) a traves de Stripe.
          </li>
          <li>
            <span className="text-navy font-medium">Cancelacion</span> — Puedes cancelar tu
            suscripcion en cualquier momento desde el portal de facturacion (accesible
            desde tu perfil). La cancelacion sera efectiva al final del periodo de
            facturacion actual y conservaras el acceso hasta esa fecha.
          </li>
          <li>
            <span className="text-navy font-medium">Reembolsos</span> — No ofrecemos reembolsos
            proporcionales por periodos parciales. Si cancelas, no se te cobrara en el
            siguiente ciclo de facturacion.
          </li>
          <li>
            <span className="text-navy font-medium">Cambio de plan</span> — Puedes cambiar de
            plan en cualquier momento. El nuevo precio se aplicara en el siguiente ciclo.
          </li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>9. Edad Minima</LegalSectionHeading>
        <p>
          Debes tener al menos 13 anos para crear una cuenta en Folio. Si eres menor
          de 16 anos y resides en el Espacio Economico Europeo, necesitas el
          consentimiento de un padre o tutor legal. Al crear una cuenta, declaras que
          cumples con este requisito de edad.
        </p>
      </section>

      <section>
        <LegalSectionHeading>10. Ley Aplicable y Jurisdiccion</LegalSectionHeading>
        <p>
          Estos terminos se rigen por las leyes de Espana. Para cualquier controversia
          derivada del uso de Folio, las partes se someten a la jurisdiccion de los
          juzgados y tribunales de Madrid, Espana, salvo que la normativa de proteccion
          al consumidor de tu pais de residencia establezca otra cosa.
        </p>
      </section>

      <section>
        <LegalSectionHeading>11. Resolucion de Disputas</LegalSectionHeading>
        <p>
          Antes de iniciar cualquier procedimiento legal, te animamos a contactarnos
          en legal@identy.cloud para intentar resolver la disputa de forma amistosa.
          Si resides en la Union Europea, tambien puedes utilizar la plataforma de
          resolucion de litigios en linea de la Comision Europea en{" "}
          <LegalLink href="https://ec.europa.eu/consumers/odr">
            ec.europa.eu/consumers/odr
          </LegalLink>
        </p>
      </section>

      <section>
        <LegalSectionHeading>12. Cambios en los Terminos</LegalSectionHeading>
        <p>
          Nos reservamos el derecho de modificar estos terminos en cualquier momento.
          Te notificaremos de cambios sustanciales por correo electronico o mediante un
          aviso visible en la plataforma. El uso continuado del servicio tras la
          notificacion constituye la aceptacion de los nuevos terminos.
        </p>
      </section>

      <section>
        <LegalSectionHeading>13. Contacto</LegalSectionHeading>
        <p>
          Para cualquier consulta sobre estos terminos, puedes escribirnos a{" "}
          <LegalLink href="mailto:legal@identy.cloud">
            legal@identy.cloud
          </LegalLink>
        </p>
      </section>
    </LegalLayout>
  );
}
