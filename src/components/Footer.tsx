import { InstagramIcon, MailIcon, TriangleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { site } from '../data/content';
import { t } from '../i18n';
import { legalReady } from '../lib/legal';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-tight">
            {t.footer.title}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            {t.footer.credit}
          </p>
          {/* A shop has to say who is selling and on what terms. Held back
              until William has filled those details in, so the footer never
              links to pages with blanks in them. */}
          {legalReady ?
          <nav aria-label={t.footer.legal} className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
              <Link to="/legal" className="transition-colors hover:text-ink">{t.footer.legal}</Link>
              <Link to="/terms" className="transition-colors hover:text-ink">{t.footer.terms}</Link>
              <Link to="/privacy" className="transition-colors hover:text-ink">{t.footer.privacy}</Link>
            </nav> :
          null}
        </div>

        <div className="flex flex-wrap items-end gap-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {t.footer.social}
            </p>
            <div className="mt-2 flex items-center gap-4">
              <a
                href={site.contact.artstation}
                target="_blank"
                rel="noreferrer"
                aria-label={t.footer.artstation}
                className="text-muted transition-colors hover:text-ink">

                <TriangleIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={t.footer.instagram}
                className="text-muted transition-colors hover:text-ink">

                <InstagramIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {t.footer.contact}
            </p>
            <a
              href={`mailto:${site.contact.email}`}
              // mt-2 like the icon row beside it: these two rows are the same height,
              // so matching the gap is what puts CONTACT and SOCIAL MEDIA on one line.
              className="mt-2 flex items-center gap-2 text-sm transition-opacity hover:opacity-70">
              
              <MailIcon className="h-4 w-4" aria-hidden="true" />
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>);

}