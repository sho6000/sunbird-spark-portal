import { FiCheck, FiSun, FiType } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';

const THEME_DOTS: Record<string, string> = {
  terracotta: 'bg-[hsl(12_50%_45%)]',
  blue: 'bg-[hsl(217_71%_46%)]',
  teal: 'bg-[hsl(180_38%_38%)]',
};

interface ThemeSelectorProps {
  buttonClassName?: string;
  iconClassName?: string;
}

export function ThemeSelector({
  buttonClassName = 'profile-action-btn',
  iconClassName = 'profile-action-icon',
}: ThemeSelectorProps = {}) {
  const { activeTheme, setTheme, themes, activeFont, setFont, fonts } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={buttonClassName}
          aria-label="Change theme"
          data-edataid="theme-selector-btn"
          data-edatatype="CLICK"
          title="Change theme"
        >
          <FiSun className={iconClassName} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="profile-dropdown-content w-48">
        <DropdownMenuLabel className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <FiSun className="w-3 h-3" aria-hidden="true" />
          Colour
        </DropdownMenuLabel>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            className="profile-dropdown-item"
            onSelect={() => setTheme(theme.id)}
            data-edataid={`theme-select-${theme.id}`}
            data-edatatype="CLICK"
          >
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${THEME_DOTS[theme.id]}`}
              aria-hidden="true"
            />
            <span className="flex-1">{theme.name}</span>
            {activeTheme.id === theme.id && (
              <FiCheck className="w-3.5 h-3.5 text-sunbird-theme-accent shrink-0" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <FiType className="w-3 h-3" aria-hidden="true" />
          Font
        </DropdownMenuLabel>
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.id}
            className="profile-dropdown-item"
            onSelect={() => setFont(font.id)}
            data-edataid={`font-select-${font.id}`}
            data-edatatype="CLICK"
          >
            <span
              className="flex-1 truncate"
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </span>
            {activeFont.id === font.id && (
              <FiCheck className="w-3.5 h-3.5 text-sunbird-theme-accent shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
