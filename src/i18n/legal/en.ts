import type { LegalWriter } from './types';

/** Translation of ./fr.ts, which is the reference. */
const en: LegalWriter = (c) => ({
  legal: {
    title: 'LEGAL NOTICE',
    sections: [
    {
      heading: 'Publisher',
      body: [
      `${c.name}, sole trader (French micro-entreprise).`,
      `SIRET (company registration): ${c.siret}`,
      `Address: ${c.address}`,
      `Contact: ${c.email}`,
      ...(c.vatExempt ? ['VAT not applicable — art. 293 B of the French General Tax Code.'] : []),
      `Publication director: ${c.name}.`]

    },
    {
      heading: 'Hosting',
      body: [
      'The site is hosted by GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA.',
      'Shop data (catalogue, orders) is hosted in the European Union by Supabase, Inc.',
      'Payments are processed by Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Ireland.']

    },
    {
      heading: 'Intellectual property',
      body: [
      `All work shown on this site — images, renders, 3D models, drawings, texts — is the exclusive property of ${c.name}. Any reproduction, distribution or use, even partial, is prohibited without prior written permission.`,
      'Buying a print, a figurine or a diorama is buying the object itself: it transfers no copyright in the work.']

    },
    {
      heading: 'Website',
      body: ['Designed and developed by Jules Gilli.']
    }]

  },

  terms: {
    title: 'TERMS OF SALE',
    sections: [
    {
      heading: '1. Scope',
      body: [
      `These terms apply to every sale made on this site between ${c.name} (“the seller”) and anyone placing an order (“the buyer”). Placing an order means accepting them.`]

    },
    {
      heading: '2. Products',
      body: [
      'The seller offers art prints, figurines and dioramas, produced in small batches or made to order from his own work.',
      'Photographs and 3D previews are as faithful as possible. Because pieces are printed and finished by hand, slight variations in colour or finish may occur and are not defects.']

    },
    {
      heading: '3. Prices',
      body: [
      `Prices are in euros. ${c.vatExempt ? 'VAT not applicable — art. 293 B of the French General Tax Code. ' : 'They include all taxes. '}Shipping is added in the cart and shown before payment.`,
      'The price that applies is the one displayed when the order is placed.']

    },
    {
      heading: '4. Ordering',
      body: [
      'The buyer adds items to the cart, chooses the delivery country, then pays. The order is final once payment is accepted; a confirmation is sent by e-mail.',
      'The seller may cancel an order in the event of an obvious pricing or stock error; the buyer is then refunded in full.']

    },
    {
      heading: '5. Payment',
      body: [
      'Payment is made by card on Stripe’s secure page. The seller never has access to card details.']

    },
    {
      heading: '6. Delivery',
      body: [
      `Orders ship from France to the following countries: ${c.countries}.`,
      shippingEn(c),
      'The dispatch time is stated on each product page, as some pieces are made to order. Where none is stated, delivery takes place within 30 days of the order.',
      'If delivery is late, the buyer may ask for the order to be cancelled and refunded. If a parcel arrives damaged, write to the seller as soon as possible, with photographs: the piece is replaced or refunded.']

    },
    {
      heading: '7. Right of withdrawal',
      body: [
      'The buyer has 14 days from receiving the order to withdraw, without giving a reason, by telling the seller by e-mail before that period ends.',
      'The product must be sent back within 14 days of that notice, in its original condition and properly protected. Return postage is paid by the buyer.',
      'The seller refunds everything paid, standard delivery included, within 14 days of the notice; the refund may be held until the product is received or proof of its return is provided.',
      'Under article L221-28 of the French Consumer Code, this right does not apply to pieces made to the buyer’s specifications or clearly personalised (custom commissions).']

    },
    {
      heading: '8. Legal guarantees',
      body: [
      'All products are covered by the legal guarantee of conformity (articles L217-3 et seq. of the French Consumer Code) for two years from delivery, and by the guarantee against hidden defects (articles 1641 et seq. of the French Civil Code).',
      `For any claim: ${c.email}.`]

    },
    {
      heading: '9. Personal data',
      body: [
      'Data collected with an order is used only to process and deliver it. Details are on the Privacy page.']

    },
    {
      heading: '10. Mediation',
      body: [
      `If a dispute cannot be settled directly with the seller, the buyer may use a consumer mediator free of charge: ${c.mediator}${c.mediatorUrl ? ` — ${c.mediatorUrl}` : ''}.`]

    },
    {
      heading: '11. Governing law',
      body: [
      'These terms are governed by French law. A consumer keeps the benefit of the mandatory provisions of the law of their country of residence. The French version of these terms prevails.']

    }]

  },

  privacy: {
    title: 'PRIVACY',
    sections: [
    {
      heading: 'Data controller',
      body: [`${c.name} — ${c.email}`]
    },
    {
      heading: 'What is collected',
      body: [
      'Browsing the site needs no account and sets no advertising or analytics trackers.',
      'When you order, the following are collected: e-mail address, name and delivery address, and the content and amount of the order. Card details are entered on Stripe’s page and never reach the seller.']

    },
    {
      heading: 'Why, and for how long',
      body: [
      'This data is used to fulfil the order (preparation, delivery, after-sales) and to meet the seller’s accounting obligations.',
      'Order data is kept for ten years, as required for accounting records. It is neither sold nor used for advertising.']

    },
    {
      heading: 'Who receives it',
      body: [
      'Stripe (payment), Supabase (hosting of the order database, in the European Union), the carrier delivering the parcel, and GitHub (hosting of the site, which keeps technical logs including IP addresses).']

    },
    {
      heading: 'Storage on your device',
      body: [
      'The site remembers, on your device only, the content of your cart, the delivery country, the language and the light or dark theme. None of it is transmitted or used for tracking, which is why there is no consent banner.']

    },
    {
      heading: 'Your rights',
      body: [
      `You may ask for access to your data, its correction, deletion or portability, or object to its processing, by writing to ${c.email}.`,
      'You may also lodge a complaint with the French data protection authority, the CNIL (www.cnil.fr).']

    }]

  }
});

function shippingEn(c: Parameters<LegalWriter>[0]): string {
  if (!c.shipFrance && !c.shipEurope) return 'Shipping is free.';
  const fees = `Shipping: ${c.shipFrance ?? 'free'} for France, ${c.shipEurope ?? 'free'} for other countries.`;
  return c.freeFrom ? `${fees} Shipping is free on orders of ${c.freeFrom} or more.` : fees;
}

export default en;
