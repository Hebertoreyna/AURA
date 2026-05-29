import { motion } from 'motion/react';
import { Calendar, Trash2, Heart, Award, Package, Clock } from 'lucide-react';
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
    congestion: 'Congestión'
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
  skinProfile,
  orders,
  userAvatar,
  onNavigateToTab
}: ProfileScreenProps) {
  
  // Calculate total points based on bookings ($1 = 1 point) and purchases
  const appointmentsPoints = appointments.reduce((sum, apt) => sum + (apt.status === 'scheduled' ? apt.price : 0), 0);
  const purchasePoints = orders.reduce((sum, ord) => sum + Math.round(ord.total), 0);
  const totalPoints = 120 + appointmentsPoints + purchasePoints; // 120 base loyalty points

  const getLoyaltyTier = (pts: number) => {
    if (pts > 400) return { name: 'Élite del Santuario Iris Dorado', perk: 'Sesiones de vapor de 30 minutos gratis y 15% de descuento en la tienda' };
    if (pts > 200) return { name: 'Socio de Loto Plateado', perk: 'Brumas activas de cortesía y prioridad para reservar citas' };
    return { name: 'Practicante de Salvia de Bronce', perk: '1 punto de bonificación por cada dólar invertido y recibos de diagnóstico mensual' };
  };

  const currentTier = getLoyaltyTier(totalPoints);

  return (
    <div id="profile-screen" className="py-8 px-6 max-w-4xl mx-auto min-h-[85vh] space-y-8">
      
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
        
        <div className="text-center sm:text-left flex-1">
          <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Registro de Huéspedes</span>
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
            {skinProfile.completed ? 'Rehacer Diagnóstico' : 'Hacer Diagnóstico de Piel'}
          </button>
        </div>

        {skinProfile.completed ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50">
              <span className="text-[9px] font-mono text-stone-400 uppercase">Estado Dérmico</span>
              <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateSkinType(skinProfile.skinType)}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50">
              <span className="text-[9px] font-mono text-stone-400 uppercase">Problema Principal</span>
              <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateConcern(skinProfile.concern)}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-[#efe6dc]/50">
              <span className="text-[9px] font-mono text-stone-400 uppercase">Estilo de Rutina</span>
              <p className="font-serif font-semibold text-stone-800 capitalize text-sm">{translateVibe(skinProfile.vibe)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-white/50 border border-dashed border-[#efe6dc] rounded-lg">
            <p className="text-xs text-stone-600 italic font-serif">Aún no se ha cargado un diagnóstico de piel.</p>
            <p className="text-[10px] text-stone-500 mt-1 max-w-sm mx-auto">
              Nuestro analizador clínico de piel mapea los sueros de alta concentración botánica correctos para el ritmo celular único de su rostro.
            </p>
          </div>
        )}
      </div>

      {/* 3. UPCOMING RESERVATIONS LIST */}
      <div id="profile-appointments-sec" className="space-y-3">
        <h4 className="text-xs font-sans font-bold tracking-widest text-[#4a2815] uppercase border-b border-[#efe6dc]/50 pb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#764229]" />
          Próximas Reservaciones de Spa
        </h4>

        {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#efe6dc]/50 rounded-xl space-y-2">
            <Clock className="w-10 h-10 text-stone-300 mx-auto stroke-1" />
            <p className="text-xs text-stone-500 italic font-serif">No cuenta con reservaciones programadas para servicios.</p>
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
            {appointments.filter(a => a.status === 'scheduled').map((apt) => (
              <div
                key={apt.id}
                id={`upcoming-reservation-${apt.id}`}
                className="bg-white rounded-xl border border-[#efe6dc] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="p-4 flex gap-3">
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
                className="p-4 flex justify-between items-center gap-4 text-xs"
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
                  <span className="text-[9px] font-mono text-[#5e6c58] bg-[#efe6dc]/20 px-2 py-0.5 rounded border border-[#efe6dc]/50 font-semibold uppercase">Despachado</span>
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

    </div>
  );
}
