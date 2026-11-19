import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { clean, FieldsEditor, Notice, previewUrl, SaveButton, ScreenHeader, type FieldSpec } from '../form';

type Value = Record<string, unknown>;

interface ProjectRow extends Value {
  id: string;
  title: string;
  category: string;
  position: number;
  published: boolean;
  poster: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  Nature: 'Nature',
  Civilisation: 'Civilisation',
  Characters: 'Personnages'
};

const slug = (s: string) =>
s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function fieldsFor(products: {id: string;name: string;}[]): FieldSpec[] {
  const productOptions = [{ value: '', label: '— Aucun —' }, ...products.map((p) => ({ value: p.id, label: p.name }))];
  return [
  { kind: 'checkbox', key: 'published', label: 'Visible sur le site', hint: 'Décoche pour garder un projet en brouillon.' },
  { kind: 'text', key: 'title', label: 'Titre' },
  { kind: 'text', key: 'ref', label: 'Référence', hint: 'Affichée dans le cadre, ex. « PRJ—004 ».', fixed: true },
  {
    kind: 'select',
    key: 'category',
    label: 'Famille',
    options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
  },
  { kind: 'text', key: 'year', label: 'Année', fixed: true },
  { kind: 'text', key: 'software', label: 'Logiciels', hint: 'Ex. « Blender · Cycles ».', fixed: true },
  { kind: 'textarea', key: 'description', label: 'Description' },
  { kind: 'text', key: 'spec', label: 'Légende technique', hint: 'Ex. « Still · 1920 × 1080 » ou « GLB · 25K TRIS ».' },
  { kind: 'media', key: 'poster', label: 'Image principale', accept: 'image', folder: 'projects' },
  {
    kind: 'media',
    key: 'model',
    label: 'Modèle 3D (facultatif)',
    accept: 'model',
    folder: 'models',
    optional: true,
    hint: 'Avec un modèle, le projet s’affiche en 3D tournable au lieu des rendus. L’export brut suffit, il est optimisé à la publication.'
  },
  {
    kind: 'list',
    key: 'renders',
    label: 'Rendus finaux',
    hint: 'Les images finies uniquement — le process va dans les étapes.',
    item: [
    { kind: 'media', key: 'src', label: 'Image', accept: 'image', folder: 'renders' },
    { kind: 'text', key: 'label', label: 'Nom', hint: 'Ex. « Paysage », « Portrait ».' },
    { kind: 'text', key: 'size', label: 'Dimensions', hint: 'Laisse vide : elles sont lues dans l’image à la publication.', fixed: true }],

    itemTitle: (v, i) => String(v.label || `Rendu ${i + 1}`),
    newItem: () => ({ src: '', label: '', size: '' })
  },
  {
    kind: 'list',
    key: 'stages',
    label: 'Étapes du process',
    hint: 'Dans l’ordre où tu les as faites : la numérotation suit.',
    item: [
    { kind: 'text', key: 'label', label: 'Étape', hint: 'Ex. « Blockout ».' },
    { kind: 'text', key: 'tool', label: 'Outil', hint: 'Ex. « Blender · solid view ».' },
    { kind: 'textarea', key: 'caption', label: 'Légende', rows: 3 },
    { kind: 'media', key: 'image', label: 'Image', accept: 'image', folder: 'process' }],

    itemTitle: (v, i) => `${String(i + 1).padStart(2, '0')} — ${v.label || 'Nouvelle étape'}`,
    newItem: () => ({ label: '', tool: '', caption: '', image: '' })
  },
  {
    kind: 'select',
    key: 'shop_poster',
    label: 'En vente en poster',
    options: productOptions,
    hint: 'Ajoute un bouton « Acheter ce poster » sur le projet.'
  },
  {
    kind: 'select',
    key: 'shop_figurine',
    label: 'En vente en figurine',
    options: productOptions,
    hint: 'Ajoute un bouton « Acheter cette figurine ».'
  }];

}

