import { useState, type FormEvent } from 'react';
import { supabase } from '../supabase';
import { Notice, ScreenHeader } from '../form';

/**
 * Change the password of whoever is signed in. Accounts are created for
 * William with a temporary password; this is where he replaces it.
 */
export function AccountSection() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setNotice('Les deux mots de passe ne sont pas identiques.');
      return;
    }
    setBusy(true);
    setNotice(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setNotice(
        error.code === 'same_password' ?
        'C’est déjà ton mot de passe actuel : choisis-en un autre.' :
        error.code === 'weak_password' ?
        'Mot de passe trop court : au moins 8 caractères.' :
        `Changement impossible : ${error.message}`
      );
      return;
    }
    setPassword('');
    setConfirm('');
    setNotice('Mot de passe changé. Utilise le nouveau à ta prochaine connexion.');
  };

  return (
    <>
      <ScreenHeader title="MON COMPTE" intro="Remplace le mot de passe qu’on t’a donné par le tien." />

      <Notice text={notice} />
      <form onSubmit={submit} className="max-w-sm border border-line p-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Nouveau mot de passe</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none focus:border-ink" />

        </label>
        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Encore une fois</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none focus:border-ink" />

        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-6 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-tight text-bg transition-opacity disabled:opacity-50">

          {busy ? 'ENREGISTREMENT…' : 'CHANGER LE MOT DE PASSE'}
        </button>
      </form>
    </>);

}
