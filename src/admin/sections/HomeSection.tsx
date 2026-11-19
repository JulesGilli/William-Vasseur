import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { clean, FieldsEditor, Notice, SaveButton, ScreenHeader, type FieldSpec } from '../form';

type Value = Record<string, unknown>;

/** The home page, block by block, in the order they appear on the page. */
const BLOCKS: {key: string;title: string;fields: FieldSpec[];}[] = [
{
  key: 'hero',
  title: 'En-tête',
  fields: [
  { kind: 'textarea', key: 'tagline', label: 'Accroche', rows: 2 },
  { kind: 'text', key: 'location', label: 'Lieu' },
  {
    kind: 'group',
    key: 'piece',
    label: 'Pièce en vedette',
    fields: [
    { kind: 'text', key: 'title', label: 'Nom' },
    { kind: 'text', key: 'spec', label: 'Légende technique', hint: 'Par exemple « GLB · 16K TRIS ».', fixed: true },
    {
      kind: 'media',
      key: 'model',
      label: 'Modèle 3D (.glb)',
      accept: 'model',
      folder: 'models',
      hint: 'L’export Blender tel quel : il est optimisé à la publication.'
    },
    { kind: 'media', key: 'poster', label: 'Image de chargement', accept: 'image', folder: 'posters' }]

  }]

},
{
  key: 'band',
  title: 'Bandeau défilant',
  fields: [{ kind: 'lines', key: 'words', label: 'Mots', hint: 'Un mot ou une expression par ligne.' }]
},
{
  key: 'about',
  title: 'À propos',
  fields: [
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'media', key: 'portrait', label: 'Photo', accept: 'image', folder: 'about' },
  { kind: 'text', key: 'portraitLabel', label: 'Légende de la photo' },
  { kind: 'paragraphs', key: 'paragraphs', label: 'Texte' },
  {
    kind: 'list',
    key: 'stats',
    label: 'Chiffres',
    item: [
    { kind: 'text', key: 'term', label: 'Intitulé' },
    { kind: 'text', key: 'value', label: 'Valeur' }],

    itemTitle: (v) => String(v.term || 'Nouvelle ligne'),
    newItem: () => ({ term: '', value: '' })
  }]

},
{
  key: 'tools',
  title: 'Outils',
  fields: [
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'textarea', key: 'intro', label: 'Introduction' },
  {
    kind: 'list',
    key: 'tools',
    label: 'Logiciels',
    item: [
    { kind: 'text', key: 'name', label: 'Nom', fixed: true },
    { kind: 'text', key: 'role', label: 'À quoi il sert' },
    {
      kind: 'select',
      key: 'icon',
      label: 'Icône',
      options: [
      { value: 'blender', label: 'Blender' },
      { value: 'unreal', label: 'Unreal Engine' },
      { value: 'resolve', label: 'DaVinci Resolve' },
      { value: 'nomad', label: 'Nomad Sculpt' }]

    }],

    itemTitle: (v) => String(v.name || 'Nouveau logiciel'),
    newItem: () => ({ name: '', role: '', icon: 'blender' })
  }]

},
{
  key: 'process',
  title: 'Process',
  fields: [
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'text', key: 'project', label: 'Projet présenté', hint: 'Affiché à droite du titre, ex. « Navana · 2026 ».' },
  {
    kind: 'list',
    key: 'stages',
    label: 'Étapes',
    hint: 'Dans l’ordre où tu les as faites : la numérotation suit.',
    item: [
    { kind: 'text', key: 'label', label: 'Étape' },
    { kind: 'text', key: 'tool', label: 'Outil' },
    { kind: 'textarea', key: 'caption', label: 'Légende', rows: 3 },
    { kind: 'media', key: 'image', label: 'Image', accept: 'image', folder: 'process' },
    {
      kind: 'media',
      key: 'video',
      label: 'Vidéo (facultatif)',
      accept: 'video',
      folder: 'process',
      optional: true,
      hint: 'Un timelapse en .mp4 : il avance au rythme du scroll.'
    }],

    itemTitle: (v, i) => `${String(i + 1).padStart(2, '0')} — ${v.label || 'Nouvelle étape'}`,
    newItem: () => ({ label: '', tool: '', caption: '', image: '' })
  }]

},
{
  key: 'physical',
  title: 'Œuvres physiques',
  fields: [
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'textarea', key: 'intro', label: 'Texte' }]

},
{
  key: 'cta',
  title: 'Appel final',
  fields: [
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'textarea', key: 'text', label: 'Texte', rows: 3 },
  { kind: 'text', key: 'button', label: 'Texte du bouton' }]

},
{
  key: 'contact',
  title: 'Contact',
  fields: [
  { kind: 'text', key: 'email', label: 'Email', fixed: true },
  { kind: 'text', key: 'artstation', label: 'Lien ArtStation', fixed: true },
  { kind: 'text', key: 'instagram', label: 'Lien Instagram', fixed: true }]

}];


export function HomeSection() {
  const [values, setValues] = useState<Record<string, Value> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.
    from('site_content').
    select('key, value').
    then(({ data, error }) => {
      if (error) setError(`Impossible de charger les textes : ${error.message}`);else
      setValues(Object.fromEntries((data ?? []).map((r) => [r.key, r.value as Value])));
    });
  }, []);

  return (
    <>
      <ScreenHeader
        title="ACCUEIL"
        intro="Chaque bloc s’enregistre séparément. Le site public change quand tu publies." />

      <Notice text={error} />
      {values ?
      <div className="flex flex-col gap-3">
          {BLOCKS.map((block, i) =>
        values[block.key] ?
        <Block
          key={block.key}
          blockKey={block.key}
          title={block.title}
          fields={block.fields}
          initial={values[block.key]}
          open={i === 0} /> :

        null
        )}
        </div> :
      error ? null : <p className="text-sm text-muted">Chargement…</p>}
    </>);

}

export function Block({
  blockKey,
  title,
  fields,
  initial,
  open






}: {blockKey: string;title: string;fields: FieldSpec[];initial: Value;open: boolean;}) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    setNotice(null);
    const value = clean(fields, draft);
    const { data, error } = await supabase.
    from('site_content').
    update({ value, updated_at: new Date().toISOString() }).
    eq('key', blockKey).
    select('key');
    setSaving(false);
    if (error) {
      setNotice(`Non enregistré : ${error.message}`);
    } else if (!data?.length) {
      // The database answers an unauthorised update with silence, not an
      // error; zero rows back is how a refusal shows up.
      setNotice('Non enregistré : ce compte n’a pas le droit de modifier le site.');
    } else {
      setSaved(value);
      setDraft(value);
      setNotice('Enregistré. Publie pour le voir sur le site.');
    }
  };

  return (
    <details open={open} className="group border border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
        <span className="font-display text-sm tracking-tight">{title.toUpperCase()}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {dirty ? 'Modifié' : ''}
        </span>
      </summary>
      <div className="border-t border-line p-4">
        <FieldsEditor fields={fields} value={draft} onChange={setDraft} />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted">{notice}</span>
          <SaveButton dirty={dirty} saving={saving} onSave={save} />
        </div>
      </div>
    </details>);

}
