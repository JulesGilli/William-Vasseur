import en, { type Dictionary } from './en';
import fr from './fr';
import de from './de';
import es from './es';
import { lang, type Lang } from './lang';

const dictionaries: Record<Lang, Dictionary> = { en, fr, de, es };

/** The interface's own words, in this visit's language. */
export const t: Dictionary = dictionaries[lang];

export { lang, setLang, LANGS, LANG_NAMES, type Lang } from './lang';
export { localize } from './localize';
