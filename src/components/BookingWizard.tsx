import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, ChevronRight, ChevronLeft, AlertTriangle, MessageCircle, Loader2, CalendarDays, Check, Sparkles, Leaf } from 'lucide-react';
import { Ritual, Specialist } from '../types';
import { RITUALS, SPECIALISTS } from '../data';
import {
  BookedSlot, getBookedSlots, saveBooking,
  generateTimeSlots, isSlotAvailable, SESSION_BUFFER, timeToMin,
} from '../lib/bookings';

// ─── CONFIGURACIÓN DEL SALÓN ────────────────────────────────────────────────
const WHATSAPP_PHONE = '526381285959';

/**
 * Porcentaje de anticipo (depósito) requerido por tipo de servicio.
 * Criterio: servicios cotidianos sin anticipo (pago al llegar);
 * servicios de maquillaje y tratamientos de mayor inversión requieren 30 %;
 * eventos especiales (novia, XV años) requieren 50 % por el compromiso de fecha.
 */
const DEPOSIT_PCT: Record<string, number> = {
  r1:   0,  // Limpieza Facial
  r2:  30,  // Hydrofacial
  r3:  30,  // Facial Lifting
  r4:   0,  // Facial Control Acné
  r5:  30,  // Facial Microdermoabrasión
  r6:  30,  // Maquillaje Social
  r7:  50,  // Maquillaje Novia
  r8:  50,  // Maquillaje XV Años
  r9:   0,  // Masaje Relajante
  r10: 30,  // EMS Body + Drenaje
  r11:  0,  // Exfoliación de Espalda
  r12:  0,  // Eliminación de Verrugas — evaluación gratuita
  r13:  0,  // Facial Ejecutivo
  r14: 30,  // Facial Personalizado
  r15:  0,  // Facial AURA (standalone o add-on)
  r16: 50,  // Velo de Novia
  r17: 30,  // Maquillaje Graduación
  r18: 50,  // Curso de Automaquillaje
  r19:  0,  // Facial Glow
  r20:  0,  // Facial Detox
};

const AURA_ADDON_PRICE = 600; // precio del Facial AURA como complemento

// ─── HELPERS DE FECHA ───────────────────────────────────────────────────────
const DAYS_ES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

