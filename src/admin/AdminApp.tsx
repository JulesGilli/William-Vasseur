import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogOutIcon } from 'lucide-react';
import { supabase } from './supabase';
import { HomeSection } from './sections/HomeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ShopSection } from './sections/ShopSection';
import { OrdersSection } from './sections/OrdersSection';
import { PublishSection } from './sections/PublishSection';
import { AccountSection } from './sections/AccountSection';

const SECTIONS = [
{ id: 'home', label: 'Accueil', hint: 'Textes et pièce de la page d’accueil', Component: HomeSection },
{ id: 'projects', label: 'Projets', hint: 'Rendus, étapes, modèles 3D', Component: ProjectsSection },
{ id: 'shop', label: 'Boutique', hint: 'Produits, prix, stock', Component: ShopSection },
{ id: 'orders', label: 'Commandes', hint: 'Ce qui a été acheté', Component: OrdersSection },
{ id: 'publish', label: 'Publier', hint: 'Mettre le site à jour', Component: PublishSection },
{ id: 'account', label: 'Mon compte', hint: 'Changer de mot de passe', Component: AccountSection }] as
const;

type SectionId = (typeof SECTIONS)[number]['id'];

/**
 * William's editor. Sign in, prove you are an admin, then edit — the
 * database refuses every write from anyone who is not, so the checks here are
 * about telling the person what is going on, not about security.
 */
export function AdminApp() {
  // undefined while the stored session is being read, null once known absent.
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase.
    from('admins').
    select('user_id').
    eq('user_id', session.user.id).
    maybeSingle().
    then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);

  if (session === undefined || session && isAdmin === null) return <Centered>Chargement…</Centered>;
  if (!session) return <Login />;
  if (!isAdmin) return <NotAdmin email={session.user.email ?? ''} />;
  return <Shell email={session.user.email ?? ''} />;
}

function Centered({ children }: {children: ReactNode;}) {
  return (
    <main className="blueprint-grid flex min-h-screen items-center justify-center bg-bg px-4 text-ink">
      <div className="w-full max-w-sm">{children}</div>
    </main>);

}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setError(
        error.message === 'Invalid login credentials' ?
        'Email ou mot de passe incorrect.' :
        `Connexion impossible : ${error.message}`
      );
    }
  };

  return (
    <Centered>
      <form onSubmit={submit} className="border border-line bg-bg p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Éditeur</p>
        <h1 className="mt-2 font-display text-2xl tracking-tight">WILLIAM VASSEUR</h1>
        <p className="mt-2 text-sm text-muted">Connecte-toi pour modifier le site.</p>

        <label className="mt-6 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none focus:border-ink" />

        </label>
        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none focus:border-ink" />

        </label>

        {error ?
        <p role="alert" className="mt-4 text-sm text-ink">
            {error}
          </p> :
        null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-ink px-5 py-2.5 font-display text-sm tracking-tight text-bg transition-opacity disabled:opacity-50">

          {busy ? 'CONNEXION…' : 'SE CONNECTER'}
        </button>
      </form>
    </Centered>);

}

function NotAdmin({ email }: {email: string;}) {
  return (
    <Centered>
      <div className="border border-line p-6">
        <h1 className="font-display text-xl tracking-tight">PAS D’ACCÈS</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Le compte <span className="text-ink">{email}</span> est bien connecté, mais il n’a pas
          les droits pour modifier le site.
        </p>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="mt-5 border border-line px-4 py-2 text-sm transition-colors hover:border-ink">

          Se déconnecter
        </button>
      </div>
    </Centered>);

}

function Shell({ email }: {email: string;}) {
  const [current, setCurrent] = useState<SectionId>('home');
  const section = SECTIONS.find((s) => s.id === current) ?? SECTIONS[0];
  const Section = section.Component;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Éditeur</p>
            <p className="font-display text-sm tracking-tight">WILLIAM VASSEUR</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-muted sm:inline">{email}</span>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              aria-label="Se déconnecter"
              className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

              <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr] lg:gap-10">
        <nav aria-label="Sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => {
            const active = s.id === current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(s.id)}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 border px-3 py-2 text-left transition-colors ${
                active ? 'border-ink bg-surface/60' : 'border-transparent hover:border-line'}`
                }>

                <span className="block text-sm">{s.label}</span>
                <span className="hidden text-[11px] text-muted lg:block">{s.hint}</span>
              </button>);

          })}
        </nav>

        <main className="min-w-0">
          <Section />
        </main>
      </div>
    </div>);

}
