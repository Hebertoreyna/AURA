import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Droplet, ShieldAlert, Layers, CheckCircle2,
  Calendar, RefreshCw, Leaf, Waves,
} from 'lucide-react';
import { SkinProfile, Product, Ritual } from '../types';
import { PRODUCTS, RITUALS } from '../data';

interface RefineScreenProps {
  currentProfile: SkinProfile;
  onUpdateProfile: (profile: SkinProfile) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBookRitual: (ritualId: string) => void;
}

// ─── DATOS DEL QUIZ ──────────────────────────────────────────────────────────

const SKIN_TYPES = [
  { id: 'dry',         label: 'Seca',      desc: 'Sensación de tirantez y descamación que pide aceites nutritivos.',    icon: Droplet },
  { id: 'oily',        label: 'Grasa',     desc: 'Sebo hiperactivo propenso a poros congestionados y brillos.',          icon: Layers },
  { id: 'sensitive',   label: 'Sensible',  desc: 'Se irrita fácilmente ante cambios de clima o productos nuevos.',       icon: ShieldAlert },
  { id: 'combination', label: 'Mixta',     desc: 'Mejillas secas y zona T (frente, nariz, barbilla) más grasa.',         icon: Layers },
  { id: 'normal',      label: 'Normal',    desc: 'Sebo equilibrado, textura confortable y poros finos.',                 icon: CheckCircle2 },
];

const FACIAL_CONCERNS = [
  { id: 'dullness',    label: 'Opacidad y Fatiga',              desc: 'La piel luce apagada y sin brillo natural.' },
  { id: 'fine_lines',  label: 'Líneas Finas y Flacidez',        desc: 'Pérdida de firmeza y primeras arrugas visibles.' },
  { id: 'hydration',   label: 'Deshidratación',                 desc: 'Tirantez constante y falta de elasticidad.' },
  { id: 'redness',     label: 'Enrojecimiento y Sensibilidad',  desc: 'Capilares sensibilizados o piel irritada.' },
  { id: 'congestion',  label: 'Poros e Impurezas',              desc: 'Puntos negros y textura irregular en el rostro.' },
  { id: 'acne',        label: 'Acné y Exceso de Grasa',         desc: 'Brotes frecuentes, espinillas y piel brillante.' },
  { id: 'spots',       label: 'Manchas y Tono Desigual',        desc: 'Hiperpigmentación, manchas o tono poco uniforme.' },
];

const BODY_CONCERNS = [
  {
    id: 'tension',
    label: 'Tensión y Estrés Muscular',
    desc: 'Contracturas, músculos cargados y estrés acumulado en el cuerpo.',
    matchIds: ['r9'],
    prescription: 'Tu cuerpo refleja el estrés acumulado. Un masaje con movimientos suaves y rítmicos es la mejor forma de liberar contracturas y recuperar el equilibrio físico y mental.',
  },
  {
    id: 'flaccidity',
    label: 'Flacidez y Retención de Líquidos',
    desc: 'Pérdida de tonicidad, retención de líquidos o celulitis visible.',
    matchIds: ['r10'],
    prescription: 'Para mejorar la firmeza y reducir la retención de líquidos, la electroestimulación muscular combinada con drenaje linfático ofrece resultados visibles y duraderos.',
  },
  {
    id: 'back_skin',
    label: 'Piel de Espalda e Impurezas',
    desc: 'Poros congestionados, asperezas o células muertas acumuladas en la espalda.',
    matchIds: ['r11'],
    prescription: 'La espalda acumula células muertas, impurezas y poros tapados. Una exfoliación mecánica seguida de mascarilla personalizada renovará completamente la textura de tu piel.',
  },
  {
    id: 'special_occasion',
    label: 'Ocasión Especial',
    desc: 'Boda, evento importante o celebración donde quieres lucir radiante.',
    matchIds: ['r16'],
    prescription: 'Para lucir perfecta en tu día especial, el Velo de Novia es el ritual completo: exfoliación corporal, mascarilla personalizada y envoltura por ambos lados del cuerpo para una piel sedosa y radiante.',
  },
  {
    id: 'skin_lesions',
    label: 'Lesiones Cutáneas (Verrugas)',
    desc: 'Verrugas u otras lesiones que requieren evaluación y tratamiento especializado.',
    matchIds: ['r12'],
    prescription: 'El primer paso es una evaluación gratuita donde Anel analiza las lesiones, determina el método más adecuado y te entrega un presupuesto personalizado sin compromiso.',
  },
];