/** "2026-05-28" sin problemas de zona horaria */
const fmtRaw = (y: number, m: number, d: number): string =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** "2026-05-28" → "Jueves, 28 de mayo de 2026" en español */
const fmtDisplay = (raw: string): string => {
  const [y, m, d] = raw.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

/** Fecha mínima reservable: hoy (no se permiten fechas pasadas) */
const getMinDate = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// ─── COMPONENTE ─────────────────────────────────────────────────────────────

interface BookingWizardProps {
  isOpen: boolean;
  preSelectedRitualId: string | null;
  onClose: () => void;
}

export default function BookingWizard({ isOpen, preSelectedRitualId, onClose }: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const prevStep = useRef<number>(1);
  const direction = step > prevStep.current ? 1 : -1;

  // Selecciones del usuario
  const [selectedRitual,     setSelectedRitual]     = useState<Ritual | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate,       setSelectedDate]       = useState<string>('');
  const [selectedTime,       setSelectedTime]       = useState<string>('');

  // Datos del cliente
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Categoría principal seleccionada en paso 1
  const [selectedCategory, setSelectedCategory] = useState<'cabina' | 'maquillaje' | null>(null);

  // Facial AURA como add-on (solo cuando se selecciona un facial distinto al propio AURA)
  const [withAuraAddon, setWithAuraAddon] = useState(false);

  // UI feedback
  const [validationError, setValidationError] = useState('');
  const [success,         setSuccess]         = useState(false);
  const [submitting]                          = useState(false);

  // Navegación del calendario mensual
  const [calYear,  setCalYear]  = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  // Firestore — slots reservados para la fecha + especialista seleccionados
  const [bookedSlots,   setBookedSlots]   = useState<BookedSlot[]>([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);

  // ── Sincronizar ritual pre-seleccionado ─────────────────────────────────
  useEffect(() => {
    if (preSelectedRitualId) {
      const ritual = RITUALS.find(r => r.id === preSelectedRitualId);
      if (ritual) {
        setSelectedRitual(ritual);
        setSelectedCategory(ritual.category);
        setStep(2);
      }
    } else {
      setSelectedRitual(null);
      setSelectedCategory(null);
      setStep(1);
    }
    setWithAuraAddon(false);
  }, [preSelectedRitualId, isOpen]);

  // ── Cargar slots ocupados al cambiar fecha o especialista ───────────────
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime('');
    getBookedSlots(selectedDate, selectedSpecialist?.name)
      .then(slots => setBookedSlots(slots))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedSpecialist]);

  // ── Helpers del calendario ───────────────────────────────────────────────
  const isDateDisabled = (y: number, m: number, d: number): boolean => {
    return new Date(y, m, d) < getMinDate();
  };

  /** Filtra horarios ya transcurridos si la fecha seleccionada es hoy */
  const isTimePast = (slotTime: string): boolean => {
    const now = new Date();
    const todayRaw = fmtRaw(now.getFullYear(), now.getMonth(), now.getDate());
    if (selectedDate !== todayRaw) return false;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return timeToMin(slotTime) <= nowMin;
  };

  /** Celdas del mes: null = relleno inicial, number = día */
  const calCells = (): (number | null)[] => {
    const firstDow  = new Date(calYear, calMonth, 1).getDay();
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    return cells;
  };

  const isPrevMonthDisabled = (): boolean => {
    const now = new Date();
    return calYear === now.getFullYear() && calMonth === now.getMonth();
  };

  const goPrevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };

  const goNextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const handleSelectDate = (day: number) => {
    if (isDateDisabled(calYear, calMonth, day)) return;
    setSelectedDate(fmtRaw(calYear, calMonth, day));
  };

  // ── Precio y duración efectivos (incluye add-on si aplica) ──────────────
  const canHaveAuraAddon = !!(
    selectedRitual &&
    selectedRitual.subcategory === 'facial' &&
    selectedRitual.id !== 'r15' &&    // Facial AURA no se añade a sí mismo
    !selectedRitual.customQuote
  );
  const effectivePrice    = (selectedRitual?.price ?? 0) + (canHaveAuraAddon && withAuraAddon ? AURA_ADDON_PRICE : 0);
  const effectiveDuration = (selectedRitual?.duration ?? 60) + (canHaveAuraAddon && withAuraAddon ? 30 : 0);

  // ── Slots de tiempo ──────────────────────────────────────────────────────
  const timesList = generateTimeSlots(effectiveDuration);

  const filteredSpecialists = selectedRitual
    ? SPECIALISTS.filter(s => selectedRitual.therapists.includes(s.name))
    : SPECIALISTS;

  // ── Navegación por pasos ─────────────────────────────────────────────────
  const handleNextStep = () => {
    setValidationError('');
    if (step === 1 && !selectedCategory) {
      setValidationError('Por favor selecciona una categoría para continuar.');
      return;
    }
    if (step === 1 && !selectedRitual) {
      setValidationError('Por favor selecciona un servicio de la lista para continuar.');
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
    setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handlePrevStep = () => {
    setValidationError('');
    prevStep.current = step;
    setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  // ── Confirmación y envío a WhatsApp ──────────────────────────────────────
  const handleConfirmReservation = (e: FormEvent) => {
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

    setValidationError('');

    const appDate = fmtDisplay(selectedDate);

    const pct  = depositPct(selectedRitual.id);
    const dep  = depositAmt(selectedRitual.id, effectivePrice);
    const rest = effectivePrice - dep;
    const isEval    = selectedRitual.customQuote === true;
    const hasAddon  = canHaveAuraAddon && withAuraAddon;
    const svcName   = hasAddon
      ? `${selectedRitual.name} + Facial AURA`
      : selectedRitual.name;

    const msg = [
      isEval
        ? `¡Hola Anel! Me gustaría agendar una cita de evaluación 🌿`
        : `¡Hola Anel! Me gustaría reservar una cita 🌿`,
      ``,
      `*Servicio:* ${svcName}`,
      isEval ? `*Tipo:* Evaluación gratuita (presupuesto personalizado)` : null,
      hasAddon ? `*Complemento:* Facial AURA · activos exclusivos, vitamina C y péptidos tensores` : null,
      `*Especialista:* ${selectedSpecialist.name}`,
      `*Fecha:* ${appDate}`,
      `*Hora:* ${selectedTime}`,
      `*Duración aprox.:* ${effectiveDuration} min`,
      ``,
      isEval
        ? `*Precio:* Por definir (presupuesto personalizado durante la evaluación)`
        : `*Precio total:* $${effectivePrice} MXN`,
      !isEval && pct > 0  ? `*Anticipo (${pct}%):* $${dep} MXN`           : null,
      !isEval && pct > 0  ? `*Resto al llegar:* $${rest} MXN`              : null,
      !isEval && pct === 0 ? `*Anticipo:* Sin anticipo — pago al llegar`   : null,
      ``,
      `*Nombre:* ${name.trim()}`,
      `*Correo:* ${email.trim()}`,
      notes.trim() ? `*Notas:* ${notes.trim()}` : null,
      ``,
      isEval ? `¡Gracias! Quedo pendiente del presupuesto 🙏` : `¡Gracias! 💆‍♀️`,
    ].filter(line => line !== null).join('\n');

    // Abrir WhatsApp PRIMERO — respuesta directa al click, sin await
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
    setSuccess(true);

    // Guardar en Firestore en segundo plano (fire-and-forget)
    saveBooking({
      date:           selectedDate,
      time:           selectedTime,
      duration:       effectiveDuration,
      ritualName:     svcName,
      specialistName: selectedSpecialist.name,
      clientName:     name.trim(),
      clientEmail:    email.trim(),
      notes:          notes.trim(),
      status:         'pending',
    }).catch(err => console.error('Firestore (non-blocking):', err));
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedRitual(null);
    setSelectedSpecialist(null);
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setEmail('');
    setNotes('');
    setWithAuraAddon(false);
    setSuccess(false);
    onClose();
  };

  // ── Helpers de anticipo (depósito) ───────────────────────────────────────
  const depositPct = (ritualId: string): number => DEPOSIT_PCT[ritualId] ?? 0;
  const depositAmt = (ritualId: string, price: number): number =>
    Math.round(price * depositPct(ritualId) / 100);

  const todayRaw = fmtRaw(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // ─────────────────────────────────────────────────────────────────────────
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

          {/* Dialog */}
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
                className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors active:scale-[0.97]"
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

            {/* Step tabs */}
            {!success && (
              <div id="booking-steps-nav" className="flex bg-[#efe6dc]/40 border-b border-[#efe6dc]/50 text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                {(['1. Ritual', '2. Especialista', '3. Horario', '4. Confirmación'] as const).map((label, i) => {
                  const s = (i + 1) as 1 | 2 | 3 | 4;
                  const clickable = s < step;
                  return (
                    <button
                      key={s}
                      onClick={() => { if (clickable) { prevStep.current = step; setStep(s); } }}
                      disabled={!clickable && step !== s}
                      className={`flex-1 py-3 text-center border-r border-[#efe6dc]/40 transition-all last:border-r-0 ${
                        step === s ? 'bg-[#efe6dc] text-[#4a2815]' : ''
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Content */}
            <div id="booking-wizard-content" className="p-6 overflow-y-auto flex-1">
              {success ? (
                /* ── SUCCESS ── */
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

                  <div className="w-full bg-[#f2eae4] rounded-xl p-5 text-left border border-[#efe6dc] space-y-3 max-w-sm mb-6">
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Servicio</span>
                      <div className="text-right">
                        <span className="font-serif font-semibold text-[#4a2815] block">{selectedRitual?.name}</span>
                        {canHaveAuraAddon && withAuraAddon && (
                          <span className="text-[9px] font-sans font-semibold text-[#764229] flex items-center justify-end gap-1 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> + Facial AURA
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Especialista</span>
                      <span className="text-stone-700">{selectedSpecialist?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                      <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Fecha y Hora</span>
                      <span className="text-stone-700 text-right max-w-[150px]">{fmtDisplay(selectedDate)} · {selectedTime}</span>
                    </div>
                    {selectedRitual?.customQuote ? (
                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-sky-700 uppercase tracking-widest font-sans font-bold">Precio</span>
                        <span className="font-sans font-semibold text-sky-700">Presupuesto personalizado</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs pb-2 border-b border-[#efe6dc]">
                          <span className="text-stone-500 uppercase tracking-widest font-sans font-bold">Precio Total</span>
                          <span className="font-serif font-semibold text-[#4a2815]">${effectivePrice} MXN</span>
                        </div>
                        {selectedRitual && depositPct(selectedRitual.id) > 0 ? (
                          <div className="flex justify-between text-xs pt-1">
                            <span className="text-amber-700 uppercase tracking-widest font-sans font-bold">
                              Anticipo ({depositPct(selectedRitual.id)}%)
                            </span>
                            <span className="font-serif font-bold text-amber-700 text-base">
                              ${depositAmt(selectedRitual.id, effectivePrice)} MXN
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-xs pt-1">
                            <span className="text-emerald-700 uppercase tracking-widest font-sans font-bold">Anticipo</span>
                            <span className="font-sans font-semibold text-emerald-700">Sin anticipo</span>
                          </div>
                        )}
                      </>
                    )}
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
                <AnimatePresence mode="wait" initial={false}>
                  {/* ── PASO 1: RITUAL ── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-4"
                    >
                      {/* ── Selector de categoría principal ── */}
                      <div>
                        <p className="text-xs text-stone-500 font-serif italic mb-3">¿Qué tipo de servicio buscas?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            {
                              key: 'cabina' as const,
                              label: 'Cabina',
                              sub: 'Faciales & Corporales',
                              icon: <Leaf className="w-5 h-5" />,
                            },
                            {
                              key: 'maquillaje' as const,
                              label: 'Maquillaje',
                              sub: 'Arte & Imagen',
                              icon: <Sparkles className="w-5 h-5" />,
                            },
                          ]).map(cat => {
                            const active = selectedCategory === cat.key;
                            return (
                              <button
                                key={cat.key}
                                onClick={() => {
                                  setSelectedCategory(cat.key);
                                  // Si el ritual seleccionado no es de esta categoría, limpiar
                                  if (selectedRitual && selectedRitual.category !== cat.key) {
                                    setSelectedRitual(null);
                                    setSelectedSpecialist(null);
                                    setWithAuraAddon(false);
                                  }
                                }}
                                className={`p-4 rounded-xl border-2 text-left transition-[border-color,background-color,transform] duration-150 active:scale-[0.97] ${
                                  active
                                    ? 'border-[#764229] bg-[#764229] text-white shadow-md'
                                    : 'border-[#efe6dc] bg-white text-[#4a2815] hover:border-[#764229]/40'
                                }`}
                              >
                                <div className={`mb-2 ${active ? 'text-white/90' : 'text-[#764229]'}`}>
                                  {cat.icon}
                                </div>
                                <span className="text-sm font-serif font-bold block leading-tight">{cat.label}</span>
                                <span className={`text-[10px] font-sans mt-0.5 block ${active ? 'text-white/70' : 'text-stone-400'}`}>
                                  {cat.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── Lista de rituales (aparece al seleccionar categoría) ── */}
                      <AnimatePresence mode="wait">
                        {selectedCategory && (
                          <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                            exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                            className="space-y-4"
                          >
                            {([
                              { key: 'facial',     label: 'Faciales',    filter: (r: typeof RITUALS[0]) => r.subcategory === 'facial' },
                              { key: 'corporal',   label: 'Corporales',  filter: (r: typeof RITUALS[0]) => r.subcategory === 'corporal' },
                              { key: 'maquillaje', label: 'Maquillaje',  filter: (r: typeof RITUALS[0]) => r.category === 'maquillaje' },
                            ] as const)
                              .filter(grp =>
                                selectedCategory === 'cabina'
                                  ? grp.key !== 'maquillaje'
                                  : grp.key === 'maquillaje'
                              )
                              .map(grp => {
                              const group = RITUALS.filter(grp.filter);
                              return (
                                <div key={grp.key} className="space-y-2">
                                  {/* Encabezado de subgrupo */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#764229]/70 uppercase">
                                      — {grp.label}
                                    </span>
                                    <div className="flex-1 h-px bg-[#efe6dc]" />
                                  </div>

                                  {/* Items del grupo */}
                                  <div className="grid grid-cols-1 gap-2">
                                    {group.map((r) => (
                                      <button
                                        key={r.id}
                                        onClick={() => { setSelectedRitual(r); setSelectedSpecialist(null); }}
                                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                                          selectedRitual?.id === r.id
                                            ? 'bg-[#efe6dc]/50 border-[#764229] shadow-md'
                                            : 'bg-white border-[#efe6dc] hover:border-stone-300'
                                        }`}
                                      >
                                        <div className="flex gap-3 items-center min-w-0">
                                          <img src={r.imageUrl} alt={r.name} referrerPolicy="no-referrer"
                                            className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="text-sm font-serif font-semibold text-[#4a2815] group-hover:text-[#764229] transition-colors">
                                                {r.name}
                                              </span>
                                              {r.badge && (
                                                <span className={`text-[8px] font-sans px-1.5 py-0.5 rounded-full font-bold ${
                                                  r.customQuote
                                                    ? 'bg-sky-100 text-sky-700'
                                                    : 'bg-[#efe6dc] text-[#764229]'
                                                }`}>
                                                  {r.badge}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{r.shortDescription}</p>
                                          </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-3 space-y-0.5">
                                          {r.customQuote
                                            ? <span className="text-xs font-serif font-bold text-sky-700 block">Cotización</span>
                                            : <span className="text-sm font-serif font-bold text-[#764229] block">${r.price}</span>
                                          }
                                          <span className="text-[9px] font-mono text-stone-400 block">{r.duration} min</span>
                                          {r.customQuote
                                            ? <span className="text-[9px] font-mono text-sky-600/80 block">Eval. gratis</span>
                                            : depositPct(r.id) > 0
                                              ? <span className="text-[9px] font-mono text-amber-700/80 block">Anticipo {depositPct(r.id)}%</span>
                                              : <span className="text-[9px] font-mono text-emerald-600/70 block">Sin anticipo</span>
                                          }
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}

                            {/* ── Facial AURA add-on toggle ── */}
                            {canHaveAuraAddon && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-[border-color,background-color] duration-150 ${
                                  withAuraAddon
                                    ? 'border-[#764229] bg-[#efe6dc]/40'
                                    : 'border-[#efe6dc] bg-white hover:border-[#764229]/30'
                                }`}
                                onClick={() => setWithAuraAddon(v => !v)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                                    withAuraAddon ? 'bg-[#764229] border-[#764229]' : 'border-stone-300'
                                  }`}>
                                    {withAuraAddon && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-3.5 h-3.5 text-[#764229]" />
                                      <span className="text-xs font-serif font-semibold text-[#4a2815]">
                                        Potenciar con Facial AURA
                                      </span>
                                      <span className="text-[9px] font-mono font-bold text-[#764229] bg-[#efe6dc] px-2 py-0.5 rounded-full">
                                        +${AURA_ADDON_PRICE}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-stone-500 mt-0.5">
                                      Activos exclusivos AURA · vitamina C · péptidos tensores · +30 min de sesión
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* ── PASO 2: ESPECIALISTA ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
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
                            onClick={() => setSelectedSpecialist(s)}
                            className={`p-4 rounded-xl text-left border transition-all flex gap-4 items-start ${
                              selectedSpecialist?.id === s.id
                                ? 'bg-[#efe6dc]/50 border-[#764229] shadow-md'
                                : 'bg-white border-[#efe6dc] hover:border-stone-300'
                            }`}
                          >
                            <img src={s.avatarUrl} alt={s.name} referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-full object-cover border-2 border-white flex-shrink-0 shadow-sm" />
                            <div>
                              <span className="text-sm font-serif font-semibold text-[#4a2815] block">{s.name}</span>
                              <span className="text-[10px] font-sans tracking-wider text-[#764229] uppercase font-semibold block">{s.role}</span>
                              <p className="text-[10px] text-stone-600 mt-1 leading-relaxed">{s.bio}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── PASO 3: FECHA Y HORA ── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-6"
                    >
                      {/* ── Calendario mensual ── */}
                      <div className="space-y-3">
                        {/* Encabezado de mes con navegación */}
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#4a2815] flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            Seleccionar Fecha
                          </label>
                          {selectedRitual && depositPct(selectedRitual.id) > 0 && (
                            <span className="text-[9px] font-mono text-amber-700/80 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                              Anticipo {depositPct(selectedRitual.id)}% al confirmar
                            </span>
                          )}
                        </div>

                        {/* Navegación mes */}
                        <div className="flex items-center justify-between bg-white border border-[#efe6dc] rounded-xl px-3 py-2">
                          <button
                            type="button"
                            onClick={goPrevMonth}
                            disabled={isPrevMonthDisabled()}
                            className="p-1 rounded-lg text-stone-400 hover:text-[#764229] disabled:opacity-25 disabled:cursor-not-allowed transition-colors active:scale-[0.92]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-serif font-semibold text-[#4a2815] capitalize">
                            {MONTHS_ES[calMonth]} {calYear}
                          </span>
                          <button
                            type="button"
                            onClick={goNextMonth}
                            className="p-1 rounded-lg text-stone-400 hover:text-[#764229] transition-colors active:scale-[0.92]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Cabecera de días de la semana */}
                        <div className="grid grid-cols-7 text-center">
                          {DAYS_ES.map(d => (
                            <span key={d} className="text-[9px] font-sans font-bold text-stone-400 uppercase py-1">
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Celdas del calendario */}
                        <div className="grid grid-cols-7 gap-1">
                          {calCells().map((day, i) => {
                            if (!day) return <div key={`e-${i}`} />;
                            const raw      = fmtRaw(calYear, calMonth, day);
                            const disabled = isDateDisabled(calYear, calMonth, day);
                            const isToday  = raw === todayRaw;
                            const isSelected = raw === selectedDate;
                            return (
                              <button
                                key={raw}
                                type="button"
                                disabled={disabled}
                                onClick={() => handleSelectDate(day)}
                                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-sans transition-[background-color,color,transform] duration-150
                                  ${isSelected
                                    ? 'bg-[#764229] text-white font-bold shadow-md'
                                    : disabled
                                    ? 'text-stone-300 cursor-not-allowed'
                                    : isToday
                                    ? 'border border-[#764229]/40 text-[#764229] font-semibold hover:bg-[#efe6dc]/60'
                                    : 'text-stone-700 hover:bg-[#efe6dc]/50 active:scale-[0.94]'
                                  }`}
                              >
                                <span className="leading-none">{day}</span>
                                {isToday && !isSelected && (
                                  <span className="w-1 h-1 rounded-full bg-[#764229] mt-0.5 block" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── Horarios disponibles ── */}
                      <div className="space-y-2 pt-1 border-t border-[#efe6dc]">
                        <div className="flex items-center justify-between pt-2">
                          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#4a2815]">
                            Horarios Disponibles
                          </label>
                          {loadingSlots && (
                            <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                              <Loader2 className="w-3 h-3 animate-spin" /> verificando...
                            </span>
                          )}
                        </div>

                        {!selectedDate ? (
                          <p className="text-xs text-stone-400 font-serif italic py-2">
                            Selecciona una fecha para ver los horarios disponibles.
                          </p>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {timesList.map((t) => {
                                const unavailable = !isSlotAvailable(t, effectiveDuration, bookedSlots)
                                                 || isTimePast(t);
                                const isSelected  = selectedTime === t;
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    disabled={unavailable || loadingSlots}
                                    onClick={() => !unavailable && setSelectedTime(t)}
                                    className={`py-3 px-2 rounded-xl text-center border text-xs font-mono transition-[background-color,border-color,opacity] duration-150 flex items-center justify-center gap-1.5
                                      ${unavailable
                                        ? 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed line-through'
                                        : isSelected
                                        ? 'bg-[#efe6dc] border-[#764229] text-[#4a2815] font-semibold shadow-sm'
                                        : 'bg-white border-[#efe6dc] hover:border-stone-300 text-stone-600 cursor-pointer active:scale-[0.96]'
                                      }`}
                                  >
                                    <Clock className={`w-3 h-3 flex-shrink-0 ${unavailable ? 'text-stone-300' : 'text-[#5e6c58] opacity-70'}`} />
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-stone-400 font-serif italic">
                              Horarios sin disponibilidad en gris · mín. {SESSION_BUFFER} min entre sesiones · último turno: {timesList[timesList.length - 1]}
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── PASO 4: DATOS DE CONTACTO ── */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: direction * 20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, x: direction * -20, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
                      className="space-y-4"
                    >
                      <p className="text-xs text-stone-500 font-serif italic">
                        Proporciona los datos del huésped para completar el registro de la sesión:
                      </p>
                      <form onSubmit={handleConfirmReservation} className="space-y-4">
                        {/* Resumen de reserva con desglose de anticipo */}
                        <div className="bg-white border border-[#efe6dc] rounded-xl overflow-hidden text-xs">
                          {/* Fila principal del ritual */}
                          <div className="p-4 flex gap-3 leading-normal">
                            <img src={selectedRitual?.imageUrl} alt="ritual" referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="font-serif font-bold text-[#4a2815] block truncate">{selectedRitual?.name}</span>
                              {canHaveAuraAddon && withAuraAddon && (
                                <span className="text-[9px] font-sans font-semibold text-[#764229] flex items-center gap-1 mt-0.5">
                                  <Sparkles className="w-2.5 h-2.5" /> Facial AURA incluido · +30 min
                                </span>
                              )}
                              <span className="text-[10px] text-stone-500 block mt-0.5">Especialista: {selectedSpecialist?.name}</span>
                              <span className="text-[10px] text-stone-500 block font-mono">
                                {selectedDate ? fmtDisplay(selectedDate) : '—'} · {selectedTime}
                              </span>
                            </div>
                            <span className="ml-auto font-serif font-bold text-[#764229] text-sm flex-shrink-0">${effectivePrice} MXN</span>
                          </div>
                          {/* Desglose anticipo / evaluación gratuita */}
                          {selectedRitual && (
                            <div className={`px-4 py-3 border-t border-[#efe6dc] flex items-center justify-between ${
                              selectedRitual.customQuote
                                ? 'bg-sky-50/60'
                                : depositPct(selectedRitual.id) > 0
                                ? 'bg-amber-50/60'
                                : 'bg-emerald-50/40'
                            }`}>
                              {selectedRitual.customQuote ? (
                                <>
                                  <div>
                                    <span className="font-sans font-semibold text-sky-800 block">
                                      Esta es una cita de evaluación gratuita
                                    </span>
                                    <span className="text-[10px] text-sky-700/70 leading-relaxed">
                                      Anel evaluará tu caso y te dará un presupuesto personalizado sin compromiso
                                    </span>
                                  </div>
                                  <span className="font-serif font-bold text-sky-700 text-base ml-4 flex-shrink-0">
                                    Gratis
                                  </span>
                                </>
                              ) : depositPct(selectedRitual.id) > 0 ? (
                                <>
                                  <div>
                                    <span className="font-sans font-semibold text-amber-800 block">
                                      Anticipo requerido — {depositPct(selectedRitual.id)}%
                                    </span>
                                    <span className="text-[10px] text-amber-700/70">Resto se paga al llegar al salón</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-serif font-bold text-amber-800 text-base block">
                                      ${depositAmt(selectedRitual.id, effectivePrice)} MXN
                                    </span>
                                    <span className="text-[9px] text-stone-400 font-mono">
                                      Resto: ${effectivePrice - depositAmt(selectedRitual.id, effectivePrice)} MXN
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="font-sans font-semibold text-emerald-700">Sin anticipo</span>
                                  <span className="text-[10px] text-emerald-700/70">Pago completo al llegar</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Nombre del Huésped</label>
                          <input type="text" required placeholder="Ej. Heberto R. G."
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229]" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Correo Electrónico</label>
                          <input type="email" required placeholder="Ej. heberto@gmail.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229]" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">
                            Alergias o Notas de la Piel (Opcional)
                          </label>
                          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                            placeholder="Cuéntanos sobre sensibilidades cutáneas, zonas secas o preferencias de presión..."
                            className="w-full p-3 text-xs rounded-xl border border-[#efe6dc] bg-white focus:outline-none focus:border-[#764229] resize-none" />
                        </div>

                        <button type="submit" className="hidden" id="booking-submit-trigger" />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Footer de acciones */}
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
                      else handleConfirmReservation(e as unknown as FormEvent);
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
