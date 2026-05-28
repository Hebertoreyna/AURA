import { Product, Ritual, Specialist } from './types';

export const SPECIALISTS: Specialist[] = [
  {
    id: 's1',
    name: 'Elara Vance',
    role: 'Fundadora y Esteticista Maestra',
    bio: 'Con más de 15 años de estudio en alquimia botánica y ciencia dérmica avanzada, Elara diseña rituales personalizados que activan el ritmo natural de la piel y restauran su vitalidad.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 's2',
    name: 'Marcus Stone',
    role: 'Especialista en Acupresión y Drenaje Linfático',
    bio: 'Marcus integra técnicas tradicionales de masaje oriental con la liberación miofascial moderna para esculpir y liberar la tensión en las estructuras faciales profundas.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 's3',
    name: 'Sofia Gray',
    role: 'Directora de Terapia Botánica',
    bio: 'Sofia adapta extracciones herbales personalizadas a las sensibilidades dérmicas, especializándose en calmar condiciones de la piel estresada a través de infusiones botánicas lentas.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aura Silk Serum',
    sku: 'AUR-SLK-01',
    shortDescription: 'Un elixir ligero que restaura la elasticidad de la piel y proporciona un acabado aterciopelado.',
    description: 'Un catalizador dérmico celestial. Aura Silk Serum penetra en las capas profundas para hidratar intensamente, mientras las células botánicas activas fomentan el rejuvenecimiento de la piel. Rico en aceite de espino amarillo y multipéptidos, proporciona una exquisita sensación aterciopelada y un brillo luminoso.',
    price: 84.00,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
    category: 'serum',
    rating: 4.9,
    reviewsCount: 142,
    size: '30 ml / 1.0 fl. oz.',
    isBestSeller: true,
    benefits: [
      'Restaura la elasticidad y la firmeza dérmica',
      'Suaviza las líneas finas con una barrera orgánica ligera',
      'Unifica el tono e ilumina la piel con antioxidantes naturales'
    ],
    ingredients: [
      'Extracto Orgánico de Fruta de Hippophae Rhamnoides (Espino Amarillo)',
      'Ácido Hialurónico (Triple Peso Molecular)',
      'Extracto de Callo de Centella Asiatica (Gotu Kola)',
      'Destilado de flor de Rosa Damascena',
      'Niacinamida (Vitamina B3)'
    ],
    howToUse: 'Calienta 3 o 4 gotas en las palmas de tus manos. Presiona suavemente sobre la piel limpia y húmeda del rostro, cuello y escote cada mañana y noche. Continúa con tu crema hidratante si lo deseas.'
  },
  {
    id: 'p2',
    name: 'Pure Cleansing Balm',
    sku: 'AUR-CLB-02',
    shortDescription: 'Un bálsamo oleoso y mantecoso que disuelve las impurezas de la piel, dejándola flexible y protegida.',
    description: 'Nuestro lujoso bálsamo sensorial se transforma de una pasta rica en aceite a una leche suave al entrar en contacto con el agua tibia. Disuelve fácilmente el protector solar persistente, el maquillaje pesado y las impurezas sebáceas sin despojar a la piel de sus capas lipídicas protectoras.',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
    category: 'cleanser',
    rating: 4.8,
    reviewsCount: 96,
    size: '50 ml / 1.7 oz.',
    benefits: [
      'Disuelve el maquillaje resistente y la micropolución en silencio',
      'Deja la piel profundamente limpia pero totalmente flexible',
      'Reduce la evaporación de la humedad durante los lavados matutinos'
    ],
    ingredients: [
      'Aceite de Semilla de Camellia Oleifera (Té Verde)',
      'Aceite de Prunus Amygdalus Dulcis (Almendras Dulces)',
      'Manteca Orgánica de Semilla de Simmondsia Chinensis (Jojoba)',
      'Aceite esencial de Tansy Azul (Tanaceto)',
      'Tocoferol (Vitamina E)'
    ],
    howToUse: 'Masajea una pequeña cantidad sobre el rostro completamente seco con suaves movimientos circulares ascendentes. Emulsiona con agua tibia, observa cómo se transforma en una leche blanca y enjuaga bien o retira con un paño de lino húmedo.'
  },
  {
    id: 'p3',
    name: 'Terra Hydration Mask',
    sku: 'AUR-TRM-03',
    shortDescription: 'Una mezcla densa de arcilla mineral y aloe que impregna las células apagadas con una rica humedad.',
    description: 'Un capullo de hidratación terapéutica nacido de la tierra. Infundida con limo mineral de yacimientos geotérmicos inactivos y jugo orgánico de hoja de aloe, esta mascarilla calma las superficies resecas, reduce la irritación y repara las capas celulares durante la noche.',
    price: 68.00,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    category: 'mask',
    rating: 4.9,
    reviewsCount: 81,
    size: '60 ml / 2.0 oz.',
    benefits: [
      'Impregna las células con hidratación biocompatible',
      'Calma el enrojecimiento inmediato y el calor superficial',
      'Refina los poros mediante un complejo orgánico de arcilla mineral'
    ],
    ingredients: [
      'Limo (Tierra Mineral Activa de Origen Geotérmico)',
      'Jugo Orgánico de Hoja de Aloe Barbadensis',
      'Extracto de Fruta de Manteca de Karité',
      'Tintura de flor de Calendula Officinalis',
      'Escualano (derivado de la aceituna)'
    ],
    howToUse: 'Aplica una capa generosa y uniforme sobre la piel limpia, evitando el contorno de los ojos. Deja actuar durante 15 a 20 minutos. Masajea y enjuaga con agua tibia. Funciona excelente como mascarilla de noche para la recuperación nocturna.'
  },
  {
    id: 'p4',
    name: 'Botanical Active Mist',
    sku: 'AUR-MST-04',
    shortDescription: 'Un rocío de hierbas refrescante para tonificar los poros y aumentar la humedad de forma instantánea.',
    description: 'Una terapia de vapor puro que contiene destilados concentrados de manzanilla, lavanda y salvia blanca destilada en cobre. Equilibra el pH dérmico y prepara los canales lipídicos para maximizar la absorción de los sueros y elixires.',
    price: 40.00,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    category: 'mist',
    rating: 4.7,
    reviewsCount: 64,
    size: '100 ml / 3.4 fl. oz.',
    benefits: [
      'Refresca el confort dérmico en espacios con aire acondicionado o calefacción',
      'Restablece los equilibrios de pH activos después de la limpieza',
      'Alivia la irritación con manzanilla botánica protectora'
    ],
    ingredients: [
      'Hidrolato destilado de Manzanilla Romana',
      'Agua de Salvia Blanca Orgánica destilada en cobre',
      'Glicerina (de origen vegetal)',
      'Extracto de Hamamelis (libre de alcohol)',
      'Alantoína'
    ],
    howToUse: 'Rocía ligeramente sobre el rostro y el cuello antes de aplicar los sueros, o aplica en cualquier momento del día para hidratar, fijar el maquillaje o calmar la piel fatigada.'
  },
  {
    id: 'p5',
    name: 'Luminous Facial Oil',
    sku: 'AUR-OIL-05',
    shortDescription: 'Una mezcla de aceites botánicos puros rica en lípidos para una textura celestial que brilla desde el interior.',
    description: 'Un concentrado de lípidos ultra refinado para envolver la piel. Este aceite dorado sella la humedad intensa mientras aporta fitosteroles activos que reparan las paredes epidérmicas de defensa, devolviendo una luminosidad celestial y juvenil.',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    category: 'serum',
    rating: 4.9,
    reviewsCount: 118,
    size: '30 ml / 1.0 fl. oz.',
    benefits: [
      'Crea un escudo de protección lipídica impenetrable',
      'Proporciona una nutrición dérmica profunda con ácidos grasos esenciales',
      'Fomenta un brillo glorioso, satinado y saludable'
    ],
    ingredients: [
      'Aceite de Semilla de Argania Spinosa (Argán)',
      'Aceite de Semilla de Rosa Canina (Rosa Mosqueta)',
      'Aceite de Escualano Puro',
      'Aceite esencial de Incienso',
      'Extracto de flor de Jazmín'
    ],
    howToUse: 'Presiona de 2 a 3 gotas como el paso final absoluto de tu rutina nocturna para sellar la hidratación profunda, o mézclalo directamente con tu base de maquillaje líquida para lograr un acabado radiante.'
  }
];

