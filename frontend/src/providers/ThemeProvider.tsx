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
  applyTemplate,
  applyLayout,
  persistThemeSeeds,
  type Theme,
  type FontOption,
  type TemplateOption,
  type LayoutOption,
} from '@/theme/themes';
import { useAppI18n } from '@/hooks/useAppI18n';

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

  const { currentLanguage } = useAppI18n();

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  // Single source of truth for `--app-font-family` (mirrors mobile-app
  // ThemeContext). Watches both the user-picked font AND the active
  // language. Script-locked languages (Arabic etc. via `forceFont`)
  // override the theme font; otherwise honour the picker.
  useEffect(() => {
    const value = currentLanguage.forceFont ? currentLanguage.font : activeFont.value;
    document.documentElement.style.setProperty('--app-font-family', value);
  }, [activeFont, currentLanguage]);

  useEffect(() => {
    applyTemplate(activeTemplate.id);
  }, [activeTemplate]);

  useEffect(() => {
    applyLayout(activeLayout.id);
  }, [activeLayout]);

  // Hand off pre-computed seeds to Keycloak login pages via localStorage
  // (same-origin, same flow as language). The Sunbird Keycloak FTL template
  // reads `sunbird-theme-seeds` + `sunbird-font` + `sunbird-template` from
  // localStorage on first paint. Font/template ids are already persisted on
  // setFont/setTemplate above; only the encoded seed string needs an extra
  // write whenever the active theme changes.
  useEffect(() => {
    persistThemeSeeds(activeTheme);
  }, [activeTheme]);

  // On first mount, honour theme/font/template hand-off from the mobile
  // InAppBrowser (see AuthWebviewService). The hand-off prefers raw values
  // over ids because the mobile and portal palette/font catalogs do not
  // always overlap (mobile has Pink/Mint/Lora; portal has Green/Inter/etc).
  //
  //   ?seeds=ph:N,ps:N%,pl:N%,ch:N,cs:N%,ih:N    — applied as CSS vars
  //   ?template=classic|modern|...               — applied as data-template
  //   ?theme=<id>                                — fallback for portal-known ids
  //   ?font=<id>                                 — fallback for portal-known ids
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const seedsParam = params.get('seeds');
    const templateParam = params.get('template');
    const themeParam = params.get('theme');
    const fontParam = params.get('font');

    const root = document.documentElement;

    // Template — apply attr + persist (Keycloak reads `sunbird-template`).
    if (templateParam) {
      root.setAttribute('data-template', templateParam);
      localStorage.setItem(TEMPLATE_STORAGE_KEY, templateParam);
      const matchedTemplate = TEMPLATES.find((t) => t.id === templateParam);
      if (matchedTemplate) setActiveTemplate(matchedTemplate);
    }

    // Theme — raw seeds win over id lookup.
    if (seedsParam) {
      const SEED_RE = /^(ph|ps|pl|ch|cs|ih):(\d{1,3}%?)$/;
      const seedToVar: Record<string, string> = {
        ph: '--sunbird-spark-theme-primary-h',
        ps: '--sunbird-spark-theme-primary-s',
        pl: '--sunbird-spark-theme-primary-l',
        ch: '--sunbird-spark-theme-chip-h',
        cs: '--sunbird-spark-theme-chip-s',
        ih: '--sunbird-spark-theme-icon-h',
      };
      seedsParam.split(',').forEach((kv) => {
        const m = SEED_RE.exec(kv.trim());
        if (m) root.style.setProperty(seedToVar[m[1]!]!, m[2]!);
      });
      // Persist for Keycloak FTL — same key the FTL reads.
      localStorage.setItem('sunbird-theme-seeds', seedsParam);
    }
    if (themeParam) {
      localStorage.setItem(THEME_STORAGE_KEY, themeParam);
      const matchedTheme = THEMES.find((t) => t.id === themeParam);
      if (matchedTheme) setActiveTheme(matchedTheme);
    }

    // Font — look up by id in portal's FONTS catalog. If unknown,
    // fall back to portal default (do nothing — activeFont stays as is).
    // Route through `setActiveFont` so the language-aware font effect
    // honours forceFont rules for the active language.
    if (fontParam) {
      const matchedFont = FONTS.find((f) => f.id === fontParam);
      if (matchedFont) {
        localStorage.setItem(FONT_STORAGE_KEY, fontParam);
        setActiveFont(matchedFont);
      }
    }
  }, []);

  const setTheme = (id: string) => {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;
    localStorage.setItem(THEME_STORAGE_KEY, id);
    setActiveTheme(theme);
    // Theme defines a recommended fontId — switch font to match unless the
    // user has explicitly chosen one already in this session.
    const themeFont = FONTS.find((f) => f.id === theme.fontId);
    if (themeFont) {
      localStorage.setItem(FONT_STORAGE_KEY, themeFont.id);
      setActiveFont(themeFont);
    }
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
    // Cascade: picking a template applies its preset theme + font (mobile-app
    // parity). User can still override theme/font afterward.
    const presetTheme = THEMES.find((t) => t.id === template.presetThemeId);
    if (presetTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, presetTheme.id);
      setActiveTheme(presetTheme);
    }
    const presetFont = FONTS.find((f) => f.id === template.presetFontId);
    if (presetFont) {
      localStorage.setItem(FONT_STORAGE_KEY, presetFont.id);
      setActiveFont(presetFont);
    }
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
