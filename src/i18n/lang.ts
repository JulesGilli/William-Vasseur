/**
 * Which language this visit is in.
 *
 * Decided once, before anything renders, and fixed for the life of the page:
 * switching language reloads. That keeps every module free to read `lang`,
 * the dictionary and the localized content as plain constants — no context,
 * no hook, nothing to forget to subscribe to — at the cost of one reload on
 * an action a visitor takes once, if ever.
 */
export const LANGS = ['en', 'fr', 'de', 'es'] as const;

export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
};

const STORAGE_KEY = 'wv.lang';

const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

function detect(): Lang {
  try {
    // A link can carry its language (?lang=fr); it wins, and sticks.
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (isLang(fromUrl)) {
      localStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // Private browsing: fall through to what the browser asks for.
  }
  for (const wanted of navigator.languages ?? [navigator.language]) {
    const short = wanted.slice(0, 2).toLowerCase();
    if (isLang(short)) return short;
  }
  return 'en';
}

export const lang: Lang = detect();

document.documentElement.lang = lang;

export function setLang(next: Lang) {
  if (next === lang) return;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Without storage the choice has to travel in the address instead.
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', next);
  window.location.assign(url);
}
