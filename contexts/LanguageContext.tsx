import { useState, useEffect, ReactNode } from "react";
import { Language, translations, TranslationKey } from "@/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with a default value

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get the language from localStorage, but ensure it works on SSR environments
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      return savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")
        ? savedLanguage
        : "pt"; // Default to Portuguese
    }
    return "pt"; // Default language
  });

  // Function to set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
    console.log(`Language changed to ${lang}`);
  };

  // Translate function
  const t = (key: string): string => {
    // Make sure we have translations for the current language
    if (!translations[language]) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }

    const translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    return translation;
  };

  // Effect to set document lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = { language, setLanguage, t };
};
