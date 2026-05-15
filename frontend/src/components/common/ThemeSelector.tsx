import {
  FiCheck,
  FiSun,
  FiType,
  FiLayout,
  FiGrid,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { themePreviewColor } from '@/theme/themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import { LayoutThumb, shortLayoutLabel } from '@/components/common/LayoutThumb';

interface ThemeSelectorProps {
  buttonClassName?: string;
  iconClassName?: string;
}

export function ThemeSelector({
  buttonClassName = 'profile-action-btn',
  iconClassName = 'profile-action-icon',
}: ThemeSelectorProps = {}) {
  const {
    activeTheme, setTheme, themes,
    activeFont, setFont, fonts,
    activeTemplate, setTemplate, templates,
    activeLayout, setLayout, layouts,
  } = useTheme();

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

      <DropdownMenuContent
        align="end"
        className="profile-dropdown-content w-80 p-0 overflow-hidden"
      >
        {/* ============ COLOR ============ */}
        <div className="p-2 border-b border-border/50">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <FiGrid className="w-3 h-3" aria-hidden="true" />
            Colour
            <span className="ml-auto normal-case tracking-normal text-[11px] font-medium text-foreground">
              {activeTheme.name}
            </span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 px-2 pt-1 pb-1.5">
            {themes.map((theme) => {
              const active = activeTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`aspect-square rounded-full ring-1 ring-black/10 transition-transform hover:scale-110 ${
                    active ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ background: themePreviewColor(theme) }}
                  title={theme.name}
                  aria-label={`Color: ${theme.name}`}
                  aria-pressed={active}
                  data-edataid={`theme-select-${theme.id}`}
                  data-edatatype="CLICK"
                />
              );
            })}
          </div>
        </div>

        {/* ============ TEMPLATE ============ */}
        <div className="p-2 border-b border-border/50">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <FiLayout className="w-3 h-3" aria-hidden="true" />
            Template
            <span className="ml-auto normal-case tracking-normal text-[11px] font-medium text-foreground">
              {activeTemplate.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-2 pt-1 pb-1">
            {templates.map((tpl) => {
              const active = activeTemplate.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`text-left p-2 rounded-md border-2 transition-colors ${
                    active
                      ? 'border-sunbird-theme-accent bg-sunbird-theme-accent/5'
                      : 'border-border hover:border-sunbird-theme-accent/50'
                  }`}
                  aria-pressed={active}
                  data-edataid={`template-select-${tpl.id}`}
                  data-edatatype="CLICK"
                >
                  <div
                    className={`h-10 rounded-md mb-2 grid grid-cols-[18px_1fr] grid-rows-[10px_1fr] gap-0.5 p-0.5 ${
                      tpl.id === 'modern' ? 'bg-gray-100' : 'bg-muted'
                    }`}
                  >
                    <div className={`col-span-2 bg-sunbird-theme-accent ${tpl.id === 'modern' ? 'rounded-[1px]' : 'rounded'}`} />
                    <div className={`bg-sunbird-theme-accent/20 ${tpl.id === 'modern' ? 'rounded-[1px]' : 'rounded'}`} />
                    <div
                      className={
                        tpl.id === 'modern'
                          ? 'bg-white border border-border rounded-[1px]'
                          : 'bg-card rounded'
                      }
                    />
                  </div>
                  <div className="text-[13px] font-semibold leading-tight">{tpl.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight">
                    {tpl.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============ LAYOUT ============ */}
        <div className="p-2 pb-6 border-b border-border/50">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <FiLayout className="w-3 h-3" aria-hidden="true" />
            Layout
            <span className="ml-auto normal-case tracking-normal text-[11px] font-medium text-foreground">
              {activeLayout.name}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 px-2 pt-1">
            {layouts.map((lyt) => (
              <LayoutThumb
                key={lyt.id}
                id={lyt.id}
                label={shortLayoutLabel(lyt.id)}
                active={activeLayout.id === lyt.id}
                onClick={() => setLayout(lyt.id)}
              />
            ))}
          </div>
        </div>

        {/* ============ FONT ============ */}
        <div className="p-2">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <FiType className="w-3 h-3" aria-hidden="true" />
            Font
            <span
              className="ml-auto normal-case tracking-normal text-[11px] font-medium text-foreground"
              style={{ fontFamily: activeFont.value }}
            >
              {activeFont.name}
            </span>
          </div>
          {fonts.map((font) => {
            const active = activeFont.id === font.id;
            return (
              <button
                key={font.id}
                onClick={() => setFont(font.id)}
                className={`w-full flex items-center px-2 py-1.5 rounded text-[13px] hover:bg-accent/30 ${
                  active ? 'bg-sunbird-theme-accent/10 text-sunbird-theme-accent font-semibold' : ''
                }`}
                aria-pressed={active}
                data-edataid={`font-select-${font.id}`}
                data-edatatype="CLICK"
              >
                <span className="flex-1 text-left" style={{ fontFamily: font.value }}>
                  {font.name}
                </span>
                {active && <FiCheck className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

