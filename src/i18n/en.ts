/**
 * Every word the site says that William does not edit: navigation, buttons,
 * labels, messages. English is the reference; fr, de and es must match its
 * shape, which the type checker enforces.
 *
 * What William writes — taglines, project texts, product descriptions —
 * lives in the database with its own translations, not here.
 */
const en = {
  meta: {
    title: 'William Vasseur — 3D Artist',
    description:
    '3D artist in Toulouse. Science-fiction environments and characters, and the prints, figurines and dioramas made from them.'
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    store: 'Store',
    main: 'Main navigation',
    homeAria: 'William Vasseur — home',
    language: 'Language'
  },
  theme: {
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode'
  },
  footer: {
    title: 'WILLIAM VASSEUR — 3D ARTIST',
    credit: 'Website created by : Jules Gilli',
    social: 'Social media',
    contact: 'Contact',
    artstation: 'William Vasseur on ArtStation',
    instagram: 'William Vasseur on Instagram',
    legal: 'Legal notice',
    terms: 'Terms of sale',
    privacy: 'Privacy'
  },
  home: {
    profile: '01 / Profile',
    toolset: '02 / Toolset',
    process: '03 / Process',
    physical: '04 / Physical',
    next: '05 / Next',
    portraitAlt: 'Portrait of William Vasseur, 3D artist',
    seeInStore: (name: string) => `${name} — see it in the store`,
    from: (price: string) => `From ${price}`,
    scroll: 'Scroll',
    liveModel: 'Live model · not a render',
    nextStage: (label: string) => `Next stage: ${label}`,
    continueDown: 'Continue down the page',
    timelapse: (label: string) => `${label} — drawn from first line to finished painting`
  },
  projects: {
    sheet: 'Index / Sheet 02',
    title: 'PROJECTS',
    intro:
    'Environments, characters and props — each one modelled, shaded and rendered in-house. Every piece below is the real mesh: drag it, spin it, look underneath.',
    all: 'All',
    items: (n: string) => `${n} items`,
    categories: { Nature: 'Nature', Civilisation: 'Civilisation', Characters: 'Characters' } as Record<string, string>,
    year: 'Year',
    software: 'Software',
    view: 'VIEW PROJECT',
    visitWorld: 'VISIT THIS WORLD',
    empty: 'No project in this category yet.',
    still: 'Still',
    process: 'Process',
    scrub: (title: string) => `${title} — scrub through the production stages`,
    finished: 'Finished work',
    how: 'How it was made',
    shipped: 'Prints, figurines and dioramas, shipped from Toulouse',
    shopPoster: 'Shop this poster',
    shopFigurine: 'Shop this figurine',
    visitStore: 'Visit the store',
    close: 'Close'
  },
  gallery: {
    viewFull: (title: string, label: string) => `View ${title} — ${label} full size`,
    previous: 'Previous image',
    next: 'Next image',
    download: 'Download'
  },
  viewer: {
    model: 'Model',
    loading: 'Loading mesh',
    pause: 'Pause the rotation',
    resume: 'Resume the rotation',
    reset: 'Reset the view',
    hint: 'Drag to orbit · scroll to zoom',
    live: 'Live model'
  },
  world: {
    explore: (title: string) => `${title} — explore in 3D`,
    leave: 'Leave this world',
    failed: 'This world could not be loaded.'
  },
  store: {
    sheet: 'Index / Sheet 03',
    title: 'STORE',
    intro:
    'Prints, figurines and dioramas — produced in small numbered batches from my own files, shipped from Toulouse. Turn any of them over in 3D before you decide.',
    families: { Poster: 'Poster', Figurine: 'Figurine', Diorama: 'Diorama' } as Record<string, string>,
    viewDetails: 'View details',
    details: (name: string) => `${name} — details`,
    close3d: 'Close 3D',
    inspect3d: 'Inspect in 3D',
    size: 'Size',
    edition: 'Edition',
    left: (n: number, lead: string) => `${n} left · ${lead}`,
    soldOutSize: 'Sold out in this size',
    added: 'Added',
    addedToCart: 'Added to cart',
    addToCart: 'Add to cart',
    soldOut: 'Sold out',
    success: 'Order received — a confirmation is on its way to your inbox. Thank you.',
    cancelled: 'Checkout cancelled — your cart is untouched.',
    preview:
    'Storefront preview — the cart works, but no payment backend is connected yet, so orders cannot be placed.',
    unavailable: 'Catalogue unavailable',
    emptyShelf: 'Nothing on this shelf yet.',
    more: 'More pieces in production — check back soon.',
    finish: 'Finish',
    dispatch: 'Dispatch',
    madeToOrder: 'Made to order',
    inStock: (n: number) => `${n} in stock`
  },
  cart: {
    aria: 'Cart',
    header: (n: number) => `Cart · ${n} ${n === 1 ? 'item' : 'items'}`,
    buttonEmpty: 'Cart, empty',
    button: (n: number) => `Cart, ${n} ${n === 1 ? 'item' : 'items'}`,
    close: 'Close the cart',
    empty: 'Nothing in the cart yet',
    each: 'each',
    outOfStock: 'Out of stock — will be removed at checkout',
    decrease: (name: string) => `Decrease ${name}`,
    increase: (name: string) => `Increase ${name}`,
    remove: 'Remove',
    subtotal: 'Subtotal',
    deliverTo: 'Deliver to',
    shipping: 'Shipping',
    free: 'Free',
    freeFrom: (amount: string) => `Free shipping from ${amount}`,
    total: 'Total',
    vat: 'VAT not applicable — art. 293 B of the French tax code',
    terms: 'By ordering you accept the',
    termsLink: 'terms of sale',
    checkout: 'CHECKOUT',
    starting: 'STARTING CHECKOUT…',
    failed: 'Checkout could not be started.',
    noBackend: 'No payment backend is connected yet.',
    refused: (status: number) => `Checkout failed (${status})`,
    countries: {
      FR: 'France',
      BE: 'Belgium',
      LU: 'Luxembourg',
      DE: 'Germany',
      ES: 'Spain',
      IT: 'Italy',
      NL: 'Netherlands',
      PT: 'Portugal',
      AT: 'Austria',
      IE: 'Ireland'
    } as Record<string, string>
  },
  legal: {
    sheet: 'Index / Legal',
    updated: 'Last updated',
    missing: 'to be completed',
    frenchPrevails:
    'This page is a translation provided for convenience. In case of doubt, the French version prevails.'
  }
};

export type Dictionary = typeof en;

export default en;
