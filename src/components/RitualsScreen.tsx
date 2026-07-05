import { motion } from 'motion/react';
import { ArrowRight, Menu, Sparkles, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Ritual, Product } from '../types';
import { RITUALS } from '../data';
import { ServiceVisual, SpecialistAvatar, PhotoPlaceholder } from './ServiceIcon';

// Portada del hero: pega aquí la URL de la foto cuando esté lista (deja '' para mostrar el placeholder)
const HERO_IMAGE = '';

interface RitualsScreenProps {
  onBookAppointment: () => void;
  onOpenPhilosophy: () => void;
  onViewRitual: (ritual: Ritual) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToTab: (tabId: 'refine' | 'rituals') => void;
}

export default function RitualsScreen({
  onBookAppointment,
  onOpenPhilosophy,
  onViewRitual,
  onNavigateToTab
}: RitualsScreenProps) {

  // Desplaza un carrusel horizontal (usado por las flechas en escritorio)
  const scrollSlider = (key: string, dir: 1 | -1) => {
    const el = document.getElementById(`rituals-slider-${key}`);
    if (el) el.scrollBy({ left: dir * 330, behavior: 'smooth' });
  };

  return (
    <div id="rituals-screen" className="relative w-full overflow-hidden bg-[#f7fbf9]">
      
      {/* 1. BRAND HEADER NAVIGATION */}
      <header id="aura-header" className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#f7fbf9]/80 backdrop-blur-md border-b border-[#dcebe2]/30">
        <button
          id="hdr-menu-btn"
          onClick={onOpenPhilosophy}
          className="p-1 px-1.5 focus:outline-none text-stone-700 hover:text-stone-950 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1
          id="hdr-brand-logo"
          onClick={() => onNavigateToTab('rituals')}
          className="text-3xl font-serif tracking-[0.18em] text-[#23543f] font-light cursor-pointer select-none"
        >
          AURA
        </h1>

        <button
          id="hdr-book-btn"
          onClick={onBookAppointment}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-[#35755d] hover:bg-[#23543f] active:scale-[0.95] text-white text-[10px] font-sans font-semibold tracking-widest uppercase rounded-full transition-[transform,background-color] duration-150 shadow-sm"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Reservar
        </button>
      </header>

      {/* 2. LUMINOUS CLINICAL HERO BANNER */}
      <section id="hero-banner" className="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden bg-[#f7fbf9]">
        {/* Portada del hero: foto real cuando exista, o placeholder con espacio reservado */}
        <div className="absolute inset-0 z-0">
          <PhotoPlaceholder src={HERO_IMAGE} label="Foto de portada · próximamente" className="absolute inset-0" />
          {HERO_IMAGE && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#12261d]/75 via-[#12261d]/25 to-[#12261d]/5" />
          )}
          {/* Orbes de luz flotantes — acento sutil, sin costo de carga */}
          <div aria-hidden="true" className="aura-orb aura-orb-a w-[45vw] h-[45vw] max-w-[420px] max-h-[420px] -top-[8%] -left-[10%] bg-[#7fa892]/50" />
          <div aria-hidden="true" className="aura-orb aura-orb-b w-[38vw] h-[38vw] max-w-[360px] max-h-[360px] bottom-[12%] -right-[8%] bg-[#dcebe2]/60" />
          {/* Destellos de luz dorada que ascienden sobre el hero */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="aura-particle"
                style={{
                  left: `${(i * 7 + 4) % 100}%`,
                  width: `${4 + (i % 4) * 2}px`,
                  height: `${4 + (i % 4) * 2}px`,
                  animationDuration: `${9 + (i % 5) * 2}s`,
                  animationDelay: `${(i % 7) * 1.4}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Text Alignments & Triggers */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-12 sm:p-12 sm:pb-20 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className={`text-xs tracking-[0.3em] font-sans font-semibold uppercase mb-3 ${HERO_IMAGE ? 'text-[#dcebe2]' : 'text-[#35755d]'}`}
          >
            Cosmetología Profesional
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className={`text-4xl sm:text-5xl md:text-6xl font-serif leading-[1.1] mb-8 max-w-2xl font-light tracking-wide ${HERO_IMAGE ? 'text-[#f3f8f5]' : 'text-[#1d3b2e]'}`}
          >
            Piel sana y luminosa, con ciencia y cuidado experto.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              id="hero-book-btn"
              onClick={onBookAppointment}
              className="py-4 px-8 bg-[#35755d] hover:bg-[#23543f] active:scale-[0.97] text-white text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase shadow-lg text-center cursor-pointer"
            >
              Reservar una cita
            </button>
            <button
              id="hero-philosophy-btn"
              onClick={onOpenPhilosophy}
              className={`py-4 px-8 border active:scale-[0.97] text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase backdrop-blur-xs text-center cursor-pointer ${HERO_IMAGE ? 'border-[#f3f8f5]/60 text-[#f3f8f5] hover:bg-white/10' : 'border-[#35755d]/50 text-[#23543f] hover:bg-[#35755d]/5'}`}
            >
              Nuestra filosofía
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. RITUALS — FACIALES / CORPORALES / MAQUILLAJE */}
      {([
        {
          key:      'facial',
          label:    'Faciales',
          eyebrow:  'Cabina · Servicios',
          desc:     'Faciales profesionales diseñados para cada tipo de piel.',
          filter:   (r: (typeof RITUALS)[0]) => r.subcategory === 'facial',
          border:   false,
        },
        {
          key:      'corporal',
          label:    'Corporales',
          eyebrow:  'Cabina · Servicios',
          desc:     'Masajes, reafirmantes y servicios corporales para el cuerpo.',
          filter:   (r: (typeof RITUALS)[0]) => r.subcategory === 'corporal',
          border:   true,
        },
        {
          key:      'maquillaje',
          label:    'Maquillaje',
          eyebrow:  'Arte & Imagen',
          desc:     'Looks profesionales de larga duración para cada ocasión.',
          filter:   (r: (typeof RITUALS)[0]) => r.category === 'maquillaje',
          border:   true,
        },
      ] as const).map((section) => {
        const sectionRituals = RITUALS.filter(section.filter);
        return (
          <section
            key={section.key}
            id={`rituals-section-${section.key}`}
            className={`py-16 px-6 max-w-6xl mx-auto ${section.border ? 'border-t border-[#dcebe2]/50' : ''}`}
          >
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#35755d]/70 uppercase block mb-1">
                  {section.eyebrow}
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#23543f] font-light">
                  {section.label}
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 max-w-lg leading-relaxed">
                  {section.desc}
                </p>
              </div>
              <button
                onClick={onBookAppointment}
                className="w-full sm:w-auto flex-shrink-0 py-2.5 px-5 border border-[#35755d]/40 text-[#35755d] hover:bg-[#35755d]/5 active:scale-[0.97] text-[10px] font-sans font-semibold tracking-widest uppercase rounded-full transition-[transform,background-color] duration-150 flex items-center justify-center gap-1.5"
              >
                Reservar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Carrusel con flechas de navegación en escritorio */}
            <div className="relative">
            <motion.div
              id={`rituals-slider-${section.key}`}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x scroll-smooth cursor-grab active:cursor-grabbing"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {sectionRituals.map((ritual) => (
                <motion.div
                  key={ritual.id}
                  id={`ritual-card-${ritual.id}`}
                  className="w-[260px] sm:w-[300px] flex-shrink-0 snap-start bg-transparent flex flex-col group cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }
                  }}
                  onClick={() => onViewRitual(ritual)}
                >
                  <div className="relative h-[340px] w-full rounded-xs overflow-hidden mb-4 bg-[#dcebe2] shadow-sm">
                    <ServiceVisual
                      ritual={ritual}
                      className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                      iconClassName="w-1/3 h-1/3"
                    />
                    {ritual.badge && (
                      <span className={`absolute top-4 right-4 backdrop-blur-xs border text-[9px] font-sans font-bold tracking-widest px-3 py-1 rounded-sm uppercase ${
                        ritual.customQuote
                          ? 'bg-sky-50/90 border-sky-200/60 text-sky-700'
                          : 'bg-[#dcebe2]/95 border-[#f3f8f5]/50 text-[#35755d]'
                      }`}>
                        {ritual.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 bg-[#0f231b]/45 text-[#dcebe2] font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {ritual.duration} MIN
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-xl font-serif text-[#23543f] group-hover:text-[#35755d] transition-colors duration-200 leading-snug">
                        {ritual.name}
                      </h4>
                      <span className="text-sm font-serif font-bold text-[#35755d] ml-2 flex-shrink-0">
                        {ritual.customQuote ? 'Cotización' : `$${ritual.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
                      {ritual.shortDescription}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest text-[#35755d] uppercase border-b border-transparent group-hover:border-[#35755d] w-max transition-[border-color] duration-200">
                      Explorar <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Flechas de navegación — solo escritorio (en móvil el carrusel se desliza con el dedo) */}
            {sectionRituals.length > 3 && (
              <>
                <button
                  type="button"
                  aria-label="Ver servicios anteriores"
                  onClick={() => scrollSlider(section.key, -1)}
                  className="hidden md:flex absolute left-0 -translate-x-1/2 top-[178px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#dcebe2] shadow-md items-center justify-center text-[#35755d] hover:bg-white hover:text-[#23543f] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Ver más servicios"
                  onClick={() => scrollSlider(section.key, 1)}
                  className="hidden md:flex absolute right-0 translate-x-1/2 top-[178px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#dcebe2] shadow-md items-center justify-center text-[#35755d] hover:bg-white hover:text-[#23543f] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            </div>
          </section>
        );
      })}

      {/* 4. SPECIALIST SPOTLIGHT */}
      <section id="specialist-spotlight" className="py-16 px-6 bg-[#e6f1ea]/40 border-t border-b border-[#dcebe2]/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h3 className="text-3xl sm:text-4xl font-serif text-[#23543f] font-light">Tu Especialista</h3>
            <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed font-serif italic">
              Atención personalizada y profesional en cada visita.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center bg-white rounded-xl border border-[#dcebe2] shadow-xs overflow-hidden">
            <div className="w-full sm:w-64 h-64 sm:h-auto flex-shrink-0 bg-[#dcebe2]">
              <SpecialistAvatar className="w-full h-full min-h-[16rem]" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#35755d] uppercase block mb-2">
                Especialista Certificada
              </span>
              <h4 className="text-3xl font-serif text-[#23543f] leading-tight mb-1">Anel (Especialista Aura)</h4>
              <p className="text-xs font-mono text-stone-500 mb-4 uppercase tracking-wider">Lic. Cosmetología e Imagen</p>
              <p className="text-sm text-stone-600 leading-relaxed font-serif mb-6">
                Licenciada en Cosmetología e Imagen, especializada en maquillaje artístico, técnicas faciales avanzadas y servicios corporales. Cada visita es una experiencia diseñada para realzar tu belleza natural con técnicas profesionales y atención personalizada.
              </p>
              <button
                id="specialist-book-btn"
                onClick={onBookAppointment}
                className="w-full sm:w-auto py-3 px-8 bg-[#35755d] hover:bg-[#23543f] active:scale-[0.97] text-white text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase cursor-pointer"
              >
                Agendar con Anel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REFINE CONCIERGE CALLOUT BLOCK */}
      <section id="refine-callout" className="py-16 px-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="max-w-md">
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#35755d] uppercase">Evaluación de la Piel</span>
          <h4 className="text-3xl font-serif text-[#23543f] mt-1 mb-2 leading-snug">Descubre el servicio ideal para tu piel</h4>
          <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
            Completa nuestro breve análisis sensorial botánico. Cuéntanos acerca de tus sensibilidades cutáneas y preocupaciones, y nuestro algoritmo identificará los servicios y activos ideales para el ritmo óptimo de tu piel.
          </p>
        </div>
        <button
          id="go-to-refine-block"
          onClick={() => onNavigateToTab('refine')}
          className="w-full md:w-auto py-3.5 px-8 bg-[#35755d] hover:bg-[#23543f] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#dcebe2]" />
          Refinar mi Rutina
        </button>
      </section>

      {/* 6. FOUNDER CITATION QUOTATION SECTION */}
      <section id="founder-citation" className="py-24 px-6 bg-[#f7fbf9] text-center border-t border-[#dcebe2]/40">
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl font-serif text-[#d3e5da] text-center block mb-2 select-none leading-none">“</span>
          
          <blockquote className="text-2xl sm:text-3xl font-serif text-[#35755d] italic leading-relaxed tracking-wide font-light mb-8">
            Tu belleza natural es el lienzo. Mi trabajo es hacerla brillar con técnica, cuidado y pasión.
          </blockquote>
          
          <cite className="text-[10px] sm:text-xs not-italic font-sans tracking-[0.2em] font-semibold text-stone-500 uppercase">
            — Anel, Lic. Cosmetología e Imagen
          </cite>
        </div>
      </section>

      {/* 7. ELEGANT FOOTER */}
      <footer id="aura-footer" className="py-12 px-6 border-t border-[#dcebe2] bg-stone-50 text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-serif tracking-[0.2em] text-[#23543f]">AURA</span>
            <p className="text-[10px] mt-1.5 text-stone-500 font-sans tracking-wide">
              Cosmetología e Imagen Profesional.
            </p>
            <a
              href="https://wa.me/526381285959"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] mt-1 text-[#35755d] hover:text-[#23543f] font-sans font-semibold tracking-wide transition-colors"
            >
              WhatsApp: 638 128 5959
            </a>
          </div>
          <div className="flex gap-6 text-[10px] font-sans font-semibold tracking-widest uppercase">
            <button onClick={onOpenPhilosophy} className="hover:text-stone-700 transition-[#35755d] cursor-pointer">Filosofía</button>
            <button onClick={() => onNavigateToTab('refine')} className="hover:text-stone-700 transition-[#35755d] cursor-pointer">Análisis</button>
            {/* <button onClick={() => onNavigateToTab('shop')} className="hover:text-stone-700 transition-[#35755d] cursor-pointer">Tienda</button> */}
            <button onClick={onBookAppointment} className="hover:text-stone-700 transition-[#35755d] cursor-pointer">Reservar</button>
          </div>
          <p className="text-[9px] font-mono text-center md:text-right">
            © 2026 SANTUARIO AURA. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
