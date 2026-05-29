import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Sparkles, ShoppingBag, User } from 'lucide-react';

// Entity types
import { Product, Ritual, CartItem, Appointment, SkinProfile } from './types';

// Page screens
import RitualsScreen from './components/RitualsScreen';
import RefineScreen from './components/RefineScreen';
import ShopScreen from './components/ShopScreen';
import ProfileScreen from './components/ProfileScreen';

// Detail Modals
import PhilosophyModal from './components/PhilosophyModal';
import ProductDetailModal from './components/ProductDetailModal';
import RitualDetailModal from './components/RitualDetailModal';
import BookingWizard from './components/BookingWizard';

const USER_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'; // Clean premium male portrait

interface OrderHistoryRecord {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  itemsList: string;
}

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'refine' | 'rituals' | 'shop' | 'profile'>('rituals');

  // Core application states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>({
    skinType: '',
    concern: '',
    vibe: '',
    completed: false
  });
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);

  // Modal toggle triggers
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreSelectedId, setBookingPreSelectedId] = useState<string | null>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);

  // Load state from localStorage on build entry once
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('aura_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedAppointments = localStorage.getItem('aura_appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        // Hydrate space with 1 beautiful completed/upcoming default mock appointment in Spanish
        const initialApts: Appointment[] = [
          {
            id: 'apt-initial-1',
            ritualId: 'r1',
            ritualName: 'Revitalizador Luminoso de la Piel',
            ritualImageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            duration: 60,
            price: 135,
            dateTime: 'Sábado, 30 de Mayo a las 11:00 AM',
            specialistName: 'Elara Vance',
            specialistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
            status: 'scheduled'
          }
        ];
        setAppointments(initialApts);
        localStorage.setItem('aura_appointments', JSON.stringify(initialApts));
      }

      const storedProfile = localStorage.getItem('aura_profile');
      if (storedProfile) setSkinProfile(JSON.parse(storedProfile));

      const storedOrders = localStorage.getItem('aura_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const initialOrders: OrderHistoryRecord[] = [
          {
            id: 'AUR-892A',
            date: '16 de Mayo, 2026',
            itemsCount: 1,
            total: 89.00,
            itemsList: 'Suero de Seda Aura (x1)'
          }
        ];
        setOrders(initialOrders);
        localStorage.setItem('aura_orders', JSON.stringify(initialOrders));
      }
    } catch (e) {
      console.error('Failed to load storage variables:', e);
    }
  }, []);

  // Sync state helpers
  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aura_cart', JSON.stringify(newCart));
  };

  const syncAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem('aura_appointments', JSON.stringify(newApts));
  };

  const syncProfile = (newProfile: SkinProfile) => {
    setSkinProfile(newProfile);
    localStorage.setItem('aura_profile', JSON.stringify(newProfile));
  };

  const syncOrders = (newOrders: OrderHistoryRecord[]) => {
    setOrders(newOrders);
    localStorage.setItem('aura_orders', JSON.stringify(newOrders));
  };

  // CART HANDLERS
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      const updated = cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      syncCart(updated);
    } else {
      syncCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const updated = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    syncCart(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const filtered = cart.filter(item => item.product.id !== productId);
    syncCart(filtered);
  };

  const handleClearCart = () => {
    syncCart([]);
  };

  // APPOINTMENTS HANDLERS
  const handleSaveAppointment = (appointment: Appointment) => {
    syncAppointments([appointment, ...appointments]);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const updated = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    );
    syncAppointments(updated);
  };

  // ORDER HANDLERS
  const handleAddOrderHistory = (items: CartItem[], total: number) => {
    const itemsList = items.map(it => `${it.product.name} (x${it.quantity})`).join(', ');
    const newRecord: OrderHistoryRecord = {
      id: `AUR-${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      date: new Date().toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' }),
      itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total,
      itemsList
    };
    syncOrders([newRecord, ...orders]);
  };

  // TRIGGER POPUPS SPECIFICS
  const handleOpenBookingWithRitual = (ritualId: string) => {
    setBookingPreSelectedId(ritualId);
    setSelectedRitual(null); // Dismiss details modal if any
    setIsBookingOpen(true);
  };

  return (
    <div id="aura-app" className="min-h-screen bg-[#faf8f5] text-[#2c1d11] font-sans pb-24">
      
      {/* ANIMATED MAIN PAGE TRANSITIONS */}
      <main id="aura-pages-container" className="relative w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'rituals' && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
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
                onNavigateToTab={(tab) => setActiveTab(tab)}
                userAvatar={USER_AVATAR}
              />
            </motion.div>
          )}

          {activeTab === 'refine' && (
            <motion.div
              key="refine"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
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

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <ShopScreen
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onViewProduct={(prod) => setSelectedProduct(prod)}
                onAddOrderHistory={handleAddOrderHistory}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileScreen
                appointments={appointments}
                onCancelAppointment={handleCancelAppointment}
                skinProfile={skinProfile}
                orders={orders}
                userAvatar={USER_AVATAR}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= PERSISTENT BOTTOM NAVIGATION BAR ================= */}
      <nav id="bottom-navigation-bar" className="fixed bottom-0 inset-x-0 bg-[#faf6f0]/95 backdrop-blur-md border-t border-[#efe6dc] py-2 px-4 flex justify-around items-center z-40 max-w-lg mx-auto rounded-t-xl sm:shadow-lg">
        {/* TAB 1: DIAGNOSTIC */}
        <button
          id="nav-tab-refine"
          onClick={() => {
            setActiveTab('refine');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'refine' ? 'text-[#764229] font-bold scale-102' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <Sprout className="w-5.5 h-5.5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Diagnóstico</span>
        </button>

        {/* TAB 2: RITUALS */}
        <button
          id="nav-tab-rituals"
          onClick={() => {
            setActiveTab('rituals');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'rituals' ? 'text-[#764229] font-bold scale-102' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <Sparkles className="w-5.5 h-5.5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Rituales</span>
        </button>

        {/* TAB 3: SHOP - OCULTADO TEMPORALMENTE (Para reactivar en el futuro, descomentar el bloque inferior)
        <button
          id="nav-tab-shop"
          onClick={() => {
            setActiveTab('shop');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'shop' ? 'text-[#764229] font-bold scale-102' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <ShoppingBag className="w-5.5 h-5.5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Tienda</span>
          
          {cart.length > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-[#8a4f35] text-white text-[8px] font-sans font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-[#faf6f0]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
        */}

        {/* TAB 4: PROFILE */}
        <button
          id="nav-tab-profile"
          onClick={() => {
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#764229] font-bold scale-102' : 'text-stone-400 hover:text-[#764229]'
          }`}
        >
          <User className="w-5.5 h-5.5 mb-1" />
          <span className="text-[10px] sm:text-xs font-sans font-medium tracking-wide">Mi Perfil</span>
        </button>
      </nav>

      {/* ================= GLOBAL CONTEXT POPUP OVERLAYS ================= */}
      
      {/* 1. Philosophy description text Modal */}
      <PhilosophyModal
        isOpen={isPhilosophyOpen}
        onClose={() => setIsPhilosophyOpen(false)}
      />

      {/* 2. Detailed product focus card */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 3. Detailed ritual treatment architecture */}
      <RitualDetailModal
        ritual={selectedRitual}
        isOpen={selectedRitual !== null}
        onClose={() => setSelectedRitual(null)}
        onBookRitual={handleOpenBookingWithRitual}
      />

      {/* 4. Scheduling interactive multistep calendar controller */}
      <BookingWizard
        isOpen={isBookingOpen}
        preSelectedRitualId={bookingPreSelectedId}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingPreSelectedId(null);
        }}
        onSaveAppointment={handleSaveAppointment}
      />

    </div>
  );
}
