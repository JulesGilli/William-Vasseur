import type { Dictionary } from './en';

const de: Dictionary = {
  meta: {
    title: 'William Vasseur — 3D-Künstler',
    description:
    '3D-Künstler in Toulouse. Science-Fiction-Welten und Figuren — und die Drucke, Figuren und Dioramen, die daraus entstehen.'
  },
  nav: {
    home: 'Start',
    projects: 'Projekte',
    store: 'Shop',
    main: 'Hauptnavigation',
    homeAria: 'William Vasseur — Startseite',
    language: 'Sprache'
  },
  theme: {
    toLight: 'Zum hellen Modus wechseln',
    toDark: 'Zum dunklen Modus wechseln'
  },
  footer: {
    title: 'WILLIAM VASSEUR — 3D-KÜNSTLER',
    credit: 'Website erstellt von: Jules Gilli',
    social: 'Soziale Medien',
    contact: 'Kontakt',
    artstation: 'William Vasseur auf ArtStation',
    instagram: 'William Vasseur auf Instagram',
    legal: 'Impressum',
    terms: 'Verkaufsbedingungen',
    privacy: 'Datenschutz'
  },
  home: {
    profile: '01 / Profil',
    toolset: '02 / Werkzeuge',
    process: '03 / Prozess',
    physical: '04 / Physisch',
    next: '05 / Weiter',
    portraitAlt: 'Porträt von William Vasseur, 3D-Künstler',
    seeInStore: (name) => `${name} — im Shop ansehen`,
    from: (price) => `Ab ${price}`,
    scroll: 'Scrollen',
    liveModel: 'Live-Modell · kein Rendering',
    nextStage: (label) => `Nächster Schritt: ${label}`,
    continueDown: 'Weiter nach unten',
    timelapse: (label) => `${label} — gezeichnet vom ersten Strich bis zum fertigen Bild`
  },
  projects: {
    sheet: 'Index / Blatt 02',
    title: 'PROJEKTE',
    intro:
    'Umgebungen, Figuren und Requisiten — alles selbst modelliert, schattiert und gerendert. Jedes Stück hier ist das echte Mesh: ziehen, drehen, von unten ansehen.',
    all: 'Alle',
    items: (n) => `${n} Einträge`,
    categories: { Nature: 'Natur', Civilisation: 'Zivilisation', Characters: 'Figuren' },
    year: 'Jahr',
    software: 'Software',
    view: 'PROJEKT ANSEHEN',
    visitWorld: 'DIESE WELT BESUCHEN',
    empty: 'Noch kein Projekt in dieser Kategorie.',
    still: 'Standbild',
    process: 'Prozess',
    scrub: (title) => `${title} — durch die Produktionsschritte blättern`,
    finished: 'Fertiges Werk',
    how: 'Wie es entstanden ist',
    shipped: 'Drucke, Figuren und Dioramen, Versand aus Toulouse',
    shopPoster: 'Dieses Poster kaufen',
    shopFigurine: 'Diese Figur kaufen',
    visitStore: 'Zum Shop',
    close: 'Schließen'
  },
  gallery: {
    viewFull: (title, label) => `${title} — ${label} in voller Größe ansehen`,
    previous: 'Vorheriges Bild',
    next: 'Nächstes Bild',
    download: 'Herunterladen'
  },
  viewer: {
    model: 'Modell',
    loading: 'Modell wird geladen',
    pause: 'Drehung anhalten',
    resume: 'Drehung fortsetzen',
    reset: 'Ansicht zurücksetzen',
    hint: 'Ziehen zum Drehen · Scrollen zum Zoomen',
    live: 'Live-Modell'
  },
  world: {
    explore: (title) => `${title} — in 3D erkunden`,
    leave: 'Diese Welt verlassen',
    failed: 'Diese Welt konnte nicht geladen werden.'
  },
  store: {
    sheet: 'Index / Blatt 03',
    title: 'SHOP',
    intro:
    'Drucke, Figuren und Dioramen — in kleinen, nummerierten Serien aus meinen eigenen Dateien gefertigt, Versand aus Toulouse. Dreh jedes Stück in 3D, bevor du dich entscheidest.',
    families: { Poster: 'Poster', Figurine: 'Figur', Diorama: 'Diorama' },
    viewDetails: 'Details ansehen',
    details: (name) => `${name} — Details`,
    close3d: '3D schließen',
    inspect3d: 'In 3D ansehen',
    size: 'Größe',
    edition: 'Ausführung',
    left: (n, lead) => `Noch ${n} · ${lead}`,
    soldOutSize: 'In dieser Größe ausverkauft',
    added: 'Hinzugefügt',
    addedToCart: 'Im Warenkorb',
    addToCart: 'In den Warenkorb',
    soldOut: 'Ausverkauft',
    success: 'Bestellung eingegangen — eine Bestätigung ist unterwegs in dein Postfach. Danke.',
    cancelled: 'Zahlung abgebrochen — dein Warenkorb ist unverändert.',
    preview:
    'Shop-Vorschau — der Warenkorb funktioniert, aber die Zahlung ist noch nicht angeschlossen: Bestellungen sind noch nicht möglich.',
    unavailable: 'Katalog nicht verfügbar',
    emptyShelf: 'In diesem Regal ist noch nichts.',
    more: 'Weitere Stücke sind in Arbeit — schau bald wieder vorbei.',
    finish: 'Ausführung',
    dispatch: 'Versand',
    madeToOrder: 'Auf Bestellung gefertigt',
    inStock: (n) => `${n} auf Lager`
  },
  cart: {
    aria: 'Warenkorb',
    header: (n) => `Warenkorb · ${n} Artikel`,
    buttonEmpty: 'Warenkorb, leer',
    button: (n) => `Warenkorb, ${n} Artikel`,
    close: 'Warenkorb schließen',
    empty: 'Der Warenkorb ist leer',
    each: 'pro Stück',
    outOfStock: 'Nicht auf Lager — wird an der Kasse entfernt',
    decrease: (name) => `${name}: Menge verringern`,
    increase: (name) => `${name}: Menge erhöhen`,
    remove: 'Entfernen',
    subtotal: 'Zwischensumme',
    deliverTo: 'Lieferung nach',
    shipping: 'Versand',
    free: 'Kostenlos',
    freeFrom: (amount) => `Kostenloser Versand ab ${amount}`,
    total: 'Gesamt',
    vat: 'Keine Mehrwertsteuer ausgewiesen — Art. 293 B des französischen Steuergesetzbuchs',
    terms: 'Mit der Bestellung akzeptierst du die',
    termsLink: 'Verkaufsbedingungen',
    checkout: 'ZUR KASSE',
    starting: 'KASSE WIRD GEÖFFNET…',
    failed: 'Die Zahlung konnte nicht gestartet werden.',
    noBackend: 'Die Zahlung ist noch nicht angeschlossen.',
    refused: (status) => `Zahlung fehlgeschlagen (${status})`,
    countries: {
      FR: 'Frankreich',
      BE: 'Belgien',
      LU: 'Luxemburg',
      DE: 'Deutschland',
      ES: 'Spanien',
      IT: 'Italien',
      NL: 'Niederlande',
      PT: 'Portugal',
      AT: 'Österreich',
      IE: 'Irland'
    }
  },
  legal: {
    sheet: 'Index / Rechtliches',
    updated: 'Zuletzt aktualisiert',
    missing: 'noch auszufüllen',
    frenchPrevails:
    'Diese Seite ist eine Übersetzung zur Orientierung. Im Zweifel gilt die französische Fassung.'
  }
};

export default de;
