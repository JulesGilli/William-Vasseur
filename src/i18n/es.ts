import type { Dictionary } from './en';

const es: Dictionary = {
  meta: {
    title: 'William Vasseur — Artista 3D',
    description:
    'Artista 3D en Toulouse. Entornos y personajes de ciencia ficción, y las láminas, figuras y dioramas que nacen de ellos.'
  },
  nav: {
    home: 'Inicio',
    projects: 'Proyectos',
    store: 'Tienda',
    main: 'Navegación principal',
    homeAria: 'William Vasseur — inicio',
    language: 'Idioma'
  },
  theme: {
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro'
  },
  footer: {
    title: 'WILLIAM VASSEUR — ARTISTA 3D',
    credit: 'Sitio web creado por: Jules Gilli',
    social: 'Redes sociales',
    contact: 'Contacto',
    artstation: 'William Vasseur en ArtStation',
    instagram: 'William Vasseur en Instagram',
    legal: 'Aviso legal',
    terms: 'Condiciones de venta',
    privacy: 'Privacidad'
  },
  home: {
    profile: '01 / Perfil',
    toolset: '02 / Herramientas',
    process: '03 / Proceso',
    physical: '04 / Físico',
    next: '05 / Siguiente',
    portraitAlt: 'Retrato de William Vasseur, artista 3D',
    seeInStore: (name) => `${name} — verlo en la tienda`,
    from: (price) => `Desde ${price}`,
    scroll: 'Desliza',
    liveModel: 'Modelo en vivo · no es un render',
    nextStage: (label) => `Siguiente etapa: ${label}`,
    continueDown: 'Seguir bajando por la página',
    timelapse: (label) => `${label} — dibujado desde el primer trazo hasta la pintura final`
  },
  projects: {
    sheet: 'Índice / Lámina 02',
    title: 'PROYECTOS',
    intro:
    'Entornos, personajes y objetos — cada uno modelado, texturizado y renderizado por mí. Cada pieza de aquí abajo es la malla real: arrástrala, gírala, mírala por debajo.',
    all: 'Todo',
    items: (n) => `${n} elementos`,
    categories: { Nature: 'Naturaleza', Civilisation: 'Civilización', Characters: 'Personajes' },
    year: 'Año',
    software: 'Software',
    view: 'VER EL PROYECTO',
    visitWorld: 'VISITAR ESTE MUNDO',
    empty: 'Todavía no hay proyectos en esta categoría.',
    still: 'Imagen',
    process: 'Proceso',
    scrub: (title) => `${title} — recorrer las etapas de producción`,
    finished: 'Obra terminada',
    how: 'Cómo se hizo',
    shipped: 'Láminas, figuras y dioramas, enviados desde Toulouse',
    shopPoster: 'Comprar este póster',
    shopFigurine: 'Comprar esta figura',
    visitStore: 'Ir a la tienda',
    close: 'Cerrar'
  },
  gallery: {
    viewFull: (title, label) => `Ver ${title} — ${label} a tamaño completo`,
    previous: 'Imagen anterior',
    next: 'Imagen siguiente',
    download: 'Descargar'
  },
  viewer: {
    model: 'Modelo',
    loading: 'Cargando el modelo',
    pause: 'Pausar la rotación',
    resume: 'Reanudar la rotación',
    reset: 'Restablecer la vista',
    hint: 'Arrastra para girar · rueda para ampliar',
    live: 'Modelo en vivo'
  },
  world: {
    explore: (title) => `${title} — explorar en 3D`,
    leave: 'Salir de este mundo',
    failed: 'No se pudo cargar este mundo.'
  },
  store: {
    sheet: 'Índice / Lámina 03',
    title: 'TIENDA',
    intro:
    'Láminas, figuras y dioramas — producidos en pequeñas series numeradas a partir de mis propios archivos, enviados desde Toulouse. Gíralos en 3D antes de decidirte.',
    families: { Poster: 'Póster', Figurine: 'Figura', Diorama: 'Diorama' },
    viewDetails: 'Ver detalles',
    details: (name) => `${name} — detalles`,
    close3d: 'Cerrar 3D',
    inspect3d: 'Inspeccionar en 3D',
    size: 'Tamaño',
    edition: 'Edición',
    left: (n, lead) => `Quedan ${n} · ${lead}`,
    soldOutSize: 'Agotado en este tamaño',
    added: 'Añadido',
    addedToCart: 'Añadido al carrito',
    addToCart: 'Añadir al carrito',
    soldOut: 'Agotado',
    success: 'Pedido recibido — una confirmación va de camino a tu correo. Gracias.',
    cancelled: 'Pago cancelado — tu carrito sigue intacto.',
    preview:
    'Vista previa de la tienda — el carrito funciona, pero el pago aún no está conectado: todavía no se pueden hacer pedidos.',
    unavailable: 'Catálogo no disponible',
    emptyShelf: 'Todavía no hay nada en este estante.',
    more: 'Hay más piezas en producción — vuelve pronto.',
    finish: 'Acabado',
    dispatch: 'Envío',
    madeToOrder: 'Hecho por encargo',
    inStock: (n) => `${n} en stock`
  },
  cart: {
    aria: 'Carrito',
    header: (n) => `Carrito · ${n} ${n === 1 ? 'artículo' : 'artículos'}`,
    buttonEmpty: 'Carrito, vacío',
    button: (n) => `Carrito, ${n} ${n === 1 ? 'artículo' : 'artículos'}`,
    close: 'Cerrar el carrito',
    empty: 'El carrito está vacío',
    each: 'la unidad',
    outOfStock: 'Agotado — se quitará al pagar',
    decrease: (name) => `Quitar un ${name}`,
    increase: (name) => `Añadir un ${name}`,
    remove: 'Quitar',
    subtotal: 'Subtotal',
    deliverTo: 'Entrega en',
    shipping: 'Envío',
    free: 'Gratis',
    freeFrom: (amount) => `Envío gratis a partir de ${amount}`,
    total: 'Total',
    vat: 'IVA no aplicable — art. 293 B del código tributario francés',
    terms: 'Al hacer el pedido aceptas las',
    termsLink: 'condiciones de venta',
    checkout: 'PAGAR',
    starting: 'ABRIENDO EL PAGO…',
    failed: 'No se pudo iniciar el pago.',
    noBackend: 'El pago aún no está conectado.',
    refused: (status) => `El pago ha fallado (${status})`,
    countries: {
      FR: 'Francia',
      BE: 'Bélgica',
      LU: 'Luxemburgo',
      DE: 'Alemania',
      ES: 'España',
      IT: 'Italia',
      NL: 'Países Bajos',
      PT: 'Portugal',
      AT: 'Austria',
      IE: 'Irlanda'
    }
  },
  legal: {
    sheet: 'Índice / Legal',
    updated: 'Última actualización',
    missing: 'por completar',
    frenchPrevails:
    'Esta página es una traducción ofrecida para facilitar la lectura. En caso de duda, prevalece la versión francesa.'
  }
};

export default es;
