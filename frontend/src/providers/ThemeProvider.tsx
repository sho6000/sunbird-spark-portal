import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  THEMES,
  FONTS,
  TEMPLATES,
  LAYOUTS,
  DEFAULT_THEME_ID,
  DEFAULT_FONT_ID,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_LAYOUT_ID,
  applyTheme,
  applyFont,
  applyTemplate,
  applyLayout,
  type Theme,
  type FontOption,
  type TemplateOption,
  type LayoutOption,
} from '@/theme/themes';

const THEME_STORAGE_KEY = 'sunbird-theme';
const FONT_STORAGE_KEY = 'sunbird-font';
const TEMPLATE_STORAGE_KEY = 'sunbird-template';
const LAYOUT_STORAGE_KEY = 'sunbird-layout';

interface ThemeContextValue {
  activeTheme: Theme;
  setTheme: (id: string) => void;
  themes: Theme[];
  activeFont: FontOption;
  setFont: (id: string) => void;
  fonts: FontOption[];
  activeTemplate: TemplateOption;
  setTemplate: (id: TemplateOption['id']) => void;
  templates: TemplateOption[];
  activeLayout: LayoutOption;
  setLayout: (id: LayoutOption['id']) => void;
  layouts: LayoutOption[];
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

  const [activeTemplate, setActiveTemplate] = useState<TemplateOption>(() => {
    const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return TEMPLATES.find((t) => t.id === saved) ?? TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;
  });

  const [activeLayout, setActiveLayout] = useState<LayoutOption>(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return LAYOUTS.find((l) => l.id === saved) ?? LAYOUTS.find((l) => l.id === DEFAULT_LAYOUT_ID)!;
  });

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    applyFont(activeFont);
  }, [activeFont]);

  useEffect(() => {
    applyTemplate(activeTemplate.id);
  }, [activeTemplate]);

  useEffect(() => {
    applyLayout(activeLayout.id);
  }, [activeLayout]);

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

  const setTemplate = (id: TemplateOption['id']) => {
    const template = TEMPLATES.find((t) => t.id === id);
    if (!template) return;
    localStorage.setItem(TEMPLATE_STORAGE_KEY, id);
    setActiveTemplate(template);
  };

  const setLayout = (id: LayoutOption['id']) => {
    const layout = LAYOUTS.find((l) => l.id === id);
    if (!layout) return;
    localStorage.setItem(LAYOUT_STORAGE_KEY, id);
    setActiveLayout(layout);
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        setTheme,
        themes: THEMES,
        activeFont,
        setFont,
        fonts: FONTS,
        activeTemplate,
        setTemplate,
        templates: TEMPLATES,
        activeLayout,
        setLayout,
        layouts: LAYOUTS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
