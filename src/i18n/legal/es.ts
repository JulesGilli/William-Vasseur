import type { LegalWriter } from './types';

/** Translation of ./fr.ts, which is the reference. */
const es: LegalWriter = (c) => ({
  legal: {
    title: 'AVISO LEGAL',
    sections: [
    {
      heading: 'Titular del sitio',
      body: [
      `${c.name}, empresario individual (micro-entreprise francesa).`,
      `SIRET (número de registro): ${c.siret}`,
      `Dirección: ${c.address}`,
      `Contacto: ${c.email}`,
      ...(c.vatExempt ? ['IVA no aplicable — art. 293 B del Código General de Impuestos francés.'] : []),
      `Director de la publicación: ${c.name}.`]

    },
    {
      heading: 'Alojamiento',
      body: [
      'El sitio está alojado en GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Estados Unidos.',
      'Los datos de la tienda (catálogo, pedidos) están alojados en la Unión Europea por Supabase, Inc.',
      'Los pagos los procesa Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublín 2, Irlanda.']

    },
    {
      heading: 'Propiedad intelectual',
      body: [
      `Todas las obras mostradas en este sitio — imágenes, renders, modelos 3D, dibujos, textos — son propiedad exclusiva de ${c.name}. Queda prohibida cualquier reproducción, difusión o uso, incluso parcial, sin autorización previa por escrito.`,
      'La compra de una lámina, una figura o un diorama se refiere al objeto en sí: no implica ninguna cesión de derechos de autor sobre la obra.']

    },
    {
      heading: 'Sitio web',
      body: ['Diseñado y desarrollado por Jules Gilli.']
    }]

  },

  terms: {
    title: 'CONDICIONES DE VENTA',
    sections: [
    {
      heading: '1. Objeto',
      body: [
      `Estas condiciones se aplican a toda venta realizada en este sitio entre ${c.name} («el vendedor») y cualquier persona que haga un pedido («el comprador»). Hacer un pedido implica aceptarlas.`]

    },
    {
      heading: '2. Productos',
      body: [
      'El vendedor ofrece láminas artísticas, figuras y dioramas, producidos en pequeñas series o por encargo a partir de sus propias creaciones.',
      'Las fotografías y las vistas 3D son lo más fieles posible. Como las piezas se imprimen y se terminan a mano, pueden existir ligeras variaciones de color o de acabado que no constituyen un defecto.']

    },
    {
      heading: '3. Precios',
      body: [
      `Los precios se indican en euros. ${c.vatExempt ? 'IVA no aplicable — art. 293 B del Código General de Impuestos francés. ' : 'Incluyen todos los impuestos. '}Los gastos de envío se añaden en el carrito y se muestran antes del pago.`,
      'El precio aplicable es el que se muestra en el momento del pedido.']

    },
    {
      heading: '4. Pedido',
      body: [
      'El comprador añade los artículos al carrito, elige el país de entrega y paga. El pedido es firme una vez aceptado el pago; se envía una confirmación por correo electrónico.',
      'El vendedor puede anular un pedido en caso de error manifiesto de precio o de stock; el comprador recibe entonces el reembolso íntegro.']

    },
    {
      heading: '5. Pago',
      body: [
      'El pago se realiza con tarjeta en la página segura de Stripe. El vendedor nunca tiene acceso a los datos de la tarjeta.']

    },
    {
      heading: '6. Entrega',
      body: [
      `Los pedidos se envían desde Francia a los siguientes países: ${c.countries}.`,
      shippingEs(c),
      'El plazo de envío se indica en la ficha de cada producto, ya que algunas piezas se fabrican por encargo. Si no se indica, la entrega se realiza como máximo 30 días después del pedido.',
      'En caso de retraso, el comprador puede pedir la anulación y el reembolso de su pedido. Si un paquete llega dañado, basta con escribir al vendedor lo antes posible, con fotos: la pieza se sustituye o se reembolsa.']

    },
    {
      heading: '7. Derecho de desistimiento',
      body: [
      'El comprador dispone de 14 días desde la recepción del pedido para desistir, sin necesidad de justificarlo. Basta con comunicarlo al vendedor por correo electrónico antes de que termine ese plazo.',
      'El producto debe devolverse en los 14 días siguientes a esa comunicación, en su estado original y bien protegido. Los gastos de devolución corren a cargo del comprador.',
      'El vendedor reembolsa todas las cantidades pagadas, incluido el envío estándar, en los 14 días siguientes a la comunicación; puede retener el reembolso hasta recibir el producto o una prueba de su envío.',
      'De acuerdo con el artículo L221-28 del Código de Consumo francés, este derecho no se aplica a las piezas realizadas según las especificaciones del comprador o claramente personalizadas (encargos a medida).']

    },
    {
      heading: '8. Garantías legales',
      body: [
      'Todos los productos cuentan con la garantía legal de conformidad (artículos L217-3 y siguientes del Código de Consumo francés) durante dos años desde la entrega, y con la garantía por vicios ocultos (artículos 1641 y siguientes del Código Civil francés).',
      `Para cualquier reclamación: ${c.email}.`]

    },
    {
      heading: '9. Datos personales',
      body: [
      'Los datos recogidos con un pedido se usan únicamente para tramitarlo y entregarlo. Los detalles están en la página Privacidad.']

    },
    {
      heading: '10. Mediación',
      body: [
      `Si un litigio no se resuelve directamente con el vendedor, el comprador puede acudir gratuitamente a un mediador de consumo: ${c.mediator}${c.mediatorUrl ? ` — ${c.mediatorUrl}` : ''}.`]

    },
    {
      heading: '11. Ley aplicable',
      body: [
      'Estas condiciones se rigen por la ley francesa. El consumidor conserva la protección de las disposiciones imperativas de la ley de su país de residencia. Prevalece la versión francesa de estas condiciones.']

    }]

  },

  privacy: {
    title: 'PRIVACIDAD',
    sections: [
    {
      heading: 'Responsable del tratamiento',
      body: [`${c.name} — ${c.email}`]
    },
    {
      heading: 'Qué datos se recogen',
      body: [
      'Navegar por el sitio no requiere cuenta y no instala rastreadores publicitarios ni de analítica.',
      'Al hacer un pedido se recogen: la dirección de correo electrónico, el nombre y la dirección de entrega, así como el contenido y el importe del pedido. Los datos de la tarjeta se introducen en la página de Stripe y nunca llegan al vendedor.']

    },
    {
      heading: 'Para qué y durante cuánto tiempo',
      body: [
      'Estos datos sirven para ejecutar el pedido (preparación, entrega, posventa) y para cumplir las obligaciones contables del vendedor.',
      'Los datos de los pedidos se conservan diez años, plazo exigido para los documentos contables. No se venden ni se usan con fines publicitarios.']

    },
    {
      heading: 'Destinatarios',
      body: [
      'Stripe (pago), Supabase (alojamiento de la base de datos de pedidos, en la Unión Europea), el transportista encargado de la entrega y GitHub (alojamiento del sitio, que guarda registros técnicos que incluyen la dirección IP).']

    },
    {
      heading: 'Almacenamiento en tu dispositivo',
      body: [
      'El sitio recuerda, solo en tu dispositivo, el contenido del carrito, el país de entrega, el idioma y el tema claro u oscuro. Nada de ello se transmite ni se usa para seguimiento; por eso no hay banner de consentimiento.']

    },
    {
      heading: 'Tus derechos',
      body: [
      `Puedes solicitar el acceso a tus datos, su rectificación, supresión o portabilidad, u oponerte a su tratamiento, escribiendo a ${c.email}.`,
      'También puedes presentar una reclamación ante la autoridad francesa de protección de datos, la CNIL (www.cnil.fr).']

    }]

  }
});

function shippingEs(c: Parameters<LegalWriter>[0]): string {
  if (!c.shipFrance && !c.shipEurope) return 'El envío es gratuito.';
  const fees = `Gastos de envío: ${c.shipFrance ?? 'gratis'} para Francia, ${c.shipEurope ?? 'gratis'} para los demás países.`;
  return c.freeFrom ? `${fees} El envío es gratuito a partir de ${c.freeFrom} de compra.` : fees;
}

export default es;
