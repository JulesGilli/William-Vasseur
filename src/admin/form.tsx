import { useRef, useState, type ReactNode } from 'react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { mediaUrl, supabase } from './supabase';

/**
 * One form engine for everything William edits.
 *
 * Each screen describes its fields — text, a paragraph, an uploaded image, a
 * list he can add to and reorder — and this renders and binds them. Writing
 * the eight home blocks, the projects and the products as hand-made forms
 * would have meant eleven slightly different ways to do the same thing.
 */

type Value = Record<string, unknown>;

export type FieldSpec =
{kind: 'text';key: string;label: string;hint?: string;} |
{kind: 'textarea';key: string;label: string;hint?: string;rows?: number;} |
{kind: 'lines';key: string;label: string;hint?: string;} |
{kind: 'paragraphs';key: string;label: string;hint?: string;} |
{kind: 'select';key: string;label: string;options: {value: string;label: string;}[];hint?: string;} |
{kind: 'checkbox';key: string;label: string;hint?: string;} |
{kind: 'media';key: string;label: string;accept: 'image' | 'model' | 'video';folder: string;hint?: string;optional?: boolean;} |
{kind: 'group';key: string;label: string;fields: FieldSpec[];} |
{
  kind: 'list';
  key: string;
  label: string;
  hint?: string;
  item: FieldSpec[];
  itemTitle: (item: Value, index: number) => string;
  newItem: () => Value;
};

const inputClass =
'mt-1.5 w-full border border-line bg-surface/40 px-3 py-2 text-sm outline-none transition-colors focus:border-ink';

export function FieldsEditor({
  fields,
  value,
  onChange




}: {fields: FieldSpec[];value: Value;onChange: (next: Value) => void;}) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });
  return (
    <div className="flex flex-col gap-5">
      {fields.map((f) =>
      <Field key={f.key} spec={f} value={value[f.key]} onChange={(v) => set(f.key, v)} />
      )}
    </div>);

}

function Label({ text, hint }: {text: string;hint?: string;}) {
  return (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{text}</span>
      {hint ? <span className="mt-0.5 block text-[11px] text-muted">{hint}</span> : null}
    </>);

}

function Field({ spec, value, onChange }: {spec: FieldSpec;value: unknown;onChange: (v: unknown) => void;}) {
  switch (spec.kind) {
    case 'text':
      return (
        <label className="block">
          <Label text={spec.label} hint={spec.hint} />
          <input className={inputClass} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
        </label>);

    case 'textarea':
      return (
        <label className="block">
          <Label text={spec.label} hint={spec.hint} />
          <textarea
            className={`${inputClass} leading-relaxed`}
            rows={spec.rows ?? 4}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)} />

        </label>);

    case 'lines':
      return (
        <label className="block">
          <Label text={spec.label} hint={spec.hint ?? 'Un élément par ligne.'} />
          <textarea
            className={`${inputClass} leading-relaxed`}
            rows={Math.max(3, ((value as string[]) ?? []).length + 1)}
            value={((value as string[]) ?? []).join('\n')}
            // Kept as typed while editing; empty lines are dropped on save.
            onChange={(e) => onChange(e.target.value.split('\n'))} />

        </label>);

    case 'paragraphs':
      return (
        <label className="block">
          <Label text={spec.label} hint={spec.hint ?? 'Laisse une ligne vide entre deux paragraphes.'} />
          <textarea
            className={`${inputClass} leading-relaxed`}
            rows={8}
            value={((value as string[]) ?? []).join('\n\n')}
            onChange={(e) => onChange(e.target.value.split(/\n\s*\n/))} />

        </label>);

    case 'select':
      return (
        <label className="block">
          <Label text={spec.label} hint={spec.hint} />
          <select className={inputClass} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
            {spec.options.map((o) =>
            <option key={o.value} value={o.value}>{o.label}</option>
            )}
          </select>
        </label>);

    case 'checkbox':
      return (
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-current"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)} />

          <span>
            <span className="text-sm">{spec.label}</span>
            {spec.hint ? <span className="block text-[11px] text-muted">{spec.hint}</span> : null}
          </span>
        </label>);

    case 'media':
      return <MediaField spec={spec} value={(value as string | null) ?? ''} onChange={onChange} />;
    case 'group':
      return (
        <fieldset className="border border-line p-4">
          <legend className="px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{spec.label}</legend>
          <FieldsEditor fields={spec.fields} value={(value as Value) ?? {}} onChange={onChange} />
        </fieldset>);

    case 'list':
      return <ListField spec={spec} value={(value as Value[]) ?? []} onChange={onChange} />;
  }
}

function ListField({
  spec,
  value,
  onChange



}: {spec: Extract<FieldSpec, {kind: 'list';}>;value: Value[];onChange: (v: Value[]) => void;}) {
  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <Label text={spec.label} hint={spec.hint} />
      <ol className="mt-2 flex flex-col gap-3">
        {value.map((item, i) =>
        <li key={i} className="border border-line p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm">{spec.itemTitle(item, i)}</span>
              <span className="flex gap-1">
                <IconButton label="Monter" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton label="Descendre" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                label="Supprimer"
                onClick={() => {
                  if (window.confirm('Supprimer cet élément ?')) onChange(value.filter((_, j) => j !== i));
                }}>

                  <Trash2Icon className="h-3.5 w-3.5" />
                </IconButton>
              </span>
            </div>
            <FieldsEditor
            fields={spec.item}
            value={item}
            onChange={(next) => onChange(value.map((v, j) => j === i ? next : v))} />

          </li>
        )}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...value, spec.newItem()])}
        className="mt-3 inline-flex items-center gap-2 border border-dashed border-line px-3 py-2 text-sm text-muted transition-colors hover:border-ink hover:text-ink">

        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Ajouter
      </button>
    </div>);

}