const VIBE_ROUTINES = [
  { id: 'minimalist', label: 'Básica (2 pasos)',      desc: 'Solo lo esencial. Menos de 3 minutos al día.' },
  { id: 'balanced',   label: 'Equilibrada (4 pasos)', desc: 'Rutina completa. Menos de 6 minutos al día.' },
  { id: 'immersive',  label: 'Ritual completo',       desc: 'Cuidado profundo estilo spa en casa.' },
];

// ─── HELPERS DE ETIQUETAS ─────────────────────────────────────────────────────
const SKIN_TYPE_LABELS: Record<string, string> = {
  dry: 'Seca', oily: 'Grasa', sensitive: 'Sensible',
  combination: 'Mixta', normal: 'Normal',
};
const FACIAL_CONCERN_LABELS: Record<string, string> = {
  dullness: 'Opacidad', fine_lines: 'Firmeza', hydration: 'Deshidratación',
  redness: 'Enrojecimiento', congestion: 'Poros e Impurezas',
  acne: 'Acné', spots: 'Manchas',
};
const BODY_CONCERN_LABELS: Record<string, string> = {
  tension: 'Tensión Muscular', flaccidity: 'Flacidez / Líquidos',
  back_skin: 'Piel de Espalda', special_occasion: 'Ocasión Especial',
  skin_lesions: 'Lesiones Cutáneas',
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function RefineScreen({
  currentProfile,
  onUpdateProfile,
  onBookRitual,
}: RefineScreenProps) {

  const [step, setStep]             = useState<1 | 2 | 3 | 'results'>(currentProfile.completed ? 'results' : 1);
  const [zone, setZone]             = useState<'facial' | 'corporal' | null>(currentProfile.zone ?? null);
  const [skinType, setSkinType]     = useState(currentProfile.skinType || '');
  const [concern, setConcern]       = useState(currentProfile.concern || '');
  const [bodyConcern, setBodyConcern] = useState(currentProfile.bodyConcern || '');
  const [vibe, setVibe]             = useState(currentProfile.vibe || '');

  const startQuiz = () => {
    setZone(null); setSkinType(''); setConcern('');
    setBodyConcern(''); setVibe(''); setStep(1);
  };

  const totalSteps = zone === 'corporal' ? 2 : 3;

  // ── Completar quiz ──────────────────────────────────────────────────────────
  const handleComplete = () => {
    const newProfile: SkinProfile = {
      zone: zone ?? undefined,
      skinType: skinType as SkinProfile['skinType'],
      concern:  concern  as SkinProfile['concern'],
      bodyConcern: bodyConcern as SkinProfile['bodyConcern'],
      vibe:    vibe    as SkinProfile['vibe'],
      completed: true,
    };
    onUpdateProfile(newProfile);
    setStep('results');
  };

  // ── Recomendaciones ─────────────────────────────────────────────────────────
  const getRecommendations = () => {
    let rituals: Ritual[] = [];
    let prescription = '';

    if (zone === 'corporal') {
      const bc = BODY_CONCERNS.find(b => b.id === bodyConcern);
      rituals = RITUALS.filter(r => bc?.matchIds.includes(r.id));
      prescription = bc?.prescription ?? '';
    } else {
      // facial logic
      if (concern === 'redness' || skinType === 'sensitive') {
        rituals = RITUALS.filter(r => ['r4','r1'].includes(r.id));
        prescription = 'Tu perfil muestra capilares sensibilizados. Prioriza protocolos calmantes y evita exfoliaciones agresivas hasta estabilizar la piel.';
      } else if (concern === 'fine_lines') {
        rituals = RITUALS.filter(r => ['r3','r14'].includes(r.id));
        prescription = 'La piel exhibe laxitud y pérdida de colágeno. Radiofrecuencia y activos tensores son la prioridad para recuperar la estructura facial.';
      } else if (concern === 'acne') {
        rituals = RITUALS.filter(r => ['r4','r1'].includes(r.id));
        prescription = 'Piel congestionada con exceso de sebo. Limpieza profunda con activos antibacterianos y aparatología específica para equilibrar y controlar brotes.';
      } else if (concern === 'spots') {
        rituals = RITUALS.filter(r => ['r19','r5'].includes(r.id));
        prescription = 'La hiperpigmentación requiere activos iluminadores y renovación celular constante. El Facial Glow y la microdermoabrasión son tus aliados principales.';
      } else if (concern === 'dullness' || concern === 'congestion') {
        rituals = RITUALS.filter(r => ['r1','r2'].includes(r.id));
        prescription = 'La piel acumula células opacas e impurezas. Limpieza profunda con Hydrofacial o Limpieza Facial para recuperar la luminosidad y limpiar los poros.';
      } else if (concern === 'hydration') {
        rituals = RITUALS.filter(r => ['r2','r15'].includes(r.id));
        prescription = 'La deshidratación profunda reduce la elasticidad y acelera el envejecimiento. Prioriza activos de ácido hialurónico y tratamientos de infusión de humedad.';
      } else {
        rituals = RITUALS.filter(r => ['r14','r1'].includes(r.id));
        prescription = 'Con tu perfil dérmico, un diagnóstico personalizado con Anel te dará el protocolo más preciso para tus objetivos específicos.';
      }
    }

    return { rituals, prescription };
  };

  const { rituals: matchedRituals, prescription } = getRecommendations();
  const matchedProducts = PRODUCTS.filter(p => p.id === 'p1');

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div id="refine-screen" className="py-8 px-5 max-w-lg mx-auto min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">

        {/* ═══ PASO 1: ZONA ═══ */}
        {step === 1 && (
          <motion.div
            key="step-zone"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            className="space-y-6"
          >
            <div className="mb-6">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Diagnóstico AURA</span>
              <h3 className="text-3xl font-serif text-[#4a2815] mt-1">¿Qué área quieres trabajar?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Elige el tipo de tratamiento que buscas y te guiaremos al servicio ideal.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {([
                {
                  id: 'facial' as const,
                  label: 'Facial',
                  sub: 'Tratamientos para el rostro',
                  icon: <Sparkles className="w-7 h-7" />,
                },
                {
                  id: 'corporal' as const,
                  label: 'Corporal',
                  sub: 'Tratamientos para el cuerpo',
                  icon: <Waves className="w-7 h-7" />,
                },
              ]).map(z => (
                <button
                  key={z.id}
                  onClick={() => { setZone(z.id); setStep(2); }}
                  className="p-5 rounded-2xl border-2 border-[#efe6dc] bg-white text-left hover:border-[#764229]/40 active:scale-[0.97] transition-[border-color,transform] duration-150 flex flex-col gap-3"
                >
                  <span className="text-[#764229]">{z.icon}</span>
                  <div>
                    <span className="font-serif font-bold text-lg text-[#4a2815] block">{z.label}</span>
                    <span className="text-[10px] text-stone-400 font-sans block mt-0.5">{z.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ PASO 2 — FACIAL: TIPO DE PIEL ═══ */}
        {step === 2 && zone === 'facial' && (
          <motion.div
            key="step-skintype"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            className="space-y-5"
          >
            <div className="mb-4">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 1 de {totalSteps} · Facial</span>
              <h3 className="text-2xl font-serif text-[#4a2815] mt-1">¿Cómo es tu tipo de piel?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Piensa en cómo luce tu rostro a mitad del día.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKIN_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => { setSkinType(type.id); setStep(3); }}
                    className={`p-4 rounded-xl border text-left transition-all active:scale-[0.97] ${
                      skinType === type.id
                        ? 'bg-[#efe6dc] border-[#764229] shadow-sm'
                        : 'bg-white border-[#efe6dc] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[#764229]">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-serif font-bold text-sm text-[#4a2815]">{type.label}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed font-serif italic">{type.desc}</p>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep(1)} className="text-xs uppercase font-sans font-bold tracking-widest text-[#764229] hover:underline cursor-pointer">
              ← Cambiar área
            </button>
          </motion.div>
        )}

        {/* ═══ PASO 2 — CORPORAL: PREOCUPACIÓN ═══ */}
        {step === 2 && zone === 'corporal' && (
          <motion.div
            key="step-body"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            className="space-y-5"
          >
            <div className="mb-4">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 1 de {totalSteps} · Corporal</span>
              <h3 className="text-2xl font-serif text-[#4a2815] mt-1">¿Qué quieres trabajar?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Selecciona tu objetivo principal para este tratamiento.</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {BODY_CONCERNS.map(bc => (
                <button
                  key={bc.id}
                  onClick={() => setBodyConcern(bc.id)}
                  className={`p-4 rounded-xl border text-left transition-all active:scale-[0.97] flex items-center justify-between ${
                    bodyConcern === bc.id
                      ? 'bg-[#efe6dc] border-[#764229] shadow-sm'
                      : 'bg-white border-[#efe6dc] hover:border-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-serif font-bold text-sm text-[#4a2815] block">{bc.label}</span>
                    <p className="text-[10px] text-stone-500 mt-0.5 font-serif italic">{bc.desc}</p>
                  </div>
                  {bodyConcern === bc.id && <Sparkles className="w-4 h-4 text-[#764229] flex-shrink-0 ml-3" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-xs uppercase font-sans font-bold tracking-widest text-[#764229] hover:underline cursor-pointer">
                ← Cambiar área
              </button>
              <button
                onClick={handleComplete}
                disabled={!bodyConcern}
                className={`py-3 px-7 text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase active:scale-[0.97] ${
                  bodyConcern
                    ? 'bg-[#764229] hover:bg-[#4a2815] text-white shadow-md cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Ver Diagnóstico →
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ PASO 3 — FACIAL: PREOCUPACIÓN ═══ */}
        {step === 3 && zone === 'facial' && (
          <motion.div
            key="step-concern"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            className="space-y-5"
          >
            <div className="mb-4">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 2 de {totalSteps} · Facial</span>
              <h3 className="text-2xl font-serif text-[#4a2815] mt-1">¿Cuál es tu mayor preocupación?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Selecciona el problema que más quieres tratar.</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {FACIAL_CONCERNS.map(fc => (
                <button
                  key={fc.id}
                  onClick={() => setConcern(fc.id)}
                  className={`p-4 rounded-xl border text-left transition-all active:scale-[0.97] flex items-center justify-between ${
                    concern === fc.id
                      ? 'bg-[#efe6dc] border-[#764229] shadow-sm'
                      : 'bg-white border-[#efe6dc] hover:border-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-serif font-bold text-sm text-[#4a2815] block">{fc.label}</span>
                    <p className="text-[10px] text-stone-500 mt-0.5 font-serif italic">{fc.desc}</p>
                  </div>
                  {concern === fc.id && <Sparkles className="w-4 h-4 text-[#764229] flex-shrink-0 ml-3" />}
                </button>
              ))}
            </div>

            {/* Vibe compacto al final */}
            <AnimatePresence>
              {concern && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                  className="pt-2 space-y-2"
                >
                  <p className="text-[10px] font-sans font-bold tracking-widest text-stone-400 uppercase">
                    Paso 3 de {totalSteps} · ¿Qué tipo de rutina en casa llevas?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {VIBE_ROUTINES.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setVibe(v.id)}
                        className={`py-2 px-3.5 rounded-lg border text-[10px] font-sans font-bold tracking-wide transition-[background-color,border-color,transform] duration-150 active:scale-[0.97] ${
                          vibe === v.id
                            ? 'bg-[#764229] border-[#764229] text-white'
                            : 'bg-white border-[#efe6dc] text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2 flex justify-between items-center">
              <button onClick={() => setStep(2)} className="text-xs uppercase font-sans font-bold tracking-widest text-[#764229] hover:underline cursor-pointer">
                ← Tipo de piel
              </button>
              <button
                onClick={handleComplete}
                disabled={!concern || !vibe}
                className={`py-3 px-7 text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase active:scale-[0.97] ${
                  concern && vibe
                    ? 'bg-[#764229] hover:bg-[#4a2815] text-white shadow-md cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Ver Diagnóstico →
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ RESULTADOS ═══ */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
            className="space-y-7"
          >
            {/* Encabezado prescripción */}
            <div className="bg-[#efe6dc]/50 border border-[#efe6dc] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#764229] uppercase block">
                    {zone === 'corporal' ? 'Diagnóstico Corporal · AURA' : 'Diagnóstico Facial · AURA'}
                  </span>
                  <h3 className="text-2xl font-serif text-[#4a2815] mt-0.5">Tu Prescripción Personalizada</h3>
                </div>
                <button
                  onClick={startQuiz}
                  className="py-1.5 px-3 bg-white hover:bg-stone-50 border border-[#efe6dc] text-[10px] font-sans font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 text-stone-700 cursor-pointer flex-shrink-0"
                >
                  <RefreshCw className="w-3 h-3 text-[#764229]" /> Nuevo
                </button>
              </div>

              {/* Badges resumen */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                  {zone === 'corporal' ? 'Corporal' : 'Facial'}
                </span>
                {zone === 'facial' && skinType && (
                  <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                    Piel: {SKIN_TYPE_LABELS[skinType]}
                  </span>
                )}
                {zone === 'facial' && concern && (
                  <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                    {FACIAL_CONCERN_LABELS[concern]}
                  </span>
                )}
                {zone === 'corporal' && bodyConcern && (
                  <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                    {BODY_CONCERN_LABELS[bodyConcern]}
                  </span>
                )}
              </div>

              <p className="text-stone-700 text-sm leading-relaxed italic font-serif">"{prescription}"</p>
            </div>

            {/* Rituales recomendados */}
            <div className="space-y-3">
              <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2">
                {zone === 'corporal' ? 'Tratamiento Recomendado' : 'Ritual Facial Recomendado'}
              </h4>

              {matchedRituals.length === 0 && (
                <p className="text-xs text-stone-400 italic font-serif py-2">
                  Vuelve a hacer el diagnóstico para ver recomendaciones.
                </p>
              )}

              {matchedRituals.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
                  className="bg-white rounded-xl border border-[#efe6dc]/60 overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="sm:w-2/5 h-40 sm:h-auto bg-[#efe6dc] flex-shrink-0">
                    <img src={r.imageUrl} alt={r.name} referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-[#5e6c58] uppercase tracking-wider">{r.duration} min</span>
                        {r.customQuote
                          ? <span className="font-serif font-bold text-sky-700 text-sm">Evaluación gratis</span>
                          : <span className="font-serif font-bold text-[#764229] text-base">${r.price}</span>
                        }
                      </div>
                      <h5 className="text-lg font-serif text-[#4a2815] font-semibold">{r.name}</h5>
                      <p className="text-xs text-stone-500 leading-relaxed mt-1">{r.shortDescription}</p>
                    </div>
                    <button
                      onClick={() => onBookRitual(r.id)}
                      className="mt-4 py-2.5 px-5 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-lg transition-[transform,background-color] duration-150 font-sans uppercase inline-flex items-center gap-1.5 cursor-pointer self-start"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Reservar Sesión
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Producto recomendado (solo facial) */}
            {zone === 'facial' && matchedProducts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2">
                  Producto para Casa
                </h4>
                {matchedProducts.slice(0, 1).map(p => (
                  <div key={p.id} className="bg-white rounded-xl border border-[#efe6dc]/60 p-4 flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                      <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-serif font-semibold text-sm text-[#4a2815] block truncate">{p.name}</span>
                      <span className="text-[10px] text-stone-400 font-sans block">{p.shortDescription}</span>
                      <span className="text-sm font-serif font-bold text-[#764229] mt-1 block">${p.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
