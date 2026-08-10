import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Inside the border the track is 72px wide. The 32px knob is inset 2px, so it
  // travels 36px and leaves the same 2px at either end; the 11px padding lands
  // each 14px icon on the centre of the knob that covers it.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="group relative flex h-8 w-[74px] items-center justify-between rounded-full border border-line px-[11px] transition-colors hover:border-ink">

      <span
        className={`absolute top-1/2 h-6 w-8 -translate-y-1/2 rounded-full bg-ink transition-transform duration-300 ease-out ${
        isDark ? 'translate-x-0' : 'translate-x-[36px]'}`
        }
        style={{ left: 2 }}
        aria-hidden="true" />
      
      <MoonIcon
        className={`relative z-10 h-3.5 w-3.5 transition-colors ${
        isDark ? 'text-bg' : 'text-muted'}`
        }
        aria-hidden="true" />
      
      <SunIcon
        className={`relative z-10 h-3.5 w-3.5 transition-colors ${
        isDark ? 'text-muted' : 'text-bg'}`
        }
        aria-hidden="true" />
      
    </button>);

}