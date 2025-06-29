// translations/index.ts
import { ptTranslations } from "./pt";
import { enTranslations } from "./en";

export type Language = "pt" | "en";

// Crie um tipo para todas as chaves de tradução
export type TranslationKey = keyof typeof ptTranslations;

export const translations = {
  pt: ptTranslations,
  en: enTranslations,
};