function IconButton({
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
      className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30">

      {children}
    </button>);

}

/** Where a stored reference can be looked at from the editor. */
export function previewUrl(ref: string): string {
  if (!ref) return '';
  return ref.startsWith('/') ? import.meta.env.BASE_URL + ref.slice(1) : mediaUrl(ref);
}

const ACCEPT = {
  image: 'image/webp,image/png,image/jpeg',
  model: '.glb,model/gltf-binary',
  video: 'video/mp4'
};

/**
 * Uploads straight to the media bucket under a fresh, unique key, so a new
 * file never overwrites one the live site is still using — the old one stays
 * until the next publish stops pointing at it.
 */
async function upload(file: File, folder: string): Promise<string> {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  const key = `${folder}/${Date.now().toString(36)}-${safe}`;
  const contentType = file.name.toLowerCase().endsWith('.glb') ? 'model/gltf-binary' : file.type;
  const { error } = await supabase.storage.from('media').upload(key, file, { contentType, upsert: false });
  if (error) throw error;
  return key;
}

function MediaField({
  spec,
  value,
  onChange



}: {spec: Extract<FieldSpec, {kind: 'media';}>;value: string;onChange: (v: string | null) => void;}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    // Mirrors the bucket's own 50MB limit, so the refusal is explained here
    // rather than arriving as a bare error after a long upload.
    if (file.size > 50 * 1024 * 1024) {
      setStatus('Fichier trop lourd : 50 Mo maximum.');
      return;
    }
    setStatus(`Envoi de ${file.name}…`);
    try {
      onChange(await upload(file, spec.folder));
      setStatus(
        spec.accept === 'model' ?
        'Envoyé. Il sera optimisé à la prochaine publication.' :
        'Envoyé. Visible sur le site à la prochaine publication.'
      );
    } catch (error) {
      setStatus(`Échec de l’envoi : ${(error as Error).message}`);
    }
  };

  const name = value ? value.split('/').pop() : '';

  return (
    <div>
      <Label text={spec.label} hint={spec.hint} />
      <div className="mt-1.5 flex flex-wrap items-center gap-3 border border-line bg-surface/40 p-3">
        {value && spec.accept === 'image' ?
        <img src={previewUrl(value)} alt="" className="h-20 w-28 border border-line object-contain" /> :
        null}
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted">
          {value ? name : 'Aucun fichier'}
        </span>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-sm transition-colors hover:border-ink">

          <UploadIcon className="h-4 w-4" aria-hidden="true" />
          {value ? 'Remplacer' : 'Envoyer'}
        </button>
        {value && spec.optional ?
        <button
          type="button"
          onClick={() => onChange(null)}
          className="border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink">

            Retirer
          </button> :
        null}
        <input
          ref={input}
          type="file"
          accept={ACCEPT[spec.accept]}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = '';
          }} />

      </div>
      {status ? <p className="mt-1.5 text-[11px] text-muted">{status}</p> : null}
    </div>);

}

/**
 * Tidy a value before it is saved: text trimmed, empty lines and paragraphs
 * dropped. Editing keeps what was typed as-is, so the cursor never jumps; the
 * tidying happens once, on the way to the database.
 */
export function clean(fields: FieldSpec[], value: Value): Value {
  const out: Value = { ...value };
  for (const f of fields) {
    const v = out[f.key];
    if (f.kind === 'text' || f.kind === 'textarea') {
      out[f.key] = typeof v === 'string' ? v.trim() : v;
    } else if (f.kind === 'lines' || f.kind === 'paragraphs') {
      out[f.key] = ((v as string[]) ?? []).map((s) => s.trim()).filter(Boolean);
    } else if (f.kind === 'group') {
      out[f.key] = clean(f.fields, (v as Value) ?? {});
    } else if (f.kind === 'list') {
      out[f.key] = ((v as Value[]) ?? []).map((item) => clean(f.item, item));
    }
  }
  return out;
}

/** Title bar for a screen, with the save state and button on the right. */
export function ScreenHeader({ title, intro, children }: {title: string;intro?: string;children?: ReactNode;}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
      <div>
        <h1 className="font-display text-2xl tracking-tight">{title}</h1>
        {intro ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{intro}</p> : null}
      </div>
      {children}
    </div>);

}

export function SaveButton({
  dirty,
  saving,
  onSave




}: {dirty: boolean;saving: boolean;onSave: () => void;}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={!dirty || saving}
      className="rounded-full bg-ink px-5 py-2 font-display text-sm tracking-tight text-bg transition-opacity disabled:opacity-40">

      {saving ? 'ENREGISTREMENT…' : dirty ? 'ENREGISTRER' : 'ENREGISTRÉ'}
    </button>);

}

/** A one-line message under a screen's header: what just happened. */
export function Notice({ text }: {text: string | null;}) {
  if (!text) return null;
  return (
    <p role="status" className="mb-5 border border-line bg-surface/40 px-3 py-2 text-sm">
      {text}
    </p>);

}
