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
          Ultima actualizacion: 30 de marzo de 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-neutral-400">
          <PrivacySection1 />
          <PrivacySection2 />
          <PrivacySection3 />
          <PrivacySection4 />
          <PrivacySection5 />
          <PrivacySection6 />
          <PrivacySection7 />
          <PrivacySection8 />
          <PrivacySection9 />
          <PrivacySection10 />
          <PrivacySection11 />
          <PrivacySection12 />
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

function PrivacySection1() {
  return (
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
        <li>Datos tecnicos: tipo de navegador, sistema operativo, direccion IP (anonimizada)</li>
        <li>Datos de pago: gestionados por Stripe (no almacenamos numeros de tarjeta)</li>
      </ul>
    </section>
  );
}

function PrivacySection2() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        2. Base Legal del Tratamiento (GDPR Art. 6)
      </h2>
      <ul className="list-inside list-disc space-y-1 text-neutral-500">
        <li>
          <span className="text-neutral-300">Ejecucion del contrato</span> — Operar tu
          cuenta, almacenar y servir tu contenido, procesar pagos
        </li>
        <li>
          <span className="text-neutral-300">Consentimiento</span> — Cookies de
          analitica (PostHog), comunicaciones de marketing
        </li>
        <li>
          <span className="text-neutral-300">Interes legitimo</span> — Mejorar el
          producto, prevenir fraude, seguridad del servicio
        </li>
        <li>
          <span className="text-neutral-300">Obligacion legal</span> — Conservar
          registros fiscales y contables segun la normativa aplicable
        </li>
      </ul>
    </section>
  );
}

function PrivacySection3() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        3. Como Usamos tus Datos
      </h2>
      <ul className="list-inside list-disc space-y-1 text-neutral-500">
        <li>Operar y mantener la plataforma Folio</li>
        <li>Autenticar tu identidad y proteger tu cuenta</li>
        <li>Almacenar y servir tu contenido (presentaciones, imagenes)</li>
        <li>Procesar pagos y gestionar suscripciones</li>
        <li>Mejorar el rendimiento y la experiencia del producto</li>
        <li>Monitorizar errores y estabilidad del servicio</li>
        <li>Comunicarte cambios importantes en el servicio</li>
      </ul>
      <p className="mt-3">
        No vendemos tus datos personales a terceros. No utilizamos tu contenido
        para entrenar modelos de inteligencia artificial.
      </p>
    </section>
  );
}

function PrivacySection4() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        4. Cookies
      </h2>
      <p>
        Folio utiliza cookies esenciales para la autenticacion y el funcionamiento
        de la sesion, y cookies de analitica opcionales (solo con tu consentimiento).
        Consulta nuestra{" "}
        <Link href="/cookies" className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors">
          Politica de Cookies
        </Link>{" "}
        para mas detalles.
      </p>
    </section>
  );
}

function PrivacySection5() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        5. Servicios de Terceros
      </h2>
      <p className="mb-3">
        Para operar Folio, utilizamos los siguientes proveedores de confianza:
      </p>
      <ul className="list-inside list-disc space-y-2 text-neutral-500">
        <li>
          <span className="text-neutral-300">Supabase</span> — Autenticacion de usuarios
          y base de datos. Datos alojados en infraestructura segura con cifrado en reposo.
        </li>
        <li>
          <span className="text-neutral-300">Cloudflare R2</span> — Almacenamiento de
          imagenes y archivos. Servidos a traves de la red global de Cloudflare.
        </li>
        <li>
          <span className="text-neutral-300">Vercel</span> — Alojamiento y despliegue de
          la aplicacion web. Trafico gestionado en infraestructura edge.
        </li>
        <li>
          <span className="text-neutral-300">Stripe</span> — Procesamiento de pagos y
          gestion de suscripciones. Stripe es un procesador certificado PCI-DSS Nivel 1.
          No almacenamos numeros de tarjeta en nuestros servidores.
        </li>
        <li>
          <span className="text-neutral-300">PostHog</span> — Analitica de uso del producto
          (solo con consentimiento). Datos agregados y anonimizados para mejorar la
          experiencia del usuario.
        </li>
        <li>
          <span className="text-neutral-300">Sentry</span> — Monitoreo de errores y
          rendimiento de la aplicacion. Captura informacion tecnica de errores para
          garantizar la estabilidad del servicio.
        </li>
      </ul>
      <p className="mt-3">
        Cada proveedor opera bajo sus propias politicas de privacidad y cumple con
        estandares de seguridad de la industria.
      </p>
    </section>
  );
}