export const RITUALS: Ritual[] = [
  {
    id: 'r1',
    name: 'Glow Revitalizer',
    badge: 'ARTESANAL',
    duration: 60,
    price: 135,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Exfoliación profunda combinada con infusiones de vitaminas para un resplandor instantáneo.',
    description: 'Nuestro ritual insignia de renovación celular. Este tratamiento facial combina la refinación dérmica manual con cabezal de diamante y una infusión profunda a alta presión de vitaminas botánicas concentradas (C y E) y ácido hialurónico. Elimina la acumulación de células opacas y estimula los capilares, restaurando tu brillo saludable de forma instantánea.',
    benefits: [
      'Exfolia las células de piel seca de inmediato',
      'Satura intensamente con vitaminas epidérmicas vitales',
      'Recarga la microcirculación para eliminar toxinas acumuladas'
    ],
    steps: [
      'Limpieza facial prebiótica con bálsamo puro y compresas tibias linfáticas',
      'Refinación dérmica suave con exfoliación enzimática de frutas biológicas',
      'Infusión personalizada de bruma pulverizada de vitaminas y péptidos de cobre',
      'Masaje estructural de rostro y cuello con rodillos de jade fríos',
      'Mascarilla de arcilla de lavanda rejuvenecedora y masaje relajante de manos'
    ],
    therapists: ['Elara Vance', 'Sofia Gray']
  },
  {
    id: 'r2',
    name: 'Sculpt & Lift Facial',
    badge: 'AVANZADO',
    duration: 75,
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Drenaje linfático manual para tonificar y definir las facciones de forma natural.',
    description: 'Un entrenamiento facial arquitectónico. Combina masaje de escultura manual, drenaje linfático profundo y manipulación térmica suave con piedras gua sha. Libera la tensión muscular acumulada por apretar la mandíbula, eleva las sienes y los pómulos, y drena el exceso de hinchazón para un perfil esculpido y estructurado naturalmente.',
    benefits: [
      'Esculpe visiblemente los pómulos y la línea de la mandíbula',
      'Promueve el drenaje linfático para resolver la congestión de la piel',
      'Alivia la tensión acumulada en las sienes y los músculos de las mejillas'
    ],
    steps: [
      'Envolturas aromáticas tibias y descompresivas para cuello y hombros',
      'Lavado botánico limpiador combinado con estimulación de ventosas faciales',
      'Masaje de elevación e intensa manipulación muscular miofascial',
      'Esculpido con piedra bian Gua Sha con infusión de aceite de rosa mosqueta tibio',
      'Sellado con mascarilla de gel de oxígeno de crioterapia'
    ],
    therapists: ['Marcus Stone', 'Elara Vance']
  },
  {
    id: 'r3',
    name: 'Sound & Rose Massage',
    badge: 'SANACIÓN',
    duration: 90,
    price: 185,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Terapia de vibración profunda combinada con infusiones de rosa otto orgánica.',
    description: 'Un profundo viaje meditativo, táctil y sonoro. Las ondas de sonido de los cuencos de cuarzo puro establecen una vibración acústica alrededor de tu cabeza, calmando el sistema nervioso central. Además, nuestro masaje de aceite caliente de rosa otto búlgara orgánica fluye sobre el rostro, cuero cabelludo, hombros y pecho para confortar los sentidos.',
    benefits: [
      'Calma el sistema de estrés simpático hacia una paz absoluta',
      'El aceite aromaterapéutico de rosa inspira una profunda liberación emocional',
      'Las vibraciones sonoras alivian la tensión psicológica y el dolor de cabeza'
    ],
    steps: [
      'Sintonización acústica utilizando cuencos de cristal de cuarzo prémium',
      'Regulación de la respiración con vaporización de rosa, incienso y lavanda',
      'Masaje rítmico de compresión con aceite caliente para hombros, cuello y escápula',
      'Estimulación con acupresión de puntos faciales con esferas minerales calentadas',
      'Masaje de presión profunda en el cuero cabelludo y sellado de sonido'
    ],
    therapists: ['Marcus Stone', 'Sofia Gray']
  },
  {
    id: 'r4',
    name: 'Botanical Recovery',
    badge: 'CALMANTE',
    duration: 60,
    price: 125,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Una compresa calmante con hierbas silvestres locales para tratar el enrojecimiento.',
    description: 'Desarrollado específicamente para pieles comprometidas, reactivas o secas y agrietadas por el viento. Sometemos caléndula, manzanilla y avena recién cosechadas a un proceso de infusión en compresas activas, aplicadas sobre geles minerales curativos. Alivia la inflamación, refuerza las barreras de humedad debilitadas y restablece los sistemas de defensa de tu piel.',
    benefits: [
      'Enfría la temperatura dérmica y calma las superficies enrojecidas',
      'Restaura los escudos de lípidos celulares debilitados',
      'Profundamente antiinflamatorio y seguro para pieles propensas al eccema'
    ],
    steps: [
      'Limpieza de avena lechosa con paños orgánicos y suaves de algodón',
      'Compresas de lino herbal al vapor impregnadas de flores de caléndula frescas',
      'Infusión a presión de suero de escualano y azuleno calmante',
      'Terapia de enfriamiento de la piel y descenso de temperatura con esferas de hielo',
      'Tratamiento de sellado con bálsamo de barrera multilipídica protectora'
    ],
    therapists: ['Sofia Gray', 'Elara Vance']
  }
];
