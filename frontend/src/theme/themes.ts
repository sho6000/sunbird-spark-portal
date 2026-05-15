export interface ThemeSeeds {
  primaryH: number;
  primaryS: string;
  primaryL: string;
  chipH: number;
  chipS: string;
  iconH: number;
}

export interface Theme {
  id: string;
  name: string;
  seeds: ThemeSeeds;
}

export interface FontOption {
  id: string;
  name: string;
  value: string;
}

export interface TemplateOption {
  id: 'classic' | 'modern';
  name: string;
  description: string;
}

export type LayoutId = 'sidebar-left' | 'sidebar-right' | 'top' | 'bottom';

export interface LayoutOption {
  id: LayoutId;
  name: string;
}

export const THEMES: Theme[] = [
  {
    id: 'terracotta',
    name: 'Sunbird Spark',
    seeds: { primaryH: 12, primaryS: '50%', primaryL: '45%', chipH: 45, chipS: '100%', iconH: 28 },
  },
  {
    id: 'blue',
    name: 'Professional',
    seeds: { primaryH: 217, primaryS: '71%', primaryL: '46%', chipH: 217, chipS: '71%', iconH: 200 },
  },
  {
    id: 'teal',
    name: 'Nature',
    seeds: { primaryH: 180, primaryS: '38%', primaryL: '38%', chipH: 180, chipS: '38%', iconH: 170 },
  },
  {
    id: 'purple',
    name: 'Royal',
    seeds: { primaryH: 265, primaryS: '50%', primaryL: '45%', chipH: 265, chipS: '50%', iconH: 255 },
  },
  {
    id: 'green',
    name: 'Forest',
    seeds: { primaryH: 145, primaryS: '45%', primaryL: '35%', chipH: 145, chipS: '45%', iconH: 155 },
  },
  {
    id: 'indigo',
    name: 'Ocean',
    seeds: { primaryH: 235, primaryS: '65%', primaryL: '48%', chipH: 235, chipS: '65%', iconH: 220 },
  },
  {
    id: 'rose',
    name: 'Blossom',
    seeds: { primaryH: 345, primaryS: '60%', primaryL: '45%', chipH: 345, chipS: '60%', iconH: 335 },
  },
  {
    id: 'amber',
    name: 'Sunrise',
    seeds: { primaryH: 35, primaryS: '80%', primaryL: '45%', chipH: 35, chipS: '80%', iconH: 25 },
  },
];

export const FONTS: FontOption[] = [
  { id: 'poppins', name: 'Poppins', value: "'Poppins', sans-serif" },
  { id: 'rubik', name: 'Rubik', value: "'Rubik', sans-serif" },
  { id: 'inter', name: 'Inter', value: "'Inter', sans-serif" },
  { id: 'satisfy', name: 'Satisfy', value: "'Satisfy', cursive" },
];

export const DEFAULT_THEME_ID = 'terracotta';
export const DEFAULT_FONT_ID = 'poppins';
export const DEFAULT_TEMPLATE_ID: TemplateOption['id'] = 'classic';
export const DEFAULT_LAYOUT_ID: LayoutId = 'sidebar-left';

export const TEMPLATES: TemplateOption[] = [
  { id: 'classic', name: 'Classic', description: 'Warm, rounded' },
  { id: 'modern', name: 'Modern', description: 'Sharp, bold' },
];

export const LAYOUTS: LayoutOption[] = [
  { id: 'sidebar-left', name: 'Left Sidebar' },
  { id: 'sidebar-right', name: 'Right Sidebar' },
  { id: 'top', name: 'Top Nav' },
  { id: 'bottom', name: 'Bottom Nav' },
];

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const { seeds } = theme;
  root.style.setProperty('--sunbird-spark-theme-primary-h', String(seeds.primaryH));
  root.style.setProperty('--sunbird-spark-theme-primary-s', seeds.primaryS);
  root.style.setProperty('--sunbird-spark-theme-primary-l', seeds.primaryL);
  root.style.setProperty('--sunbird-spark-theme-chip-h', String(seeds.chipH));
  root.style.setProperty('--sunbird-spark-theme-chip-s', seeds.chipS);
  root.style.setProperty('--sunbird-spark-theme-icon-h', String(seeds.iconH));
}

export function applyFont(font: FontOption): void {
  document.documentElement.style.setProperty('--app-font-family', font.value);
}

export function applyTemplate(id: TemplateOption['id']): void {
  document.documentElement.setAttribute('data-template', id);
}

export function applyLayout(id: LayoutId): void {
  document.documentElement.setAttribute('data-layout', id);
}

export function themePreviewColor(theme: Theme): string {
  const { primaryH, primaryS, primaryL } = theme.seeds;
  return `hsl(${primaryH} ${primaryS} ${primaryL})`;
}
