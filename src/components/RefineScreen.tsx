import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Droplet, ShieldAlert, Layers, CheckCircle2, ShoppingBag, Eye, Calendar, RefreshCw } from 'lucide-react';
import { SkinProfile, Product, Ritual } from '../types';
import { PRODUCTS, RITUALS } from '../data';

interface RefineScreenProps {
  currentProfile: SkinProfile;
  onUpdateProfile: (profile: SkinProfile) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBookRitual: (ritualId: string) => void;
}

const SKIN_TYPES = [
  { id: 'dry', label: 'Seca', desc: 'Células tirantes y con descamación que requieren aceites lipídicos intensivos.', icon: Droplet },
  { id: 'oily', label: 'Grasa', desc: 'Producción de sebo hiperactiva propensa a la congestión de los poros.', icon: Layers },
  { id: 'sensitive', label: 'Sensible', desc: 'Piel que se irrita muy fácilmente y posee defensas cutáneas débiles.', icon: ShieldAlert },
  { id: 'combination', label: 'Mixta', desc: 'Mejillas secas o deshidratadas combinadas con una zona T central más grasa.', icon: Layers },
  { id: 'normal', label: 'Normal', desc: 'Secreción de sebo equilibrada, textura confortable y poros finos.', icon: CheckCircle2 }
];

const SKIN_CONCERNS = [
  { id: 'dullness', label: 'Opacidad y Fatiga', desc: 'La piel carece de energía celular y reflejo luminoso saludable.' },
  { id: 'fine_lines', label: 'Líneas Finas y Pérdida de Firmeza', desc: 'Laxitud cutánea que requiere escultura manual y elevación estructural.' },
  { id: 'hydration', label: 'Deshidratación Crónica', desc: 'Depósitos de humedad reducidos con sensación constante de tirantez.' },
  { id: 'redness', label: 'Enrojecimiento Persistente y Calor', desc: 'Capilares dérmicos sensibilizados y piel quemada por el viento o clima.' },
  { id: 'congestion', label: 'Poros Obstruidos e Impurezas', desc: 'Suciedad sebácea acumulada que requiere desintoxicación y purificación profunda.' }
];

const VIBE_ROUTINES = [
  { id: 'minimalist', label: 'La Minimalista (2 Pasos)', desc: 'Esenciales absolutos de alta pureza. Menos de 3 minutos diarios.' },
  { id: 'balanced', label: 'La Equilibrada (4 Pasos)', desc: 'Capas de tratamiento estándar. Menos de 6 minutos diarios.' },
  { id: 'immersive', label: 'El Ritual Inmersivo (6 Pasos)', desc: 'Cuidado profundo estilo spa en casa con compresas calientes.' }
];

