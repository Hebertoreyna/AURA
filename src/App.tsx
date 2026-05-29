import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Sparkles } from 'lucide-react';

// Entity types
import { Product, Ritual, CartItem, SkinProfile } from './types';

// Page screens
import RitualsScreen from './components/RitualsScreen';
import RefineScreen from './components/RefineScreen';

// Detail Modals
import PhilosophyModal from './components/PhilosophyModal';
import ProductDetailModal from './components/ProductDetailModal';
import RitualDetailModal from './components/RitualDetailModal';
import BookingWizard from './components/BookingWizard';

export default function App() {
  // Navigation — sólo 2 tabs activos: rituales y diagnóstico
  const [activeTab, setActiveTab] = useState<'refine' | 'rituals'>('rituals');

  // Core application states
  const [cart, setCart] = useState<CartItem[]>([]);
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

  // Load state from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('aura_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedProfile = localStorage.getItem('aura_profile');
      if (storedProfile) setSkinProfile(JSON.parse(storedProfile));
    } catch (e) {
      console.error('Failed to load storage variables:', e);
    }
  }, []);

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
                onNavigateToTab={(tab) => setActiveTab(tab)}
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
