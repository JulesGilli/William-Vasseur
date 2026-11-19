import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Notice, ScreenHeader } from '../form';

interface OrderRow {
  id: string;
  status: 'pending' | 'paid' | 'canceled';
  email: string | null;
  amount_total_cents: number | null;
  country: string | null;
  shipping_cents: number | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  order_items: {sku: string;quantity: number;unit_price_cents: number;}[];
}

const euros = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
const date = (iso: string) =>
new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * What has been bought, and what is still to send.
 *
 * Payment status is Stripe's word and is never edited here; shipping is
 * William's, recorded beside it. Checkouts that were started and never paid
 * are hidden by default — they are noise, not orders.
 */
export function OrdersSection() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data, error }, { data: variants }] = await Promise.all([
    supabase.
    from('orders').
    select('id, status, email, amount_total_cents, country, shipping_cents, created_at, paid_at, shipped_at, order_items(sku, quantity, unit_price_cents)').
    order('created_at', { ascending: false }),
    supabase.from('variants').select('sku, label, products(name)')]
    );
    if (error) return setNotice(`Impossible de charger les commandes : ${error.message}`);
    setOrders(data as OrderRow[]);
    setNames(
      Object.fromEntries(
        (variants ?? []).map((v) => [
        v.sku,
        `${(v.products as unknown as {name: string;} | null)?.name ?? v.sku} — ${v.label}`]
        )
      )
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markShipped = async (order: OrderRow) => {
    const { error } = await supabase.
    from('orders').
    update({ shipped_at: new Date().toISOString() }).
    eq('id', order.id);
    if (error) setNotice(`Non enregistré : ${error.message}`);else
    load();
  };

  const shown = (orders ?? []).filter((o) => showAll || o.status === 'paid');
  const toShip = (orders ?? []).filter((o) => o.status === 'paid' && !o.shipped_at).length;

  return (
    <>
      <ScreenHeader
        title="COMMANDES"
        intro={
        orders ?
        toShip ?
        `${toShip} commande${toShip > 1 ? 's' : ''} à expédier.` :
        'Tout est expédié.' :
        undefined
        }>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Afficher aussi les paiements abandonnés
        </label>
      </ScreenHeader>
      <Notice text={notice} />

      {!orders ?
      <p className="text-sm text-muted">Chargement…</p> :
      shown.length === 0 ?
      <p className="text-sm text-muted">Aucune commande pour l’instant.</p> :

      <ol className="flex flex-col gap-3">
          {shown.map((order) =>
        <li key={order.id} className="border border-line p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-muted">{date(order.created_at)}</span>
                <span className="font-mono text-sm">
                  {order.amount_total_cents !== null ? euros(order.amount_total_cents) : '—'}
                </span>
              </div>
              <p className="mt-1 text-sm">
                {order.email ?? 'Email inconnu'}
                {order.country ?
            <span className="ml-2 font-mono text-[11px] text-muted">
                    · {order.country} · port {order.shipping_cents ? euros(order.shipping_cents) : 'offert'}
                  </span> :
            null}
              </p>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
                {order.order_items.map((item) =>
            <li key={item.sku}>
                    {item.quantity} × {names[item.sku] ?? item.sku}
                  </li>
            )}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                  {order.status === 'paid' ? 'Payée' : order.status === 'pending' ? 'Non payée' : 'Annulée'}
                </span>
                {order.status === 'paid' ?
            order.shipped_at ?
            <span className="font-mono text-[11px] text-muted">Expédiée le {date(order.shipped_at)}</span> :

            <button
              type="button"
              onClick={() => markShipped(order)}
              className="rounded-full bg-ink px-4 py-1.5 font-display text-xs tracking-tight text-bg">

                      MARQUER COMME EXPÉDIÉE
                    </button> :

            null}
                <span className="text-[11px] text-muted">
                  L’adresse de livraison est dans Stripe, avec le paiement.
                </span>
              </div>
            </li>
        )}
        </ol>
      }
    </>);

}
