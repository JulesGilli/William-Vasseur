import { useState } from 'react';
import { supabase } from '../supabase';
import { Notice, ScreenHeader } from '../form';

/**
 * Rebuild the public site from what is saved. Saving and publishing are
 * separate on purpose: William can rework a project over several sittings
 * and the site only changes when he says so.
 */
export function PublishSection() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const publish = async () => {
    setBusy(true);
    setNotice(null);
    const { error } = await supabase.functions.invoke('publish', { method: 'POST' });
    setBusy(false);
    setNotice(
      error ?
      `Publication impossible : ${error.message}` :
      'C’est parti. Le site sera à jour dans environ deux minutes.'
    );
  };

  return (
    <>
      <ScreenHeader
        title="PUBLIER"
        intro="Tes modifications sont enregistrées mais pas encore en ligne. Publier reconstruit le site avec tout ce qui est enregistré : textes, projets, images, modèles 3D." />

      <Notice text={notice} />
      <div className="border border-line p-5">
        <ul className="flex flex-col gap-2 text-sm text-muted">
          <li>Compte environ deux minutes avant de voir le changement en ligne.</li>
          <li>Les modèles 3D sont optimisés à ce moment-là : un gros modèle allonge l’attente.</li>
          <li>Si quelque chose ne va pas, le site en ligne reste tel qu’il était.</li>
        </ul>
        <button
          type="button"
          onClick={publish}
          disabled={busy}
          className="mt-6 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-tight text-bg transition-opacity disabled:opacity-50">

          {busy ? 'PUBLICATION…' : 'PUBLIER LE SITE'}
        </button>
      </div>
    </>);

}
