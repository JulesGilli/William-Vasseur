import { site } from '../data/content';

/**
 * Who is selling, as William entered it in the editor. A French shop has to
 * name its seller, and the legal pages are written around these details.
 */
export const seller = {
  name: '',
  siret: '',
  address: '',
  email: '',
  mediator: '',
  mediatorUrl: '',
  ...site.legal
};

/**
 * The pages exist at their addresses either way, but nothing links to them
 * until the details that make them true are filled in.
 */
export const legalReady = Boolean(seller.name && seller.siret && seller.address);

/**
 * A micro-entreprise under the VAT threshold charges no VAT and has to say so
 * wherever a price is totalled. William unticks this in the editor the day
 * that stops being his case.
 */
export const vatExempt = (site.legal as {vatExempt?: boolean;} | undefined)?.vatExempt !== false;
