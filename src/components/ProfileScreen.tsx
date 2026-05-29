import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Trash2, Heart, Award, Package, Clock,
  ShieldCheck, DollarSign, Users, Sparkles, CheckCircle2, 
  XCircle, Search, MessageSquare, Check, Eye
} from 'lucide-react';
import { Appointment, SkinProfile } from '../types';

interface OrderHistoryRecord {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  itemsList: string;
}

interface ProfileScreenProps {
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
  onUpdateAppointmentStatus?: (id: string, status: 'scheduled' | 'completed' | 'cancelled') => void;
  onUpdateAppointmentNotes?: (id: string, notes: string) => void;
  skinProfile: SkinProfile;
  orders: OrderHistoryRecord[];
  userAvatar: string;
  onNavigateToTab: (tabId: 'refine' | 'rituals' | 'shop' | 'profile') => void;
}

const translateSkinType = (type: string) => {
  const types: Record<string, string> = {
    dry: 'Seca',
    oily: 'Grasa',
    sensitive: 'Sensible',
    combination: 'Mixta',
    normal: 'Normal'
  };
  return types[type.toLowerCase()] || type;
};

const translateConcern = (concern: string) => {
  const concerns: Record<string, string> = {
    dullness: 'Opacidad',
    fine_lines: 'Líneas finas',
    hydration: 'Deshidratación',
    redness: 'Enrojecimiento',
    congestion: 'Congestión',
    acne: 'Acné',
    spots: 'Manchas'
  };
  return concerns[concern.toLowerCase()] || concern;
};

const translateVibe = (vibe: string) => {
  const vibes: Record<string, string> = {
    minimalist: 'Minimalista (2 Pasos)',
    balanced: 'Equilibrada (4 Pasos)',
    immersive: 'Inmersiva (6 Pasos)'
  };
  return vibes[vibe.toLowerCase()] || vibe;
};

