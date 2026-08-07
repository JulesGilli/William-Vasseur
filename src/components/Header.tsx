import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const links = [
{ to: '/', label: 'Home' },
{ to: '/projects', label: 'Projects' },
{ to: '/store', label: 'Store' }];


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
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="William Vasseur — accueil">
          
          <span
            className="flex h-7 w-7 items-center justify-center bg-ink font-display text-[11px] leading-none text-bg"
            aria-hidden="true">
            
            W
          </span>
          <span
            className={`hidden font-display text-xs tracking-tight transition-opacity duration-300 sm:block ${
            showName ? 'opacity-100' : 'opacity-0'}`
            }>
            
            WILLIAM VASSEUR
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ThemeToggle />
        </div>

        <nav aria-label="Navigation principale" className="flex items-center gap-5">
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
                  <span
                aria-hidden="true"
                className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0'}`
                } />
              
                </>
            }
            </NavLink>
          )}
          <span className="md:hidden">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>);

}