import { Product, Ritual, Specialist } from './types';

export const SPECIALISTS: Specialist[] = [
  {
    id: 's1',
    name: 'Anel Reyna',
    role: 'Lic. Cosmetología e Imagen',
    bio: 'Licenciada en Cosmetología e Imagen, especializada en maquillaje artístico, tratamientos faciales avanzados y rituales corporales. Cada servicio es una experiencia diseñada para realzar tu belleza natural con técnicas profesionales y atención personalizada.',
    avatarUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=250&q=80'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aura Silk Serum',
    sku: 'AUR-SLK-01',
    shortDescription: 'Un elixir ligero que restaura la elasticidad de la piel y proporciona un acabado aterciopelado.',
    description: 'Hidratación profunda con péptidos activos y ácido hialurónico de triple peso molecular. Ideal para todo tipo de piel.',
    price: 84.00,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
    category: 'serum',
    rating: 4.9,
    reviewsCount: 142,
    size: '30 ml',
    isBestSeller: true,
    benefits: ['Restaura la elasticidad dérmica', 'Suaviza líneas finas', 'Unifica el tono de la piel'],
    ingredients: ['Ácido Hialurónico', 'Niacinamida (Vitamina B3)', 'Extracto de Centella Asiatica'],
    howToUse: 'Aplica 3-4 gotas sobre piel limpia y húmeda. Usa mañana y noche.'
  }
];

