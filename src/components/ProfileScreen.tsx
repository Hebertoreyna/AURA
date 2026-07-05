import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Trash2, ShieldCheck, DollarSign, Sparkles, 
  CheckCircle2, XCircle, Search, MessageSquare, Check, Eye,
  Lock, ArrowRight, LogOut, Info, AlertTriangle, ChevronLeft, ChevronRight,
  Download, Share2, Palette, Clock, Sliders, CheckSquare, Gift, Heart, Tag, User, SlidersHorizontal
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Appointment, SkinProfile } from '../types';
import { RITUALS } from '../data';
import { ServiceVisual } from './ServiceIcon';

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
  // Autenticación real vía Firebase Auth (email/contraseña del personal AURA)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Admin search and list filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  
  // Interactive Monthly Calendar states
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null); // "YYYY-MM-DD" style
  
  // Note inline editing dictionary
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  
  // Id of appointment targeted for permanent removal from DB
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Administrative workspace subtab state
  const [adminSubTab, setAdminSubTab] = useState<'appointments' | 'serviceCards'>('appointments');

  // Interactive Fichas generator configurations
  const [selectedRitualForCard, setSelectedRitualForCard] = useState<any | null>(null);
  const [selectedCardTheme, setSelectedCardTheme] = useState<string>('champagne');
  const [customPriceVal, setCustomPriceVal] = useState<string>('');
  const [customFootnoteVal, setCustomFootnoteVal] = useState<string>('Reserva vía WhatsApp: 638 128 5959');
  const [customDiscountText, setCustomDiscountText] = useState<string>('Piel saludable y luminosa desde la primera sesión');
  const [assignedSpecialist, setAssignedSpecialist] = useState<string>('Atendido por Anel, Licenciada en Cosmetología Aura');

  // Catalog filtering within Card Generator block
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<'all' | 'cabina' | 'maquillaje'>('all');

  const previewRef = useRef<HTMLDivElement>(null);

  const filteredCatalogRaw = RITUALS.filter(r => {
    const term = catalogSearch.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(term) || r.shortDescription.toLowerCase().includes(term);
    const matchesCategory = catalogCategory === 'all' ? true : r.category === catalogCategory;
    return matchesSearch && matchesCategory;
  });

  // Sesión persistente manejada por Firebase Auth (sobrevive recargas del navegador)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  // Login handler — valida credenciales contra Firebase Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setEmailInput('');
      setPasswordInput('');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/too-many-requests') {
        setLoginError('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
      } else if (code === 'auth/network-request-failed') {
        setLoginError('Sin conexión. Verifica tu internet e intenta de nuevo.');
      } else {
        setLoginError('Correo o contraseña incorrectos. Intente de nuevo.');
      }
      setPasswordInput('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out failed:', e);
    }
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

  // Filter based on search criteria, state, and calendar clicked date
  const filteredBookings = appointments.filter(apt => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (apt.clientName || '').toLowerCase().includes(term) ||
      (apt.clientEmail || '').toLowerCase().includes(term) ||
      (apt.ritualName || '').toLowerCase().includes(term) ||
      (apt.specialistName || '').toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'all' ? true : apt.status === statusFilter;
    const matchesCalendarDate = !selectedCalendarDate ? true : apt.rawDate === selectedCalendarDate;
    
    return matchesSearch && matchesStatus && matchesCalendarDate;
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

  // --- COMPARTIR CARD THEMES CONSTANT DEFINITIONS ---
  const CARD_THEMES = [
    {
      id: 'champagne',
      name: 'Champán Editorial',
      bgColor: '#FAF5EF',
      borderColor: '#C5A880',
      decorColor: '#C5A880',
      textColor: '#3D2517',
      mutedColor: '#756358',
      accentBg: '#e6f1ea',
      accentText: '#35755d',
      badgeClass: 'bg-[#e6f1ea] text-[#35755d]',
      cardClass: 'bg-[#FDFBF9] text-[#3D2517] border-[#C5A880]'
    },
    {
      id: 'jade',
      name: 'Jade Silvestre',
      bgColor: '#1E352F', // Deep forest green
      borderColor: '#D4AF37', // Gleaming gold
      decorColor: '#D4AF37',
      textColor: '#F3ECE3',
      mutedColor: '#A8B7A5',
      accentBg: '#2A463F',
      accentText: '#DBC380',
      badgeClass: 'bg-[#2A463F] text-[#DBC380]',
      cardClass: 'bg-[#243D36] text-[#F3ECE3] border-[#D4AF37]'
    },
    {
      id: 'obsidian',
      name: 'Obsidiana Satori',
      bgColor: '#121212', // Obsidian dark
      borderColor: '#D4AF37', // Gold divider
      decorColor: '#D4AF37',
      textColor: '#FFFFFF',
      mutedColor: '#9E9E9E',
      accentBg: '#222222',
      accentText: '#E6C687',
      badgeClass: 'bg-[#222222] text-[#E6C687]',
      cardClass: 'bg-[#181818] text-white border-[#D4AF37]'
    }
  ];

  const openFichaDesigner = (ritual: any) => {
    setSelectedRitualForCard(ritual);
    setSelectedCardTheme('champagne');
    setCustomPriceVal(ritual.customQuote ? 'Valoración Personalizada de Piel' : `$${ritual.price} MXN`);
    setCustomDiscountText(ritual.badge ? `Ritual con Sello AURA - ${ritual.badge}` : 'Piel saludable y luminosa desde la primera sesión');
    setCustomFootnoteVal('Agenda al WhatsApp: 638 128 5959');
    setAssignedSpecialist('Atendido por Anel, Licenciada en Cosmetología Aura');
  };

  const handleDownloadCard = () => {
    if (!selectedRitualForCard) return;

    // Create a high resolution canvas of 800x1000 representing the vertical postcard
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = CARD_THEMES.find(t => t.id === selectedCardTheme) || CARD_THEMES[0];

    // Smooth typography alias
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Fill base canvas background color
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, 800, 1000);

    // 2. Draw dual framed borders: Y=35, X=35
    ctx.strokeStyle = theme.borderColor;
    
    // Thin outer border
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 940);
    
    // Bold inner border
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 720, 920);

    // Star decorations/diamonds logic
    const drawDecorationSparkle = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.quadraticCurveTo(cx, cy, cx + 8, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + 8);
      ctx.quadraticCurveTo(cx, cy, cx - 8, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - 8);
      ctx.fillStyle = theme.decorColor;
      ctx.fill();
    };
    drawDecorationSparkle(40, 40);
    drawDecorationSparkle(760, 40);
    drawDecorationSparkle(40, 960);
    drawDecorationSparkle(760, 960);

    // 3. Header title line: A  U  R  A
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.textColor;
    
    // Use generic elegant font families
    ctx.font = 'normal 42px "Playfair Display", "Georgia", "Times New Roman", serif';
    ctx.fillText('A  U  R  A', 400, 110);

    // Subtitle tagline
    ctx.fillStyle = theme.mutedColor;
    ctx.font = 'bold 12px "Courier New", "JetBrains Mono", monospace';
    ctx.fillText('C O S M E T O L O G Í A   E   I M A G E N', 400, 150);

    // Thin luxury division line
    ctx.lineWidth = 1;
    ctx.strokeStyle = theme.borderColor;
    ctx.beginPath();
    ctx.moveTo(330, 180);
    ctx.lineTo(470, 180);
    ctx.stroke();

    // 4. Center therapeutic golden emblem shape
    ctx.strokeStyle = theme.decorColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(400, 270, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 270, 38, 0, Math.PI * 2);
    ctx.stroke();
    // Radiant sparks loops
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(400 + Math.cos(angle) * 14, 270 + Math.sin(angle) * 14);
      ctx.lineTo(400 + Math.cos(angle) * 38, 270 + Math.sin(angle) * 38);
      ctx.stroke();
    }

    // 5. Category label badge
    const badgeTxt = (selectedRitualForCard.badge || 'BIENESTAR EXCLUSIVO').toUpperCase();
    ctx.font = 'bold 11px "Helvetica", "Arial", sans-serif';
    const textWidth = ctx.measureText(badgeTxt).width;
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(400 - (textWidth + 20) / 2, 345, textWidth + 20, 24);
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(400 - (textWidth + 20) / 2, 345, textWidth + 20, 24);
    ctx.fillStyle = theme.textColor;
    ctx.fillText(badgeTxt, 400, 361);

    // 6. Title centered text
    ctx.fillStyle = theme.textColor;
    ctx.font = 'italic bold 36px "Georgia", "Times New Roman", serif';
    ctx.fillText(selectedRitualForCard.name, 400, 425);

    // 7. Value and scale price panel box
    ctx.fillStyle = theme.accentBg;
    ctx.fillRect(180, 480, 440, 85);
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(180, 480, 440, 85);
    
    // Duration
    ctx.fillStyle = theme.accentText;
    ctx.font = 'bold 13px "Helvetica", "Arial", sans-serif';
    ctx.fillText(`⏱   TERAPIA INDIVIDUAL DE ${selectedRitualForCard.duration} MINUTOS`, 400, 513);
    
    // Value price
    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 24px "Georgia", "Times New Roman", serif';
    const finalPriceStr = customPriceVal ? customPriceVal : `$${selectedRitualForCard.price} MXN`;
    ctx.fillText(finalPriceStr, 400, 547);

    // 8. Description wrapped text lines
    ctx.fillStyle = theme.mutedColor;
    ctx.font = 'italic 15px "Times New Roman", "Georgia", serif';
    
    // Inline utility function for safe canvas line wrapping
    const wrapCanvasText = (
      c: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ): number => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = c.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          c.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      c.fillText(line, x, currentY);
      return currentY + lineHeight;
    };

    const descriptionY = wrapCanvasText(
      ctx,
      `"${selectedRitualForCard.description || selectedRitualForCard.shortDescription}"`,
      400,
      605,
      565,
      22
    );

    // 9. Extra promo banner text line
    ctx.lineWidth = 1;
    ctx.strokeStyle = theme.borderColor;
    ctx.beginPath();
    ctx.moveTo(375, descriptionY + 12);
    ctx.lineTo(425, descriptionY + 12);
    ctx.stroke();

    ctx.fillStyle = theme.accentText;
    ctx.font = 'bold 15px "Helvetica", "Arial", sans-serif';
    ctx.fillText(customDiscountText.toUpperCase(), 400, descriptionY + 45);

    // 10. Footers
    ctx.fillStyle = theme.mutedColor;
    ctx.font = 'italic 13px "Georgia", "Times New Roman", serif';
    ctx.fillText(assignedSpecialist, 400, 815);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 14px "Helvetica", "Arial", sans-serif';
    ctx.fillText(customFootnoteVal.toUpperCase(), 400, 845);

    // Little typographic zen signoff
    ctx.font = 'normal 18px "Georgia", "Times New Roman", serif';
    ctx.fillStyle = theme.decorColor;
    ctx.fillText('✦   ✧   ✦', 400, 885);

    // Fire browser direct PNG save download trigger
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const element = document.createElement('a');
      element.download = `AURA_Ficha_${selectedRitualForCard.name.replace(/\s+/g, '_')}.png`;
      element.href = dataUrl;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error('Failed to export high-definition canvas:', e);
    }
  };

  // --- CALENDAR GENERATION LOGIC ---
  const handlePrevMonth = () => {
    setCurrentCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const generateMonthDays = () => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth(); // 0-indexed

    // Day of week of the first day (0=Sunday, 1=Monday... 6=Saturday)
    const firstDay = new Date(year, month, 1);
    
    // Map to Monday-first: Monday is 0, Tuesday is 1... Sunday is 6
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; 

    const numDaysInMonth = new Date(year, month + 1, 0).getDate();
    const daysList: { dateString: string; dayNum: number; isCurrentMonth: boolean; key: string }[] = [];

    // 1. Fill previous month padding days
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const numDaysInPrevMonth = new Date(prevMonthYear, prevMonthIdx + 1, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayVal = numDaysInPrevMonth - i;
      const dStr = `${prevMonthYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayVal).padStart(2, '0')}`;
      daysList.push({
        dateString: dStr,
        dayNum: dayVal,
        isCurrentMonth: false,
        key: `prev-${dayVal}`
      });
    }

    // 2. Fill current month days
    for (let i = 1; i <= numDaysInMonth; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      daysList.push({
        dateString: dStr,
        dayNum: i,
        isCurrentMonth: true,
        key: `curr-${i}`
      });
    }

    // 3. Fill next month padding days to complete 6-week layout grids (42 elements)
    const totalSlots = 42;
    const remainingSlots = totalSlots - daysList.length;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthIdx = month === 11 ? 0 : month + 1;

    for (let i = 1; i <= remainingSlots; i++) {
      const dStr = `${nextMonthYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      daysList.push({
        dateString: dStr,
        dayNum: i,
        isCurrentMonth: false,
        key: `next-${i}`
      });
    }

    return daysList;
  };

  const calendarDays = generateMonthDays();
  const monthNamesSpanish = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const displayedMonthLabel = `${monthNamesSpanish[currentCalendarMonth.getMonth()]} ${currentCalendarMonth.getFullYear()}`;

  // Formatter for calendar date selected indicator
  const formatCalendarDateSpanish = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="admin-control-center" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto min-h-[85vh] pb-24 font-sans">
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
            className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-[#dcebe2] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#35755d]/10 rounded-full flex items-center justify-center text-[#35755d] mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#23543f]">Santuario AURA</h2>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Acceso reservado únicamente para terapeutas y personal de administración.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="text-[10px] font-sans font-bold tracking-widest text-[#35755d] uppercase">
                  Correo del personal
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setLoginError(null); }}
                  placeholder="correo@aura.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#35755d] focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="text-[10px] font-sans font-bold tracking-widest text-[#35755d] uppercase">
                  Contraseña
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(null); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#35755d] focus:bg-white transition-colors"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-rose-50 text-rose-700 text-[11px] p-2.5 rounded-lg border border-rose-200 text-center font-medium flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={!emailInput || !passwordInput || isLoggingIn}
                className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-sans font-bold text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                  emailInput && passwordInput && !isLoggingIn
                    ? 'bg-[#45705f] text-white hover:bg-[#38594c]'
                    : 'bg-stone-100 text-stone-300 pointer-events-none'
                }`}
              >
                {isLoggingIn ? 'Verificando…' : <>Ingresar <ArrowRight className="w-4 h-4" /></>}
              </button>

              {/* Secure note for staff */}
              <div className="pt-4 border-t border-dashed border-[#dcebe2] text-center font-sans">
                <p className="text-[10px] text-stone-400">
                  <span className="font-semibold text-stone-500">Aviso:</span> Acceso protegido con Firebase Authentication, de uso exclusivo del personal de AURA. La sesión persistirá en este dispositivo hasta cerrar sesión.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          
          /* ========================================== */
          /* VIEW B: INTEGRATED ADMIN WORKSPACE         */
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
            <div className="bg-gradient-to-r from-[#23543f] to-[#142e24] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#23543f] shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e6f1ea]/10 border border-[#dcebe2]/20 flex items-center justify-center text-[#e6f1ea]">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg">Panel de Administración AURA</h3>
                  <p className="text-[10px] sm:text-xs text-[#dcebe2]/70 font-mono">Control de Reservaciones & Wellness Skincare</p>
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

            {/* TAB-SELECTION BAR FOR DUAL ADMINISTRATOR CONTROLS */}
            <div className="flex border-b border-[#dcebe2] pb-0.5 gap-2">
              <button
                onClick={() => setAdminSubTab('appointments')}
                className={`py-2.5 px-4 text-xs font-sans font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  adminSubTab === 'appointments'
                    ? 'border-[#35755d] text-[#35755d]'
                    : 'border-transparent text-stone-400 hover:text-stone-750'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#35755d]" />
                <span>Control de Citas</span>
              </button>
              <button
                id="admin-service-cards-tab"
                onClick={() => setAdminSubTab('serviceCards')}
                className={`py-2.5 px-4 text-xs font-sans font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  adminSubTab === 'serviceCards'
                    ? 'border-[#35755d] text-[#35755d] font-extrabold'
                    : 'border-transparent text-stone-400 hover:text-stone-750'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#35755d]" />
                <span>Fichas de Servicios</span>
              </button>
            </div>

            {adminSubTab === 'appointments' ? (
              <>
                {/* ADMON METRIC CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-[#dcebe2] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#45705f]" /> Estimado Mensual
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#23543f] mt-1">${estimatedRevenue}</p>
                <span className="text-[9px] text-[#45705f] font-semibold mt-0.5 block">Excluye cancelados</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-[#dcebe2] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Totales
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mt-1">{totalBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Registros en base de datos</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#dcebe2] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#35755d]" /> Por Atender (Activos)
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#45705f] mt-1">{activeBookings}</p>
                <span className="text-[9px] text-[#45705f] font-semibold mt-0.5 block">Citas activas</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#dcebe2] shadow-2xs">
                <span className="text-[9px] font-sans font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-500" /> Cancelados
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-rose-600 mt-1">{cancelledBookings}</p>
                <span className="text-[9px] text-stone-400 mt-0.5 block">Omitidos o descartados</span>
              </div>
            </div>

            {/* SYNC NOTI ALERT (REVERSION DIRECTIVE INSTRUCTIONS) */}
            <div className="bg-[#fafcfb] border-l-4 border-[#35755d] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-2xs">
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-stone-800 text-sm flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#35755d]" /> ¿Los cambios se revierten al actualizar?
                </h5>
                <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
                  Firestore requiere permisos explícitos para modificar o borrar documentos en producción. Ya hemos generado el archivo de configuración ideal en <strong>/firestore.rules</strong> en tu servidor. Solo debes copiar su contenido y pegarlo en la pestaña <strong>Rules</strong> de tu Firebase Console para permitir cambios permanentes en tus citas.
                </p>
              </div>
              <div className="bg-[#35755d]/5 text-[#35755d] border border-[#35755d]/20 px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap self-stretch md:self-auto text-center font-bold">
                Copia firestore.rules
              </div>
            </div>

            {/* BENTO LAYOUT: INTERACTIVE CALENDAR + AGENDA AGENDA LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* COL 1: INTERACTIVE CALENDAR SECTION */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#dcebe2] p-4 shadow-2xs space-y-4">
                  
                  {/* Calendar Widget Title / Month Navigation */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#dcebe2]/50">
                    <span className="text-xs font-serif font-bold text-[#23543f] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#35755d]" />
                      Agenda Mensual
                    </span>
                    
                    <div className="flex items-center gap-1 bg-stone-50 border border-stone-200/60 rounded-lg p-0.5">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                        title="Mes anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                        title="Mes siguiente"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Spanish Month Year Title */}
                  <div className="text-center">
                    <h4 className="font-serif font-semibold text-stone-800 text-sm">{displayedMonthLabel}</h4>
                  </div>

                  {/* Grid of Day-of-week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                    <span>L</span>
                    <span>M</span>
                    <span>M</span>
                    <span>J</span>
                    <span>V</span>
                    <span>S</span>
                    <span>D</span>
                  </div>

                  {/* Calendar Grid of Month Days */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((day) => {
                      const dayBookings = appointments.filter(apt => apt.rawDate === day.dateString);
                      const isSelected = selectedCalendarDate === day.dateString;
                      
                      // Count appointments of each status on this day
                      const counts = {
                        scheduled: dayBookings.filter(b => b.status === 'scheduled').length,
                        completed: dayBookings.filter(b => b.status === 'completed').length,
                        cancelled: dayBookings.filter(b => b.status === 'cancelled').length
                      };

                      return (
                        <button
                          key={day.key}
                          onClick={() => {
                            // Toggle filter
                            if (selectedCalendarDate === day.dateString) {
                              setSelectedCalendarDate(null);
                            } else {
                              setSelectedCalendarDate(day.dateString);
                            }
                          }}
                          className={`min-h-[44px] p-1 flex flex-col justify-between items-center rounded-lg cursor-pointer transition-all border ${
                            day.isCurrentMonth 
                              ? isSelected 
                                ? 'bg-[#35755d] border-[#35755d] text-white font-bold scale-102 shadow-xs' 
                                : 'bg-stone-50 hover:bg-[#35755d]/5 border-stone-200/50 text-stone-800'
                              : 'bg-stone-100/40 border-transparent text-stone-300'
                          }`}
                        >
                          {/* Day number */}
                          <span className="text-[10px] font-serif mt-0.5">{day.dayNum}</span>
                          
                          {/* Colored Dots Indicators under the day */}
                          <div className="flex gap-0.5 justify-center mt-1 w-full flex-wrap h-1.5 mb-0.5">
                            {counts.scheduled > 0 && (
                              <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#cfe3d8]' : 'bg-[#45705f]'} inline-block`} title={`${counts.scheduled} cita(s) vigentes`} />
                            )}
                            {counts.completed > 0 && (
                              <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-indigo-200' : 'bg-indigo-500'} inline-block`} title={`${counts.completed} completadas`} />
                            )}
                            {counts.cancelled > 0 && (
                              <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-rose-200' : 'bg-rose-500'} inline-block`} title={`${counts.cancelled} canceladas`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar explanatory legend */}
                  <div className="pt-2 border-t border-[#dcebe2]/50 flex items-center justify-between text-[9px] text-[#35755d]/80 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#45705f]" /> Vigente
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]" /> Atendida
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-550" /> Cancelada
                    </span>
                  </div>

                </div>

                {/* Info block for selected date */}
                {selectedCalendarDate && (
                  <div className="bg-[#eaf2ed] border border-[#dcebe2] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Filtro de fecha activo</span>
                        <p className="text-[11px] font-serif font-semibold text-stone-800">
                          {formatCalendarDateSpanish(selectedCalendarDate)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCalendarDate(null)}
                        className="text-[10px] font-mono text-[#35755d] hover:underline cursor-pointer border border-[#35755d]/20 bg-[#e6f1ea] px-2 py-0.5 rounded-md hover:bg-[#dcebe2] transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 font-sans leading-tight">
                      La lista del consultorio a la derecha ahora muestra únicamente las reservaciones agendadas para el día seleccionado.
                    </p>
                  </div>
                )}
              </div>

              {/* COL 2 & 3: CENTRAL AGENDA AGENDA LIST */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl border border-[#dcebe2] p-5 space-y-4 shadow-2xs">
                  
                  {/* List Header Search query bar */}
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="space-y-0.5 self-start">
                      <h4 className="text-xs font-sans font-bold tracking-wider text-[#23543f] uppercase flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-[#35755d]" />
                        Listado de Citas ({filteredBookings.length})
                      </h4>
                      {selectedCalendarDate ? (
                        <p className="text-[10px] font-mono text-stone-500">
                          Filtrando día: <span className="font-semibold">{selectedCalendarDate}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] font-mono text-stone-500">Mostrando todas las fechas de la agenda</p>
                      )}
                    </div>
                    
                    {/* Search query frame */}
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Busca por huésped, ritual, especialista..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-[#dcebe2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                      />
                    </div>
                  </div>

                  {/* CRM status filter tabs bar */}
                  <div className="flex flex-wrap gap-1.5 border-b border-[#dcebe2]/50 pb-2">
                    {[
                      { value: 'all', label: 'Todas' },
                      { value: 'scheduled', label: 'Vigentes' },
                      { value: 'completed', label: 'Completadas' },
                      { value: 'cancelled', label: 'Canceladas ✖' }
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value as any)}
                        className={`px-3 py-1 text-[10px] font-sans font-bold tracking-wider rounded-lg uppercase cursor-pointer transition-colors ${
                          statusFilter === tab.value
                            ? 'bg-[#35755d]/10 text-[#35755d] border border-[#35755d]/20 font-extrabold'
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
                      <p className="text-sm">No se encontraron citas que coincidan con los filtros activos.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setSelectedCalendarDate(null);
                        }}
                        className="text-[11px] font-sans uppercase tracking-[0.1em] text-[#35755d] underline hover:text-[#23543f] cursor-pointer"
                      >
                        Limpiar todos los filtros
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#dcebe2]/50">
                      {filteredBookings.map((apt) => {
                        const currentNoteVal = localNotes[apt.id] !== undefined ? localNotes[apt.id] : (apt.notes || '');
                        const hasUnsavedNotes = localNotes[apt.id] !== undefined && localNotes[apt.id] !== (apt.notes || '');
                        const isConfirmingErase = deletingId === apt.id;
                        
                        return (
                          <div key={apt.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-4 justify-between items-start transition-all">
                            {/* LEFT DETAIL META */}
                            <div className="flex gap-4 items-start flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-[#dcebe2]/40 overflow-hidden flex-shrink-0 border border-stone-200">
                                <ServiceVisual ritual={RITUALS.find(x => x.id === apt.ritualId) || RITUALS[0]} className="w-full h-full" iconClassName="w-1/2 h-1/2" />
                              </div>
                              
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-serif font-bold text-stone-900 text-sm sm:text-base pr-2">{apt.ritualName}</h5>
                                  
                                  {/* Status pill styles in CRM */}
                                  {apt.status === 'scheduled' && (
                                    <span className="text-[9px] uppercase font-bold tracking-wider bg-[#45705f]/10 text-[#45705f] border border-[#45705f]/20 px-2 py-0.5 rounded-full">
                                      Vigente
                                    </span>
                                  )}
                                  {apt.status === 'completed' && (
                                    <span className="text-[9px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                      Atendida ✨
                                    </span>
                                  )}
                                  {apt.status === 'cancelled' && (
                                    <span className="text-[9px] uppercase font-bold tracking-wider bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                                      Cancelada
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
                                  <p className="flex items-center gap-1 text-[#35755d] font-medium mt-0.5">
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
                                <div className="mt-3.5 bg-stone-50 rounded-xl p-3 border border-[#dcebe2]/50 max-w-xl">
                                  <span className="text-[9px] font-bold tracking-wider text-[#35755d] uppercase flex items-center gap-1 mb-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" /> Notas Clínicas de la Cita (Para Terapeutas):
                                  </span>
                                  <textarea
                                    value={currentNoteVal}
                                    onChange={(e) => handleNoteChangeLocal(apt.id, e.target.value)}
                                    placeholder="Escribe aquí observaciones útiles (Ej. alergias, dolores, nivel de fuerza deseada, tipo de piel para productos AURA)..."
                                    className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#35755d] placeholder:italic"
                                    rows={2}
                                  />
                                  {hasUnsavedNotes && (
                                    <button
                                      onClick={() => handleSaveNotes(apt.id)}
                                      className="mt-2 px-3 py-1 bg-[#45705f] text-white font-sans text-[10px] font-bold uppercase rounded-md flex items-center gap-1 shadow-2xs hover:bg-[#38594c] cursor-pointer"
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
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Atendida
                                </button>
                              )}

                              {/* 2. Reactive booking action */}
                              {onUpdateAppointmentStatus && apt.status !== 'scheduled' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(apt.id, 'scheduled')}
                                  className="flex-1 md:flex-none px-3 py-2 bg-stone-50 hover:bg-stone-100 text-[#45705f] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#45705f]/30 flex items-center justify-center gap-1 cursor-pointer"
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
              </div>

            </div>

              </>
            ) : (
              /* ========================================================== */
              /* VIEW B.2: SERVICES EXHIBITION GRID FOR CARD GENTLEMANS     */
              /* ========================================================== */
              <div className="space-y-6">
                {/* Visual Editorial Description header */}
                <div className="bg-[#fbfdfc] rounded-xl border border-[#dcebe2] p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#35755d]/10 text-[#35755d] rounded-lg">
                      <Sparkles className="w-5 h-5 text-[#35755d]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm">Generador de Fichas Compartibles</h4>
                      <p className="text-xs text-stone-400 font-mono">Presenta tus servicios y rituales con elegancia sutil</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-4xl">
                    Selecciona cualquier ritual o servicio de tu catálogo y personaliza una ficha promocional con tu propio precio/descuento, un mensaje personalizado y un especialista asignado. Descárgala como una imagen de alta definición lista para enviarse por WhatsApp o subirse a tus redes sociales de <strong>AURA Cosmetología e Imagen</strong>.
                  </p>
                </div>

                {/* Filter and catalog search bar */}
                <div className="bg-white rounded-xl border border-[#dcebe2]/80 p-4 shadow-3xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                    {[
                      { value: 'all', label: 'Todos los Rituales' },
                      { value: 'cabina', label: 'Terapia Cabina' },
                      { value: 'maquillaje', label: 'Maquillaje Profesional' }
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setCatalogCategory(btn.value as any)}
                        className={`px-3 py-1 text-[10px] uppercase font-sans font-extrabold tracking-wider rounded-lg border transition-all cursor-pointer ${
                          catalogCategory === btn.value
                            ? 'bg-[#35755d] text-white border-[#35755d] shadow-xs font-extrabold'
                            : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar servicio para compartir..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-[#dcebe2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                    />
                  </div>
                </div>

                {/* Rituals display Catalog Grid */}
                {filteredCatalogRaw.length === 0 ? (
                  <div className="text-center py-16 text-stone-450 font-serif italic">
                    No se encontraron rituales que coincidan con la búsqueda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCatalogRaw.map((ritual) => (
                      <div 
                        key={ritual.id}
                        className="bg-white rounded-xl border border-[#dcebe2] hover:border-[#35755d]/40 transition-all duration-300 p-4 shadow-3xs hover:shadow-xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="aspect-[16/9] w-full rounded-lg bg-stone-100 overflow-hidden relative border border-stone-100">
                            <ServiceVisual ritual={ritual} className="w-full h-full" iconClassName="w-1/4 h-1/4" />
                            <span className="absolute top-2 right-2 text-[9px] font-sans font-extrabold bg-[#35755d] text-white px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                              {ritual.badge || 'PRO'}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <h5 className="font-serif font-bold text-stone-900 text-smPr">{ritual.name}</h5>
                            <div className="flex gap-2 text-[10px] font-mono text-[#35755d]">
                              {ritual.subcategory && (
                                <span className="uppercase">● {ritual.subcategory}</span>
                              )}
                              <span>⏱ {ritual.duration} min</span>
                            </div>
                            <p className="text-[11px] text-stone-500 font-sans leading-relaxed whitespace-normal">
                              {ritual.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-[#dcebe2]/60 mt-4 flex items-center justify-between">
                          <span className="text-xs font-serif font-extrabold text-stone-850">
                            {ritual.customQuote ? 'A Cotizar' : `$${ritual.price} MXN`}
                          </span>
                          
                          <button
                            onClick={() => openFichaDesigner(ritual)}
                            className="px-3.5 py-1.5 bg-[#35755d] hover:bg-[#23543f] text-white rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Generar Ficha
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. OVERLAY MODAL: EXQUISITE LIVE DESIGNS CUSTOMIZER AND CANVAS EXPORTER */}
            <AnimatePresence>
              {selectedRitualForCard && (() => {
                const activeTheme = CARD_THEMES.find(t => t.id === selectedCardTheme) || CARD_THEMES[0];
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-stone-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-[#fafcfb] rounded-2xl w-full max-w-4xl border border-[#dcebe2] shadow-2xl relative overflow-hidden flex flex-col my-4 max-h-[96vh] sm:my-8"
                    >
                      {/* FIXED STICKY TOP HEADER FOR CONSTANT RETURN OPTION */}
                      <div className="sticky top-0 bg-[#fafcfb]/98 backdrop-blur-md border-b border-[#dcebe2]/70 px-4 sm:px-6 py-3.5 flex items-center justify-between z-30 w-full shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#35755d]/5 text-[#35755d] rounded-lg">
                            <Share2 className="w-4 h-4 text-[#35755d]" />
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-stone-850 text-xs sm:text-sm">Personalizar Ficha</h3>
                            <p className="text-[9px] text-[#35755d] font-mono tracking-wider uppercase font-semibold">AURA Cosmetología e Imagen</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedRitualForCard(null)}
                          className="text-xs font-bold text-[#35755d] hover:bg-[#35755d]/10 bg-[#35755d]/5 border border-[#35755d]/25 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          ✕ Cerrar Editor
                        </button>
                      </div>

                      {/* SPLIT RESPONSIVE VIEWPORT CONTAINER */}
                      <div className="flex flex-col md:flex-row w-full overflow-y-auto md:overflow-hidden md:h-[580px] max-h-[calc(100vh-140px)] md:max-h-[640px]">
                        
                        {/* LEFT: CARD DESIGN ADJUSTMENT FORM PANEL */}
                        <div className="w-full md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#dcebe2]/65 space-y-4 md:overflow-y-auto md:h-full">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#35755d] font-extrabold flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5" /> Ajustes de Diseño
                            </span>
                            <h4 className="font-serif font-bold text-stone-850 text-sm md:text-base">{selectedRitualForCard.name}</h4>
                            <p className="text-[11px] text-stone-500">Modifica los detalles estéticos antes de descargar la imagen promocional.</p>
                          </div>

                          {/* Themes Select */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center gap-1">
                              <Palette className="w-3.5 h-3.5 text-[#35755d]" /> 1. Elige una Paleta de Color:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {CARD_THEMES.map((theme) => (
                                <button
                                  key={theme.id}
                                  onClick={() => setSelectedCardTheme(theme.id)}
                                  className={`p-2 rounded-xl border text-[9px] font-sans font-bold flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                                    selectedCardTheme === theme.id
                                      ? 'border-[#35755d] ring-1 ring-[#35755d] bg-[#35755d]/5 scale-102 font-extrabold'
                                      : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                                  }`}
                                >
                                  <span 
                                    className="w-5 h-5 rounded-full border border-stone-250 flex items-center justify-center text-[8px]" 
                                    style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
                                  >
                                    Aa
                                  </span>
                                  <span>{theme.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Price input settings */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 text-[#35755d]" /> 2. Personalizar Precio / Leyenda de Valor:
                            </label>
                            <input
                              type="text"
                              value={customPriceVal}
                              onChange={(e) => setCustomPriceVal(e.target.value)}
                              placeholder="Ej. $800 MXN o ¡Gratis con Membresía!"
                              className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                            />
                            <p className="text-[9px] text-stone-400 leading-tight">
                              Puedes escribir formulas alternativas como "10% OFF: $720 MXN" para reflejar descuentos especiales temporales.
                            </p>
                          </div>

                          {/* Promotional Text input settings */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center gap-1">
                              <Gift className="w-3.5 h-3.5 text-[#35755d]" /> 3. Sello o Descuento Especial Promocional:
                            </label>
                            <textarea
                              value={customDiscountText}
                              onChange={(e) => setCustomDiscountText(e.target.value)}
                              rows={2}
                              maxLength={75}
                              placeholder="Ej. ¡25% OFF reservando esta semana!"
                              className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                            />
                            <span className="text-[9px] text-stone-400 text-right block">{customDiscountText.length}/75 carácteres máximo</span>
                          </div>

                          {/* Specialist details settings */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-[#35755d]" /> 4. Lic. en Cosmetología / Recomendado:
                            </label>
                            <input
                              type="text"
                              value={assignedSpecialist}
                              onChange={(e) => setAssignedSpecialist(e.target.value)}
                              placeholder="Ej. Atendido por Anel, Licenciada en Cosmetología Aura"
                              className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                            />
                          </div>

                          {/* Footnotes instructions rules */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center gap-1">
                              <CheckSquare className="w-3.5 h-3.5 text-[#35755d]" /> 5. Instrucción de Contacto (Pie de Ficha):
                            </label>
                            <input
                              type="text"
                              value={customFootnoteVal}
                              onChange={(e) => setCustomFootnoteVal(e.target.value)}
                              placeholder="Ej. WhatsApp: 638 128 5959"
                              className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#35755d]"
                            />
                          </div>
                        </div>

                        {/* RIGHT: REAL-TIME PREMIUM WYSIWYG DESIGN PREVIEW AND EXPORT BUTTON */}
                        <div className="w-full md:w-1/2 p-5 sm:p-6 bg-stone-50 flex flex-col justify-between items-center gap-4 md:overflow-y-auto md:h-full border-t md:border-t-0 border-[#dcebe2]/60">
                          <div className="w-full text-center">
                            <span className="text-[8px] uppercase font-mono tracking-widest text-[#35755d] font-bold bg-[#35755d]/5 px-2.5 py-1 rounded border border-[#35755d]/15">
                              Vista previa en tiempo real
                            </span>
                          </div>

                          {/* Beautiful Card preview box */}
                          <div 
                            ref={previewRef}
                            style={{ backgroundColor: activeTheme.bgColor }}
                            className="w-full min-h-[440px] h-auto max-w-[310px] shadow-lg rounded-xl border p-6 flex flex-col justify-between items-center gap-4 text-center relative overflow-hidden transition-all font-serif shrink-0 py-8"
                          >
                            {/* Double elegant borders */}
                            <div style={{ borderColor: activeTheme.borderColor }} className="absolute inset-3 border pointer-events-none select-none" />
                            <div style={{ borderColor: activeTheme.borderColor }} className="absolute inset-4 border-2 pointer-events-none select-none" />
                            
                            {/* Tiny corner ornamental stars */}
                            <div style={{ color: activeTheme.decorColor }} className="absolute top-4 left-4 text-[10px] select-none pointer-events-none">✧</div>
                            <div style={{ color: activeTheme.decorColor }} className="absolute top-4 right-4 text-[10px] select-none pointer-events-none">✧</div>
                            <div style={{ color: activeTheme.decorColor }} className="absolute bottom-4 left-4 text-[10px] select-none pointer-events-none">✧</div>
                            <div style={{ color: activeTheme.decorColor }} className="absolute bottom-4 right-4 text-[10px] select-none pointer-events-none">✧</div>

                            <div className="relative z-10 flex flex-col items-center justify-between gap-3.5 w-full h-full py-1 px-1">
                              {/* Logo header */}
                              <div className="space-y-1">
                                <h4 style={{ color: activeTheme.textColor }} className="text-xl tracking-[0.2em] font-medium font-serif select-none">A U R A</h4>
                                <p style={{ color: activeTheme.mutedColor }} className="text-[7.5px] font-sans tracking-[0.14em] uppercase select-none">Cosmetología e Imagen</p>
                                <div style={{ backgroundColor: activeTheme.borderColor }} className="h-[1px] w-10 mx-auto mt-1 opacity-50" />
                              </div>

                              {/* Central vector therapeutic seal */}
                              <div style={{ color: activeTheme.decorColor }} className="flex flex-col items-center select-none py-1">
                                <div style={{ borderColor: activeTheme.decorColor }} className="w-10 h-10 rounded-full border border-dashed flex items-center justify-center relative">
                                  <Sparkles className="w-4 h-4 absolute" />
                                </div>
                              </div>

                              {/* Name of ritual */}
                              <div className="space-y-1 w-full">
                                <span style={{ color: activeTheme.textColor }} className="inline-block text-[7px] tracking-widest font-sans font-bold uppercase py-0.5 px-2 bg-black/5 rounded select-none">
                                  {selectedRitualForCard.badge || 'EXCLUSIVO BIENESTAR'}
                                </span>
                                <h3 style={{ color: activeTheme.textColor }} className="text-base font-serif italic font-bold leading-tight px-1 max-w-full break-words">
                                  {selectedRitualForCard.name}
                                </h3>
                              </div>

                              {/* Value and duration panel mockup */}
                              <div style={{ backgroundColor: activeTheme.accentBg }} className="py-2 px-3 rounded-lg w-full max-w-[230px] space-y-0.5 border border-[#d4af37]/15">
                                <span style={{ color: activeTheme.accentText }} className="text-[8.5px] font-sans font-extrabold block uppercase tracking-wide">
                                  ⏱ {selectedRitualForCard.duration} minutos
                                </span>
                                <span style={{ color: activeTheme.textColor }} className="text-sm font-serif font-extrabold block">
                                  {customPriceVal ? customPriceVal : `$${selectedRitualForCard.price} MXN`}
                                </span>
                              </div>

                              {/* Description */}
                              <p style={{ color: activeTheme.mutedColor }} className="text-[8.5px] leading-relaxed font-sans px-2 italic font-medium whitespace-normal">
                                "{selectedRitualForCard.description || selectedRitualForCard.shortDescription}"
                              </p>

                              {/* Promo footnotes info */}
                              {customDiscountText && (
                                <div className="space-y-0.5">
                                  <div style={{ backgroundColor: activeTheme.borderColor }} className="h-[0.8px] w-5 mx-auto opacity-50" />
                                  <p style={{ color: activeTheme.accentText }} className="text-[8px] font-sans font-extrabold uppercase tracking-widest leading-normal">
                                    {customDiscountText}
                                  </p>
                                </div>
                              )}

                              {/* Footers client actions instructions */}
                              <div className="space-y-0.5">
                                <span style={{ color: activeTheme.mutedColor }} className="text-[7.5px] font-sans block italic">
                                  {assignedSpecialist}
                                </span>
                                <span style={{ color: activeTheme.textColor }} className="text-[8px] font-sans font-extrabold uppercase tracking-wide block">
                                  {customFootnoteVal}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Immediate Direct Export Save Download button */}
                          <button
                            onClick={handleDownloadCard}
                            className="w-full max-w-[310px] py-3 bg-[#35755d] hover:bg-[#23543f] text-white hover:text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 shrink-0 my-2 active:scale-95"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descargar Ficha</span>
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
