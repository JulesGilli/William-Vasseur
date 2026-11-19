/**
 * The legal pages are written once per language as templates, and filled
 * with the seller's details and the shipping fees William has set — so a
 * change of address or of fee in the editor reaches all three pages in all
 * four languages without anyone rewriting a contract.
 *
 * The French text is the reference; the others are translations of it.
 */
export interface LegalContext {
  name: string;
  siret: string;
  address: string;
  email: string;
  mediator: string;
  mediatorUrl: string;
  vatExempt: boolean;
  /** Formatted amounts ("6 €"), or null when that fee is zero. */
  shipFrance: string | null;
  shipEurope: string | null;
  /** Order value from which shipping is free, or null when there is none. */
  freeFrom: string | null;
  /** The delivery countries, named in the page's language. */
  countries: string;
}

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  sections: LegalSection[];
}

export type LegalPage = 'legal' | 'terms' | 'privacy';

export type LegalWriter = (c: LegalContext) => Record<LegalPage, LegalDoc>;
