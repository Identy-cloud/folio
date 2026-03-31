import Link from "next/link";
import { LegalLayout, LegalSectionHeading, LegalList, LegalListDetailed, LegalLink } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Politica de Privacidad"
      lastUpdated="Ultima actualizacion: 30 de marzo de 2026"
    >
      <section>
        <LegalSectionHeading>1. Datos que Recopilamos</LegalSectionHeading>
        <p className="mb-3">
          Identy Cloud recopila la informacion minima necesaria para operar Folio:
        </p>
        <LegalList>
          <li>Datos de cuenta: nombre, direccion de correo electronico</li>
          <li>Contenido de usuario: presentaciones, slides, elementos e imagenes que creas</li>
          <li>Datos de uso: paginas visitadas, acciones en el editor, marcas de tiempo</li>
          <li>Datos tecnicos: tipo de navegador, sistema operativo, direccion IP (anonimizada)</li>
          <li>Datos de pago: gestionados por Stripe (no almacenamos numeros de tarjeta)</li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>2. Base Legal del Tratamiento (GDPR Art. 6)</LegalSectionHeading>
        <LegalList>
          <li>
            <span className="text-navy font-medium">Ejecucion del contrato</span> — Operar tu
            cuenta, almacenar y servir tu contenido, procesar pagos
          </li>
          <li>
            <span className="text-navy font-medium">Consentimiento</span> — Cookies de
            analitica (PostHog), comunicaciones de marketing
          </li>
          <li>
            <span className="text-navy font-medium">Interes legitimo</span> — Mejorar el
            producto, prevenir fraude, seguridad del servicio
          </li>
          <li>
            <span className="text-navy font-medium">Obligacion legal</span> — Conservar
            registros fiscales y contables segun la normativa aplicable
          </li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>3. Como Usamos tus Datos</LegalSectionHeading>
        <LegalList>
          <li>Operar y mantener la plataforma Folio</li>
          <li>Autenticar tu identidad y proteger tu cuenta</li>
          <li>Almacenar y servir tu contenido (presentaciones, imagenes)</li>
          <li>Procesar pagos y gestionar suscripciones</li>
          <li>Mejorar el rendimiento y la experiencia del producto</li>
          <li>Monitorizar errores y estabilidad del servicio</li>
          <li>Comunicarte cambios importantes en el servicio</li>
        </LegalList>
        <p className="mt-3">
          No vendemos tus datos personales a terceros. No utilizamos tu contenido
          para entrenar modelos de inteligencia artificial.
        </p>
      </section>

      <section>
        <LegalSectionHeading>4. Cookies</LegalSectionHeading>
        <p>
          Folio utiliza cookies esenciales para la autenticacion y el funcionamiento
          de la sesion, y cookies de analitica opcionales (solo con tu consentimiento).
          Consulta nuestra{" "}
          <Link href="/cookies" className="text-navy underline underline-offset-4 hover:text-accent transition-colors">
            Politica de Cookies
          </Link>{" "}
          para mas detalles.
        </p>
      </section>

      <section>
        <LegalSectionHeading>5. Servicios de Terceros</LegalSectionHeading>
        <p className="mb-3">
          Para operar Folio, utilizamos los siguientes proveedores de confianza:
        </p>
        <LegalListDetailed>
          <li>
            <span className="text-navy font-medium">Supabase</span> — Autenticacion de usuarios
            y base de datos. Datos alojados en infraestructura segura con cifrado en reposo.
          </li>
          <li>
            <span className="text-navy font-medium">Cloudflare R2</span> — Almacenamiento de
            imagenes y archivos. Servidos a traves de la red global de Cloudflare.
          </li>
          <li>
            <span className="text-navy font-medium">Vercel</span> — Alojamiento y despliegue de
            la aplicacion web. Trafico gestionado en infraestructura edge.
          </li>
          <li>
            <span className="text-navy font-medium">Stripe</span> — Procesamiento de pagos y
            gestion de suscripciones. Stripe es un procesador certificado PCI-DSS Nivel 1.
            No almacenamos numeros de tarjeta en nuestros servidores.
          </li>
          <li>
            <span className="text-navy font-medium">PostHog</span> — Analitica de uso del producto
            (solo con consentimiento). Datos agregados y anonimizados para mejorar la
            experiencia del usuario.
          </li>
          <li>
            <span className="text-navy font-medium">Sentry</span> — Monitoreo de errores y
            rendimiento de la aplicacion. Captura informacion tecnica de errores para
            garantizar la estabilidad del servicio.
          </li>
        </LegalListDetailed>
        <p className="mt-3">
          Cada proveedor opera bajo sus propias politicas de privacidad y cumple con
          estandares de seguridad de la industria.
        </p>
      </section>

      <section>
        <LegalSectionHeading>6. Transferencias Internacionales de Datos</LegalSectionHeading>
        <p>
          Algunos de nuestros proveedores (Vercel, Stripe, Cloudflare, PostHog, Sentry)
          pueden procesar datos fuera del Espacio Economico Europeo (EEE). En estos
          casos, las transferencias estan protegidas mediante Clausulas Contractuales
          Tipo (SCCs) aprobadas por la Comision Europea, o el proveedor cuenta con
          certificacion bajo el EU-US Data Privacy Framework. Puedes solicitar una
          copia de las garantias aplicables escribiendo a privacy@identy.cloud.
        </p>
      </section>

      <section>
        <LegalSectionHeading>7. Retencion de Datos</LegalSectionHeading>
        <p>
          Conservamos tus datos mientras tu cuenta este activa. Si eliminas tu cuenta,
          borraremos tus datos personales, contenido y archivos almacenados en un
          plazo de 30 dias. Podemos conservar registros anonimizados con fines
          estadisticos. Las copias de seguridad se eliminan de forma automatica en
          un ciclo de 90 dias.
        </p>
      </section>

      <section>
        <LegalSectionHeading>8. Tus Derechos (GDPR)</LegalSectionHeading>
        <p className="mb-3">
          Si resides en el Espacio Economico Europeo, tienes los siguientes derechos:
        </p>
        <LegalList>
          <li>
            <span className="text-navy font-medium">Acceso</span> — Solicitar una copia de todos
            los datos personales que tenemos sobre ti
          </li>
          <li>
            <span className="text-navy font-medium">Rectificacion</span> — Corregir datos
            personales inexactos o incompletos
          </li>
          <li>
            <span className="text-navy font-medium">Eliminacion</span> — Solicitar la eliminacion
            de tus datos personales y contenido
          </li>
          <li>
            <span className="text-navy font-medium">Exportacion</span> — Obtener tus datos en un
            formato estructurado y legible por maquina (JSON)
          </li>
          <li>
            <span className="text-navy font-medium">Oposicion</span> — Oponerte al tratamiento
            basado en interes legitimo
          </li>
          <li>
            <span className="text-navy font-medium">Retirar consentimiento</span> — Puedes retirar
            tu consentimiento para cookies de analitica en cualquier momento
          </li>
        </LegalList>
        <p className="mt-3">
          Para ejercer cualquiera de estos derechos, contacta con nosotros en la
          direccion indicada al final de esta politica.
        </p>
      </section>

      <section id="ccpa">
        <LegalSectionHeading>9. Derechos de los Consumidores de California (CCPA/CPRA)</LegalSectionHeading>
        <p className="mb-3">
          Si resides en California, la Ley de Privacidad del Consumidor de California
          te otorga derechos adicionales:
        </p>
        <LegalList>
          <li>
            <span className="text-navy font-medium">Derecho a saber</span> — Que datos personales
            recopilamos, usamos y compartimos
          </li>
          <li>
            <span className="text-navy font-medium">Derecho a eliminar</span> — Solicitar la
            eliminacion de tus datos personales
          </li>
          <li>
            <span className="text-navy font-medium">Derecho a no ser discriminado</span> — No
            recibiras un servicio diferente por ejercer tus derechos
          </li>
          <li>
            <span className="text-navy font-medium">Derecho a optar por no participar</span> — En
            la venta o comparticion de informacion personal
          </li>
        </LegalList>
        <p className="mt-3">
          <strong className="text-navy">
            Folio no vende ni comparte tu informacion personal
          </strong>{" "}
          segun la definicion de la CCPA/CPRA. No utilizamos tu informacion para
          publicidad dirigida entre contextos cruzados. Si deseas ejercer cualquiera
          de estos derechos, contacta con nosotros en privacy@identy.cloud.
        </p>
      </section>

      <section>
        <LegalSectionHeading>10. Medidas de Seguridad</LegalSectionHeading>
        <LegalList>
          <li>Cifrado en transito (TLS) para todas las comunicaciones</li>
          <li>Cifrado en reposo para datos almacenados</li>
          <li>Autenticacion segura con tokens de sesion de duracion limitada</li>
          <li>Aislamiento de datos entre usuarios y workspaces</li>
          <li>Direcciones IP anonimizadas mediante hash unidireccional</li>
          <li>Auditorias de seguridad periodicas de la infraestructura</li>
        </LegalList>
      </section>

      <section>
        <LegalSectionHeading>11. Delegado de Proteccion de Datos y Autoridad de Control</LegalSectionHeading>
        <p className="mb-3">
          Para cuestiones relacionadas con la proteccion de datos puedes contactar
          con nuestro responsable de privacidad en{" "}
          <LegalLink href="mailto:dpo@identy.cloud">dpo@identy.cloud</LegalLink>
        </p>
        <p>
          Si consideras que el tratamiento de tus datos infringe la normativa vigente,
          tienes derecho a presentar una reclamacion ante la autoridad de control
          competente de tu pais de residencia. En Espana, la Agencia Espanola de
          Proteccion de Datos (AEPD) —{" "}
          <LegalLink href="https://www.aepd.es">www.aepd.es</LegalLink>
        </p>
      </section>

      <section>
        <LegalSectionHeading>12. Contacto</LegalSectionHeading>
        <p>
          Para cualquier consulta relacionada con tu privacidad o tus datos, puedes
          escribirnos a{" "}
          <LegalLink href="mailto:privacy@identy.cloud">privacy@identy.cloud</LegalLink>
        </p>
        <p className="mt-3 text-steel">
          Identy Cloud — Responsable del tratamiento de datos
        </p>
      </section>
    </LegalLayout>
  );
}
