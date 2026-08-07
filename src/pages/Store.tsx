import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Rotate3dIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { products, type Product } from '../data/products';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { ModelViewer } from '../components/three/ModelViewer';
import { SplitText } from '../components/motion/SplitText';
import { Reveal } from '../components/motion/Reveal';

/**
 * Each card holds a still until asked. Mounting three WebGL contexts on a
 * shop grid is a lot to pay for something most visitors will scroll past.
 */
function ProductCard({ product, index }: {product: Product;index: number;}) {
  const reduced = useReducedMotion();
  const [inspecting, setInspecting] = useState(false);

  return (
    <Reveal as="li" delay={index * 0.08} className="flex flex-col">
      <div className="relative">
        <AnimatePresence mode="wait">
          {inspecting && product.model ?
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>

              <ModelViewer
              url={product.model}
              poster={product.image}
              label={product.ref}
              spec="Live model"
              aspect="aspect-square" />

            </motion.div> :

          <motion.div
            key="still"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>

              {/* No caption here — the floating "Inspect in 3D" pill straddles
                  the bottom border and would sit on top of it. */}
              <BlueprintFrame label={product.ref}>
                <div className="overflow-hidden bg-surface/40">
                  <motion.img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-square w-full object-contain p-6"
                  whileHover={reduced ? undefined : { scale: 1.06 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />

                </div>
              </BlueprintFrame>
            </motion.div>
          }
        </AnimatePresence>

        {product.model ?
        <button
          type="button"
          onClick={() => setInspecting((v) => !v)}
          className="absolute -bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 border border-line bg-bg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-ink hover:text-ink">

            {inspecting ?
          <>
                <XIcon className="h-3 w-3" aria-hidden="true" />
                Close 3D
              </> :

          <>
                <Rotate3dIcon className="h-3 w-3" aria-hidden="true" />
                Inspect in 3D
              </>
          }
          </button> :
        null}
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {product.kind}
        </span>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
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
          className="group relative mt-5 flex items-center justify-center gap-2 overflow-hidden rounded-full border border-ink px-5 py-2.5 text-sm">

          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-400 ease-out group-hover:scale-y-100" />

          <ShoppingBagIcon
            className="relative h-4 w-4 transition-colors group-hover:text-bg"
            aria-hidden="true" />

          <span className="relative transition-colors group-hover:text-bg">
            Add to cart
          </span>
        </button>
      </div>
    </Reveal>);

}

export function Store() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <header className="border-b border-line pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Index / Sheet 03
        </span>
        <SplitText
          as="h1"
          by="letter"
          text="STORE"
          className="mt-3 font-display text-3xl tracking-tight sm:text-5xl" />

        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Prints, figurines and dioramas — produced in small numbered batches
            from my own files, shipped from Toulouse. Turn any of them over in
            3D before you decide.
          </p>
        </Reveal>
      </header>

      <ul className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) =>
        <ProductCard key={product.id} product={product} index={i} />
        )}
      </ul>

      <p className="border-t border-line py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        More pieces in production — check back soon.
      </p>
    </main>);

}
