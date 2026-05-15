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

export const THEMES: Theme[] = [
  {
    id: 'terracotta',
    name: 'Sunbird Spark',
    seeds: {
      primaryH: 12,
      primaryS: '50%',
      primaryL: '45%',
      chipH: 45,
      chipS: '100%',
      iconH: 28,
    },
  },
  {
    id: 'blue',
    name: 'Professional',
    seeds: {
      primaryH: 217,
      primaryS: '71%',
      primaryL: '46%',
      chipH: 217,
      chipS: '71%',
      iconH: 200,
    },
  },
  {
    id: 'teal',
    name: 'Nature',
    seeds: {
      primaryH: 180,
      primaryS: '38%',
      primaryL: '38%',
      chipH: 180,
      chipS: '38%',
      iconH: 170,
    },
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
