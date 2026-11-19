import type { LegalWriter } from './types';

/** Translation of ./fr.ts, which is the reference. */
const de: LegalWriter = (c) => ({
  legal: {
    title: 'IMPRESSUM',
    sections: [
    {
      heading: 'Herausgeber',
      body: [
      `${c.name}, Einzelunternehmer (französische Micro-Entreprise).`,
      `SIRET (Unternehmensnummer): ${c.siret}`,
      `Anschrift: ${c.address}`,
      `Kontakt: ${c.email}`,
      ...(c.vatExempt ? ['Keine Mehrwertsteuer ausgewiesen — Art. 293 B des französischen Steuergesetzbuchs.'] : []),
      `Verantwortlich für den Inhalt: ${c.name}.`]

    },
    {
      heading: 'Hosting',
      body: [
      'Die Website wird von GitHub Pages gehostet — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA.',
      'Die Daten des Shops (Katalog, Bestellungen) werden von Supabase, Inc. in der Europäischen Union gehostet.',
      'Zahlungen werden von Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland, abgewickelt.']

    },
    {
      heading: 'Urheberrecht',
      body: [
      `Alle auf dieser Website gezeigten Werke — Bilder, Renderings, 3D-Modelle, Zeichnungen, Texte — sind ausschließliches Eigentum von ${c.name}. Jede Vervielfältigung, Verbreitung oder Nutzung, auch auszugsweise, ist ohne vorherige schriftliche Genehmigung untersagt.`,
      'Der Kauf eines Drucks, einer Figur oder eines Dioramas betrifft den Gegenstand selbst: Urheberrechte am Werk werden damit nicht übertragen.']

    },
    {
      heading: 'Website',
      body: ['Gestaltet und entwickelt von Jules Gilli.']
    }]

  },

  terms: {
    title: 'VERKAUFSBEDINGUNGEN',
    sections: [
    {
      heading: '1. Geltungsbereich',
      body: [
      `Diese Bedingungen gelten für jeden Kauf auf dieser Website zwischen ${c.name} („der Verkäufer“) und jeder Person, die eine Bestellung aufgibt („der Käufer“). Mit der Bestellung werden sie akzeptiert.`]

    },
    {
      heading: '2. Produkte',
      body: [
      'Der Verkäufer bietet Kunstdrucke, Figuren und Dioramen an, die in kleinen Serien oder auf Bestellung nach seinen eigenen Werken gefertigt werden.',
      'Fotos und 3D-Vorschauen sind so originalgetreu wie möglich. Da die Stücke gedruckt und von Hand fertiggestellt werden, sind leichte Abweichungen in Farbe oder Ausführung möglich und stellen keinen Mangel dar.']

    },
    {
      heading: '3. Preise',
      body: [
      `Die Preise sind in Euro angegeben. ${c.vatExempt ? 'Keine Mehrwertsteuer ausgewiesen — Art. 293 B des französischen Steuergesetzbuchs. ' : 'Sie verstehen sich inklusive aller Steuern. '}Die Versandkosten werden im Warenkorb hinzugerechnet und vor der Zahlung angezeigt.`,
      'Es gilt der Preis, der zum Zeitpunkt der Bestellung angezeigt wird.']

    },
    {
      heading: '4. Bestellung',
      body: [
      'Der Käufer legt Artikel in den Warenkorb, wählt das Lieferland und bezahlt. Die Bestellung ist verbindlich, sobald die Zahlung akzeptiert ist; eine Bestätigung wird per E-Mail gesendet.',
      'Der Verkäufer kann eine Bestellung bei einem offensichtlichen Preis- oder Bestandsfehler stornieren; der Käufer erhält dann den vollen Betrag zurück.']

    },
    {
      heading: '5. Zahlung',
      body: [
      'Die Zahlung erfolgt per Karte auf der gesicherten Seite von Stripe. Der Verkäufer hat zu keinem Zeitpunkt Zugriff auf die Kartendaten.']

    },
    {
      heading: '6. Lieferung',
      body: [
      `Bestellungen werden aus Frankreich in folgende Länder versandt: ${c.countries}.`,
      shippingDe(c),
      'Die Versandzeit ist auf der jeweiligen Produktseite angegeben, da manche Stücke auf Bestellung gefertigt werden. Fehlt eine Angabe, erfolgt die Lieferung spätestens 30 Tage nach der Bestellung.',
      'Bei Lieferverzug kann der Käufer die Stornierung und Erstattung seiner Bestellung verlangen. Kommt ein Paket beschädigt an, genügt eine baldige Nachricht mit Fotos an den Verkäufer: Das Stück wird ersetzt oder erstattet.']

    },
    {
      heading: '7. Widerrufsrecht',
      body: [
      'Der Käufer kann seine Bestellung innerhalb von 14 Tagen nach Erhalt ohne Angabe von Gründen widerrufen. Dazu genügt eine E-Mail an den Verkäufer vor Ablauf dieser Frist.',
      'Die Ware ist innerhalb von 14 Tagen nach dieser Mitteilung im Originalzustand und gut geschützt zurückzusenden. Die Kosten der Rücksendung trägt der Käufer.',
      'Der Verkäufer erstattet alle geleisteten Zahlungen einschließlich der Standardversandkosten innerhalb von 14 Tagen nach der Mitteilung; er kann die Erstattung zurückhalten, bis die Ware eingegangen ist oder ihr Versand nachgewiesen wurde.',
      'Gemäß Artikel L221-28 des französischen Verbrauchergesetzbuchs gilt dieses Recht nicht für Stücke, die nach Vorgaben des Käufers gefertigt oder eindeutig personalisiert wurden (Auftragsarbeiten).']

    },
    {
      heading: '8. Gesetzliche Gewährleistung',
      body: [
      'Für alle Produkte gilt die gesetzliche Konformitätsgarantie (Artikel L217-3 ff. des französischen Verbrauchergesetzbuchs) für zwei Jahre ab Lieferung sowie die Haftung für verborgene Mängel (Artikel 1641 ff. des französischen Zivilgesetzbuchs).',
      `Für Reklamationen: ${c.email}.`]

    },
    {
      heading: '9. Personenbezogene Daten',
      body: [
      'Die bei einer Bestellung erhobenen Daten dienen ausschließlich ihrer Abwicklung und Lieferung. Einzelheiten stehen auf der Seite Datenschutz.']

    },
    {
      heading: '10. Schlichtung',
      body: [
      `Lässt sich ein Streit nicht direkt mit dem Verkäufer beilegen, kann der Käufer kostenlos eine Verbraucherschlichtungsstelle anrufen: ${c.mediator}${c.mediatorUrl ? ` — ${c.mediatorUrl}` : ''}.`]

    },
    {
      heading: '11. Anwendbares Recht',
      body: [
      'Diese Bedingungen unterliegen französischem Recht. Verbraucher behalten den Schutz der zwingenden Vorschriften des Rechts ihres Wohnsitzlandes. Maßgeblich ist die französische Fassung dieser Bedingungen.']

    }]

  },

  privacy: {
    title: 'DATENSCHUTZ',
    sections: [
    {
      heading: 'Verantwortlicher',
      body: [`${c.name} — ${c.email}`]
    },
    {
      heading: 'Welche Daten erhoben werden',
      body: [
      'Für den Besuch der Website ist kein Konto nötig; es werden keine Werbe- oder Analyse-Tracker gesetzt.',
      'Bei einer Bestellung werden erhoben: E-Mail-Adresse, Name und Lieferadresse sowie Inhalt und Betrag der Bestellung. Kartendaten werden auf der Seite von Stripe eingegeben und gelangen nie zum Verkäufer.']

    },
    {
      heading: 'Wozu und wie lange',
      body: [
      'Diese Daten dienen der Ausführung der Bestellung (Vorbereitung, Lieferung, Kundendienst) und der Erfüllung der Buchführungspflichten des Verkäufers.',
      'Bestelldaten werden zehn Jahre aufbewahrt, wie für Buchungsbelege vorgeschrieben. Sie werden weder verkauft noch für Werbung genutzt.']

    },
    {
      heading: 'Empfänger',
      body: [
      'Stripe (Zahlung), Supabase (Hosting der Bestelldatenbank in der Europäischen Union), das mit der Zustellung beauftragte Versandunternehmen und GitHub (Hosting der Website; dort werden technische Protokolle einschließlich der IP-Adresse gespeichert).']

    },
    {
      heading: 'Speicherung auf deinem Gerät',
      body: [
      'Die Website merkt sich ausschließlich auf deinem Gerät den Inhalt des Warenkorbs, das Lieferland, die Sprache und das helle oder dunkle Design. Nichts davon wird übertragen oder zur Nachverfolgung genutzt; deshalb gibt es kein Einwilligungsbanner.']

    },
    {
      heading: 'Deine Rechte',
      body: [
      `Du kannst Auskunft über deine Daten, ihre Berichtigung, Löschung oder Übertragbarkeit verlangen oder der Verarbeitung widersprechen — per E-Mail an ${c.email}.`,
      'Du kannst außerdem Beschwerde bei der französischen Datenschutzbehörde CNIL (www.cnil.fr) einlegen.']

    }]

  }
});

function shippingDe(c: Parameters<LegalWriter>[0]): string {
  if (!c.shipFrance && !c.shipEurope) return 'Der Versand ist kostenlos.';
  const fees = `Versandkosten: ${c.shipFrance ?? 'kostenlos'} für Frankreich, ${c.shipEurope ?? 'kostenlos'} für die anderen Länder.`;
  return c.freeFrom ? `${fees} Ab einem Bestellwert von ${c.freeFrom} ist der Versand kostenlos.` : fees;
}

export default de;