function PrivacySection6() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        6. Transferencias Internacionales de Datos
      </h2>
      <p>
        Algunos de nuestros proveedores (Vercel, Stripe, Cloudflare, PostHog, Sentry)
        pueden procesar datos fuera del Espacio Economico Europeo (EEE). En estos
        casos, las transferencias estan protegidas mediante Clausulas Contractuales
        Tipo (SCCs) aprobadas por la Comision Europea, o el proveedor cuenta con
        certificacion bajo el EU-US Data Privacy Framework. Puedes solicitar una
        copia de las garantias aplicables escribiendo a privacy@identy.cloud.
      </p>
    </section>
  );
}

function PrivacySection7() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        7. Retencion de Datos
      </h2>
      <p>
        Conservamos tus datos mientras tu cuenta este activa. Si eliminas tu cuenta,
        borraremos tus datos personales, contenido y archivos almacenados en un
        plazo de 30 dias. Podemos conservar registros anonimizados con fines
        estadisticos. Las copias de seguridad se eliminan de forma automatica en
        un ciclo de 90 dias.
      </p>
    </section>
  );
}

function PrivacySection8() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        8. Tus Derechos (GDPR)
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
          formato estructurado y legible por maquina (JSON)
        </li>
        <li>
          <span className="text-neutral-300">Oposicion</span> — Oponerte al tratamiento
          basado en interes legitimo
        </li>
        <li>
          <span className="text-neutral-300">Retirar consentimiento</span> — Puedes retirar
          tu consentimiento para cookies de analitica en cualquier momento
        </li>
      </ul>
      <p className="mt-3">
        Para ejercer cualquiera de estos derechos, contacta con nosotros en la
        direccion indicada al final de esta politica.
      </p>
    </section>
  );
}

function PrivacySection9() {
  return (
    <section id="ccpa">
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        9. Derechos de los Consumidores de California (CCPA/CPRA)
      </h2>
      <p className="mb-3">
        Si resides en California, la Ley de Privacidad del Consumidor de California
        te otorga derechos adicionales:
      </p>
      <ul className="list-inside list-disc space-y-1 text-neutral-500">
        <li>
          <span className="text-neutral-300">Derecho a saber</span> — Que datos personales
          recopilamos, usamos y compartimos
        </li>
        <li>
          <span className="text-neutral-300">Derecho a eliminar</span> — Solicitar la
          eliminacion de tus datos personales
        </li>
        <li>
          <span className="text-neutral-300">Derecho a no ser discriminado</span> — No
          recibirás un servicio diferente por ejercer tus derechos
        </li>
        <li>
          <span className="text-neutral-300">Derecho a optar por no participar</span> — En
          la venta o comparticion de informacion personal
        </li>
      </ul>
      <p className="mt-3">
        <strong className="text-neutral-200">
          Folio no vende ni comparte tu informacion personal
        </strong>{" "}
        segun la definicion de la CCPA/CPRA. No utilizamos tu informacion para
        publicidad dirigida entre contextos cruzados. Si deseas ejercer cualquiera
        de estos derechos, contacta con nosotros en privacy@identy.cloud.
      </p>
    </section>
  );
}

function PrivacySection10() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        10. Medidas de Seguridad
      </h2>
      <ul className="list-inside list-disc space-y-1 text-neutral-500">
        <li>Cifrado en transito (TLS) para todas las comunicaciones</li>
        <li>Cifrado en reposo para datos almacenados</li>
        <li>Autenticacion segura con tokens de sesion de duracion limitada</li>
        <li>Aislamiento de datos entre usuarios y workspaces</li>
        <li>Direcciones IP anonimizadas mediante hash unidireccional</li>
        <li>Auditorias de seguridad periodicas de la infraestructura</li>
      </ul>
    </section>
  );
}

function PrivacySection11() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        11. Delegado de Proteccion de Datos y Autoridad de Control
      </h2>
      <p className="mb-3">
        Para cuestiones relacionadas con la proteccion de datos puedes contactar
        con nuestro responsable de privacidad en{" "}
        <a
          href="mailto:dpo@identy.cloud"
          className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
        >
          dpo@identy.cloud
        </a>
      </p>
      <p>
        Si consideras que el tratamiento de tus datos infringe la normativa vigente,
        tienes derecho a presentar una reclamacion ante la autoridad de control
        competente de tu pais de residencia. En Espana, la Agencia Espanola de
        Proteccion de Datos (AEPD) —{" "}
        <a
          href="https://www.aepd.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-200 underline underline-offset-4 hover:text-white transition-colors"
        >
          www.aepd.es
        </a>
      </p>
    </section>
  );
}

function PrivacySection12() {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg tracking-tight text-neutral-200">
        12. Contacto
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
  );
}
