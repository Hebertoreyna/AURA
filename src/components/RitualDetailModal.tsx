import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Sparkles } from 'lucide-react';
import { Ritual } from '../types';

interface RitualDetailModalProps {
  ritual: Ritual | null;
  isOpen: boolean;
  onClose: () => void;
  onBookRitual: (ritualId: string) => void;
}

export default function RitualDetailModal({ ritual, isOpen, onClose, onBookRitual }: RitualDetailModalProps) {
  if (!ritual) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={`ritual-modal-${ritual.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="ritual-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4a2815]/30 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="ritual-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-[#faf6f0] rounded-2xl overflow-hidden shadow-2xl border border-[#efe6dc] md:flex"
            style={{ maxHeight: '90vh' }}
          >
            {/* Close button */}
            <button
              id="ritual-modal-close"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/70 backdrop-blur-md rounded-full shadow-md text-stone-700 hover:text-stone-950 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Hero Image with badge */}
            <div id="ritual-modal-image-panel" className="relative w-full md:w-1/2 h-56 md:h-auto min-h-[250px] bg-[#efe6dc]">
              <img
                src={ritual.imageUrl}
                alt={ritual.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {ritual.badge && (
                <span className="absolute top-4 left-4 bg-[#764229] text-white text-[10px] font-sans font-semibold tracking-wider px-3 py-1 rounded-full uppercase">
                  {ritual.badge}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#4a2815]/50 to-transparent p-4 flex items-end md:hidden">
                <div>
                  <span className="text-[10px] font-sans tracking-widest text-[#efe6dc] uppercase">{ritual.duration} MIN</span>
                  <h3 className="text-2xl font-serif text-white">{ritual.name}</h3>
                </div>
              </div>
            </div>

            {/* Right side: Detailed Information */}
            <div id="ritual-modal-info-panel" className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
              {/* Desktop Header */}
              <div className="hidden md:block mb-4">
                <span className="text-xs font-sans tracking-widest text-[#764229] uppercase font-semibold">ARQUITECTURA DEL TRATAMIENTO</span>
                <h3 className="text-3xl font-serif text-[#4a2815] mt-1 leading-tight">{ritual.name}</h3>
                <p className="text-xs text-stone-500 font-sans tracking-wider mt-1 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#5e6c58]" /> {ritual.duration} minutos de cuidado
                </p>
              </div>

              {/* Price Tag */}
              <div className="flex justify-between items-baseline pb-4 border-b border-[#efe6dc] mb-4">
                <span className="text-2xl font-serif text-[#764229] font-semibold">${ritual.price}</span>
                <span className="text-xs font-mono text-[#5e6c58] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Totalmente Personalizado
                </span>
              </div>

              {/* Core Description */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">{ritual.description}</p>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-xs font-sans font-semibold tracking-wider uppercase text-[#4a2815] mb-2">Beneficios Estructurales</h4>
                <ul className="space-y-1">
                  {ritual.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-[#efe6dc] bg-[#764229] w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chronological Steps */}
              <div className="mb-4">
                <h4 className="text-xs font-sans font-semibold tracking-wider uppercase text-[#4a2815] mb-2">Pasos Cronológicos</h4>
                <div className="space-y-2 border-l-2 border-[#efe6dc] pl-4 py-1">
                  {ritual.steps.map((step, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#764229] border border-[#faf6f0]" />
                      <span className="text-[10px] font-mono text-[#764229] uppercase block tracking-wider font-semibold font-bold">Fase {i + 1}</span>
                      <p className="text-stone-600 text-xs mt-0.5 leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Therapists */}
              <div className="mb-6">
                <h4 className="text-xs font-sans font-semibold tracking-wider uppercase text-[#4a2815] mb-1">Especialistas Disponibles</h4>
                <p className="text-xs text-stone-500">{ritual.therapists.join(', ')}</p>
              </div>

              {/* CTA Booking Button */}
              <div className="mt-auto pt-4 flex gap-3">
                <button
                  id={`ritual-book-direct-${ritual.id}`}
                  onClick={() => {
                    onBookRitual(ritual.id);
                  }}
                  className="flex-1 py-3 px-4 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-xl transition-all font-sans uppercase flex items-center justify-center gap-2 shadow-lg"
                >
                  Reservar Sesión — ${ritual.price}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
