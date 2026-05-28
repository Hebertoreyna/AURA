import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Sprout, Heart } from 'lucide-react';

interface PhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhilosophyModal({ isOpen, onClose }: PhilosophyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="philosophy-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="philosophy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4a2815]/30 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            id="philosophy-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-y-auto max-h-[85vh] bg-[#faf6f0] rounded-2xl p-6 md:p-8 shadow-xl border border-[#efe6dc] text-stone-800"
          >
            {/* Close button */}
            <button
               id="philosophy-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div id="philosophy-header" className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-[#764229] font-medium">En el interior de nuestra esencia</span>
              <h2 className="text-3xl font-serif text-[#4a2815] mt-1">Nuestra Filosofía</h2>
            </div>

            {/* Core Values */}
            <div id="philosophy-values" className="space-y-6">
              <div id="value-pure" className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eae4] flex items-center justify-center text-[#764229]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Alquimia Botánica Real</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Seleccionamos elementos crudos y silvestres cultivados sin disruptores endocrinos ni metales pesados. Cada lote de suero se infunde lentamente en alambiques de cobre para preservar las enzimas activas naturales.
                  </p>
                </div>
              </div>

              <div id="value-cycle" className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eae4] flex items-center justify-center text-[#764229]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Sinergias Circadianas</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Nuestra piel tiene una fase de defensa diurna y una velocidad de restauración nocturna. Cada ritual de AURA está diseñado para cooperar con tus picos hormonales circadianos, duplicando la recuperación celular.
                  </p>
                </div>
              </div>

              <div id="value-care" className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eae4] flex items-center justify-center text-[#764229]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Química Limpia y Consciente</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    La estética nunca debería costar nuestros ecosistemas planetarios. Distribuimos en frascos de vidrio ámbar, utilizamos etiquetas de pulpa de madera y financiamos santuarios de restauración botánica en todo el país.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div id="philosophy-quote" className="mt-8 pt-6 border-t border-[#efe6dc] text-center italic text-[#764229] text-sm font-serif">
              "Para sanar la piel, aquieta la mente y escucha los ritmos de la tierra."
              <p className="text-[10px] mt-1 not-italic font-sans tracking-widest uppercase text-stone-500">— SANTUARIO AURA</p>
            </div>

            {/* Dismiss Button */}
            <button
              id="philosophy-dismiss-btn"
              onClick={onClose}
              className="mt-6 w-full py-3 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-xl transition-all font-sans uppercase"
            >
              Continuar Nuestro Viaje
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
