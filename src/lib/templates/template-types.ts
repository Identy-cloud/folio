import type { Slide } from "@/types/elements";
import type { Theme } from "./themes";

export type TemplateCategory = "pitch" | "business" | "creative" | "education";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  category: TemplateCategory;
  generate: (theme: Theme, themeKey: string, presentationId: string) => Omit<Slide, "id">[];
}
