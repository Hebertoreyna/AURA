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
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', duration: 0.4, bounce: 0.1 } }}
            exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.16, ease: [0.32, 0.72, 0, 1] } }}
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
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Cuidado Personalizado</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Cada servicio comienza con un análisis de tu piel. Adaptamos cada servicio a tus necesidades específicas para que veas resultados reales desde la primera sesión.
                  </p>
                </div>
              </div>

              <div id="value-cycle" className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eae4] flex items-center justify-center text-[#764229]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Técnicas Profesionales</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Combinamos las técnicas más avanzadas en cosmetología con productos de alta calidad. Desde faciales con tecnología Hydrofacial hasta maquillaje artístico para tus momentos más especiales.
                  </p>
                </div>
              </div>

              <div id="value-care" className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eae4] flex items-center justify-center text-[#764229]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4a2815] font-medium">Experiencia que Transforma</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Más que un servicio de belleza, AURA es un espacio donde te cuidas y te consientes. Cada visita es una pausa en tu día para reconectar contigo misma y salir radiante.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div id="philosophy-quote" className="mt-8 pt-6 border-t border-[#efe6dc] text-center italic text-[#764229] text-sm font-serif">
              "Tu belleza natural es el lienzo. Mi trabajo es hacerla brillar."
              <p className="text-[10px] mt-1 not-italic font-sans tracking-widest uppercase text-stone-500">— Anel Reyna, AURA</p>
            </div>

            {/* Dismiss Button */}
            <button
              id="philosophy-dismiss-btn"
              onClick={onClose}
              className="mt-6 w-full py-3 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase"
            >
              Continuar Nuestro Viaje
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
