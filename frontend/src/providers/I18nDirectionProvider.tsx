import React, { useEffect } from 'react';
import { useAppI18n } from '../hooks/useAppI18n';
import { useTheme } from './ThemeProvider';

export default function I18nDirectionProvider({ children }: { children: React.ReactNode }) {
  const { dir, currentCode, currentLanguage } = useAppI18n();
  const { activeFont } = useTheme();

  const fontValue = currentLanguage.forceFont ? currentLanguage.font : activeFont.value;

  useEffect(() => {
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.documentElement.lang = currentCode;
    document.documentElement.style.setProperty('--app-font-family', fontValue);
  }, [dir, currentCode, fontValue]);

  return <>{children}</>;
}
