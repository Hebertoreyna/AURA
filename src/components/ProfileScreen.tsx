import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Trash2, ShieldCheck, DollarSign, Sparkles, 
  CheckCircle2, XCircle, Search, MessageSquare, Check, Eye,
  Lock, ArrowRight, LogOut, Info, AlertTriangle
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
  onDeleteAppointment?: (id: string) => void;
  skinProfile: SkinProfile;
  orders: OrderHistoryRecord[];
  userAvatar: string;
  onNavigateToTab: (tabId: 'refine' | 'rituals' | 'shop' | 'profile') => void;
}

export default function ProfileScreen({
  appointments,
  onCancelAppointment,
  onUpdateAppointmentStatus,
  onUpdateAppointmentNotes,
  onDeleteAppointment,
}: ProfileScreenProps) {
  // Master authentication passcode for administration block (configurable via env)
  const MASTER_PIN = (import.meta as any).env?.VITE_ADMIN_PIN || '2026';
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Admin search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  
  // Note inline editing dictionary
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  
  // Id of appointment targeted for permanent removal from DB
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check persistent login session on load ("este desde donde entre tiene mi sesion")
  useEffect(() => {
    const sessionToken = localStorage.getItem('aura_admin_session');
    if (sessionToken === 'authenticated_aura_admin') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === MASTER_PIN) {
      localStorage.setItem('aura_admin_session', 'authenticated_aura_admin');
      setIsAuthenticated(true);
      setLoginError(null);
      setPasscodeInput('');
    } else {
      setLoginError('PIN administrativo incorrecto. Intente de nuevo.');
      setPasscodeInput('');
    }
  };

  // Keyboard PIN button pad assistant
  const handlePinPadClick = (num: string) => {
    setLoginError(null);
    if (passcodeInput.length < 4) {
      setPasscodeInput(prev => prev + num);
    }
  };

  const handlePinPadClear = () => {
    setPasscodeInput('');
  };

  const handleSignOut = () => {
    localStorage.removeItem('aura_admin_session');
    setIsAuthenticated(false);
  };

  // Admin Dashboard stats calculations (over ALL bookings in collection)
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
      // Clean local notes info so button goes back to passive state
      const updated = { ...localNotes };
      delete updated[aptId];
      setLocalNotes(updated);
    }
  };

  // Permanent document delete handler (Remueve definitivamente de Firestore)
  const handleExecuteDelete = (id: string) => {
    if (onDeleteAppointment) {
      onDeleteAppointment(id);
    }
    setDeletingId(null);
  };

  return (
    <div id="admin-control-center" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto min-h-[85vh] pb-24 font-sans">
      <AnimatePresence mode="wait">
        
        {/* ========================================== */}
        {/* VIEW A: SECURE LOGIN FORM                  */}
        {/* ========================================== */}
        {!isAuthenticated ? (
          <motion.div
            key="secure-login-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-[#efe6dc] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#764229]/10 rounded-full flex items-center justify-center text-[#764229] mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4a2815]">Santuario AURA</h2>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Acceso reservado únicamente para terapeutas y personal de administración.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5 text-center">
                <label className="text-[10px] font-sans font-bold tracking-widest text-[#764229] uppercase">
                  Código de Seguridad PIN
                </label>
                
                {/* Visual dots placeholder indicators */}
                <div className="flex justify-center gap-3 py-3">
                  {[1, 2, 3, 4].map((dotIndex) => (
                    <div 
                      key={dotIndex}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        passcodeInput.length >= dotIndex 
                          ? 'bg-[#764229] border-[#764229] scale-110 shadow-xs' 
                          : 'bg-stone-50 border-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <input
                  type="password"
                  maxLength={4}
                  readOnly
                  value={passcodeInput}
                  placeholder="PIN administrativo"
                  className="hidden" // hidden, interaction is managed via visual keypad for premium mobile touch feel
                />
              </div>

              {loginError && (
                <div className="bg-rose-50 text-rose-700 text-[11px] p-2.5 rounded-lg border border-rose-200 text-center font-medium flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {loginError}
                </div>
              )}

              {/* PREMIUM KEYPAD GRID */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinPadClick(num)}
                    className="h-12 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#764229]/5 text-stone-700 hover:text-[#764229] font-serif font-bold text-lg flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handlePinPadClear}
                  className="h-12 rounded-full text-stone-400 hover:text-rose-600 font-sans text-xs flex items-center justify-center transition-colors uppercase font-bold tracking-wider cursor-pointer"
                >
                  Limpiar
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePinPadClick('0')}
                  className="h-12 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#764229]/5 text-stone-700 hover:text-[#764229] font-serif font-bold text-lg flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  0
                </button>

                <button
                  type="submit"
                  disabled={passcodeInput.length < 4}
                  className={`h-12 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                    passcodeInput.length === 4 
                      ? 'bg-[#5e6c58] text-white hover:bg-[#4b5746]' 
                      : 'bg-stone-100 text-stone-300 pointer-events-none'
                  }`}
                  aria-label="Submit passcode"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Secure note for staff */}
              <div className="pt-4 border-t border-dashed border-[#efe6dc] text-center font-sans">
                <p className="text-[10px] text-stone-400">
                  <span className="font-semibold text-stone-500">Aviso:</span> Conexión cifrada de uso exclusivo de AURA. Se registrará la dirección IP y el navegador al iniciar sesión.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          
          /* ========================================== */
          /* VIEW B: FULL ADMINISTRATIVE WORKSPACE      */
          /* ========================================== */
          <motion.div
            key="admin-management-module"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-stone-800"
          >
            {/* WORKSPACE HEADER BAR */}
            <div className="bg-gradient-to-r from-[#4a2815] to-[#2c1d11] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#4a2815] shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f4eae1]/10 border border-[#efe6dc]/20 flex items-center justify-center text-[#f4eae1]">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg">Panel de Administración AURA</h3>
                  <p className="text-[10px] sm:text-xs text-[#efe6dc]/70 font-mono">Control de Reservaciones & Wellness Skincare</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider text-stone-300 hover:text-white border border-stone-500/30 hover:border-white rounded-lg flex items-center gap-2 transition-all cursor-pointer self-stretch sm:self-auto justify-center bg-white/5 hover:bg-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {/* ADMIN KPI METRICS DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#5e6c58]" /> Estimado Mensual
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#4a2815] mt-1">${estimatedRevenue}</p>
                <span className="text-[9px] text-[#5e6c58] font-semibold mt-0.5 block">Excluye cancelados</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Totales
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mt-1">{totalBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Registros en base de datos</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#764229]" /> Por Atender (Activos)
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#5e6c58] mt-1">{activeBookings}</p>
                <span className="text-[9px] text-[#5e6c58] font-semibold mt-0.5 block">Citas activas</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#efe6dc] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-500" /> Cancelados
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-rose-600 mt-1">{cancelledBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Omitidos o descartados</span>
              </div>
            </div>

            {/* FILTER SEARCH AND CALENDAR RECORDS BOARD */}
            <div className="bg-white rounded-xl border border-[#efe6dc] p-5 space-y-4 shadow-2xs">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <h4 className="text-xs font-sans font-bold tracking-wider text-[#4a2815] uppercase self-start flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#764229]" />
                  Calendario Maestro AURA Skincare & Wellness
                </h4>
                
                {/* Search query frame */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Búsqueda rápida (nombre, ritual)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-[#efe6dc] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#764229]"
                  />
                </div>
              </div>

              {/* CRM status filter tabs bar */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#efe6dc]/50 pb-2">
                {[
                  { value: 'all', label: 'Todos los registros' },
                  { value: 'scheduled', label: 'Vigentes / Confirmadas' },
                  { value: 'completed', label: 'Completados' },
                  { value: 'cancelled', label: 'Canceladas ✖' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value as any)}
                    className={`px-3 py-1.5 text-[11px] font-sans font-bold tracking-wider rounded-lg uppercase cursor-pointer transition-colors ${
                      statusFilter === tab.value
                        ? 'bg-[#764229]/10 text-[#764229] border border-[#764229]/20 font-extrabold'
                        : 'text-stone-500 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* RECORDS LIST BOARD */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 text-stone-500 font-serif italic space-y-2">
                  <Calendar className="w-10 h-10 text-stone-300 mx-auto stroke-1 mb-2" />
                  <p className="text-sm">No se encontraron citas que coincidan con la búsqueda actual.</p>
                  <p className="text-[11px] font-sans uppercase tracking-[0.1em] text-stone-400">Pruebe limpiando el campo de búsqueda</p>
                </div>
              ) : (
                <div className="divide-y divide-[#efe6dc]/50">
                  {filteredBookings.map((apt) => {
                    const currentNoteVal = localNotes[apt.id] !== undefined ? localNotes[apt.id] : (apt.notes || '');
                    const hasUnsavedNotes = localNotes[apt.id] !== undefined && localNotes[apt.id] !== (apt.notes || '');
                    const isConfirmingErase = deletingId === apt.id;
                    
                    return (
                      <div key={apt.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-4 justify-between items-start transition-all">
                        {/* LEFT DETAIL META */}
                        <div className="flex gap-4 items-start flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                            <img src={apt.ritualImageUrl} alt={apt.ritualName} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-serif font-bold text-stone-900 text-sm sm:text-base pr-2">{apt.ritualName}</h5>
                              
                              {/* Status pill styles in CRM */}
                              {apt.status === 'scheduled' && (
                                <span className="text-[9px] uppercase font-bold tracking-wider bg-[#5e6c58]/10 text-[#5e6c58] border border-[#5e6c58]/20 px-2 py-0.5 rounded-full">
                                  Vigente
                                </span>
                              )}
                              {apt.status === 'completed' && (
                                <span className="text-[9px] uppercase font-bold tracking-wider bg-indigo-550/10 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                  Atendido ✨
                                </span>
                              )}
                              {apt.status === 'cancelled' && (
                                <span className="text-[9px] uppercase font-bold tracking-wider bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                                  Cancelado
                                </span>
                              )}
                            </div>
                            
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-500 font-sans mt-1.5">
                              <p className="flex items-center gap-1 text-stone-700">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Huésped:</span>
                                <span className="font-semibold">{apt.clientName || 'Invitado Aura'}</span>
                              </p>
                              <p className="flex items-center gap-1 font-mono text-[11px] truncate">
                                <span className="text-stone-400">Email:</span>
                                <span className="text-stone-600">{apt.clientEmail || 'sin dirección'}</span>
                              </p>
                              <p className="flex items-center gap-1 text-[#764229] font-medium mt-0.5">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Horario Cita:</span>
                                <span>{apt.dateTime}</span>
                              </p>
                              <p className="flex items-center gap-1 text-stone-600">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Especialista:</span>
                                <span>{apt.specialistName || 'Especialista Aura'}</span>
                              </p>
                              <p className="flex items-center gap-1 text-stone-800 font-mono text-[11px]">
                                <span className="font-mono text-[9px] uppercase text-stone-400">Precio Servicio:</span>
                                <span className="font-bold">${apt.price || 0} MXN</span>
                              </p>
                            </div>

                            {/* SECURE CLINICAL NOTE EDITOR */}
                            <div className="mt-3.5 bg-stone-50 rounded-xl p-3 border border-[#efe6dc]/50 max-w-xl">
                              <span className="text-[9px] font-bold tracking-wider text-[#764229] uppercase flex items-center gap-1 mb-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Notas Clínicas de la Cita (Para Terapeutas):
                              </span>
                              <textarea
                                value={currentNoteVal}
                                onChange={(e) => handleNoteChangeLocal(apt.id, e.target.value)}
                                placeholder="Escribe aquí observaciones útiles (Ej. alergias, dolores de hombros, nivel de fuerza deseada, tipo de piel)..."
                                className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#764229] placeholder:italic"
                                rows={2}
                              />
                              {hasUnsavedNotes && (
                                <button
                                  onClick={() => handleSaveNotes(apt.id)}
                                  className="mt-2 px-3 py-1 bg-[#5e6c58] text-white font-sans text-[10px] font-bold uppercase rounded-md flex items-center gap-1 shadow-2xs hover:bg-[#4b5746] cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Guardar Notas de Terapeuta
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT ACTIONS BLOCK */}
                        <div className="flex md:flex-col gap-1.5 justify-end w-full md:w-44 pt-2 md:pt-0 self-stretch md:self-auto border-t md:border-t-0 border-stone-100 mt-2 md:mt-0">
                          
                          {/* 1. Complete booking action */}
                          {onUpdateAppointmentStatus && apt.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                              className="flex-1 md:flex-none px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-stone-200 flex items-center justify-center gap-1 cursor-pointer"
                              title="Marcar como Atendido / Completado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Atendido
                            </button>
                          )}

                          {/* 2. Reactive booking action */}
                          {onUpdateAppointmentStatus && apt.status !== 'scheduled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'scheduled')}
                              className="flex-1 md:flex-none px-3 py-2 bg-stone-50 hover:bg-stone-100 text-[#5e6c58] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#5e6c58]/30 flex items-center justify-center gap-1 cursor-pointer"
                              title="Colocar como reserva activa de nuevo"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Reactivar
                            </button>
                          )}

                          {/* 3. Cancel booking action */}
                          {onUpdateAppointmentStatus && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                              className="flex-1 md:flex-none px-3 py-2 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-stone-200 flex items-center justify-center gap-1 cursor-pointer"
                              title="Cancelar Reserva"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-500" /> Cancelar
                            </button>
                          )}

                          {/* 4. PERMANENT SYSTEM ERASE (BORRAR) */}
                          <div className="flex-1 md:flex-none mt-0 md:mt-2 border-l md:border-l-0 md:border-t border-stone-100 pt-0 md:pt-2 pl-2 md:p-0">
                            {isConfirmingErase ? (
                              <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-200 flex flex-col gap-1 items-center">
                                <span className="text-[8px] font-extrabold text-amber-800 text-center uppercase flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-500" /> ¿Eliminar de BD?
                                </span>
                                <div className="flex gap-1 w-full justify-center">
                                  <button
                                    onClick={() => handleExecuteDelete(apt.id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white font-sans text-[8px] font-bold uppercase py-1 px-2 rounded cursor-pointer"
                                  >
                                    Sí, borrar
                                  </button>
                                  <button
                                    onClick={() => setDeletingId(null)}
                                    className="bg-stone-200 text-stone-700 font-sans text-[8px] font-bold uppercase py-1 px-2 rounded cursor-pointer"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(apt.id)}
                                className="w-full px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-dashed border-rose-200 hover:border-rose-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                title="Borrar definitivamente de la Base de Datos"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Borrar de DB
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
