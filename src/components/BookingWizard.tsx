import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, ChevronRight, ChevronLeft, Sparkles, AlertTriangle, MessageCircle, Loader2 } from 'lucide-react';
import { Ritual, Specialist } from '../types';
import { RITUALS, SPECIALISTS } from '../data';
import { getBookedSlots, saveBooking } from '../lib/bookings';

// ─── CONFIGURACIÓN DEL SALÓN ────────────────────────────────────────────────
// Reemplaza con el número de WhatsApp de Anel (formato: 52 + número sin espacios)
const WHATSAPP_PHONE = '526381285959';
// ────────────────────────────────────────────────────────────────────────────

interface BookingWizardProps {
  isOpen: boolean;
  preSelectedRitualId: string | null;
  onClose: () => void;
}

export default function BookingWizard({ isOpen, preSelectedRitualId, onClose }: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const prevStep = useRef<number>(1);
  const direction = step > prevStep.current ? 1 : -1;
  
  // Selections state
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Person details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Firestore — slots ya reservados para la fecha seleccionada
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Sync pre-selected ritual
  useEffect(() => {
    if (preSelectedRitualId) {
      const ritual = RITUALS.find(r => r.id === preSelectedRitualId);
      if (ritual) {
        setSelectedRitual(ritual);
        setStep(2);
      }
    } else {
      setSelectedRitual(null);
      setStep(1);
    }
  }, [preSelectedRitualId, isOpen]);

  // Cargar horarios ocupados de Firestore cuando cambia la fecha seleccionada
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime(''); // resetear hora si cambia la fecha
    getBookedSlots(selectedDate)
      .then(slots => setBookedSlots(slots))
      .catch(() => setBookedSlots(new Set()))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  // Generate date options for the next 7 days in May 2026
  const getDatesList = () => {
    const list = [];
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Start from current simulated date: 2026-05-28
    const baseDate = new Date('2026-05-28');
    for (let i = 0; i < 7; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        const dayName = weekdays[d.getDay()];
        const dayNum = d.getDate();
        const monthName = d.getMonth() === 4 ? 'Mayo' : months[d.getMonth()]; // May translation specifically
        const formatted = `${dayName}, ${dayNum} de ${monthName}`;
        list.push({
          raw: d.toISOString().split('T')[0],
          formatted,
          shortName: dayName.substring(0, 3),
          dayNum
        });
    }
    return list;
  };

  const datesList = getDatesList();
  const timesList = ['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'];

  const filteredSpecialists = selectedRitual
    ? SPECIALISTS.filter(s => selectedRitual.therapists.includes(s.name))
    : SPECIALISTS;

  const handleNextStep = () => {
    setValidationError('');
    if (step === 1 && !selectedRitual) {
      setValidationError('Por verifique y seleccione un ritual para continuar.');
      return;
    }
    if (step === 2 && !selectedSpecialist) {
      setValidationError('Por favor seleccione un especialista disponible.');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      setValidationError('Por favor elija una fecha y un horario.');
      return;
    }
    prevStep.current = step;
    setStep((prev) => (prev + 1) as any);
  };

  const handlePrevStep = () => {
    setValidationError('');
    prevStep.current = step;
    setStep((prev) => (prev - 1) as any);
  };

  const handleConfirmReservation = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Por favor proporciona tu nombre para continuar.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!selectedRitual || !selectedSpecialist) return;

    setSubmitting(true);
    setValidationError('');

    try {
      const appDate = datesList.find(d => d.raw === selectedDate)?.formatted || selectedDate;

      // 1. Guardar reserva en Firestore (status: pending)
      await saveBooking({
        date: selectedDate,
        time: selectedTime,
        ritualName: selectedRitual.name,
        specialistName: selectedSpecialist.name,
        clientName: name.trim(),
        clientEmail: email.trim(),
        notes: notes.trim(),
        status: 'pending',
      });

      // 2. Construir y abrir mensaje de WhatsApp
      const msg = [
        `¡Hola Anel! Me gustaría reservar una cita 🌿`,
        ``,
        `*Servicio:* ${selectedRitual.name}`,
        `*Especialista:* ${selectedSpecialist.name}`,
        `*Fecha:* ${appDate}`,
        `*Hora:* ${selectedTime}`,
        `*Duración:* ${selectedRitual.duration} min`,
        `*Precio:* $${selectedRitual.price} MXN`,
        ``,
        `*Nombre:* ${name.trim()}`,
        `*Correo:* ${email.trim()}`,
        notes.trim() ? `*Notas:* ${notes.trim()}` : null,
        ``,
        `¡Gracias! 💆‍♀️`,
      ].filter(line => line !== null).join('\n');

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
      setSuccess(true);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      setValidationError('Error al conectar con el servidor. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRitual(null);
    setSelectedSpecialist(null);
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setEmail('');
    setNotes('');
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="booking-wizard-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="booking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="absolute inset-0 bg-[#4a2815]/30 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            id="booking-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] } }}
            className="relative w-full max-w-xl bg-[#faf6f0] rounded-2xl overflow-hidden shadow-2xl border border-[#efe6dc] flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div id="booking-wizard-header" className="p-5 border-b border-[#efe6dc] flex justify-between items-center bg-white/50">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#764229] uppercase">Agendador Exclusivo</span>
                <h3 className="text-xl font-serif text-[#4a2815]">
                  {success ? '¡Mensaje Enviado!' : 'Reservar por WhatsApp'}
                </h3>
              </div>
              <button
                id="booking-close-btn"
                onClick={handleReset}
                className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {validationError && (
              <div id="booking-validation-error" className="bg-[#8a4f35]/10 border-b border-[#8a4f35]/20 px-5 py-2.5 text-xs text-[#8a4f35] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Step indicators */}
            {!success && (
              <div id="booking-steps-nav" className="flex bg-[#efe6dc]/40 border-b border-[#efe6dc]/50 text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                <button
                  onClick={() => selectedRitual && setStep(1)}
                  disabled={!selectedRitual}
                  className={`flex-1 py-3 text-center border-r border-[#efe6dc]/40 transition-all ${step === 1 ? 'bg-[#efe6dc] text-[#4a2815]' : ''}`}
                >
                  1. Ritual
                </button>
                <button
                  onClick={() => selectedSpecialist && setStep(2)}
                  disabled={!selectedSpecialist}
                  className={`flex-1 py-3 text-center border-r border-[#efe6dc]/40 transition-all ${step === 2 ? 'bg-[#efe6dc] text-[#4a2815]' : ''}`}
                >
                  2. Especialista
                </button>
                <button
                  onClick={() => selectedDate && setStep(3)}
                  disabled={!selectedDate}
                  className={`flex-1 py-3 text-center border-r border-[#efe6dc]/40 transition-all ${step === 3 ? 'bg-[#efe6dc] text-[#4a2815]' : ''}`}
                >
                  3. Horario
                </button>
                <button
                  disabled
                  className={`flex-1 py-3 text-center transition-all ${step === 4 ? 'bg-[#efe6dc] text-[#4a2815]' : ''}`}
                >
                  4. Confirmación
                </button>
              </div>
            )}

            {/* Main Interactive Content Panel */}
            <div id="booking-wizard-content" className="p-6 overflow-y-auto flex-1">
              {success ? (
                /* SUCCESS SCREEN — WhatsApp enviado */
                <motion.div
                  id="booking-success-pnl"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }}
                  className="text-center py-6 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-[#25D366]/25">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono tracking-widest text-[#25D366] uppercase font-semibold">Mensaje enviado</span>
                  <h4 className="text-2xl font-serif text-[#4a2815] mt-1 mb-2">¡Solicitud enviada por WhatsApp!</h4>
                  <p className="text-xs text-stone-600 max-w-sm leading-relaxed mb-6">
                    Tu mensaje fue enviado a Anel Reyna por WhatsApp. Ella confirmará tu cita en breve.
                  </p>

                  {/* Resumen */}
                  <div className="w-full bg-[#f2eae4] rounded-xl p-5 text-left border border-[#efe6dc] space-y-3 max-w-sm mb-6">
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Servicio</span>
                      <span className="font-serif font-semibold text-[#4a2815]">{selectedRitual?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Especialista</span>
                      <span className="text-stone-700">{selectedSpecialist?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Fecha y Hora</span>
                      <span className="text-stone-700 text-right max-w-[150px]">{datesList.find(d => d.raw === selectedDate)?.formatted} • {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-[#764229] uppercase tracking-widest font-sans font-bold">Precio</span>
                      <span className="font-serif font-bold text-[#764229] text-base">${selectedRitual?.price} MXN</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 italic mb-5">
                    Cancelaciones con al menos 24 horas de anticipación.
                  </p>

                  <button
                    id="booking-finish-btn"
                    onClick={handleReset}
                    className="py-3 px-10 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                /* STEPPING LOGIC — direction-aware step transitions */
                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 && (
                    /* STEP 1: SELECT RITUAL */
                    <motion.div
                      key="step1"
                      id="step1-ritual-select"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-4"
                    >
                      <p className="text-xs text-stone-500 font-serif italic">Selecciona uno de nuestros icónicos rituales de bienestar dérmico:</p>
                      <div className="grid grid-cols-1 gap-3">
                        {RITUALS.map((r) => (
                          <button
                            key={r.id}
                            id={`select-ritual-opt-${r.id}`}
                            onClick={() => {
                              setSelectedRitual(r);
                              setSelectedSpecialist(null);
                            }}
                            className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                              selectedRitual?.id === r.id
                                ? 'bg-[#efe6dc]/50 border-[#764229] shadow-md'
                                : 'bg-white border-[#efe6dc] hover:border-stone-300'
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <img
                                src={r.imageUrl}
                                alt={r.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-serif font-semibold text-[#4a2815] group-hover:text-[#764229] transition-colors">
                                    {r.name}
                                  </span>
                                  {r.badge && (
                                    <span className="text-[8px] font-sans bg-[#efe6dc] text-[#764229] px-2 py-0.5 rounded-full font-bold">
                                      {r.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-stone-500 mt-0.5 max-w-sm line-clamp-1">{r.shortDescription}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-serif font-bold text-[#764229] block">${r.price}</span>
                              <span className="text-[9px] font-mono text-stone-400 block">{r.duration} Mins</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    /* STEP 2: SELECT THERAPIST */
                    <motion.div
                      key="step2"
                      id="step2-therapist-select"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-4"
                    >
                      <p className="text-xs text-stone-500 font-serif italic">
                        Especialistas disponibles para <strong className="text-[#4a2815]">{selectedRitual?.name}</strong>:
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {filteredSpecialists.map((s) => (
                          <button
                            key={s.id}
                            id={`select-specialist-opt-${s.id}`}
                            onClick={() => setSelectedSpecialist(s)}
                            className={`p-4 rounded-xl text-left border transition-all flex gap-4 items-start ${
                              selectedSpecialist?.id === s.id
                                ? 'bg-[#efe6dc]/50 border-[#764229] shadow-md'
                                : 'bg-white border-[#efe6dc] hover:border-stone-300'
                            }`}
                          >
                            <img
                              src={s.avatarUrl}
                              alt={s.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-full object-cover border-2 border-white flex-shrink-0 shadow-sm"
                            />
                            <div>
                              <span className="text-sm font-serif font-semibold text-[#4a2815] block">{s.name}</span>
                              <span className="text-[10px] font-sans tracking-wider text-[#764229] uppercase font-semibold block">{s.role}</span>
                              <p className="text-[10px] text-stone-600 mt-1 lines-clamp-3 leading-relaxed">{s.bio}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    /* STEP 3: DATE & TIME slots */
                    <motion.div
                      key="step3"
                      id="step3-schedule-select"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-6"
                    >
                      {/* Date Carousel Grid */}
                      <div className="space-y-2">
                        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#4a2815]">Seleccionar Fecha</label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {datesList.map((d) => (
                            <button
                              key={d.raw}
                              id={`select-date-opt-${d.raw}`}
                              type="button"
                              onClick={() => setSelectedDate(d.raw)}
                              className={`p-2 rounded-xl text-center border transition-all ${
                                selectedDate === d.raw
                                  ? 'bg-[#764229] border-[#764229] text-white shadow-md'
                                  : 'bg-white border-[#efe6dc] hover:border-stone-300 text-stone-700'
                              }`}
                            >
                              <span className="text-[9px] font-mono block uppercase tracking-wider opacity-80">{d.shortName}</span>
                              <span className="text-lg font-serif font-bold block leading-none my-1">{d.dayNum}</span>
                              <span className="text-[8px] font-sans block uppercase opacity-85">Mayo</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hour List */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#4a2815]">
                            Horarios Disponibles
                          </label>
                          {loadingSlots && (
                            <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                              <Loader2 className="w-3 h-3 animate-spin" /> verificando...
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {timesList.map((t) => {
                            const isBooked = bookedSlots.has(t);
                            const isSelected = selectedTime === t;
                            return (
                              <button
                                key={t}
                                id={`select-time-opt-${t.replace(' ', '-')}`}
                                type="button"
                                disabled={isBooked || loadingSlots}
                                onClick={() => !isBooked && setSelectedTime(t)}
                                className={`py-3 px-4 rounded-xl text-center border text-xs font-mono transition-[background-color,border-color,opacity] duration-150 flex items-center justify-center gap-2 ${
                                  isBooked
                                    ? 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed line-through'
                                    : isSelected
                                    ? 'bg-[#efe6dc] border-[#764229] text-[#4a2815] font-semibold shadow-sm'
                                    : 'bg-white border-[#efe6dc] hover:border-stone-300 text-stone-600 cursor-pointer'
                                }`}
                              >
                                <Clock className={`w-3.5 h-3.5 ${isBooked ? 'text-stone-300' : 'text-[#5e6c58] opacity-70'}`} />
                                {isBooked ? `${t}` : t}
                              </button>
                            );
                          })}
                        </div>
                        {selectedDate && !loadingSlots && bookedSlots.size > 0 && (
                          <p className="text-[10px] text-stone-400 font-serif italic mt-1">
                            Los horarios tachados ya tienen reserva pendiente.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    /* STEP 4: CONTACT & SECURE REGISTER */
                    <motion.div
                      key="step4"
                      id="step4-contact"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-4"
                    >
                      <p className="text-xs text-stone-500 font-serif italic">Proporciona los datos del huésped para completar el registro de la sesión:</p>
                      <form onSubmit={handleConfirmReservation} className="space-y-4">
                        {/* Summary preview */}
                        <div className="p-4 bg-white border border-[#efe6dc] rounded-xl flex gap-3 text-xs leading-normal">
                          <img
                            src={selectedRitual?.imageUrl}
                            alt="ritual"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <span className="font-serif font-bold text-[#4a2815] block">{selectedRitual?.name}</span>
                            <span className="text-[10px] text-stone-500 block">Especialista: {selectedSpecialist?.name}</span>
                            <span className="text-[10px] text-stone-500 block font-mono">
                              {datesList.find(d => d.raw === selectedDate)?.formatted} a las {selectedTime}
                            </span>
                          </div>
                          <span className="ml-auto font-serif font-bold text-[#764229] text-sm">${selectedRitual?.price}</span>
                        </div>

                        {/* Name input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Nombre del Huésped</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Heberto R. G."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229]"
                          />
                        </div>

                        {/* Email input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Correo Electrónico</label>
                          <input
                            type="email"
                            required
                            placeholder="Ej. Heberto.R.G@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229]"
                          />
                        </div>

                        {/* Guest messages */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Alergias o Notas de la Piel (Opcional)</label>
                          <textarea
                            rows={3}
                            placeholder="Cuéntanos sobre sensibilidades cutáneas, zonas secas o preferencias de presión..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229] resize-none"
                          />
                        </div>

                        {/* Invisible Submit trigger */}
                        <button type="submit" className="hidden" id="booking-submit-trigger" />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Sticky Actions Footer */}
            {!success && (
              <div id="booking-wizard-footer" className="p-5 border-t border-[#efe6dc] flex justify-between gap-3 bg-white/50">
                {step > 1 && (
                  <button
                    id="booking-prev-step-btn"
                    onClick={handlePrevStep}
                    className="py-3 px-4 border border-[#efe6dc] hover:bg-[#efe6dc]/20 active:scale-[0.97] text-stone-700 text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Atrás
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    id="booking-next-step-btn"
                    onClick={handleNextStep}
                    className="ml-auto py-3 px-6 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase flex items-center gap-1.5"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="booking-confirm-reservation-btn"
                    onClick={(e) => {
                      const trigger = document.getElementById('booking-submit-trigger');
                      if (trigger) trigger.click();
                      else handleConfirmReservation(e);
                    }}
                    disabled={submitting}
                    className="ml-auto py-3 px-6 bg-[#25D366] hover:bg-[#1da851] active:scale-[0.97] disabled:opacity-60 text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase flex items-center justify-center gap-2"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                      : <><MessageCircle className="w-4 h-4" /> Enviar por WhatsApp</>
                    }
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
