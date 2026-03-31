import { LegalLayout, LegalSectionHeading, LegalList, LegalListDetailed, LegalLink } from "@/components/LegalLayout";

export default function AccessibilityPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Accesibilidad"
      lastUpdated="Ultima actualizacion: 30 de marzo de 2026"
    >
      <section>
        <LegalSectionHeading>1. Nuestro Compromiso</LegalSectionHeading>
        <p>
          En Folio nos comprometemos a garantizar que nuestra plataforma sea
          accesible para todas las personas, independientemente de sus
          capacidades. Trabajamos de forma continua para mejorar la
          experiencia de usuario y aplicar las pautas de accesibilidad
          pertinentes.
        </p>
      </section>

      <section>
        <LegalSectionHeading>2. Nivel de Conformidad</LegalSectionHeading>
        <p>
          Folio aspira a cumplir de forma parcial con las{" "}
          <strong className="text-navy">
            Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA
          </strong>
          . Conformidad parcial significa que algunas partes del contenido no
          cumplen completamente con el estandar.
        </p>
      </section>

      <section>
        <LegalSectionHeading>3. Limitaciones Conocidas</LegalSectionHeading>
        <p className="mb-3">
          A pesar de nuestros esfuerzos, algunas areas de Folio presentan
          limitaciones de accesibilidad conocidas:
        </p>
        <LegalListDetailed>
          <li>
            <span className="text-navy font-medium">Editor de canvas</span> — La
            manipulacion de elementos mediante arrastrar y soltar no es
            totalmente operable con teclado.
          </li>
          <li>
            <span className="text-navy font-medium">Viewer de presentaciones</span>{" "}
            — Algunos gestos tactiles no tienen alternativas de teclado
            equivalentes.
          </li>
          <li>
            <span className="text-navy font-medium">Contraste de colores</span> —
            Ciertos temas pueden no alcanzar la relacion de contraste 4.5:1
            en todos los elementos decorativos.
          </li>
          <li>
            <span className="text-navy font-medium">Lectores de pantalla</span> —
            El contenido generado dinamicamente en el canvas puede no
            anunciarse correctamente en todos los lectores de pantalla.
          </li>
          <li>
            <span className="text-navy font-medium">Textos en imagenes</span> —
            Las imagenes subidas por usuarios pueden carecer de texto
            alternativo descriptivo.
          </li>
        </LegalListDetailed>
      </section>

      <section>
        <LegalSectionHeading>4. Medidas de Accesibilidad Implementadas</LegalSectionHeading>
        <LegalListDetailed>
          <li>Estructura semantica con HTML5 y roles ARIA donde corresponde.</li>
          <li>Navegacion completa mediante teclado en dashboard y formularios.</li>
          <li>Atajos de teclado documentados para las acciones principales del editor.</li>
          <li>Textos alternativos en imagenes del sistema.</li>
          <li>Diseno responsive que se adapta a diferentes tamanos de pantalla.</li>
        </LegalListDetailed>
      </section>

      <section>
        <LegalSectionHeading>5. Contacto</LegalSectionHeading>
        <p>
          Si encuentras barreras de accesibilidad en Folio o necesitas la
          informacion en un formato alternativo, contactanos en{" "}
          <LegalLink href="mailto:accessibility@identy.cloud">
            accessibility@identy.cloud
          </LegalLink>
          . Nos comprometemos a responder en un plazo maximo de 5 dias
          laborables e intentar resolver el problema reportado.
        </p>
      </section>

      <section>
        <LegalSectionHeading>6. Entorno de Evaluacion</LegalSectionHeading>
        <p>
          Esta declaracion fue preparada el 30 de marzo de 2026. La
          accesibilidad de Folio fue evaluada internamente mediante pruebas
          manuales con teclado, lector de pantalla (VoiceOver) y
          herramientas automatizadas (axe DevTools, Lighthouse).
        </p>
      </section>
    </LegalLayout>
  );
}
