import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Sparkles, User } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { RITUALS, SPECIALISTS } from './data';

// Entity types
import { Product, Ritual, CartItem, SkinProfile, Appointment } from './types';

// Page screens
import RitualsScreen from './components/RitualsScreen';
import RefineScreen from './components/RefineScreen';
import ProfileScreen from './components/ProfileScreen';

// Detail Modals
import PhilosophyModal from './components/PhilosophyModal';
import ProductDetailModal from './components/ProductDetailModal';
import RitualDetailModal from './components/RitualDetailModal';
import BookingWizard from './components/BookingWizard';

export default function App() {
  // Navigation — ahora con 3 pestañas: análisis, servicios, perfil (reservaciones)
  const [activeTab, setActiveTab] = useState<'refine' | 'rituals' | 'profile'>('rituals');

  // Core application states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>({
    skinType: '',
    concern: '',
    vibe: '',
    completed: false
  });

  // Modal toggle triggers
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreSelectedId, setBookingPreSelectedId] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);

  // Fetch bookings from Firestore (all bookings for admin view, filtered locally for client views)
  const fetchBookings = async () => {
    try {
      const qSnapshot = await getDocs(collection(db, 'bookings'));
      const fetched: Appointment[] = [];
      qSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const ritualName = data.ritualName || '';
        const matchingRitual = RITUALS.find(r => ritualName.includes(r.name)) || RITUALS[0];
        const matchingRituals = RITUALS.filter(r => ritualName.includes(r.name));
        const specName = data.specialistName || '';
        const spec = SPECIALISTS.find(s => s.name === specName) || SPECIALISTS[0];
        
        const price = data.price || matchingRituals.reduce((sum, r) => sum + r.price, 0) + (ritualName.includes('Ritual AURA') && !ritualName.startsWith('Ritual AURA') ? 400 : 0);

        const rawDate = data.date || '';
        const rawTime = data.time || '';
        
        let displayDate = `${rawDate} a las ${rawTime}`;
        try {
          if (rawDate) {
            const [y, m, d] = rawDate.split('-').map(Number);
            const formattedDateStr = new Date(y, m - 1, d).toLocaleDateString('es-MX', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
            });
            displayDate = `${formattedDateStr}, ${rawTime}`;
          }
        } catch (e) {
          console.error(e);
        }

        // Map status cleanly: preserve detailed Firestore status if any
        let resolvedStatus: 'scheduled' | 'cancelled' | 'completed' = 'scheduled';
        if (data.status === 'cancelled') {
          resolvedStatus = 'cancelled';
        } else if (data.status === 'completed') {
          resolvedStatus = 'completed';
        }

        fetched.push({
          id: docSnap.id,
          ritualId: matchingRitual?.id || 'r1',
          ritualName: ritualName,
          ritualImageUrl: matchingRitual?.imageUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
          duration: data.duration || 60,
          price: price,
          dateTime: displayDate,
          specialistName: specName || 'Anel Reyna',
          specialistAvatar: spec?.avatarUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=250&q=80',
          status: resolvedStatus,
          notes: data.notes || '',
          clientName: data.clientName || 'Cliente Aura',
          clientEmail: data.clientEmail || 'correo@aura.com',
          rawDate: rawDate,
          rawTime: rawTime
        });
      });
      
      // Sort: show newer/upcoming first
      fetched.sort((a, b) => {
        const dateA = a.rawDate || '0000-00-00';
        const dateB = b.rawDate || '0000-00-00';
        return dateB.localeCompare(dateA);
      });

      setAppointments(fetched);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  // Load state from localStorage & Firestore
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('aura_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedProfile = localStorage.getItem('aura_profile');
      if (storedProfile) setSkinProfile(JSON.parse(storedProfile));
    } catch (e) {
      console.error('Failed to load storage variables:', e);
    }
    fetchBookings();
  }, []);

  // Sync bookings after the wizard is closed (user might have booked)
  useEffect(() => {
    if (!isBookingOpen) {
      fetchBookings();
    }
  }, [isBookingOpen]);

  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aura_cart', JSON.stringify(newCart));
  };

  const syncProfile = (newProfile: SkinProfile) => {
    setSkinProfile(newProfile);
    localStorage.setItem('aura_profile', JSON.stringify(newProfile));
  };

  // CART HANDLERS (usados por RefineScreen / ProductDetailModal)
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      syncCart(cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      syncCart([...cart, { product, quantity: 1 }]);
    }
  };

  // BOOKING HELPERS
  const handleOpenBookingWithRitual = (ritualId: string) => {
    setBookingPreSelectedId(ritualId);
    setSelectedRitual(null);
    setIsBookingOpen(true);
  };

  // UPDATE APPOINTMENT HANDLERS (ADMIN)
  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      console.warn('Firestore update failed, updating locally:', e);
    }
    
    // Optimistic local update
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleUpdateAppointmentNotes = async (id: string, notes: string) => {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { notes: notes });
    } catch (e) {
      console.warn('Firestore update failed, updating locally:', e);
    }
    
    // Optimistic local update
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, notes: notes } : apt
      )
    );
  };

  // CANCEL APPOINTMENT HANDLER (CLIENT)
  const handleCancelAppointment = async (id: string) => {
    await handleUpdateAppointmentStatus(id, 'cancelled');
  };

  return (
    <div id="aura-app" className="min-h-screen bg-[#faf8f5] text-[#2c1d11] font-sans pb-20">

      {/* ANIMATED MAIN PAGE TRANSITIONS */}
      <main id="aura-pages-container" className="relative w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'rituals' && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            >
              <RitualsScreen
                onBookAppointment={() => {
                  setBookingPreSelectedId(null);
                  setIsBookingOpen(true);
                }}
                onOpenPhilosophy={() => setIsPhilosophyOpen(true)}
                onViewRitual={(ritual) => setSelectedRitual(ritual)}
                onViewProduct={(product) => setSelectedProduct(product)}
                onAddToCart={handleAddToCart}
                onNavigateToTab={(tab) => {
                  if (tab === 'rituals' || tab === 'refine') {
                    setActiveTab(tab);
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'refine' && (
            <motion.div
              key="refine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            >
              <RefineScreen
                currentProfile={skinProfile}
                onUpdateProfile={syncProfile}
                onViewProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                onBookRitual={handleOpenBookingWithRitual}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.32, 0.72, 0, 1] } }}
            >
              <ProfileScreen
                appointments={appointments}
                onCancelAppointment={handleCancelAppointment}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onUpdateAppointmentNotes={handleUpdateAppointmentNotes}
                skinProfile={skinProfile}
                orders={[]}
                userAvatar="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=250&q=80"
                onNavigateToTab={(tab) => {
                  if (tab === 'profile' || tab === 'rituals' || tab === 'refine') {
                    setActiveTab(tab as 'rituals' | 'refine' | 'profile');
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <nav id="bottom-navigation-bar" className="fixed bottom-0 inset-x-0 bg-[#faf6f0]/95 backdrop-blur-md border-t border-[#efe6dc] py-2 px-4 flex justify-around items-center z-40 max-w-lg mx-auto rounded-t-xl sm:shadow-lg">

        {/* TAB 1: DIAGNÓSTICO */}
        <button
          id="nav-tab-refine"
          onClick={() => setActiveTab('refine')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'refine' ? 'text-[#764229] font-bold' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <Sprout className="w-5 h-5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Análisis</span>
        </button>

        {/* TAB 2: RITUALES */}
        <button
          id="nav-tab-rituals"
          onClick={() => setActiveTab('rituals')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'rituals' ? 'text-[#764229] font-bold' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Servicios</span>
        </button>

        {/* TAB 3: REGISTRO/PERFIL */}
        <button
          id="nav-tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#764229] font-bold' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Mi Perfil</span>
        </button>

      </nav>

      {/* ================= GLOBAL OVERLAYS ================= */}

      {/* 1. Philosophy Modal */}
      <PhilosophyModal
        isOpen={isPhilosophyOpen}
        onClose={() => setIsPhilosophyOpen(false)}
      />

      {/* 2. Product Detail */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 3. Ritual Detail */}
      <RitualDetailModal
        ritual={selectedRitual}
        isOpen={selectedRitual !== null}
        onClose={() => setSelectedRitual(null)}
        onBookRitual={handleOpenBookingWithRitual}
      />

      {/* 4. Booking Wizard → envía por WhatsApp */}
      <BookingWizard
        isOpen={isBookingOpen}
        preSelectedRitualId={bookingPreSelectedId}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingPreSelectedId(null);
        }}
      />

    </div>
  );
}
