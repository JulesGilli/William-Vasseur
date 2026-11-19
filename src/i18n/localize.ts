/**
 * Content arrives in English with its translations riding along: any object
 * may carry `_i18n: { fr: {…}, de: {…}, es: {…} }`, a partial copy of its own
 * text fields. This folds one language in and drops the rest.
 *
 * A translation that is missing or empty leaves the English in place, so a
 * project William adds in a hurry still reads properly everywhere, just not
 * yet translated.
 */
const isEmpty = (value: unknown) =>
value === undefined || value === null || value === '' || Array.isArray(value) && value.length === 0;

export function localize<T>(node: T, lang: string): T {
  if (Array.isArray(node)) return node.map((item) => localize(item, lang)) as T;
  if (typeof node !== 'object' || node === null) return node;

  const { _i18n, ...rest } = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) out[key] = localize(value, lang);

  const overlay = (_i18n as Record<string, Record<string, unknown>> | undefined)?.[lang];
  if (overlay) {
    for (const [key, value] of Object.entries(overlay)) {
      if (!isEmpty(value)) out[key] = value;
    }
  }
  return out as T;
}
