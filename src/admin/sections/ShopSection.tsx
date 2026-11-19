import { useCallback, useEffect, useState } from 'react';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { clean, FieldsEditor, Notice, previewUrl, SaveButton, ScreenHeader, type FieldSpec } from '../form';

type Value = Record<string, unknown>;

interface VariantRow {
  sku: string;
  product_id: string;
  id: string;
  label: string;
  price_cents: number;
  stock: number | null;
  position: number;
  i18n?: Record<string, unknown>;
}

interface ProductRow extends Value {
  id: string;
  name: string;
  ref: string;
  family: string;
  image: string;
  position: number;
  variants: VariantRow[];
}

const slug = (s: string) =>
s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const euros = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

const FIELDS: FieldSpec[] = [
{ kind: 'text', key: 'name', label: 'Nom' },
{ kind: 'text', key: 'ref', label: 'Référence', hint: 'Ex. « ART—04 ».', fixed: true },
{
  kind: 'select',
  key: 'family',
  label: 'Rayon',
  options: [
  { value: 'Poster', label: 'Poster' },
  { value: 'Figurine', label: 'Figurine' },
  { value: 'Diorama', label: 'Diorama' }]

},
{ kind: 'text', key: 'kind', label: 'Ligne de catégorie', hint: 'Affichée au-dessus du nom, ex. « Poster · Fine art print ».' },
{ kind: 'textarea', key: 'blurb', label: 'Description', rows: 3 },
{ kind: 'text', key: 'spec', label: 'Matériaux et finition' },
{ kind: 'text', key: 'lead_time', label: 'Délai', hint: 'Ex. « Printed to order · ships in 5–7 days ».' },
{ kind: 'media', key: 'image', label: 'Photo', accept: 'image', folder: 'products' },
{
  kind: 'media',
  key: 'model',
  label: 'Modèle 3D (facultatif)',
  accept: 'model',
  folder: 'models',
  optional: true,
  hint: 'Pour les figurines et dioramas — pas pour un poster, qui est une image plate.'
},
{
  kind: 'list',
  key: 'variants',
  label: 'Formats',
  hint: 'Chaque format a son prix et son stock.',
  item: [
  { kind: 'text', key: 'label', label: 'Format', hint: 'Ex. « 50 × 70 cm », « 18 cm ».' },
  { kind: 'text', key: 'price', label: 'Prix (€)', hint: 'Ex. 60 ou 59,90.', fixed: true },
  { kind: 'text', key: 'stock', label: 'Stock', hint: 'Vide = fabriqué à la commande. 0 = épuisé.', fixed: true }],

  itemTitle: (v) => `${v.label || 'Nouveau format'}${v.price ? ` — ${v.price} €` : ''}`,
  newItem: () => ({ label: '', price: '', stock: '' })
}];


/** The variants as the form edits them: prices in euros and stock as text. */
function toForm(row: ProductRow): Value {
  // Translations sit in "i18n" columns; the form engine reads "_i18n".
  const { i18n, ...columns } = row;
  return {
    ...columns,
    _i18n: i18n ?? {},
    model: row.model ?? null,
    variants: [...row.variants].
    sort((a, b) => a.position - b.position).
    map((v) => ({
      sku: v.sku,
      id: v.id,
      label: v.label,
      price: String(v.price_cents / 100).replace('.', ','),
      stock: v.stock === null ? '' : String(v.stock),
      _i18n: v.i18n ?? {}
    }))
  };
}

