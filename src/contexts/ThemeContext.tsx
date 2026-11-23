import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState } from
'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'wv.theme';
const query = () => window.matchMedia('(prefers-color-scheme: dark)');

/** A choice made with the toggle, if there is one. */
function stored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

const system = (): Theme => query().matches ? 'dark' : 'light';

/**
 * Follows the visitor's system theme, as William asked, until they use the
 * toggle; from then on their choice wins and is remembered.
 */
export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setTheme] = useState<Theme>(() => stored() ?? system());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  // The system switching to dark at sunset carries the site along with it,
  // unless the visitor has picked a side.
  useEffect(() => {
    const media = query();
    const follow = () => {
      if (!stored()) setTheme(system());
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Without storage the choice lasts for this visit only.
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>);

}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