export default function ProfileScreen({
  appointments,
  onCancelAppointment,
  onUpdateAppointmentStatus,
  onUpdateAppointmentNotes,
  skinProfile,
  orders,
  userAvatar,
  onNavigateToTab
}: ProfileScreenProps) {
  // We default to true because Heberto is the page administrator
  const [isAdminMode, setIsAdminMode] = useState(true);
  
  // Admin search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  
  // Note inline editing dictionary
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});

  // 1. Calculate stats for standard client view (using Heberto.R.G@gmail.com specific subset)
  const myAppointments = appointments.filter(a => a.clientEmail === 'Heberto.R.G@gmail.com');
  const appointmentsPoints = myAppointments.reduce((sum, apt) => sum + (apt.status === 'scheduled' ? apt.price : 0), 0);
  const purchasePoints = orders.reduce((sum, ord) => sum + Math.round(ord.total), 0);
  const totalPoints = 120 + appointmentsPoints + purchasePoints; // 120 base loyalty points

  const getLoyaltyTier = (pts: number) => {
    if (pts > 400) return { name: 'Élite del Santuario Iris Dorado', perk: 'Sesiones de vapor de 30 minutos gratis y 15% de descuento en la tienda' };
    if (pts > 200) return { name: 'Socio de Loto Plateado', perk: 'Brumas activas de cortesía y prioridad para reservar citas' };
    return { name: 'Practicante de Salvia de Bronce', perk: '1 punto de bonificación por cada visita e informe mensual de seguimiento' };
  };

  const currentTier = getLoyaltyTier(totalPoints);

  // 2. Admin Dashboard stats calculations (over ALL bookings)
  const totalBookings = appointments.length;
  const activeBookings = appointments.filter(a => a.status === 'scheduled').length;
  const completedBookings = appointments.filter(a => a.status === 'completed').length;
  const cancelledBookings = appointments.filter(a => a.status === 'cancelled').length;
  
  const estimatedRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.price, 0);

  // Filter based on search criteria and state
  const filteredBookings = appointments.filter(apt => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (apt.clientName || '').toLowerCase().includes(term) ||
      (apt.clientEmail || '').toLowerCase().includes(term) ||
      (apt.ritualName || '').toLowerCase().includes(term) ||
      (apt.specialistName || '').toLowerCase().includes(term);
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && apt.status === statusFilter;
  });

  // Handle local note changes before saving
  const handleNoteChangeLocal = (aptId: string, notes: string) => {
    setLocalNotes(prev => ({ ...prev, [aptId]: notes }));
  };

  const handleSaveNotes = (aptId: string) => {
    const notes = localNotes[aptId];
    if (onUpdateAppointmentNotes && notes !== undefined) {
      onUpdateAppointmentNotes(aptId, notes);
      // Clean local notes dictionary key so button hides
      const updated = { ...localNotes };
      delete updated[aptId];
      setLocalNotes(updated);
    }
  };

  return (
    <div id="profile-screen" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto min-h-[90vh] space-y-6 pb-24">
      
      {/* VIEW SELECTOR TOGGLE (Premium golden glass box) */}
      <div className="bg-gradient-to-r from-[#efe6dc] to-[#f5ebdf] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#e3d5c5] shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#764229]/10 flex items-center justify-center text-[#764229]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#4a2815] text-sm sm:text-base">Centro de Acceso Privado</h3>
            <p className="text-[10px] sm:text-xs text-stone-500 font-mono">Modo de rol: Heberto Reyna ({isAdminMode ? 'Administrador' : 'Huésped'})</p>
          </div>
        </div>
        
        <div className="bg-white/80 p-1 rounded-full border border-[#efe6dc] flex gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !isAdminMode 
                ? 'bg-[#764229] text-white shadow-sm' 
                : 'text-stone-400 hover:text-[#764229]'
            }`}
          >
            Vista Huésped
          </button>
          <button
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isAdminMode 
                ? 'bg-[#5e6c58] text-white shadow-sm' 
                : 'text-stone-400 hover:text-[#5e6c58]'
            }`}
          >
            Administrar Aura
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* VIEW 1: ADMIN WORKSPACE PANEL */}
        {/* ========================================================================= */}
        {isAdminMode ? (
          <motion.div
            key="admin-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* ADMIN KPI METRICS DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#5e6c58]" /> Estimado Aura
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#4a2815] mt-1">${estimatedRevenue}</p>
                <span className="text-[9px] text-[#5e6c58] font-semibold mt-0.5 block">Vigente + Completado</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Totales
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mt-1">{totalBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Historial en Firestore</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#764229]" /> Por Atender
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#5e6c58] mt-1">{activeBookings}</p>
                <span className="text-[9px] text-[#5e6c58] font-semibold mt-0.5 block">Citas programadas</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-stone-400" /> Cerradas / Cancel
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mt-1">{completedBookings + cancelledBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Finalizadas u omitidas</span>
              </div>
            </div>

            {/* FILTER SEARCH AND METRICS */}
            <div className="bg-white rounded-xl border border-[#efe6dc] p-5 space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <h4 className="text-xs font-sans font-bold tracking-wider text-[#4a2815] uppercase self-start flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#764229]" />
                  Calendario de Reservas Aura Skincare & Wellness
                </h4>
                
                {/* Search query frame */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por huésped, ritual, terapeuta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-[#efe6dc] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#764229]"
                  />
                </div>
              </div>

              {/* CRM status filter tabs bar */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#efe6dc]/50 pb-2">
                {[
                  { value: 'all', label: 'Todas las reservaciones' },
                  { value: 'scheduled', label: 'Vigentes / Confirmadas' },
                  { value: 'completed', label: 'Completadas ✨' },
                  { value: 'cancelled', label: 'Canceladas ✖' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value as any)}
                    className={`px-3 py-1.5 text-[11px] font-sans font-bold tracking-wider rounded-lg uppercase cursor-pointer transition-colors ${
                      statusFilter === tab.value
                        ? 'bg-[#764229]/10 text-[#764229] border border-[#764229]/20'
                        : 'text-stone-500 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* LISTING RECORDS IN CRM BOARD */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 text-stone-500 font-serif italic space-y-2">
                  <Calendar className="w-10 h-10 text-stone-300 mx-auto stroke-1 mb-2" />
                  <p className="text-sm">No se encontraron reservaciones que coincidan con los filtros aplicados.</p>
                  <p className="text-[11px] font-sans uppercase tracking-[0.1em] text-stone-400">Verifique los términos de búsqueda</p>
                </div>
              ) : (
                <div className="divide-y divide-[#efe6dc]/50">
                  {filteredBookings.map((apt) => {
                    const currentNoteVal = localNotes[apt.id] !== undefined ? localNotes[apt.id] : (apt.notes || '');
                    const hasUnsavedNotes = localNotes[apt.id] !== undefined && localNotes[apt.id] !== (apt.notes || '');
                    
                    return (
                      <div key={apt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-4 justify-between items-start">
                        {/* LEFT: Ritual and Booking metadata details */}
                        <div className="flex gap-3.5 items-start flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                            <img src={apt.ritualImageUrl} alt={apt.ritualName} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="font-serif font-bold text-stone-900 text-sm sm:text-base pr-2">{apt.ritualName}</h5>
                              
                              {/* Pill indicators for status */}
                              {apt.status === 'scheduled' && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#5e6c58]/10 text-[#5e6c58] border border-[#5e6c58]/20 px-2 py-0.5 rounded-full">
                                  Vigente / Confirmado
                                </span>
                              )}
                              {apt.status === 'completed' && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                  Completado
                                </span>
                              )}
                              {apt.status === 'cancelled' && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                                  Cancelado
                                </span>
                              )}
                            </div>
                            
                            {/* Personal client details info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-500 font-sans mt-1">
                              <p className="flex items-center gap-1 font-semibold text-stone-700">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Huésped:</span>
                                {apt.clientName}
                              </p>
                              <p className="flex items-center gap-1 font-mono text-[11px] truncate">
                                <span className="text-stone-400">Email:</span>
                                {apt.clientEmail}
                              </p>
                              <p className="flex items-center gap-1 font-medium mt-0.5 text-stone-600">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Horario:</span>
                                {apt.dateTime}
                              </p>
                              <p className="flex items-center gap-1 font-medium text-stone-600">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Especialista:</span>
                                {apt.specialistName}
                              </p>
                            </div>

                            {/* INLINE CLIENT SESSION CLINICAL NOTES */}
                            <div className="mt-3 bg-stone-50 rounded-lg p-2.5 border border-[#efe6dc]/50 max-w-xl">
                              <span className="text-[9px] font-bold tracking-wider text-[#764229] uppercase flex items-center gap-1 mb-1">
                                <MessageSquare className="w-3.5 h-3.5" /> Notas Internas de la Cita (Para Terapeutas):
                              </span>
                              <textarea
                                value={currentNoteVal}
                                onChange={(e) => handleNoteChangeLocal(apt.id, e.target.value)}
                                placeholder="Escribe aquí observaciones útiles (Ej. alergias, dolores de hombros, nivel de fuerza deseada)..."
                                className="w-full text-xs bg-white border border-stone-200 rounded p-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#764229] placeholder:italic"
                                rows={2}
                              />
                              {hasUnsavedNotes && (
                                <button
                                  onClick={() => handleSaveNotes(apt.id)}
                                  className="mt-1.5 px-3 py-1 bg-[#5e6c58] text-white font-sans text-[10px] font-bold uppercase rounded-md flex items-center gap-1 shadow-2xs hover:bg-[#4b5746] cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Guardar Nota
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Status modifier Actions buttons */}
                        <div className="flex md:flex-col gap-1.5 justify-end w-full md:w-auto pt-2 md:pt-0 self-stretch md:self-auto border-t md:border-t-0 border-stone-100/80">
                          {onUpdateAppointmentStatus && apt.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                              className="flex-1 md:flex-none px-3 py-1.5 bg-indigo-550 hover:bg-indigo-600 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-indigo-200 flex items-center justify-center gap-1 cursor-pointer bg-stone-50 hover:bg-stone-100"
                              title="Marcar como Completado/Atendido"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Atendido
                            </button>
                          )}
                          
                          {onUpdateAppointmentStatus && apt.status !== 'scheduled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'scheduled')}
                              className="flex-1 md:flex-none px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-[#5e6c58] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#5e6c58]/30 flex items-center justify-center gap-1 cursor-pointer"
                              title="Colocar de nuevo como reservación activa"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Reactivar
                            </button>
                          )}

                          {onUpdateAppointmentStatus && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                              className="flex-1 md:flex-none px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-rose-200 flex items-center justify-center gap-1 cursor-pointer"
                              title="Cancelar Reserva"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: STANDARD CLIENT LEDGER DETAILS & HISTORY */
          /* ========================================================================= */
          <motion.div
            key="client-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* 1. GUEST USER HEADER */}
            <div id="profile-user-card" className="bg-white rounded-xl border border-[#efe6dc] p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
              <div className="w-20 h-20 rounded-full border-2 border-[#764229] overflow-hidden bg-[#efe6dc] flex-shrink-0 shadow-sm">
                <img
                  src={userAvatar}
                  alt="User profile avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center sm:text-left flex-1 font-sans">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#764229] uppercase font-sans">Registro de Huéspedes</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#4a2815] font-semibold">Heberto R. G.</h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Heberto.R.G@gmail.com</p>
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className="text-[10px] uppercase font-sans font-extrabold bg-[#5e6c58]/10 text-[#5e6c58] px-3 py-1 rounded-full border border-[#5e6c58]/20 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Categoría {currentTier.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-mono bg-stone-100 text-stone-600 px-3 py-1 rounded-full border border-stone-200">
                    Puntos Aura: {totalPoints}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SKIN ALIGNMENT SUMMARY BLOCK */}
            <div id="profile-skin-prescription" className="bg-[#f4eae1]/40 border border-[#efe6dc]/70 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase">
                  Alineación Cutánea Activa
                </h4>
                <button
                  id="profile-retake-quiz-btn"
                  onClick={() => onNavigateToTab('refine')}
                  className="text-[10px] font-sans font-bold text-[#764229] uppercase border-b border-[#764229] cursor-pointer"
                >
                  {skinProfile.completed ? 'Rehacer Análisis' : 'Hacer Análisis de Piel'}
                </button>
              </div>

              {skinProfile.completed ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50 font-sans">
                    <span className="text-[9px] font-mono text-stone-400 commerce-brand uppercase">Estado Dérmico</span>
                    <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateSkinType(skinProfile.skinType)}</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50 font-sans">
                    <span className="text-[9px] font-mono text-stone-400 commerce-brand uppercase">Problema Principal</span>
                    <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateConcern(skinProfile.concern)}</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50 font-sans">
                    <span className="text-[9px] font-mono text-stone-400 commerce-brand uppercase">Estilo de Rutina</span>
                    <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateVibe(skinProfile.vibe)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-white/50 border border-dashed border-[#efe6dc] rounded-lg">
                  <p className="text-xs text-stone-600 italic font-serif">Aún no has completado tu análisis de piel.</p>
                  <p className="text-[10px] text-stone-500 mt-1 max-w-sm mx-auto font-sans">
                    Nuestro análisis personalizado identifica los servicios y activos ideales para las necesidades únicas de tu piel.
                  </p>
                </div>
              )}
            </div>

            {/* 3. UPCOMING RESERVATIONS LIST */}
            <div id="profile-appointments-sec" className="space-y-3">
              <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#764229]" />
                Mis Próximas Reservaciones de Spa
              </h4>

              {myAppointments.filter(a => a.status === 'scheduled').length === 0 ? (
                <div className="text-center py-10 bg-white border border-[#efe6dc]/50 rounded-xl space-y-2">
                  <Clock className="w-10 h-10 text-stone-300 mx-auto stroke-1" />
                  <p className="text-xs text-stone-500 italic font-serif">No cuentas con reservaciones programadas para servicios.</p>
                  <button
                    id="profile-empty-book-btn"
                    onClick={() => onNavigateToTab('rituals')}
                    className="py-1.5 px-4 bg-transparent border border-[#764229] hover:bg-[#764229] text-[#764229] hover:text-white text-[10px] font-sans font-bold tracking-wider rounded-lg uppercase transition-all cursor-pointer"
                  >
                    Reservar un Servicio
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAppointments.filter(a => a.status === 'scheduled').map((apt) => (
                    <div
                      key={apt.id}
                      id={`upcoming-reservation-${apt.id}`}
                      className="bg-white rounded-xl border border-[#efe6dc] overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="p-4 flex gap-3 text-sans">
                        <div className="w-14 h-14 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={apt.ritualImageUrl}
                            alt={apt.ritualName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-serif font-bold text-[#4a2815]">{apt.ritualName}</h5>
                          <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#5e6c58]" /> {apt.duration} Min • ${apt.price}
                          </p>
                          <div className="flex gap-1.5 items-center mt-2 bg-[#faf6f0] p-1.5 rounded border border-[#efe6dc]/50">
                            <img
                              src={apt.specialistAvatar}
                              alt="especialista"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-[9px] text-[#764229] font-sans font-semibold">Terapeuta: {apt.specialistName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Calendar summary bottom bar */}
                      <div className="bg-stone-50 p-3 px-4 flex justify-between items-center border-t border-stone-100">
                        <span className="text-[10px] font-mono text-stone-600 font-bold block bg-white px-2.5 py-1 rounded border border-[#efe6dc]/80">
                          {apt.dateTime}
                        </span>
                        
                        <button
                          id={`cancel-reservation-btn-${apt.id}`}
                          onClick={() => onCancelAppointment(apt.id)}
                          className="p-1.5 rounded-full hover:bg-[#8a4f35]/15 text-stone-400 hover:text-[#8a4f35] transition-colors flex items-center gap-1 hover:font-bold text-[10px] font-sans uppercase tracking-widest bg-stone-100/50 hover:bg-stone-100 cursor-pointer"
                          title="Cancelar Cita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. PURCHASE ORDER HISTORY RECORDS */}
            <div id="profile-orders-sec" className="space-y-3">
              <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#764229]" />
                Historial de Pedidos de Productos
              </h4>

              {orders.length === 0 ? (
                <div className="text-center py-10 bg-white border border-[#efe6dc]/50 rounded-xl">
                  <p className="text-xs text-stone-500 italic font-serif">Aún no cuenta con registro de compras.</p>
                </div>
              ) : (
                <div className="bg-white border border-[#efe6dc] rounded-xl overflow-hidden shadow-xs divide-y divide-[#efe6dc]/60">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      id={`order-history-${ord.id}`}
                      className="p-4 flex justify-between items-center gap-4 text-xs font-sans"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 items-baseline flex-wrap">
                          <span className="font-mono font-bold text-stone-800 uppercase text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">{ord.id}</span>
                          <span className="text-stone-400 font-mono text-[10px]">{ord.date}</span>
                        </div>
                        <p className="text-stone-600 mt-1 truncation text-[11px] leading-relaxed max-w-sm">
                          {ord.itemsList}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-serif font-bold text-[#764229] text-base block">${ord.total.toFixed(2)}</span>
                        <span className="text-[9px] font-mono text-[#5e6c58] bg-[#efe6dc]/20 px-2 py-0.5 rounded border border-[#efe6dc]/50 font-semibold uppercase font-sans">Despachado</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. LOYALTY TIER BENEFITS PERK CARD */}
            <div id="profile-loyalty-tier-card" className="bg-gradient-to-br from-[#4a2815] to-stone-900 rounded-xl p-6 text-white shadow-xl space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#764229] flex items-center justify-center text-[#efe6dc]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#efe6dc] opacity-90 block">Beneficio de Nivel Activo</span>
                  <h5 className="font-serif text-lg font-bold">{currentTier.name}</h5>
                </div>
              </div>

              <p className="text-xs text-stone-200 leading-relaxed font-serif italic">
                "{currentTier.perk}"
              </p>

              {/* Loyalty progress meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] font-mono text-[#efe6dc] font-semibold">
                  <span>Mis Puntos: {totalPoints}</span>
                  <span>Próximo Nivel (Nivel Oro Rosa): 450 pts</span>
                </div>
                <div className="w-full h-1.5 bg-stone-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#efe6dc] to-white rounded-full"
                    style={{ width: `${Math.min((totalPoints / 450) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
