// hooks/useTranslation.ts
import { useSelector } from "react-redux";
import { translations, TranslationKey } from "../translations";
import { RootState } from "@/lib/redux/store";

export const useTranslation = () => {
  const currentLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  return (key: TranslationKey) => {
    return translations[currentLanguage][key] || key; // Retorna a chave se a tradução não existir
  };
};
