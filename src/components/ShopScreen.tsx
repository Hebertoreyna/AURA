import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Trash2, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data';

interface ShopScreenProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onViewProduct: (product: Product) => void;
  onAddOrderHistory: (items: CartItem[], total: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Todos',
  serum: 'Sueros',
  cleanser: 'Limpiadores',
  mask: 'Mascarillas',
  mist: 'Brumas'
};

export default function ShopScreen({
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onViewProduct,
  onAddOrderHistory
}: ShopScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'serum' | 'cleanser' | 'mask' | 'mist'>('all');
  const [showingCart, setShowingCart] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = discountApplied ? cartSubtotal * 0.15 : 0; // 15% discount for AURA code
  const cartTotal = cartSubtotal - discountAmount + (cartSubtotal > 0 ? 5.00 : 0); // $5 flat delivery fee

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Save order history details to the Profile tracker
    onAddOrderHistory([...cart], cartTotal);
    
    // Success flow
    setCheckoutSuccess(true);
    onClearCart();
    setPromoCode('');
    setDiscountApplied(false);
  };

  const applyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA15') {
      setDiscountApplied(true);
    }
  };

  return (
    <div id="shop-screen" className="py-8 px-6 max-w-6xl mx-auto min-h-[85vh] relative">
      
      {/* SHOP PAGE HEADING */}
      <div id="shop-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Boticario Exclusivo</span>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] font-light mt-0.5">La Estantería Pura</h3>
          <p className="text-xs text-stone-500 mt-1 font-serif italic">Formulaciones éticas y concentradas embotelladas en vidrio ámbar.</p>
        </div>

        {/* View Cart Pill with counter */}
        <button
          id="shop-toggle-cart-btn"
          onClick={() => {
            setCheckoutSuccess(false);
            setShowingCart(true);
          }}
          className="relative py-2.5 px-5 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-full transition-all font-sans uppercase flex items-center gap-2 shadow-md cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#efe6dc]" />
          Mi Bolsa
          {cart.length > 0 && (
            <span className="bg-white text-[#764229] rounded-full w-5 h-5 flex items-center justify-center font-sans font-extrabold text-[10px]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* CATEGORIES SELECTION RAIL */}
      <div id="categories-rail" className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-[#efe6dc]/50 mb-8 w-full">
        {(['all', 'serum', 'cleanser', 'mask', 'mist'] as const).map((cat) => (
          <button
            key={cat}
            id={`shop-category-tab-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-6 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#efe6dc] text-[#4a2815] shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-500'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div id="products-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const inCartItem = cart.find(item => item.product.id === p.id);
          return (
            <div
              key={p.id}
              id={`product-grid-card-${p.id}`}
              className="bg-white rounded-xl border border-[#efe6dc]/60 shadow-xs overflow-hidden flex flex-col justify-between group"
            >
              <div
                className="relative h-64 bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => onViewProduct(p)}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                {p.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-[#764229] text-white text-[9px] font-sans font-bold tracking-widest px-2.5 py-0.5 rounded-sm uppercase shadow-xs">
                    Más Vendido
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-xs text-stone-700 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                  {p.size}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                      {CATEGORY_LABELS[p.category] || p.category}
                    </span>
                    <span className="text-base font-serif font-bold text-[#764229]">${p.price.toFixed(2)}</span>
                  </div>
                  <h4
                    onClick={() => onViewProduct(p)}
                    className="text-lg font-serif text-[#4a2815] group-hover:text-[#764229] transition-colors leading-snug cursor-pointer font-semibold"
                  >
                    {p.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-2">
                    {p.shortDescription}
                  </p>
                </div>

                <div className="pt-5 flex gap-2">
                  <button
                    id={`catalog-view-btn-${p.id}`}
                    onClick={() => onViewProduct(p)}
                    className="flex-1 py-2 px-3 border border-[#efe6dc] hover:border-stone-300 text-stone-600 hover:text-stone-900 font-sans tracking-wide text-[10px] uppercase font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Detalles
                  </button>
                  <button
                    id={`catalog-bag-btn-${p.id}`}
                    onClick={() => onAddToCart(p)}
                    className="flex-1 py-2 px-3 bg-[#764229] hover:bg-[#4a2815] text-white font-sans tracking-wide text-[10px] uppercase font-semibold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {inCartItem ? `Añadir (${inCartItem.quantity})` : 'Añadir'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= EXTRA FEATURE: CART DRAWER OVERLAY ================= */}
      <AnimatePresence>
        {showingCart && (
          <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              id="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowingCart(false)}
              className="absolute inset-0 bg-[#4a2815]/20 backdrop-blur-xs"
            />

            {/* Sliding Panel */}
            <motion.div
              id="cart-slider-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md h-full bg-[#faf6f0] border-l border-[#efe6dc] shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#efe6dc] flex justify-between items-center bg-white">
                <div>
                  <h4 className="text-xl font-serif text-[#4a2815]">Mi Bolsa de Compras</h4>
                  <p className="text-[10px] text-stone-500 font-mono">Artículos exclusivos seleccionados</p>
                </div>
                <button
                  id="cart-close-btn"
                  onClick={() => setShowingCart(false)}
                  className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="hidden" />
                  <span className="text-xs uppercase font-sans font-bold tracking-widest px-1">Cerrar</span>
                </button>
              </div>

              {/* Central Bag list */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {checkoutSuccess ? (
                  /* ORDER SUCCESS REVEAL */
                  <motion.div
                    id="checkout-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-[#5e6c58] rounded-full flex items-center justify-center text-white shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#5e6c58] font-bold">Preparación en curso</span>
                    <h5 className="text-2xl font-serif text-[#4a2815]">¡Pedido Despachado!</h5>
                    <p className="text-xs text-stone-600 max-w-xs leading-normal">
                      Estamos envolviendo sus frascos de vidrio ámbar con protectores de lino orgánico seco. Consulte la pestaña de <span className="font-semibold text-stone-800">Mi Perfil</span> para ver el historial y estado de su orden.
                    </p>
                    <div className="pt-3 flex">
                      <button
                        onClick={() => setShowingCart(false)}
                        className="py-2.5 px-6 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-lg uppercase cursor-pointer"
                      >
                        Seguir Explorando
                      </button>
                    </div>
                  </motion.div>
                ) : cart.length === 0 ? (
                  /* EMPTY CART STATE */
                  <div className="text-center py-16 text-stone-400 space-y-2">
                    <ShoppingBag className="w-12 h-12 stroke-1 text-stone-300 mx-auto" />
                    <p className="text-sm font-serif">Su bolsa está vacía.</p>
                    <p className="text-[10px] text-stone-500 max-w-[200px] mx-auto">Seleccione sueros, mascarillas y brumas purificadoras para verlas aquí.</p>
                  </div>
                ) : (
                  /* ITEMS LIST */
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        id={`cart-item-row-${item.product.id}`}
                        className="flex gap-3 bg-white p-3.5 rounded-xl border border-[#efe6dc]/50 shadow-xs"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h5 className="font-serif font-bold text-[#4a2815] text-sm line-clamp-1">{item.product.name}</h5>
                              <span className="font-serif font-semibold text-xs text-[#764229]">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block mt-0.5">{item.product.size}</span>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-[#efe6dc] rounded-md overflow-hidden bg-[#faf6f0]">
                              <button
                                onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                                className="px-2 py-0.5 hover:bg-stone-200 text-stone-600 text-xs transition-colors cursor-pointer font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 text-xs font-mono font-bold text-[#4a2815]" id={`cart-row-qty-${item.product.id}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                                className="px-2 py-0.5 hover:bg-stone-200 text-stone-600 text-xs transition-colors cursor-pointer font-bold"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete line */}
                            <button
                              id={`cart-row-remove-${item.product.id}`}
                              onClick={() => onRemoveFromCart(item.product.id)}
                              className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#764229] hover:text-[#8a4f35] transition-colors cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Calculation Footer */}
              {!checkoutSuccess && cart.length > 0 && (
                <div className="p-5 border-t border-[#efe6dc] bg-white space-y-4">
                  {/* Promo coupon field */}
                  <form onSubmit={applyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código Cupón (Ej. AURA15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2.5 text-xs font-mono uppercase rounded-lg border border-[#efe6dc] bg-stone-50 focus:outline-none focus:border-[#764229]"
                    />
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      className="py-2.5 px-4 bg-stone-100 hover:bg-[#efe6dc] text-stone-700 hover:text-[#4a2815] text-[10px] font-sans font-bold tracking-wider rounded-lg uppercase border border-[#efe6dc] transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>

                  {/* Summary math */}
                  <div className="space-y-1.5 text-xs border-b border-[#efe6dc] pb-3 text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal de Productos</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-[#5e6c58] font-semibold">
                        <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Cupón de Bienvenida AURA15 (15% Off)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Envío Sustentable Neutral</span>
                      <span>$5.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-serif font-bold text-[#4a2815]">Total General</span>
                    <span className="font-serif font-bold text-xl text-[#764229]">${cartTotal.toFixed(2)}</span>
                  </div>

                  <p className="text-[9px] text-[#5e6c58] flex items-center justify-center gap-1 bg-[#efe6dc]/20 py-1.5 rounded border border-[#efe6dc]/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pago Seguro • Elegible para cambios o reembolsos
                  </p>

                  <button
                    id="cart-checkout-btn"
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-xl transition-all font-sans uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    Proceder al Pago
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