export default function RefineScreen({
  currentProfile,
  onUpdateProfile,
  onViewProduct,
  onAddToCart,
  onBookRitual
}: RefineScreenProps) {
  // Navigation quiz sub-state
  const [step, setStep] = useState<1 | 2 | 3 | 'results'>(currentProfile.completed ? 'results' : 1);
  const [skinType, setSkinType] = useState<SkinProfile['skinType']>(currentProfile.skinType || '');
  const [concern, setConcern] = useState<SkinProfile['concern']>(currentProfile.concern || '');
  const [vibe, setVibe] = useState<SkinProfile['vibe']>(currentProfile.vibe || '');

  const startQuiz = () => {
    setSkinType('');
    setConcern('');
    setVibe('');
    setStep(1);
  };

  const handleCompleteQuiz = () => {
    if (skinType && concern && vibe) {
      const newProfile: SkinProfile = {
        skinType,
        concern,
        vibe,
        completed: true
      };
      onUpdateProfile(newProfile);
      setStep('results');
    }
  };

  // Diagnostic algorithm matching products and rituals based on concerns
  const getDermalRecommendations = () => {
    let matchedProducts: Product[] = [];
    let matchedRituals: Ritual[] = [];
    let prescriptionText = '';

    // Match Rituals
    if (concern === 'redness' || skinType === 'sensitive') {
      matchedRituals = RITUALS.filter(r => r.id === 'r4' || r.id === 'r3'); // Botanical Recovery / Sound & Rose
      prescriptionText = 'Su perfil dérmico muestra capilares vulnerables con calor superficial. Priorice compresas ligeras y frías en lugar de exfoliaciones pesadas de arcilla rígida.';
    } else if (concern === 'fine_lines') {
      matchedRituals = RITUALS.filter(r => r.id === 'r2' || r.id === 'r1'); // Sculpt & Lift / Glow
      prescriptionText = 'Su piel exhibe flacidez muscular moderada y evaporación de humedad superficial. Concéntrese en la escultura manual profunda, fricción linfática y la alta absorción de lípidos.';
    } else if (concern === 'dullness' || concern === 'congestion') {
      matchedRituals = RITUALS.filter(r => r.id === 'r1' || r.id === 'r2'); // Glow Revitalizer / Sculpt
      prescriptionText = 'Las células externas muestran una acumulación de células opacas. Recomendamos exfoliación con de enzimas de frutas biológicas, seguida de activación linfática.';
    } else { // hydration
      matchedRituals = RITUALS.filter(r => r.id === 'r3' || r.id === 'r4'); // Sound & Rose / Botanical
      prescriptionText = 'La deshidratación profunda restringe los procesos de reparación celular naturales. Concéntrese en masajes de aceite tibio de rosa otto y terapias de vapor de manzanilla.';
    }

    // Match Products
    if (skinType === 'dry' || concern === 'hydration') {
      matchedProducts = PRODUCTS.filter(p => p.id === 'p1' || p.id === 'p3' || p.id === 'p5'); // Silk Serum, Mask, Oil
    } else if (skinType === 'oily' || concern === 'congestion') {
      matchedProducts = PRODUCTS.filter(p => p.id === 'p2' || p.id === 'p4'); // Cleansing Balm, Mist
    } else if (skinType === 'sensitive' || concern === 'redness') {
      matchedProducts = PRODUCTS.filter(p => p.id === 'p3' || p.id === 'p4'); // Mask, Mist
    } else { // normal / combination
      matchedProducts = PRODUCTS.filter(p => p.id === 'p1' || p.id === 'p2' || p.id === 'p4'); // Serum, Balm, Mist
    }

    // Sub-select based on routine vibe scale
    if (vibe === 'minimalist') {
      matchedProducts = matchedProducts.slice(0, 2);
    } else if (vibe === 'balanced') {
      matchedProducts = matchedProducts.slice(0, 3);
    } // immersive receives all matching

    return { matchedProducts, matchedRituals, prescriptionText };
  };

  const { matchedProducts, matchedRituals, prescriptionText } = getDermalRecommendations();

  return (
    <div id="refine-screen" className="py-8 px-6 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      
      <AnimatePresence mode="wait">
        
        {/* =============== STEP 1: SKIN TYPE QUESTION =============== */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center md:text-left mb-8">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 1 de 3</span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] mt-1">¿Cómo es su estado dérmico natural?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Seleccione la opción que recuerde al comportamiento de su rostro a la mitad del día.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKIN_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    id={`quiz-skintype-${type.id}`}
                    onClick={() => {
                      setSkinType(type.id as any);
                      setStep(2);
                    }}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      skinType === type.id
                        ? 'bg-[#efe6dc] border-[#764229] shadow-md text-stone-850'
                        : 'bg-white border-[#efe6dc] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex gap-3 items-center mb-1 text-[#764229]">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-serif font-bold text-base text-[#4a2815]">{type.label}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-normal font-serif italic">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* =============== STEP 2: PRIMARY CONCERN QUESTION =============== */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center md:text-left mb-8">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 2 de 3</span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] mt-1">¿Qué preocupación es más persistente?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Seleccione el problema principal que desea tratar con mayor urgencia.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SKIN_CONCERNS.map((c) => (
                <button
                  key={c.id}
                  id={`quiz-concern-${c.id}`}
                  onClick={() => {
                    setConcern(c.id as any);
                    setStep(3);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    concern === c.id
                      ? 'bg-[#efe6dc] border-[#764229] shadow-md'
                      : 'bg-white border-[#efe6dc] hover:border-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-serif font-bold text-base text-[#4a2815] block">{c.label}</span>
                    <p className="text-[10px] text-stone-600 mt-0.5 font-serif italic">{c.desc}</p>
                  </div>
                  {concern === c.id && <Sparkles className="w-4 h-4 text-[#764229]" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex">
              <button
                id="quiz-back-step-1"
                onClick={() => setStep(1)}
                className="text-xs uppercase font-sans font-bold tracking-widest text-[#764229] cursor-pointer hover:border-b hover:border-[#764229]"
              >
                ← Volver al Tipo de Piel
              </button>
            </div>
          </motion.div>
        )}

        {/* =============== STEP 3: ROUTINE VIBE QUESTION =============== */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center md:text-left mb-8">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Paso 3 de 3</span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] mt-1">¿De cuánto tiempo dispone en su rutina?</h3>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">Seleccione el tipo de rutina que se comprometería a repetir consistentemente.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {VIBE_ROUTINES.map((v) => (
                <button
                  key={v.id}
                  id={`quiz-vibe-${v.id}`}
                  onClick={() => {
                    setVibe(v.id as any);
                  }}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    vibe === v.id
                      ? 'bg-[#efe6dc] border-[#764229] shadow-md'
                      : 'bg-white border-[#efe6dc] hover:border-stone-300'
                  }`}
                >
                  <span className="font-serif font-bold text-base text-[#4a2815] block">{v.label}</span>
                  <p className="text-xs text-stone-600 mt-0.5 font-serif italic">{v.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                id="quiz-back-step-2"
                onClick={() => setStep(2)}
                className="text-xs uppercase font-sans font-bold tracking-widest text-[#764229] cursor-pointer hover:border-b hover:border-[#764229]"
              >
                ← Volver a Preocupaciones
              </button>
              
              <button
                id="quiz-complete-trigger"
                onClick={handleCompleteQuiz}
                disabled={!vibe}
                className={`py-3 px-8 text-xs font-semibold tracking-wider rounded-xl transition-all font-sans uppercase cursor-pointer ${
                  vibe
                    ? 'bg-[#764229] hover:bg-[#4a2815] text-white shadow-md'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Revelar Diagnóstico
              </button>
            </div>
          </motion.div>
        )}

        {/* =============== RESULTS PANEL =============== */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Header prescription cards */}
            <div className="bg-[#efe6dc]/50 border border-[#efe6dc] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#5e6c58] uppercase block">Resultados Diagnósticos Aura</span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#4a2815] mt-0.5">Su Prescripción Personalizada</h3>
                </div>
                <button
                  id="quiz-reset-btn"
                  onClick={startQuiz}
                  className="py-1.5 px-3 bg-white hover:bg-stone-50 border border-[#efe6dc] text-[10px] font-sans font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 text-stone-700 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#764229]" /> Volver a Diagnosticar
                </button>
              </div>

              {/* Badges summarizing input with translation */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                  Tipo: {
                    skinType === 'dry' ? 'Seca' :
                    skinType === 'oily' ? 'Grasa' :
                    skinType === 'sensitive' ? 'Sensible' :
                    skinType === 'combination' ? 'Mixta' : 'Normal'
                  }
                </span>
                <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                  Enfoque: {
                    concern === 'dullness' ? 'Opacidad' :
                    concern === 'fine_lines' ? 'Líneas Finas / Firmeza' :
                    concern === 'hydration' ? 'Deshidratación' :
                    concern === 'redness' ? 'Enrojecimiento' : 'Congestión'
                  }
                </span>
                <span className="text-[10px] bg-white text-[#764229] px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider border border-[#efe6dc]">
                  Rutina: {
                    vibe === 'minimalist' ? 'Minimalista' :
                    vibe === 'balanced' ? 'Equilibrada' : 'Inmersiva'
                  }
                </span>
              </div>

              <div className="pt-1 text-stone-700 text-sm sm:text-base leading-relaxed italic font-serif">
                "{prescriptionText}"
              </div>
            </div>

            {/* Recommended Ritual Session on top */}
            <div className="space-y-3">
              <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2">
                Purificación de Spa Recomendada
              </h4>

              {matchedRituals.map((r) => (
                <div
                  key={r.id}
                  id={`recommended-ritual-${r.id}`}
                  className="bg-white rounded-xl border border-[#efe6dc]/60 overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/3 h-44 sm:h-auto bg-[#efe6dc]">
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:w-2/3 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-[#5e6c58] uppercase tracking-wider">{r.duration} MINUTOS DE CUIDADO</span>
                        <span className="font-serif font-bold text-[#764229] text-base">${r.price}</span>
                      </div>
                      <h5 className="text-xl font-serif text-[#4a2815] font-semibold mt-1">{r.name}</h5>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1.5">{r.shortDescription}</p>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        id={`recommended-ritual-book-${r.id}`}
                        onClick={() => onBookRitual(r.id)}
                        className="py-2.5 px-5 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-lg transition-all font-sans uppercase inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Reservar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Daily Essentials Products down */}
            <div className="space-y-4">
              <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2">
                Recomendaciones de Productos para el Hogar
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    id={`recommended-prod-${p.id}`}
                    className="bg-white rounded-xl border border-[#efe6dc]/65 overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="p-4 flex gap-3.5 items-center">
                      <div className="w-14 h-14 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-sans tracking-wide text-stone-405 uppercase text-xs block">{p.category}</span>
                        <h5 className="font-serif text-[#4a2815] font-semibold group-hover:text-[#764229] transition-colors leading-snug">
                          {p.name}
                        </h5>
                        <p className="text-xs font-medium text-[#764229] mt-0.5">${p.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-[#efe6dc]/25 p-3 flex gap-2 border-t border-[#efe6dc]/40">
                      <button
                        onClick={() => onViewProduct(p)}
                        className="flex-1 py-1.5 px-3 bg-white border border-[#efe6dc] hover:border-stone-300 text-stone-700 text-[10px] font-sans font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#764229]" /> Ver Detalles
                      </button>
                      <button
                        onClick={() => onAddToCart(p)}
                        className="py-1.5 px-3 bg-[#764229] hover:bg-[#4a2815] text-white text-[10px] font-sans font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#efe6dc]" /> Añadir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
