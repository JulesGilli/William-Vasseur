import React from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import { products } from '../data/products';
import { BlueprintFrame } from '../components/BlueprintFrame';

export function Store() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <header className="border-b border-line pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Index / Sheet 03
        </span>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
          STORE
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Prints, figurines and dioramas — produced in small numbered batches from
          my own files. Shipped from Toulouse.
        </p>
      </header>

      <ul className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) =>
        <li key={product.id} className="flex flex-col">
            <BlueprintFrame label={product.ref} caption={product.kind}>
              <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover" />
            
            </BlueprintFrame>

            <div className="mt-4 flex flex-1 flex-col">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-sm tracking-tight">
                  {product.name.toUpperCase()}
                </h2>
                <span className="font-mono text-sm">{product.price}</span>
              </div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
                {product.spec}
              </p>
              <button
              type="button"
              className="mt-5 flex items-center justify-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:bg-ink hover:text-bg">
              
                <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
                Add to cart
              </button>
            </div>
          </li>
        )}
      </ul>

      <p className="border-t border-line py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        More pieces in production — check back soon.
      </p>
    </main>);

}