export function ProjectsSection() {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [products, setProducts] = useState<{id: string;name: string;}[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data, error }, { data: prods }] = await Promise.all([
    supabase.from('projects').select('*').order('position'),
    supabase.from('products').select('id, name').order('position')]
    );
    if (error) setNotice(`Impossible de charger les projets : ${error.message}`);else
    setRows(data as ProjectRow[]);
    setProducts(prods ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fields = useMemo(() => fieldsFor(products), [products]);

  // Swapping two neighbours' positions keeps the order a clean 0..n.
  const move = async (from: number, to: number) => {
    if (!rows) return;
    const a = rows[from],b = rows[to];
    await Promise.all([
    supabase.from('projects').update({ position: to }).eq('id', a.id),
    supabase.from('projects').update({ position: from }).eq('id', b.id)]
    );
    setNotice('Ordre enregistré. Publie pour le voir sur le site.');
    load();
  };

  const create = () =>
  setEditing({
    id: '',
    ref: `PRJ—${String((rows?.length ?? 0) + 1).padStart(3, '0')}`,
    title: '',
    category: 'Nature',
    year: String(new Date().getFullYear()),
    software: 'Blender',
    description: '',
    spec: '',
    poster: '',
    model: null,
    renders: [],
    stages: [],
    shop_poster: '',
    shop_figurine: '',
    position: rows?.length ?? 0,
    published: false,
    i18n: {}
  });

  if (editing) {
    return (
      <ProjectEditor
        initial={editing}
        fields={fields}
        existingIds={(rows ?? []).map((r) => r.id)}
        onDone={(message) => {
          setEditing(null);
          setNotice(message);
          load();
        }} />);


  }

  return (
    <>
      <ScreenHeader title="PROJETS" intro="L’ordre ici est l’ordre sur la page Projets.">
        <button
          type="button"
          onClick={create}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 font-display text-sm tracking-tight text-bg">

          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          NOUVEAU PROJET
        </button>
      </ScreenHeader>
      <Notice text={notice} />

      {rows ?
      <ol className="flex flex-col gap-2">
          {rows.map((row, i) =>
        <li key={row.id} className="flex items-center gap-4 border border-line p-3">
              {row.poster ?
          <img src={previewUrl(row.poster)} alt="" className="h-14 w-20 border border-line object-cover" /> :

          <span className="h-14 w-20 border border-dashed border-line" />
          }
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm tracking-tight">{row.title.toUpperCase()}</span>
                <span className="font-mono text-[11px] text-muted">
                  {CATEGORY_LABELS[row.category] ?? row.category}
                  {row.published ? '' : ' · brouillon'}
                </span>
              </span>
              <span className="flex gap-1">
                <SquareButton label="Monter" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </SquareButton>
                <SquareButton label="Descendre" disabled={i === rows.length - 1} onClick={() => move(i, i + 1)}>
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                </SquareButton>
                <SquareButton label="Modifier" onClick={() => setEditing(row)}>
                  <PencilIcon className="h-3.5 w-3.5" />
                </SquareButton>
              </span>
            </li>
        )}
        </ol> :
      <p className="text-sm text-muted">Chargement…</p>}
    </>);

}

function SquareButton({
  label,
  onClick,
  disabled,
  children




}: {label: string;onClick: () => void;disabled?: boolean;children: ReactNode;}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30">

      {children}
    </button>);

}

function ProjectEditor({
  initial,
  fields,
  existingIds,
  onDone





}: {initial: ProjectRow;fields: FieldSpec[];existingIds: string[];onDone: (message: string | null) => void;}) {
  const isNew = !initial.id;
  // The row keeps its translations in an "i18n" column; the form engine
  // expects them under "_i18n" like everywhere else, so they are renamed on
  // the way in and back on the way out.
  const { i18n, ...columns } = initial;
  const start = {
    ...columns,
    _i18n: i18n ?? {},
    shop_poster: initial.shop_poster ?? '',
    shop_figurine: initial.shop_figurine ?? ''
  };
  const [draft, setDraft] = useState<Value>(start);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(start);

  const save = async () => {
    const v = clean(fields, draft) as Value & {title: string;poster: string;};
    if (!v.title) return setNotice('Il faut au moins un titre.');
    if (!v.poster) return setNotice('Il faut une image principale : c’est elle qui représente le projet.');

    const { _i18n, ...texts } = v;
    const record = {
      ...texts,
      i18n: _i18n ?? {},
      // Numbering follows the order of the list, so it can never drift.
      stages: ((v.stages as Value[]) ?? []).map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0') })),
      shop_poster: v.shop_poster || null,
      shop_figurine: v.shop_figurine || null,
      updated_at: new Date().toISOString()
    };

    setSaving(true);
    setNotice(null);
    let error;
    if (isNew) {
      let id = slug(v.title) || 'projet';
      while (existingIds.includes(id)) id += '-2';
      ({ error } = await supabase.from('projects').insert({ ...record, id }));
    } else {
      ({ error } = await supabase.from('projects').update(record).eq('id', initial.id));
    }
    setSaving(false);
    if (error) setNotice(`Non enregistré : ${error.message}`);else
    onDone(`« ${v.title} » enregistré. Publie pour le voir sur le site.`);
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement « ${initial.title} » ? Ses fichiers restent stockés.`)) return;
    const { error } = await supabase.from('projects').delete().eq('id', initial.id);
    if (error) setNotice(`Suppression impossible : ${error.message}`);else
    onDone(`« ${initial.title} » supprimé. Publie pour le retirer du site.`);
  };

  return (
    <>
      <ScreenHeader title={isNew ? 'NOUVEAU PROJET' : String(initial.title).toUpperCase()}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (!dirty || window.confirm('Quitter sans enregistrer ?')) && onDone(null)}
            className="border border-line px-4 py-2 text-sm transition-colors hover:border-ink">

            Retour
          </button>
          <SaveButton dirty={dirty} saving={saving} onSave={save} />
        </div>
      </ScreenHeader>
      <Notice text={notice} />
      <FieldsEditor fields={fields} value={draft} onChange={setDraft} />
      {!isNew ?
      <div className="mt-10 border-t border-line pt-5">
          <button
          type="button"
          onClick={remove}
          className="border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ink hover:text-ink">

            Supprimer ce projet
          </button>
        </div> :
      null}
    </>);

}