export function ShopSection() {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*, variants(*)').order('position');
    if (error) setNotice(`Impossible de charger la boutique : ${error.message}`);else
    setRows(data as ProductRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (editing) {
    return (
      <ProductEditor
        initial={editing}
        existingIds={(rows ?? []).map((r) => r.id)}
        onDone={(message) => {
          setEditing(null);
          setNotice(message);
          load();
        }} />);


  }

  return (
    <>
      <ScreenHeader
        title="BOUTIQUE"
        intro="Prix et stock sont lus en direct au moment du paiement : un changement de stock compte tout de suite. Le reste apparaît sur le site à la prochaine publication.">

        <button
          type="button"
          onClick={() =>
          setEditing({
            id: '',
            name: '',
            ref: `ART—${String((rows?.length ?? 0) + 1).padStart(2, '0')}`,
            kind: '',
            family: 'Poster',
            blurb: '',
            spec: '',
            image: '',
            model: null,
            currency: 'EUR',
            lead_time: '',
            position: rows?.length ?? 0,
            i18n: {},
            variants: []
          })
          }
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 font-display text-sm tracking-tight text-bg">

          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          NOUVEAU PRODUIT
        </button>
      </ScreenHeader>
      <Notice text={notice} />

      {rows ?
      <ol className="flex flex-col gap-2">
          {rows.map((row) => {
          const prices = row.variants.map((v) => v.price_cents);
          const stock = row.variants.reduce<number | null>(
            (sum, v) => v.stock === null || sum === null ? null : sum + v.stock,
            0
          );
          return (
            <li key={row.id} className="flex items-center gap-4 border border-line p-3">
                {row.image ?
              <img src={previewUrl(row.image)} alt="" className="h-14 w-14 border border-line object-contain" /> :

              <span className="h-14 w-14 border border-dashed border-line" />
              }
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm tracking-tight">{row.name.toUpperCase()}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {row.family}
                    {prices.length ? ` · dès ${euros(Math.min(...prices))}` : ' · aucun format'}
                    {stock === null ? ' · à la commande' : ` · ${stock} en stock`}
                  </span>
                </span>
                <button
                type="button"
                aria-label="Modifier"
                title="Modifier"
                onClick={() => setEditing(row)}
                className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
              </li>);

        })}
        </ol> :
      <p className="text-sm text-muted">Chargement…</p>}
    </>);

}

function ProductEditor({
  initial,
  existingIds,
  onDone




}: {initial: ProductRow;existingIds: string[];onDone: (message: string | null) => void;}) {
  const isNew = !initial.id;
  const start = toForm(initial);
  const [draft, setDraft] = useState<Value>(start);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(start);

  const save = async () => {
    const v = clean(FIELDS, draft);
    const name = String(v.name ?? '');
    if (!name) return setNotice('Il faut un nom.');
    if (!v.image) return setNotice('Il faut une photo.');

    // Turn the form's text back into what the shop runs on, refusing
    // anything it could not charge correctly.
    const variants: Omit<VariantRow, 'product_id'>[] = [];
    for (const [i, raw] of ((v.variants as Value[]) ?? []).entries()) {
      const label = String(raw.label ?? '').trim();
      const price = Number(String(raw.price ?? '').replace(',', '.').replace(/[^\d.]/g, ''));
      const stockText = String(raw.stock ?? '').trim();
      const stock = stockText === '' ? null : Number(stockText);
      if (!label) return setNotice(`Format ${i + 1} : il manque son nom.`);
      if (!Number.isFinite(price) || price <= 0) return setNotice(`« ${label} » : le prix n’est pas un nombre.`);
      if (stock !== null && (!Number.isInteger(stock) || stock < 0)) {
        return setNotice(`« ${label} » : le stock doit être un nombre entier, ou vide.`);
      }
      variants.push({
        sku: String(raw.sku || ''),
        id: String(raw.id || slug(label) || `format-${i + 1}`),
        label,
        price_cents: Math.round(price * 100),
        stock,
        position: i,
        i18n: (raw._i18n as Record<string, unknown>) ?? {}
      });
    }
    if (!variants.length) return setNotice('Il faut au moins un format, avec son prix.');

    let id = initial.id;
    if (isNew) {
      id = slug(name) || 'produit';
      while (existingIds.includes(id)) id += '-2';
    }
    const ref = String(v.ref ?? '');
    for (const variant of variants) {
      // A new format gets a stock-keeping code from the product reference.
      if (!variant.sku) variant.sku = `WV-${ref.replace(/[^A-Z0-9]/gi, '')}-${variant.id}`.toUpperCase();
    }

    setSaving(true);
    setNotice(null);
    const product = {
      id,
      ref,
      name,
      kind: v.kind,
      family: v.family,
      blurb: v.blurb,
      spec: v.spec,
      image: v.image,
      model: v.model || null,
      lead_time: v.lead_time,
      currency: 'EUR',
      position: initial.position,
      i18n: v._i18n ?? {}
    };
    const { error: productError } = await supabase.from('products').upsert(product);
    if (productError) {
      setSaving(false);
      return setNotice(`Non enregistré : ${productError.message}`);
    }

    const { error: variantsError } = await supabase.
    from('variants').
    upsert(variants.map((variant) => ({ ...variant, product_id: id })));
    if (variantsError) {
      setSaving(false);
      return setNotice(`Formats non enregistrés : ${variantsError.message}`);
    }

    const kept = new Set(variants.map((x) => x.sku));
    const removed = initial.variants.filter((x) => !kept.has(x.sku)).map((x) => x.sku);
    if (removed.length) {
      const { error } = await supabase.from('variants').delete().in('sku', removed);
      if (error) {
        setSaving(false);
        // A format that has been ordered is referenced by that order.
        return setNotice(
          'Un format retiré a déjà été commandé, il ne peut pas être supprimé : remets-le et passe son stock à 0 pour l’épuiser.'
        );
      }
    }

    setSaving(false);
    onDone(`« ${name} » enregistré.`);
  };

  return (
    <>
      <ScreenHeader title={isNew ? 'NOUVEAU PRODUIT' : initial.name.toUpperCase()}>
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
      <FieldsEditor fields={FIELDS} value={draft} onChange={setDraft} />
    </>);

}
