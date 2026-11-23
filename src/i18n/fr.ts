import type { Dictionary } from './en';

const fr: Dictionary = {
  meta: {
    title: 'William Vasseur — Artiste 3D',
    description:
    'Artiste 3D à Toulouse. Environnements et personnages de science-fiction, et les tirages, figurines et dioramas qui en sont tirés.'
  },
  nav: {
    home: 'Accueil',
    projects: 'Projets',
    store: 'Boutique',
    main: 'Navigation principale',
    homeAria: 'William Vasseur — accueil',
    language: 'Langue'
  },
  theme: {
    toLight: 'Passer en mode clair',
    toDark: 'Passer en mode sombre'
  },
  footer: {
    title: 'WILLIAM VASSEUR — ARTISTE 3D',
    credit: 'Site réalisé par : Jules Gilli',
    social: 'Réseaux sociaux',
    contact: 'Contact',
    artstation: 'William Vasseur sur ArtStation',
    instagram: 'William Vasseur sur Instagram',
    legal: 'Mentions légales',
    terms: 'Conditions de vente',
    privacy: 'Confidentialité'
  },
  home: {
    profile: '01 / Profil',
    toolset: '02 / Outils',
    process: '03 / Process',
    physical: '04 / Physique',
    next: '05 / Suite',
    portraitAlt: 'Portrait de William Vasseur, artiste 3D',
    seeInStore: (name) => `${name} — à voir dans la boutique`,
    from: (price) => `Dès ${price}`,
    scroll: 'Défiler',
    liveModel: 'Modèle en direct · pas un rendu',
    nextStage: (label) => `Étape suivante : ${label}`,
    continueDown: 'Continuer vers le bas de la page',
    timelapse: (label) => `${label} — dessiné du premier trait à la peinture finie`
  },
  projects: {
    sheet: 'Index / Planche 02',
    title: 'PROJETS',
    intro:
    'Environnements, personnages et accessoires — chacun modélisé, texturé et rendu par mes soins. Chaque pièce ci-dessous est le vrai maillage : attrape-la, fais-la tourner, regarde en dessous.',
    all: 'Tout',
    items: (n) => `${n} éléments`,
    categories: { Nature: 'Nature', Civilisation: 'Civilisation', Characters: 'Personnages' },
    year: 'Année',
    software: 'Logiciels',
    view: 'VOIR LE PROJET',
    visitWorld: 'VISITER CE MONDE',
    empty: 'Aucun projet dans cette catégorie pour l’instant.',
    still: 'Image',
    finished: 'Œuvre finie',
    how: 'Comment elle a été faite',
    shipped: 'Tirages, figurines et dioramas, expédiés depuis Toulouse',
    shopPoster: 'Acheter ce poster',
    shopFigurine: 'Acheter cette figurine',
    visitStore: 'Voir la boutique',
    close: 'Fermer'
  },
  gallery: {
    previous: 'Image précédente',
    next: 'Image suivante',
    enlarge: (title, label) => `Agrandir ${title} — ${label}`,
    open: (title) => `Ouvrir ${title}`,
  },
  viewer: {
    model: 'Modèle',
    loading: 'Chargement du modèle',
    pause: 'Mettre la rotation en pause',
    resume: 'Reprendre la rotation',
    reset: 'Réinitialiser la vue',
    hint: 'Glisser pour faire tourner',
    live: 'Modèle en direct'
  },
  world: {
    explore: (title) => `${title} — explorer en 3D`,
    leave: 'Quitter ce monde',
    failed: 'Ce monde n’a pas pu être chargé.'
  },
  store: {
    sheet: 'Index / Planche 03',
    title: 'BOUTIQUE',
    intro:
    'Tirages, figurines et dioramas — produits en petites séries numérotées à partir de mes propres fichiers, expédiés depuis Toulouse. Fais-les tourner en 3D avant de te décider.',
    families: { Poster: 'Poster', Figurine: 'Figurine', Diorama: 'Diorama' },
    commission: 'Sur mesure',
    viewDetails: 'Voir le détail',
    details: (name) => `${name} — détail`,
    close3d: 'Fermer la 3D',
    inspect3d: 'Inspecter en 3D',
    size: 'Format',
    edition: 'Édition',
    left: (n, lead) => `${n} en stock · ${lead}`,
    soldOutSize: 'Épuisé dans ce format',
    added: 'Ajouté',
    addedToCart: 'Ajouté au panier',
    addToCart: 'Ajouter au panier',
    soldOut: 'Épuisé',
    success: 'Commande reçue — une confirmation arrive dans ta boîte mail. Merci.',
    cancelled: 'Paiement annulé — ton panier est intact.',
    preview:
    'Aperçu de la boutique — le panier fonctionne, mais le paiement n’est pas encore branché : aucune commande ne peut être passée.',
    unavailable: 'Catalogue indisponible',
    emptyShelf: 'Rien sur ce rayon pour l’instant.',
    more: 'D’autres pièces sont en production — reviens bientôt.',
    finish: 'Finition',
    dispatch: 'Expédition',
    madeToOrder: 'Fabriqué à la commande',
    inStock: (n) => `${n} en stock`
  },
  cart: {
    aria: 'Panier',
    header: (n) => `Panier · ${n} ${n > 1 ? 'articles' : 'article'}`,
    buttonEmpty: 'Panier, vide',
    button: (n) => `Panier, ${n} ${n > 1 ? 'articles' : 'article'}`,
    close: 'Fermer le panier',
    empty: 'Le panier est vide',
    each: 'l’unité',
    outOfStock: 'Épuisé — sera retiré au paiement',
    decrease: (name) => `Retirer un ${name}`,
    increase: (name) => `Ajouter un ${name}`,
    remove: 'Retirer',
    subtotal: 'Sous-total',
    deliverTo: 'Livraison en',
    shipping: 'Livraison',
    free: 'Offerte',
    freeFrom: (amount) => `Livraison offerte dès ${amount}`,
    total: 'Total',
    vat: 'TVA non applicable, art. 293 B du CGI',
    terms: 'En commandant, tu acceptes les',
    termsLink: 'conditions de vente',
    checkout: 'PAYER',
    starting: 'OUVERTURE DU PAIEMENT…',
    failed: 'Le paiement n’a pas pu être lancé.',
    noBackend: 'Le paiement n’est pas encore branché.',
    refused: (status) => `Le paiement a échoué (${status})`,
    countries: {
      FR: 'France',
      BE: 'Belgique',
      LU: 'Luxembourg',
      DE: 'Allemagne',
      ES: 'Espagne',
      IT: 'Italie',
      NL: 'Pays-Bas',
      PT: 'Portugal',
      AT: 'Autriche',
      IE: 'Irlande'
    }
  },
  legal: {
    sheet: 'Index / Légal',
    updated: 'Dernière mise à jour',
    missing: 'à compléter',
    frenchPrevails: ''
  }
};

export default fr;
