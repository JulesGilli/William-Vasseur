import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './icons/Logo';
import { CartButton } from './shop/CartButton';
import { ScrollProgress } from './motion/ScrollProgress';
import { LANGS, LANG_NAMES, lang, setLang, t, type Lang } from '../i18n';

const links = [
{ to: '/', label: t.nav.home },
{ to: '/projects', label: t.nav.projects },
{ to: '/store', label: t.nav.store }];


export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showName = scrolled || pathname !== '/';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-sm">
      <ScrollProgress />
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={t.nav.homeAria}>

          <motion.span
            className="text-ink"
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            aria-hidden="true">

            <Logo className="h-7 w-7" />
          </motion.span>
          <span
            className={`hidden font-display text-sm tracking-tight transition-opacity duration-300 sm:block ${
            showName ? 'opacity-100' : 'opacity-0'}`
            }>
            
            WILLIAM VASSEUR
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ThemeToggle />
        </div>

        <nav aria-label={t.nav.main} className="flex items-center gap-2.5 sm:gap-5">
          {links.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
            `relative py-1 text-sm transition-colors ${
            isActive ? 'text-ink' : 'text-muted hover:text-ink'}`

            }>

              {({ isActive }) =>
            <>
                  {link.label}
                  {/* A single marker travels between links rather than blinking. */}
                  {isActive ?
              <motion.span
                layoutId="nav-marker"
                aria-hidden="true"
                // Centred with auto margins rather than a translate class, which
                // the layout animation's inline transform would override.
                className="absolute -bottom-0.5 left-0 right-0 mx-auto h-1 w-1 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }} /> :

              null}
                </>
            }
            </NavLink>
          )}
          <CartButton />
          {/* A native select: four options do not earn a custom menu, and this
              one is keyboard- and touch-correct for free. Changing it reloads
              the page in the chosen language. */}
          <select
            aria-label={t.nav.language}
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="cursor-pointer appearance-none border border-line bg-bg px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted outline-none transition-colors hover:border-ink hover:text-ink focus-visible:border-ink">

            {LANGS.map((code) =>
            <option key={code} value={code} title={LANG_NAMES[code]}>
                {code.toUpperCase()}
              </option>
            )}
          </select>
          <span className="md:hidden">
            <ThemeToggle compact />
          </span>
        </nav>
      </div>
    </header>);

}