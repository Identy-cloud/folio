import { LegalLayout } from "@/components/LegalLayout";
import { DmcaSections } from "./dmca-sections";

export default function DmcaPage() {
  return (
    <LegalLayout
      label="Legal"
      title="DMCA y Derechos de Autor"
      lastUpdated="Ultima actualizacion: 30 de marzo de 2026"
    >
      <DmcaSections />
    </LegalLayout>
  );
}
