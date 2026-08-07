import { InstagramIcon, MailIcon, TriangleIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-tight">
            WILLIAM VASSEUR — 3D ARTIST
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Website created by : Jules Gilli
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-8">
          <div className="flex items-center gap-4">
            <a
              href="https://www.artstation.com"
              target="_blank"
              rel="noreferrer"
              aria-label="ArtStation"
              className="text-muted transition-colors hover:text-ink">
              
              <TriangleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted transition-colors hover:text-ink">
              
              <InstagramIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Contact
            </p>
            <a
              href="mailto:contact@williamvasseur.fr"
              className="mt-1 flex items-center gap-2 text-sm transition-opacity hover:opacity-70">
              
              <MailIcon className="h-4 w-4" aria-hidden="true" />
              contact@williamvasseur.fr
            </a>
          </div>
        </div>
      </div>
    </footer>);

}