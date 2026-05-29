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
  // ── FACIALES ─────────────────────────────────────────────────
  {
    id: 'r1',
    name: 'Limpieza Facial',
    badge: 'ESENCIAL',
    duration: 50,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Limpieza profunda que elimina impurezas y revitaliza tu piel desde la primera sesión.',
    description: 'Nuestro facial más solicitado. Combina limpieza enzimática, extracción profesional de comedones y una mascarilla calmante personalizada según tu tipo de piel. Deja la piel visiblemente más limpia, suave y luminosa.',
    benefits: [
      'Elimina impurezas y exceso de sebo acumulado',
      'Reduce poros y minimiza puntos negros',
      'Hidrata y unifica el tono de forma inmediata'
    ],
    steps: [
      'Diagnóstico y análisis del tipo de piel',
      'Limpieza desmaquillante con bálsamo enzimático',
      'Vapor facial para apertura de poros',
      'Extracción profesional de comedones',
      'Mascarilla calmante e hidratante personalizada',
      'Aplicación de sérum y crema finalizadora'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r2',
    name: 'Hydrofacial',
    badge: 'PREMIUM',
    duration: 50,
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Hidratación intensa y renovación celular con tecnología de punta para un glow instantáneo.',
    description: 'El tratamiento estrella para pieles que necesitan hidratación profunda y renovación celular. Utiliza tecnología de infusión simultánea que limpia, exfolia e hidrata en un solo paso, dejando la piel con un brillo espectacular desde la primera sesión.',
    benefits: [
      'Hidratación profunda duradera hasta por 72 horas',
      'Exfoliación suave sin irritación ni descamación',
      'Efecto glow inmediato y duradero'
    ],
    steps: [
      'Limpieza y desmaquillaje suave',
      'Exfoliación con punta de diamante personalizada',
      'Infusión de vitaminas y ácido hialurónico a presión',
      'Masaje linfático de rostro y cuello',
      'Mascarilla hidratante de última generación',
      'Sérum vitamínico finalizador'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r3',
    name: 'Facial Lifting',
    badge: 'REAFIRMANTE',
    duration: 50,
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Técnica de tensado natural que define el óvalo facial y devuelve firmeza a la piel.',
    description: 'Un facial arquitectónico que trabaja los músculos del rostro para reafirmar, tonificar y esculpir las facciones de forma natural. Combina masaje modelador con principios activos reafirmantes para resultados visibles desde la primera sesión.',
    benefits: [
      'Reafirma y tensa la piel de forma natural',
      'Define el óvalo facial y los pómulos',
      'Reduce la apariencia de flacidez'
    ],
    steps: [
      'Limpieza y preparación de la piel',
      'Exfoliación enzimática suave',
      'Masaje de lifting con técnica modeladora',
      'Infusión de principios activos reafirmantes',
      'Mascarilla tensor de efecto inmediato',
      'Crema finalizadora antienvejecimiento'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r4',
    name: 'Facial Control Acné',
    badge: 'PURIFICANTE',
    duration: 50,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Tratamiento especializado para pieles con acné activo o tendencia grasa.',
    description: 'Protocolo clínico diseñado para pieles con acné, combinando ácidos exfoliantes, luz LED azul antibacteriana y activos reguladores del sebo. Reduce la inflamación, previene nuevos brotes y deja la piel limpia y equilibrada.',
    benefits: [
      'Reduce brotes activos de acné con activos antibacterianos',
      'Regula la producción de sebo',
      'Mejora la textura y uniformidad de la piel'
    ],
    steps: [
      'Limpieza profunda con gel purificante',
      'Exfoliación química con ácido salicílico',
      'Extracción controlada de comedones',
      'Aplicación de ampolleta antibacteriana',
      'Mascarilla de arcilla absorbente',
      'Crema matificante finalizadora'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r5',
    name: 'Facial Microdermoabrasión',
    badge: 'RENOVADOR',
    duration: 50,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Renovación celular profunda con microdermoabrasión para una piel nueva y tersa.',
    description: 'Exfoliación mecánica avanzada que elimina la capa superficial de células muertas, reduce manchas, cicatrices superficiales y líneas de expresión. Estimula la producción de colágeno para una piel visiblemente más joven y radiante.',
    benefits: [
      'Elimina células muertas y piel opaca en profundidad',
      'Reduce manchas, cicatrices y líneas de expresión',
      'Estimula la renovación celular y producción de colágeno'
    ],
    steps: [
      'Limpieza y desmaquillaje completo',
      'Microdermoabrasión con punta de cristal',
      'Aspiración de impurezas liberadas',
      'Calming sérum post-abrasión',
      'Mascarilla reparadora y calmante',
      'Protección hidratante finalizadora'
    ],
    therapists: ['Anel Reyna']
  },
  // ── MAQUILLAJE ───────────────────────────────────────────────
  {
    id: 'r6',
    name: 'Maquillaje Social',
    badge: 'CLÁSICO',
    duration: 45,
    price: 700,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Look elegante y duradero para cualquier evento social o celebración.',
    description: 'Maquillaje profesional personalizado según tu tipo de piel, tono y el estilo del evento. Incluye preparación de la piel, base de larga duración, diseño de cejas y acabado fotogénico que dura toda la noche.',
    benefits: [
      'Look personalizado según tu estilo y evento',
      'Técnicas profesionales de larga duración',
      'Preparación e hidratación de la piel incluida'
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
    duration: 90,
    price: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'El look de tus sueños para el día más importante de tu vida.',
    description: 'Una experiencia completa para la novia más radiante. Incluye prueba previa de maquillaje, asesoría de imagen personalizada y el maquillaje nupcial el día del evento. Técnicas de larga duración garantizadas para que luzcas perfecta toda la celebración.',
    benefits: [
      'Incluye prueba previa de maquillaje',
      'Look nupcial personalizado y de ultra larga duración',
      'Asesoría completa de imagen y estilo'
    ],
    steps: [
      'Sesión de prueba previa incluida',
      'Preparación profunda de la piel',
      'Base airbrush o HD de ultra larga duración',
      'Contouring y iluminación profesional',
      'Maquillaje de ojos personalizado',
      'Labios y fijación de larga duración garantizada'
    ],
    therapists: ['Anel Reyna']
  },
  {
    id: 'r8',
    name: 'Maquillaje XV Años',
    badge: 'ESPECIAL',
    duration: 60,
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Un look fresco, luminoso y memorable para tu noche más especial.',
    description: 'Maquillaje profesional diseñado para realzar la belleza natural de la quinceañera. Fresco, luminoso y de larga duración, pensado para que se vea y sienta perfecta durante toda la celebración.',
    benefits: [
      'Look fresco y natural adaptado a la edad',
      'Fotografía perfecta con técnica HD',
      'Duración garantizada toda la noche'
    ],
    steps: [
      'Diagnóstico y preparación de piel joven',
      'Base ligera de cobertura natural',
      'Diseño de cejas suave y definido',
      'Maquillaje de ojos luminoso',
      'Colorete y contorno delicado',
      'Labial y fijación final'
    ],
    therapists: ['Anel Reyna']
  },
  // ── CORPORALES ───────────────────────────────────────────────
  {
    id: 'r9',
    name: 'Masaje Relajante',
    badge: 'BIENESTAR',
    duration: 60,
    price: 700,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Libera la tensión muscular y renueva tu energía con un masaje terapéutico profundo.',
    description: 'Un ritual de bienestar completo que combina técnicas de masaje sueco y relajación profunda. Alivia la tensión acumulada, mejora la circulación y devuelve el equilibrio al cuerpo y la mente.',
    benefits: [
      'Libera tensión muscular y contracturas',
      'Mejora la circulación sanguínea y linfática',
      'Reduce el estrés y mejora la calidad del sueño'
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
    duration: 60,
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Renovación profunda para la espalda: piel suave, limpia y libre de imperfecciones.',
    description: 'Tratamiento especializado para limpiar, exfoliar e hidratar profundamente la espalda. Elimina impurezas, puntos negros y células muertas acumuladas, dejando la piel completamente renovada y lista para lucir en cualquier outfit.',
    benefits: [
      'Elimina células muertas e impurezas acumuladas',
      'Suaviza la textura y unifica el tono de la espalda',
      'Ideal antes de eventos donde se use ropa descubierta'
    ],
    steps: [
      'Limpieza inicial y análisis de la piel',
      'Vapor para apertura de poros',
      'Exfoliación mecánica y enzimática',
      'Extracción de comedones si es necesario',
      'Mascarilla purificante e hidratante',
      'Hidratación profunda finalizadora'
    ],
    therapists: ['Anel Reyna']
  }
];
