import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import I18nDirectionProvider from './I18nDirectionProvider';
import { useAppI18n } from '../hooks/useAppI18n';
import { useTheme } from './ThemeProvider';

vi.mock('../hooks/useAppI18n', () => ({
  useAppI18n: vi.fn(),
}));

vi.mock('./ThemeProvider', () => ({
  useTheme: vi.fn(),
}));

const mockTheme = (fontValue: string) => {
  (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    activeFont: { id: 'mock', name: 'Mock', value: fontValue },
  });
};

describe('I18nDirectionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.dir = '';
    document.body.dir = '';
    document.documentElement.lang = '';
    document.documentElement.style.removeProperty('--app-font-family');
  });

  it('forces Arabic font when current language is RTL, ignoring theme font', () => {
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'rtl',
      currentCode: 'ar',
      currentLanguage: { font: "'Noto Sans Arabic', sans-serif", forceFont: true },
    });
    mockTheme("'Satisfy', cursive");

    render(
      <I18nDirectionProvider>
        <div>child</div>
      </I18nDirectionProvider>
    );

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.body.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.style.getPropertyValue('--app-font-family'))
      .toBe("'Noto Sans Arabic', sans-serif");
  });

  it('uses the active theme font for LTR languages', () => {
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'ltr',
      currentCode: 'en',
      currentLanguage: { font: "'Rubik', sans-serif" },
    });
    mockTheme("'Satisfy', cursive");

    render(
      <I18nDirectionProvider>
        <div>child</div>
      </I18nDirectionProvider>
    );

    expect(document.documentElement.style.getPropertyValue('--app-font-family'))
      .toBe("'Satisfy', cursive");
  });

  it('preserves the user theme font across LTR → RTL → LTR switches', () => {
    // Start LTR with Satisfy
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'ltr',
      currentCode: 'en',
      currentLanguage: { font: "'Rubik', sans-serif" },
    });
    mockTheme("'Satisfy', cursive");

    const { rerender } = render(
      <I18nDirectionProvider>
        <div>child</div>
      </I18nDirectionProvider>
    );

    expect(document.documentElement.style.getPropertyValue('--app-font-family'))
      .toBe("'Satisfy', cursive");

    // Switch to Arabic — forced Noto Sans Arabic
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'rtl',
      currentCode: 'ar',
      currentLanguage: { font: "'Noto Sans Arabic', sans-serif", forceFont: true },
    });
    rerender(
      <I18nDirectionProvider>
        <div>child</div>
      </I18nDirectionProvider>
    );

    expect(document.documentElement.style.getPropertyValue('--app-font-family'))
      .toBe("'Noto Sans Arabic', sans-serif");

    // Switch back to English — theme's Satisfy must be restored
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'ltr',
      currentCode: 'en',
      currentLanguage: { font: "'Rubik', sans-serif" },
    });
    rerender(
      <I18nDirectionProvider>
        <div>child</div>
      </I18nDirectionProvider>
    );

    expect(document.documentElement.style.getPropertyValue('--app-font-family'))
      .toBe("'Satisfy', cursive");
  });

  it('renders children correctly', () => {
    (useAppI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      dir: 'ltr',
      currentCode: 'en',
      currentLanguage: { font: "'Rubik', sans-serif" },
    });
    mockTheme("'Rubik', sans-serif");

    const { getByText } = render(
      <I18nDirectionProvider>
        <div>Hello World</div>
      </I18nDirectionProvider>
    );

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
