import { motion } from 'motion/react';
import { ArrowRight, Menu, Sparkles, CalendarPlus } from 'lucide-react';
import { Ritual, Product } from '../types';
import { RITUALS } from '../data';

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

  return (
    <div id="rituals-screen" className="relative w-full overflow-hidden bg-[#faf8f5]">
      
      {/* 1. BRAND HEADER NAVIGATION */}
      <header id="aura-header" className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#faf8f5]/80 backdrop-blur-md border-b border-[#efe6dc]/30">
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
          className="text-3xl font-serif tracking-[0.18em] text-[#4a2815] font-light cursor-pointer select-none"
        >
          AURA
        </h1>

        <button
          id="hdr-book-btn"
          onClick={onBookAppointment}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.95] text-white text-[10px] font-sans font-semibold tracking-widest uppercase rounded-full transition-[transform,background-color] duration-150 shadow-sm"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Reservar
        </button>
      </header>

      {/* 2. MAJESTIC SPA LOBBY HERO BANNER */}
      <section id="hero-banner" className="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden bg-stone-950">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80"
            alt="Aura Spa Sanctuary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105"
            style={{ objectPosition: 'center 40%' }}
          />
          {/* Subtle gradient overlay to enhance visual readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40" />
        </div>

        {/* Hero Text Alignments & Triggers */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-12 sm:p-12 sm:pb-20 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-xs tracking-[0.3em] font-sans text-[#efe6dc] font-semibold uppercase mb-3 drop-shadow-sm"
          >
            La Esencia de la Pureza
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#faf6f0] leading-[1.1] mb-8 max-w-2xl font-light tracking-wide"
          >
            Eleva tu belleza natural con cuidado artesanal.
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
              className="py-4 px-8 bg-[#764229] hover:bg-[#54311f] active:scale-[0.97] text-white text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase shadow-lg text-center cursor-pointer"
            >
              Reservar una cita
            </button>
            <button
              id="hero-philosophy-btn"
              onClick={onOpenPhilosophy}
              className="py-4 px-8 border border-[#faf6f0]/60 hover:bg-white/10 active:scale-[0.97] text-[#faf6f0] text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase backdrop-blur-xs text-center cursor-pointer"
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
            className={`py-16 px-6 max-w-6xl mx-auto ${section.border ? 'border-t border-[#efe6dc]/50' : ''}`}
          >
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#764229]/70 uppercase block mb-1">
                  {section.eyebrow}
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] font-light">
                  {section.label}
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 max-w-lg leading-relaxed">
                  {section.desc}
                </p>
              </div>
              <button
                onClick={onBookAppointment}
                className="w-full sm:w-auto flex-shrink-0 py-2.5 px-5 border border-[#764229]/40 text-[#764229] hover:bg-[#764229]/5 active:scale-[0.97] text-[10px] font-sans font-semibold tracking-widest uppercase rounded-full transition-[transform,background-color] duration-150 flex items-center justify-center gap-1.5"
              >
                Reservar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Scroll horizontal con stagger */}
            <motion.div
              id={`rituals-slider-${section.key}`}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x cursor-grab active:cursor-grabbing"
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
                  <div className="relative h-[340px] w-full rounded-xs overflow-hidden mb-4 bg-[#efe6dc] shadow-sm">
                    <img
                      src={ritual.imageUrl}
                      alt={ritual.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {ritual.badge && (
                      <span className={`absolute top-4 right-4 backdrop-blur-xs border text-[9px] font-sans font-bold tracking-widest px-3 py-1 rounded-sm uppercase ${
                        ritual.customQuote
                          ? 'bg-sky-50/90 border-sky-200/60 text-sky-700'
                          : 'bg-[#efe6dc]/95 border-[#faf6f0]/50 text-[#764229]'
                      }`}>
                        {ritual.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 bg-[#1c130d]/45 text-[#efe6dc] font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {ritual.duration} MIN
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-xl font-serif text-[#4a2815] group-hover:text-[#764229] transition-colors duration-200 leading-snug">
                        {ritual.name}
                      </h4>
                      <span className="text-sm font-serif font-bold text-[#764229] ml-2 flex-shrink-0">
                        {ritual.customQuote ? 'Cotización' : `$${ritual.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
                      {ritual.shortDescription}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest text-[#764229] uppercase border-b border-transparent group-hover:border-[#764229] w-max transition-[border-color] duration-200">
                      Explorar <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        );
      })}

      {/* 4. SPECIALIST SPOTLIGHT */}
      <section id="specialist-spotlight" className="py-16 px-6 bg-[#f4eae1]/40 border-t border-b border-[#efe6dc]/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h3 className="text-3xl sm:text-4xl font-serif text-[#4a2815] font-light">Tu Especialista</h3>
            <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed font-serif italic">
              Atención personalizada y profesional en cada visita.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center bg-white rounded-xl border border-[#efe6dc] shadow-xs overflow-hidden">
            <div className="w-full sm:w-64 h-64 sm:h-auto flex-shrink-0 bg-[#efe6dc]">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
                alt="Anel Reyna"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase block mb-2">
                Especialista Certificada
              </span>
              <h4 className="text-3xl font-serif text-[#4a2815] leading-tight mb-1">Anel Reyna</h4>
              <p className="text-xs font-mono text-stone-500 mb-4 uppercase tracking-wider">Lic. Cosmetología e Imagen</p>
              <p className="text-sm text-stone-600 leading-relaxed font-serif mb-6">
                Licenciada en Cosmetología e Imagen, especializada en maquillaje artístico, técnicas faciales avanzadas y servicios corporales. Cada visita es una experiencia diseñada para realzar tu belleza natural con técnicas profesionales y atención personalizada.
              </p>
              <button
                id="specialist-book-btn"
                onClick={onBookAppointment}
                className="w-full sm:w-auto py-3 px-8 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-[0.2em] rounded-sm transition-[transform,background-color] duration-150 font-sans uppercase cursor-pointer"
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
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#764229] uppercase">Evaluación de la Piel</span>
          <h4 className="text-3xl font-serif text-[#4a2815] mt-1 mb-2 leading-snug">Descubre el servicio ideal para tu piel</h4>
          <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
            Completa nuestro breve diagnóstico sensorial botánico. Cuéntanos acerca de tus sensibilidades cutáneas y preocupaciones, y nuestro algoritmo identificará los servicios y activos ideales para el ritmo óptimo de tu piel.
          </p>
        </div>
        <button
          id="go-to-refine-block"
          onClick={() => onNavigateToTab('refine')}
          className="w-full md:w-auto py-3.5 px-8 bg-[#764229] hover:bg-[#4a2815] active:scale-[0.97] text-white text-xs font-semibold tracking-wider rounded-xl transition-[transform,background-color] duration-150 font-sans uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#efe6dc]" />
          Refinar mi Rutina
        </button>
      </section>

      {/* 6. FOUNDER CITATION QUOTATION SECTION */}
      <section id="founder-citation" className="py-24 px-6 bg-[#faf8f5] text-center border-t border-[#efe6dc]/40">
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl font-serif text-[#e4dacd] text-center block mb-2 select-none leading-none">“</span>
          
          <blockquote className="text-2xl sm:text-3xl font-serif text-[#764229] italic leading-relaxed tracking-wide font-light mb-8">
            Tu belleza natural es el lienzo. Mi trabajo es hacerla brillar con técnica, cuidado y pasión.
          </blockquote>
          
          <cite className="text-[10px] sm:text-xs not-italic font-sans tracking-[0.2em] font-semibold text-stone-500 uppercase">
            — Anel Reyna, Lic. Cosmetología e Imagen
          </cite>
        </div>
      </section>

      {/* 7. ELEGANT FOOTER */}
      <footer id="aura-footer" className="py-12 px-6 border-t border-[#efe6dc] bg-stone-50 text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-serif tracking-[0.2em] text-[#4a2815]">AURA</span>
            <p className="text-[10px] mt-1.5 text-stone-500 font-sans tracking-wide">
              Cosmetología e Imagen Profesional.
            </p>
          </div>
          <div className="flex gap-6 text-[10px] font-sans font-semibold tracking-widest uppercase">
            <button onClick={onOpenPhilosophy} className="hover:text-stone-700 transition-[#764229] cursor-pointer">Filosofía</button>
            <button onClick={() => onNavigateToTab('refine')} className="hover:text-stone-700 transition-[#764229] cursor-pointer">Diagnóstico</button>
            {/* <button onClick={() => onNavigateToTab('shop')} className="hover:text-stone-700 transition-[#764229] cursor-pointer">Tienda</button> */}
            <button onClick={onBookAppointment} className="hover:text-stone-700 transition-[#764229] cursor-pointer">Reservar</button>
          </div>
          <p className="text-[9px] font-mono text-center md:text-right">
            © 2026 SANTUARIO AURA. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
