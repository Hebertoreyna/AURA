import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={`product-modal-${product.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4a2815]/30 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="product-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-[#faf6f0] rounded-2xl overflow-hidden shadow-2xl border border-[#efe6dc] md:flex"
            style={{ maxHeight: '90vh' }}
          >
            {/* Close button */}
            <button
              id="product-modal-close"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/70 backdrop-blur-md rounded-full shadow-md text-stone-700 hover:text-stone-950 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Hero Image with best seller indicator */}
            <div id="product-modal-image-panel" className="relative w-full md:w-1/2 h-56 md:h-auto min-h-[250px] bg-[#efe6dc]">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-[#764229] text-white text-[10px] font-sans font-semibold tracking-wider px-3 py-1 rounded-full uppercase">
                  Más Vendido
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#4a2815]/50 to-transparent p-4 flex items-end md:hidden">
                <div>
                  <span className="text-[10px] font-sans tracking-widest text-[#efe6dc] uppercase">{product.category}</span>
                  <h3 className="text-2xl font-serif text-white">{product.name}</h3>
                </div>
              </div>
            </div>

            {/* Right side: Detailed Information */}
            <div id="product-modal-info-panel" className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
              {/* Desktop Header */}
              <div className="hidden md:block mb-4">
                <span className="text-xs font-sans tracking-widest text-[#764229] uppercase font-semibold">{product.category}</span>
                <h3 className="text-3xl font-serif text-[#4a2815] mt-1 leading-tight">{product.name}</h3>
                <p className="text-sm text-stone-500 font-mono mt-1">{product.size}</p>
              </div>

              {/* Price Tag & Description */}
              <div className="flex justify-between items-baseline pb-4 border-b border-[#efe6dc] mb-4">
                <span className="text-2xl font-serif text-[#764229] font-semibold">${product.price.toFixed(2)}</span>
                <span className="text-xs font-mono text-[#5e6c58] flex items-center gap-1">
                  <Sparkles className="w-3 w-3" /> {product.rating} / 5 ({product.reviewsCount} reseñas)
                </span>
              </div>

              {/* Core Description */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">{product.description}</p>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-xs font-sans font-semibold tracking-wider uppercase text-[#4a2815] mb-2">Beneficios Clave</h4>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-[#efe6dc] bg-[#764229] w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions */}
              <div className="mb-4 bg-[#f2eae4] p-3 rounded-xl border border-[#efe6dc]">
                <h4 className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#764229] mb-1">Instrucciones del Ritual</h4>
                <p className="text-xs text-[#54311f] italic">{product.howToUse}</p>
              </div>

              {/* Ingredients Details */}
              <div className="mb-6">
                <h4 className="text-xs font-sans font-semibold tracking-wider uppercase text-[#4a2815] mb-1">Ingredientes Completos</h4>
                <p className="text-[10px] font-sans text-stone-500 leading-normal bg-stone-50/50 p-2 rounded border border-stone-100 max-h-20 overflow-y-auto">
                  {product.ingredients.join(', ')}
                </p>
              </div>

              {/* CTA Add to Cart */}
              <div className="mt-auto pt-4 flex gap-3">
                <button
                  id={`product-add-to-cart-${product.id}`}
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-[#764229] hover:bg-[#4a2815] text-white text-xs font-semibold tracking-wider rounded-xl transition-all font-sans uppercase flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Añadir a la Bolsa — ${product.price.toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
