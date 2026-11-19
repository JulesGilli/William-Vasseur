import { NavLink } from 'react-router-dom';
import { SplitText } from '../components/motion/SplitText';
import { Reveal } from '../components/motion/Reveal';
import { site } from '../data/content';
import { lang, t, type Lang } from '../i18n';
import legalEn from '../i18n/legal/en';
import legalFr from '../i18n/legal/fr';
import legalDe from '../i18n/legal/de';
import legalEs from '../i18n/legal/es';
import type { LegalPage, LegalWriter } from '../i18n/legal/types';
import { seller, vatExempt } from '../lib/legal';
import { formatPrice, shipCountries } from '../lib/shop/types';

const writers: Record<Lang, LegalWriter> = { en: legalEn, fr: legalFr, de: legalDe, es: legalEs };

const PAGES: {page: LegalPage;label: string;}[] = [
{ page: 'legal', label: t.footer.legal },
{ page: 'terms', label: t.footer.terms },
{ page: 'privacy', label: t.footer.privacy }];


/**
 * Legal notice, terms of sale and privacy: one layout, three texts. The texts
 * are templates filled with what William entered in the editor, so a blank
 * there shows here as a marked gap rather than as a sentence that reads fine
 * and says nothing.
 */
export function Legal({ page }: {page: LegalPage;}) {
  const gap = `[${t.legal.missing}]`;
  const rates = site.shipping ?? { franceCents: 0, europeCents: 0, freeFromCents: 0 };
  const amount = (cents: number) => cents > 0 ? formatPrice(cents) : null;

  const doc = writers[lang]({
    name: seller.name || gap,
    siret: seller.siret || gap,
    // Entered on several lines; read here as one.
    address: seller.address.split('\n').map((line) => line.trim()).filter(Boolean).join(', ') || gap,
    email: seller.email || site.contact.email,
    mediator: seller.mediator || gap,
    mediatorUrl: seller.mediatorUrl,
    vatExempt,
    shipFrance: amount(rates.franceCents),
    shipEurope: amount(rates.europeCents),
    freeFrom: amount(rates.freeFromCents),
    countries: shipCountries.map((code) => t.cart.countries[code]).join(', ')
  })[page];

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <header className="border-b border-line pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {t.legal.sheet}
        </span>
        <SplitText
          as="h1"
          by="letter"
          text={doc.title}
          className="mt-3 font-display text-2xl tracking-tight sm:text-4xl" />

      </header>

      <nav aria-label={t.footer.legal} className="flex flex-wrap gap-2 border-b border-line py-4">
        {PAGES.map((entry) =>
        <NavLink
          key={entry.page}
          to={`/${entry.page}`}
          className={({ isActive }) =>
          `rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
          isActive ? 'border-ink bg-ink text-bg' : 'border-line text-muted hover:border-ink hover:text-ink'}`
          }>

            {entry.label}
          </NavLink>
        )}
      </nav>

      <Reveal>
        {/* A reading measure, on the page's own paper rather than the grid. */}
        <div className="max-w-2xl bg-bg py-10">
          {t.legal.frenchPrevails ?
          <p className="mb-8 border border-line px-4 py-3 text-xs leading-relaxed text-muted">
              {t.legal.frenchPrevails}
            </p> :
          null}

          {doc.sections.map((section) =>
          <section key={section.heading} className="mb-9">
              <h2 className="font-display text-sm tracking-tight">{section.heading.toUpperCase()}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {section.body.map((paragraph) =>
              <p key={paragraph}>{paragraph}</p>
              )}
              </div>
            </section>
          )}
        </div>
      </Reveal>
    </main>);

}