export const RITUALS: Ritual[] = [
  // ── CABINA: FACIALES ─────────────────────────────────────────
  {
    id: 'r1',
    name: 'Limpieza Facial',
    badge: 'ESENCIAL',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Tratamiento ideal para tu primera cita, personalizado a las necesidades de tu piel.',
    description: 'Tratamiento ideal para tu primera cita, personalizado a las necesidades de tu piel. Utilizando aparatología personalizada luce tu piel limpia, saludable y luminosa.',
    benefits: [
      'Piel limpia, saludable y luminosa desde la primera sesión',
      'Protocolo personalizado según tu tipo de piel',
      'Aparatología profesional para resultados visibles'
    ],
    steps: [
      'Diagnóstico y análisis del tipo de piel',
      'Limpieza desmaquillante inicial',
      'Exfoliación y apertura de poros',
      'Extracción profesional de comedones',
      'Aplicación de activos personalizados con aparatología',
      'Mascarilla y sérum finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r2',
    name: 'Hydrofacial',
    badge: 'PREMIUM',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Limpieza profunda, extracción, hidratación y exfoliación para una piel oxigenada y limpia.',
    description: 'Tratamiento facial que combina limpieza profunda, extracción, hidratación y exfoliación. Eliminando impurezas para una piel oxigenada y limpia.',
    benefits: [
      'Limpieza profunda con extracción de impurezas',
      'Hidratación intensa y exfoliación simultánea',
      'Piel oxigenada y radiante desde la primera sesión'
    ],
    steps: [
      'Limpieza y desmaquillaje suave',
      'Exfoliación con tecnología hydrofacial',
      'Extracción de impurezas e hidratación a presión',
      'Infusión de activos nutritivos',
      'Mascarilla hidratante de sellado',
      'Sérum finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r3',
    name: 'Facial Lifting',
    badge: 'REAFIRMANTE',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Radiofrecuencia para estimular colágeno y elastina, previniendo arrugas y flacidez.',
    description: 'Procedimiento que utiliza radiofrecuencia. Estimulando la producción de colágeno y elastina en la piel, previniendo y reduciendo arrugas y flacidez en el rostro.',
    benefits: [
      'Estimula la producción de colágeno y elastina',
      'Previene y reduce arrugas y flacidez',
      'Efecto tensor y reafirmante visible'
    ],
    steps: [
      'Limpieza y preparación de la piel',
      'Aplicación de gel conductor',
      'Sesión de radiofrecuencia por zonas',
      'Masaje modelador reafirmante',
      'Mascarilla tensor de efecto inmediato',
      'Crema finalizadora antienvejecimiento'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r4',
    name: 'Facial Control Acné',
    badge: 'PURIFICANTE',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Limpieza profunda para controlar el exceso de grasa y disminuir brotes e impurezas.',
    description: 'Tratamiento enfocado en limpiar profundamente la piel, controlar el exceso de grasa y ayudar a disminuir brotes e impurezas. Incluye limpieza, exfoliación, extracción, activos especializados, aparatología específica y mascarilla calmante para favorecer una piel más equilibrada y saludable.',
    benefits: [
      'Limpieza profunda y control del exceso de grasa',
      'Reducción de brotes e impurezas',
      'Piel más equilibrada, calmada y saludable'
    ],
    steps: [
      'Limpieza profunda con gel purificante',
      'Exfoliación especializada',
      'Extracción controlada de comedones',
      'Aplicación de activos especializados con aparatología',
      'Mascarilla calmante',
      'Crema finalizadora equilibrante'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r5',
    name: 'Facial Microdermoabrasión',
    badge: 'RENOVADOR',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 700,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Procedimiento no invasivo que exfolia y renueva la piel, eliminando células muertas.',
    description: 'Consiste en un procedimiento no invasivo que exfolia y renueva la piel, eliminando células muertas y mejorando su apariencia.',
    benefits: [
      'Exfolia profundamente sin irritación',
      'Elimina células muertas y piel opaca',
      'Mejora la textura y apariencia de la piel'
    ],
    steps: [
      'Limpieza y desmaquillaje completo',
      'Microdermoabrasión mecánica',
      'Aspiración de células muertas liberadas',
      'Sérum calmante post-abrasión',
      'Mascarilla reparadora',
      'Protección hidratante finalizadora'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r13',
    name: 'Facial Ejecutivo',
    badge: 'RÁPIDO',
    category: 'cabina',
    subcategory: 'facial',
    duration: 40,
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffbb8abba64?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Protocolo cosmetológico personalizado de 40 min para quienes quieren lucir bien con poco tiempo.',
    description: 'Tratamiento de 40 min. que consiste de un protocolo cosmetológico personalizado adecuado a tus necesidades. Para aquellas personas con poco tiempo pero que quieren lucir de una piel sana y limpia.',
    benefits: [
      'Piel sana y limpia en solo 40 minutos',
      'Protocolo personalizado según tus necesidades',
      'Ideal para mantenimiento de rutina'
    ],
    steps: [
      'Limpieza y desmaquillaje express',
      'Exfoliación rápida',
      'Extracción esencial',
      'Mascarilla tratante express',
      'Sérum e hidratante finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r14',
    name: 'Facial Personalizado',
    badge: 'A TU MEDIDA',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Facial adaptado exclusivamente para atender las necesidades de tu piel, con resultados visibles y duraderos.',
    description: 'Facial adaptado exclusivamente para atender las necesidades de tu piel, ofreciendo resultados visibles y duraderos. Un enfoque personalizado ayuda a tratar de manera precisa las necesidades específicas de cada cliente.',
    benefits: [
      'Diagnóstico y protocolo 100% personalizado',
      'Resultados visibles y duraderos',
      'Activos seleccionados según tus necesidades específicas'
    ],
    steps: [
      'Diagnóstico cutáneo profundo',
      'Diseño del protocolo personalizado',
      'Limpieza y preparación a medida',
      'Aplicación de activos seleccionados para ti',
      'Mascarilla personalizada',
      'Cierre con tratamiento finalizador específico'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r19',
    name: 'Facial Glow',
    badge: 'LUMINOSIDAD',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Ayuda a combatir manchas y aporta luminosidad a la piel con aparatología específica.',
    description: 'Ayuda a combatir manchas y aportar luminosidad a la piel. Utilizando aparatología específica para un acabado radiante y uniforme.',
    benefits: [
      'Combate manchas y tono desigual',
      'Aporta luminosidad y glow intenso',
      'Aparatología específica para resultados visibles'
    ],
    steps: [
      'Limpieza y diagnóstico de manchas',
      'Exfoliación suave preparadora',
      'Aplicación de activos iluminadores',
      'Sesión con aparatología específica',
      'Mascarilla iluminadora',
      'Sérum glow finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r20',
    name: 'Facial Detox',
    badge: 'DETOX',
    category: 'cabina',
    subcategory: 'facial',
    duration: 60,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Elimina impurezas y toxinas acumuladas, aportando un tono renovado y equilibrado.',
    description: 'Se focaliza en la eliminación profunda de impurezas y toxinas acumuladas en la piel. Utilizando aparatología especializada para aportar un tono renovado, equilibrado y saludable.',
    benefits: [
      'Elimina toxinas e impurezas profundas',
      'Tono de piel renovado y equilibrado',
      'Aparatología especializada para resultados óptimos'
    ],
    steps: [
      'Limpieza y apertura de poros',
      'Exfoliación enzimática detox',
      'Extracción de impurezas acumuladas',
      'Sesión con aparatología específica',
      'Mascarilla purificante y equilibrante',
      'Sérum regenerador finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r15',
    name: 'Facial AURA',
    badge: 'SIGNATURE',
    category: 'cabina',
    subcategory: 'facial',
    isAddon: true,
    duration: 50,
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'El ritual exclusivo de AURA. Luminosidad, firmeza y glow — independiente o como extra en cualquier facial (+$600).',
    description: 'El facial que lleva el nombre del salón. Combina activos exclusivos de alta concentración — vitamina C encapsulada, péptidos tensores y ácido hialurónico de triple peso molecular — en un protocolo diseñado para transformar la piel en una sola sesión. Puede reservarse como tratamiento independiente o añadirse como extra a cualquier otro facial de cabina para potenciar sus resultados.',
    benefits: [
      'Luminosidad y glow intensos desde la primera sesión',
      'Efecto tensor y reafirmante con péptidos activos',
      'Combinable con cualquier facial como extra (+$600)'
    ],
    steps: [
      'Limpieza y preparación de la piel',
      'Aplicación de vitamina C encapsulada',
      'Infusión de péptidos tensores',
      'Masaje con técnica de lifting manual AURA',
      'Mascarilla de ácido hialurónico triple peso',
      'Sérum glow finalizador exclusivo'
    ],
    therapists: ['Anel Reyna']
  },
  // ── MAQUILLAJE ───────────────────────────────────────────────
  {
    id: 'r6',
    name: 'Maquillaje Social',
    badge: 'CLÁSICO',
    category: 'maquillaje',
    duration: 120,
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Maquillaje profesional para eventos y ocasiones sociales, con acabado armonioso y de larga duración.',
    description: 'Maquillaje profesional ideal para eventos y ocasiones sociales. Diseñado para resaltar tus facciones con un acabado armonioso, elegante y de larga duración, adaptado a tu estilo y preferencias.',
    benefits: [
      'Look personalizado según tu estilo y evento',
      'Acabado elegante y armonioso de larga duración',
      'Adaptado a tus preferencias y facciones'
    ],
    steps: [
      'Consulta y análisis de tono de piel',
      'Preparación: limpieza, hidratación y primer',
      'Aplicación de base y corrección',
      'Diseño y delineado de cejas',
      'Maquillaje de ojos y acabado final',
      'Fijación de larga duración'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r7',
    name: 'Maquillaje Novia',
    badge: 'ESPECIAL',
    category: 'maquillaje',
    duration: 180,
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Maquillaje profesional de alta duración para lucir impecable durante toda la celebración.',
    description: 'Maquillaje profesional de alta duración pensado para lucir impecable durante toda la celebración, realzando tus facciones con un acabado sofisticado y personalizado.',
    benefits: [
      'Acabado sofisticado y personalizado para el gran día',
      'Alta duración para toda la celebración',
      'Realza tus facciones con técnica profesional'
    ],
    steps: [
      'Consulta personalizada y preparación de la piel',
      'Base de ultra larga duración',
      'Contouring e iluminación profesional',
      'Maquillaje de ojos personalizado',
      'Diseño y definición de cejas',
      'Labios y fijación de larga duración garantizada'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r8',
    name: 'Maquillaje XV Años',
    badge: 'ESPECIAL',
    category: 'maquillaje',
    duration: 120,
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Acabado juvenil y de larga duración adaptado a tu estilo y temática del evento.',
    description: 'Maquillaje diseñado para resaltar tu belleza en un día tan especial, con un acabado juvenil y de larga duración, adaptado a tu estilo y temática del evento.',
    benefits: [
      'Look juvenil y fresco adaptado a tu temática',
      'Alta duración para toda la celebración',
      'Perfecto para fotografías y videos del evento'
    ],
    steps: [
      'Consulta de estilo y temática del evento',
      'Preparación e hidratación de la piel',
      'Base ligera y luminosa',
      'Diseño de cejas suave y definido',
      'Maquillaje de ojos adaptado al look',
      'Labial y fijación final de larga duración'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r17',
    name: 'Maquillaje Graduación',
    badge: 'CELEBRACIÓN',
    category: 'maquillaje',
    duration: 120,
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Look elegante, fresco y duradero para destacar en tu graduación y fotografías.',
    description: 'Look ideal para tu graduación, creado para destacar tus facciones con un maquillaje elegante, fresco y duradero para fotografías y celebración.',
    benefits: [
      'Look fotogénico adaptado a tu personalidad',
      'Elegante, fresco y de larga duración',
      'Perfecto para ceremonia y celebración'
    ],
    steps: [
      'Consulta y análisis de tono de piel',
      'Preparación: limpieza, hidratación y primer',
      'Base HD y corrección de imperfecciones',
      'Diseño y delineado de cejas',
      'Maquillaje de ojos festivo y acabado final',
      'Fijación de larga duración'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r18',
    name: 'Curso de Automaquillaje',
    badge: 'APRENDE',
    category: 'maquillaje',
    duration: 180,
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Aprende técnicas y productos ideales para tu tipo de rostro y piel con Anel.',
    description: 'Aprende técnicas y productos ideales para tu tipo de rostro y piel. Curso personalizado para lograr maquillajes prácticos, favorecedores y adaptados a tu estilo.',
    benefits: [
      'Técnicas personalizadas para tu tipo de rostro',
      'Productos ideales según tu tono y tipo de piel',
      'Maquillajes prácticos y adaptados a tu estilo'
    ],
    steps: [
      'Diagnóstico de facciones y tono de piel',
      'Explicación de bases y preparación de la piel',
      'Práctica guiada: base, corrección y cejas',
      'Técnicas de ojos adaptadas a tu forma',
      'Contouring, iluminación y labial personalizado',
      'Resolución de dudas y productos recomendados'
    ],
    therapists: ['Anel Reyna']
  },
  // ── CABINA: CORPORALES ───────────────────────────────────────
  {
    id: 'r9',
    name: 'Masaje Relajante',
    badge: 'BIENESTAR',
    category: 'cabina',
    subcategory: 'corporal',
    duration: 60,
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Técnica terapéutica de movimientos suaves y rítmicos para la relajación general del cuerpo y la mente.',
    description: 'Consiste en una técnica terapéutica que utiliza movimientos suaves y rítmicos. Aliviando la tensión muscular y promoviendo la relajación general del cuerpo y la mente.',
    benefits: [
      'Alivia la tensión muscular acumulada',
      'Promueve la relajación general del cuerpo',
      'Renueva la energía y el bienestar mental'
    ],
    steps: [
      'Recepción y consulta de zonas de tensión',
      'Preparación con aceites esenciales relajantes',
      'Masaje de espalda, hombros y cuello',
      'Masaje de piernas y pies',
      'Técnica de presión profunda en puntos de tensión',
      'Relajación final con compresas tibias'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r10',
    name: 'EMS Body + Drenaje Linfático',
    badge: 'REAFIRMANTE',
    category: 'cabina',
    subcategory: 'corporal',
    duration: 60,
    price: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Tecnología EMS y drenaje linfático manual para tonificar, reafirmar y eliminar retención de líquidos.',
    description: 'Tratamiento corporal de alta tecnología que combina electroestimulación muscular (EMS) con drenaje linfático manual. Tonifica los músculos, reduce la celulitis y elimina la retención de líquidos para un cuerpo más firme y definido.',
    benefits: [
      'Tonifica y reafirma la musculatura corporal',
      'Elimina la retención de líquidos y reduce el volumen',
      'Mejora la apariencia de la celulitis visiblemente'
    ],
    steps: [
      'Medición y evaluación de zonas a tratar',
      'Aplicación de gel conductor',
      'Sesión de electroestimulación EMS',
      'Drenaje linfático manual de zonas tratadas',
      'Masaje reafirmante con crema activa',
      'Vendaje frío de efecto tensor'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r11',
    name: 'Exfoliación de Espalda',
    badge: 'PURIFICANTE',
    category: 'cabina',
    subcategory: 'corporal',
    duration: 60,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Exfoliación mecánica con mascarilla personalizada para eliminar células muertas e hidratar la piel.',
    description: 'Tratamiento que consiste en una exfoliación mecánica en la zona para eliminar células muertas de la piel seguido con una mascarilla personalizada y envolvemos la zona para hidratar y nutrir la piel.',
    benefits: [
      'Elimina células muertas e impurezas acumuladas',
      'Mascarilla personalizada para hidratación profunda',
      'Piel suave, nutrida y renovada'
    ],
    steps: [
      'Limpieza inicial y análisis de la piel',
      'Exfoliación mecánica en zona de espalda',
      'Enjuague y preparación post-exfoliación',
      'Aplicación de mascarilla personalizada',
      'Envoltura para potenciar absorción de activos',
      'Hidratación profunda finalizadora'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r12',
    name: 'Eliminación de Verrugas',
    badge: 'EVALUACIÓN',
    category: 'cabina',
    subcategory: 'corporal',
    duration: 30,
    price: 0,
    customQuote: true,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Evaluación gratuita para determinar el tratamiento y presupuesto personalizado según cada caso.',
    description: 'Eliminación de verrugas con aparatología. El precio varía según el número y características de las lesiones, por ello la primera cita es una evaluación gratuita donde Anel analizará tu caso y te entregará un presupuesto personalizado sin compromiso.',
    benefits: [
      'Evaluación diagnóstica gratuita y sin compromiso',
      'Presupuesto personalizado según tu caso específico',
      'Aparatología especializada para cada tipo de lesión'
    ],
    steps: [
      'Evaluación visual y diagnóstica de las lesiones',
      'Determinación del método de tratamiento idóneo',
      'Estimación del número de sesiones necesarias',
      'Entrega de presupuesto personalizado',
      'Agendamiento del tratamiento si se acepta el presupuesto'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r16',
    name: 'Velo de Novia',
    badge: 'NUPCIAL',
    category: 'cabina',
    subcategory: 'corporal',
    duration: 60,
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Exfoliación corporal completa con mascarilla y envoltura para una piel radiante en tu día especial.',
    description: 'La forma perfecta para lucir una piel radiante y suave en un día especial. Consiste en una exfoliación corporal completa donde eliminamos células muertas, impurezas, puntos negros, exceso de grasa y toxinas acumuladas. Mascarilla personalizada y envoltura por ambos lados del cuerpo.',
    benefits: [
      'Piel radiante, suave y luminosa para el día especial',
      'Exfoliación corporal completa por ambos lados',
      'Elimina células muertas, impurezas y toxinas'
    ],
    steps: [
      'Exfoliación corporal completa cara anterior',
      'Exfoliación corporal cara posterior',
      'Enjuague y preparación de la piel',
      'Aplicación de mascarilla personalizada',
      'Envoltura corporal por ambos lados',
      'Hidratación selladora final'
    ],
    therapists: ['Anel Reyna']
  }
];
