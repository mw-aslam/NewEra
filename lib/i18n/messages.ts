import uz from '@/messages/uz.json';
import ru from '@/messages/ru.json';
import en from '@/messages/en.json';

/**
 * The dictionary, shared by both sides of the app.
 *
 * Deliberately free of React so a Server Component can translate during render
 * — the client hook and the server helper read exactly the same strings.
 */
export type Locale = 'uz' | 'ru' | 'en';

export const LOCALES: Locale[] = ['uz', 'ru', 'en'];
export const DEFAULT_LOCALE: Locale = 'uz';

export const messages: Record<Locale, Record<string, unknown>> = { uz, ru, en };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}

/** Values substituted into `{placeholder}` slots. */
export type TranslateParams = Record<string, string | number>;

/**
 * Dotted lookup. Returns the key itself when a string is missing, never blank.
 *
 * `{name}` placeholders are filled from `params`. A placeholder with no value
 * is left as-is rather than blanked, so a missing argument is visible in the
 * page instead of silently producing a sentence with a hole in it.
 */
export function translate(locale: Locale, key: string, params?: TranslateParams): string {
  const walk = (dict: Record<string, unknown>): string | null => {
    let current: unknown = dict;
    for (const part of key.split('.')) {
      if (!current || typeof current !== 'object' || !(part in current)) return null;
      current = (current as Record<string, unknown>)[part];
    }
    return typeof current === 'string' ? current : null;
  };

  // Fall back to Uzbek before falling back to the raw key, so a gap in one
  // language shows real text rather than "courses.title".
  const text = walk(messages[locale]) ?? walk(messages[DEFAULT_LOCALE]) ?? key;
  if (!params) return text;

  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export type Translator = (key: string, params?: TranslateParams) => string;

export function translatorFor(locale: Locale): Translator {
  return (key, params) => translate(locale, key, params);
}
