import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  THEMES,
  FONTS,
  DEFAULT_THEME_ID,
  DEFAULT_FONT_ID,
  applyTheme,
  applyFont,
  type Theme,
  type FontOption,
} from '@/theme/themes';

const THEME_STORAGE_KEY = 'sunbird-theme';
const FONT_STORAGE_KEY = 'sunbird-font';

interface ThemeContextValue {
  activeTheme: Theme;
  setTheme: (id: string) => void;
  themes: Theme[];
  activeFont: FontOption;
  setFont: (id: string) => void;
  fonts: FontOption[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.find((t) => t.id === saved) ?? THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
  });

  const [activeFont, setActiveFont] = useState<FontOption>(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    return FONTS.find((f) => f.id === saved) ?? FONTS.find((f) => f.id === DEFAULT_FONT_ID)!;
  });

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    applyFont(activeFont);
  }, [activeFont]);

  const setTheme = (id: string) => {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;
    localStorage.setItem(THEME_STORAGE_KEY, id);
    setActiveTheme(theme);
  };

  const setFont = (id: string) => {
    const font = FONTS.find((f) => f.id === id);
    if (!font) return;
    localStorage.setItem(FONT_STORAGE_KEY, id);
    setActiveFont(font);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, themes: THEMES, activeFont, setFont, fonts: FONTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
