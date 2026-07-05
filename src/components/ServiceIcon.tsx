import { Ritual } from '../types';
import { SPECIALISTS, PRODUCTS } from '../data';

/**
 * Sistema de imágenes de AURA.
 *
 * Cada bloque muestra la FOTO real si existe (campo `imageUrl` / `avatarUrl`),
 * o un placeholder elegante con ícono de cámara si aún no hay foto.
 *
 * Para cargar las fotos después de la sesión: solo pega la URL de cada imagen
 * en el campo correspondiente de `src/data.ts` (imageUrl del ritual, avatarUrl
 * de la especialista, imageUrl del producto). La foto aparece automáticamente.
 */

const Camera = ({ className = 'w-1/3 h-1/3' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3}
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 8.5a2 2 0 0 1 2-2h1.8l1.3-2h5.8l1.3 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="12.3" r="3.2" />
  </svg>
);

/** Degradado de fondo del placeholder según la categoría del servicio. */
export function getServiceGradient(ritual: Pick<Ritual, 'category' | 'subcategory'>): string {
  if (ritual.category === 'maquillaje') return 'from-[#f2ede5] to-[#e6ded2]';
  if (ritual.subcategory === 'corporal') return 'from-[#eaf3ee] to-[#d9e7df]';
  return 'from-[#eef4f0] to-[#dbe8e0]'; // facial
}

interface FrameProps {
  src?: string;
  alt?: string;
  className?: string;
  gradient?: string;
  iconClassName?: string;
}

/** Muestra la foto si `src` existe; si no, un placeholder con ícono de cámara. */
function PhotoFrame({
  src,
  alt = '',
  className = '',
  gradient = 'from-[#eef4f0] to-[#dbe8e0]',
  iconClassName = 'w-1/3 h-1/3',
}: FrameProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} text-[#8aa89a] ${className}`}
      aria-hidden="true"
    >
      <Camera className={iconClassName} />
    </div>
  );
}

/** Imagen de un servicio: foto real o placeholder (usado en tarjetas y modales). */
export function ServiceVisual({
  ritual,
  className = '',
  iconClassName = 'w-2/5 h-2/5',
}: {
  ritual: Ritual;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <PhotoFrame
      src={ritual.imageUrl}
      alt={ritual.name}
      className={className}
      gradient={getServiceGradient(ritual)}
      iconClassName={iconClassName}
    />
  );
}

/** Foto (o placeholder) de la especialista. */
export function SpecialistAvatar({ className = '' }: { className?: string }) {
  return (
    <PhotoFrame
      src={SPECIALISTS[0]?.avatarUrl}
      alt={SPECIALISTS[0]?.name ?? 'Especialista AURA'}
      className={className}
      iconClassName="w-1/3 h-1/3"
    />
  );
}

/** Foto (o placeholder) de un producto. */
export function ProductIcon({
  className = '',
  iconClassName = 'w-2/5 h-2/5',
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <PhotoFrame
      src={PRODUCTS[0]?.imageUrl}
      alt={PRODUCTS[0]?.name ?? 'Producto AURA'}
      className={className}
      iconClassName={iconClassName}
    />
  );
}

/** Placeholder grande genérico (p. ej. portada del hero). */
export function PhotoPlaceholder({
  src,
  alt = '',
  className = '',
  label,
}: {
  src?: string;
  alt?: string;
  className?: string;
  label?: string;
}) {
  if (src) {
    return (
      <img src={src} alt={alt} referrerPolicy="no-referrer" className={`w-full h-full object-cover ${className}`} />
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#eef4f0] to-[#dbe8e0] text-[#8aa89a] ${className}`}
      aria-hidden="true"
    >
      <Camera className="w-14 h-14" />
      {label && <span className="text-[10px] font-sans tracking-[0.25em] uppercase">{label}</span>}
    </div>
  );
}
