import type { LegalWriter } from './types';

/** Reference text. To be read and approved by William before the shop opens. */
const fr: LegalWriter = (c) => ({
  legal: {
    title: 'MENTIONS LÉGALES',
    sections: [
    {
      heading: 'Éditeur du site',
      body: [
      `${c.name}, entrepreneur individuel (micro-entreprise).`,
      `SIRET : ${c.siret}`,
      `Adresse : ${c.address}`,
      `Contact : ${c.email}`,
      ...(c.vatExempt ? ['TVA non applicable, art. 293 B du CGI.'] : []),
      `Directeur de la publication : ${c.name}.`]

    },
    {
      heading: 'Hébergement',
      body: [
      'Le site est hébergé par GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.',
      'Les données de la boutique (catalogue, commandes) sont hébergées dans l’Union européenne par Supabase, Inc.',
      'Les paiements sont traités par Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irlande.']

    },
    {
      heading: 'Propriété intellectuelle',
      body: [
      `L’ensemble des œuvres présentées sur ce site — images, rendus, modèles 3D, dessins, textes — est la propriété exclusive de ${c.name}. Toute reproduction, diffusion ou utilisation, même partielle, est interdite sans autorisation écrite préalable.`,
      'L’achat d’un tirage, d’une figurine ou d’un diorama porte sur l’objet lui-même : il n’emporte aucune cession des droits d’auteur sur l’œuvre.']

    },
    {
      heading: 'Conception du site',
      body: ['Site conçu et développé par Jules Gilli.']
    }]

  },

  terms: {
    title: 'CONDITIONS GÉNÉRALES DE VENTE',
    sections: [
    {
      heading: '1. Objet',
      body: [
      `Les présentes conditions s’appliquent à toute vente conclue sur ce site entre ${c.name} (« le vendeur ») et toute personne passant commande (« l’acheteur »). Passer commande vaut acceptation de ces conditions.`]

    },
    {
      heading: '2. Produits',
      body: [
      'Le vendeur propose des tirages d’art, des figurines et des dioramas, produits en petites séries ou fabriqués à la commande à partir de ses propres créations.',
      'Les photographies et les aperçus 3D sont aussi fidèles que possible. Les pièces étant imprimées et finies à la main, de légères variations de teinte ou de finition peuvent exister et ne constituent pas un défaut.']

    },
    {
      heading: '3. Prix',
      body: [
      `Les prix sont indiqués en euros. ${c.vatExempt ? 'TVA non applicable, art. 293 B du CGI. ' : 'Ils s’entendent toutes taxes comprises. '}Les frais de livraison sont ajoutés au panier et affichés avant le paiement.`,
      'Le prix applicable est celui affiché au moment de la commande.']

    },
    {
      heading: '4. Commande',
      body: [
      'L’acheteur ajoute les articles à son panier, choisit le pays de livraison, puis procède au paiement. La commande est définitive une fois le paiement accepté ; une confirmation est envoyée par e-mail.',
      'Le vendeur peut annuler une commande en cas d’erreur manifeste de prix ou de stock ; l’acheteur est alors intégralement remboursé.']

    },
    {
      heading: '5. Paiement',
      body: [
      'Le paiement s’effectue par carte bancaire, sur la page sécurisée de Stripe. Le vendeur n’a jamais accès aux données de la carte.']

    },
    {
      heading: '6. Livraison',
      body: [
      `Les commandes sont expédiées depuis la France vers les pays suivants : ${c.countries}.`,
      shippingFr(c),
      'Le délai d’expédition est indiqué sur la fiche de chaque produit, certaines pièces étant fabriquées à la commande. À défaut d’indication, la livraison intervient au plus tard 30 jours après la commande.',
      'En cas de retard, l’acheteur peut demander l’annulation de sa commande et son remboursement. Si un colis arrive endommagé, il suffit d’écrire au vendeur dans les meilleurs délais, photos à l’appui : la pièce est remplacée ou remboursée.']

    },
    {
      heading: '7. Droit de rétractation',
      body: [
      'L’acheteur dispose de 14 jours à compter de la réception de sa commande pour se rétracter, sans avoir à donner de motif. Il lui suffit d’en informer le vendeur par e-mail avant la fin de ce délai.',
      'Le produit doit être renvoyé dans les 14 jours suivant cette notification, dans son état d’origine et correctement protégé. Les frais de retour sont à la charge de l’acheteur.',
      'Le vendeur rembourse la totalité des sommes versées, frais de livraison standard compris, dans les 14 jours suivant la notification ; il peut différer le remboursement jusqu’à la réception du produit ou la preuve de son expédition.',
      'Conformément à l’article L221-28 du Code de la consommation, ce droit ne s’applique pas aux pièces réalisées selon les spécifications de l’acheteur ou nettement personnalisées (commande sur mesure).']

    },
    {
      heading: '8. Garanties légales',
      body: [
      'Tous les produits bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation), pendant deux ans à compter de la livraison, et de la garantie des vices cachés (articles 1641 et suivants du Code civil).',
      `Pour toute réclamation : ${c.email}.`]

    },
    {
      heading: '9. Données personnelles',
      body: [
      'Les données collectées lors d’une commande servent uniquement à la traiter et à la livrer. Le détail figure sur la page Confidentialité.']

    },
    {
      heading: '10. Médiation',
      body: [
      `En cas de litige non résolu à l’amiable avec le vendeur, l’acheteur peut recourir gratuitement à un médiateur de la consommation : ${c.mediator}${c.mediatorUrl ? ` — ${c.mediatorUrl}` : ''}.`]

    },
    {
      heading: '11. Droit applicable',
      body: [
      'Les présentes conditions sont soumises au droit français. L’acheteur consommateur conserve le bénéfice des dispositions impératives de la loi de son pays de résidence. La version française de ces conditions fait foi.']

    }]

  },

  privacy: {
    title: 'CONFIDENTIALITÉ',
    sections: [
    {
      heading: 'Responsable du traitement',
      body: [`${c.name} — ${c.email}`]
    },
    {
      heading: 'Données collectées',
      body: [
      'Naviguer sur le site ne demande aucun compte et ne dépose aucun traceur publicitaire ou de mesure d’audience.',
      'Lors d’une commande, sont collectés : l’adresse e-mail, le nom et l’adresse de livraison, ainsi que le contenu et le montant de la commande. Les données de carte bancaire sont saisies sur la page de Stripe et ne sont jamais transmises au vendeur.']

    },
    {
      heading: 'Pourquoi, et pendant combien de temps',
      body: [
      'Ces données servent à exécuter la commande (préparation, livraison, service après-vente) et à respecter les obligations comptables du vendeur.',
      'Les données de commande sont conservées dix ans, durée imposée pour les pièces comptables. Elles ne sont ni vendues ni utilisées à des fins publicitaires.']

    },
    {
      heading: 'Destinataires',
      body: [
      'Stripe (paiement), Supabase (hébergement de la base des commandes, dans l’Union européenne), le transporteur chargé de la livraison, et GitHub (hébergement du site, qui enregistre des journaux techniques incluant l’adresse IP).']

    },
    {
      heading: 'Stockage sur votre appareil',
      body: [
      'Le site garde en mémoire, sur votre appareil uniquement, le contenu du panier, le pays de livraison, la langue et le thème clair ou sombre. Ces informations ne sont pas transmises et ne servent à aucun suivi ; aucun bandeau de consentement n’est donc nécessaire.']

    },
    {
      heading: 'Vos droits',
      body: [
      `Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, leur portabilité, ou vous opposer à leur traitement, en écrivant à ${c.email}.`,
      'Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).']

    }]

  }
});

function shippingFr(c: Parameters<LegalWriter>[0]): string {
  if (!c.shipFrance && !c.shipEurope) return 'La livraison est offerte.';
  const fees = `Frais de livraison : ${c.shipFrance ?? 'offerts'} pour la France, ${c.shipEurope ?? 'offerts'} pour les autres pays.`;
  return c.freeFrom ? `${fees} La livraison est offerte à partir de ${c.freeFrom} d’achat.` : fees;
}

export default fr;
