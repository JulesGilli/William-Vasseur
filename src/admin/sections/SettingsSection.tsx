import { useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { EditLangContext, Notice, SaveButton, ScreenHeader, type FieldSpec } from '../form';
import { Block } from './HomeSection';

type Value = Record<string, unknown>;

/** Who is selling. The site's three legal pages are written around these. */
const LEGAL: FieldSpec[] = [
{ kind: 'text', key: 'name', label: 'Nom complet', hint: 'Prénom et nom, comme sur ton SIRET.', fixed: true },
{ kind: 'text', key: 'siret', label: 'SIRET', hint: '14 chiffres.', fixed: true },
{
  kind: 'textarea',
  key: 'address',
  label: 'Adresse',
  rows: 3,
  hint: 'L’adresse de ton entreprise. Elle est publique : la loi l’exige sur un site qui vend.'
},
{ kind: 'text', key: 'email', label: 'Email de contact', hint: 'Vide = l’email du bloc Contact.', fixed: true },
{
  kind: 'checkbox',
  key: 'vatExempt',
  label: 'Je ne facture pas la TVA (franchise en base)',
  hint: 'Le cas d’une micro-entreprise sous le seuil. Affiche « TVA non applicable, art. 293 B du CGI ».'
},
{
  kind: 'text',
  key: 'mediator',
  label: 'Médiateur de la consommation',
  hint: 'Obligatoire pour vendre à des particuliers : le nom de l’organisme auquel tu as adhéré.',
  fixed: true
},
{ kind: 'text', key: 'mediatorUrl', label: 'Site du médiateur', fixed: true }];


const euros = (cents: unknown) => {
  const n = Number(cents);
  return Number.isFinite(n) && n > 0 ? String(n / 100).replace('.', ',') : '';
};

const cents = (text: string): number | null => {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  const n = Number(trimmed.replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};

export function SettingsSection() {
  const lang = useContext(EditLangContext);
  const [values, setValues] = useState<Record<string, Value> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.
    from('site_content').
    select('key, value').
    in('key', ['shipping', 'legal']).
    then(({ data, error }) => {
      if (error) setError(`Impossible de charger les réglages : ${error.message}`);else
      setValues(Object.fromEntries((data ?? []).map((r) => [r.key, r.value as Value])));
    });
  }, []);

  return (
    <>
      <ScreenHeader
        title="LIVRAISON & LÉGAL"
        intro="Les frais de port s’appliquent au paiement dès que tu enregistres. Les pages légales du site se remplissent toutes seules avec ce que tu indiques ici, dans les quatre langues." />

      <Notice text={error} />
      {lang !== 'en' ?
      <Notice text="Rien à traduire ici : ces réglages sont les mêmes dans toutes les langues. Repasse sur EN pour les modifier." /> :
      values ?
      <div className="flex flex-col gap-3">
          {values.shipping ? <Shipping initial={values.shipping} /> : null}
          {values.legal ?
        <Block
          blockKey="legal"
          title="Informations légales"
          fields={LEGAL}
          // Unticked only on purpose: a value never saved means exempt.
          initial={{ vatExempt: true, ...values.legal }}
          open={false} /> :

        null}
        </div> :
      error ? null : <p className="text-sm text-muted">Chargement…</p>}
    </>);

}

/** Amounts are typed in euros and stored in cents, like every price. */
function Shipping({ initial }: {initial: Value;}) {
  const start = {
    france: euros(initial.franceCents),
    europe: euros(initial.europeCents),
    freeFrom: euros(initial.freeFromCents)
  };
  const [saved, setSaved] = useState(start);
  const [draft, setDraft] = useState(start);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    const value = {
      franceCents: cents(draft.france),
      europeCents: cents(draft.europe),
      freeFromCents: cents(draft.freeFrom)
    };
    if (Object.values(value).includes(null)) return setNotice('Un des montants n’est pas un nombre.');

    setSaving(true);
    setNotice(null);
    const { data, error } = await supabase.
    from('site_content').
    update({ value, updated_at: new Date().toISOString() }).
    eq('key', 'shipping').
    select('key');
    setSaving(false);
    if (error) setNotice(`Non enregistré : ${error.message}`);else
    if (!data?.length) setNotice('Non enregistré : ce compte n’a pas le droit de modifier le site.');else
    {
      setSaved(draft);
      setNotice('Enregistré : le paiement applique ces frais dès maintenant. Publie pour mettre à jour les pages légales.');
    }
  };

  const field = (key: keyof typeof draft, label: string, hint: string) =>
  <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</span>
      <span className="mt-0.5 block text-[11px] text-muted">{hint}</span>
      <input
      inputMode="decimal"
      placeholder="0"
      value={draft[key]}
      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
      className="mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none transition-colors focus:border-ink" />

    </label>;


  return (
    <details open className="group border border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
        <span className="font-display text-sm tracking-tight">FRAIS DE PORT</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{dirty ? 'Modifié' : ''}</span>
      </summary>
      <div className="border-t border-line p-4">
        <div className="grid gap-5 sm:grid-cols-3">
          {field('france', 'France (€)', 'Par commande. Vide ou 0 = offert.')}
          {field('europe', 'Autres pays d’Europe (€)', 'Belgique, Allemagne, Espagne…')}
          {field('freeFrom', 'Offerts à partir de (€)', 'Montant du panier. Vide = jamais.')}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          L’acheteur choisit son pays dans le panier et voit le total avant de payer. La boutique livre en France,
          Belgique, Luxembourg, Allemagne, Espagne, Italie, Pays-Bas, Portugal, Autriche et Irlande.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted">{notice}</span>
          <SaveButton dirty={dirty} saving={saving} onSave={save} />
        </div>
      </div>
    </details>);

}
