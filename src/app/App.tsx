import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  MapPin,
  Heart,
  CreditCard,
  Users,
  CheckCircle,
  ExternalLink,
  Sun,
  Moon,
  Wrench,
  Hammer,
  AlertCircle,
  Globe,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { RenovationPopup } from "@/app/components/ui/renovation-popup";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { AboutPage } from "@/app/components/AboutPage";
import logoImg from "../public/cropped-LOGO-NEGRO-SIN-LETRAS.png";

// ─── DATA ────────────────────────────────────────────────────────────────────

const programs = [
  {
    id: 1,
    title: "Educación Artística Comunitaria",
    tag: "Niñes 8–18",
    desc: "Talleres semanales de artes plásticas, escultura y medios mixtos que construyen confianza creativa desde la raíz.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&h=500&fit=crop&auto=format",
    color: "#d4f500",
  },
  {
    id: 2,
    title: "Laboratorio de Medios Digitales",
    tag: "Todas las edades",
    desc: "Fotografía, edición de video e ilustración digital con herramientas de nivel profesional, accesibles para todes.",
    image: "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=700&h=500&fit=crop&auto=format",
    color: "#ff3366",
  },
  {
    id: 3,
    title: "Narrativas Colectivas",
    tag: "Jóvenes y adultes",
    desc: "Historia oral, fanzines y escritura narrativa que centra las voces del territorio y la memoria viva.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&h=500&fit=crop&auto=format",
    color: "#a78bfa",
  },
  {
    id: 4,
    title: "Música y Producción Sonora",
    tag: "13+ años",
    desc: "Composición, producción de beats y grabación en estudio. Del barrio al escenario, con acompañamiento real.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=700&h=500&fit=crop&auto=format",
    color: "#fb923c",
  },
  {
    id: 5,
    title: "Residencias de Artes Visuales",
    tag: "Artistas",
    desc: "Residencias de seis semanas con espacio de estudio, mentoría y exposición colectiva de cierre.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&h=500&fit=crop&auto=format",
    color: "#34d399",
  },
];

const quotes = [
  {
    text: "Platohedro me dio el lenguaje para decir lo que siempre sentí. Mi arte ahora tiene sentido — para mí y para mi comunidad.",
    author: "Valentina M.",
    role: "Participante, Educación Artística, 2023",
  },
  {
    text: "Llegué pensando que no tenía nada que decir. Me fui con un fanzine y una lectura en la biblioteca. Eso lo cambió todo.",
    author: "Andrés K.",
    role: "Participante, Narrativas Colectivas",
  },
  {
    text: "La residencia no solo me dio espacio de estudio. Me dio pares que me desafían y mentores que creen en el trabajo.",
    author: "Sienna R.",
    role: "Residencia de Artes Visuales, Primavera 2024",
  },
];

const events = [
  {
    date: { month: "AGO", day: "09" },
    title: "Noche de Estudio Abierto",
    location: "Galería Principal, 3er Piso",
    time: "6:00 – 9:00 PM",
    tag: "Libre",
  },
  {
    date: { month: "AGO", day: "16" },
    title: "Apertura: Exposición de Jóvenes Artistas",
    location: "Sala Comunal",
    time: "5:00 – 8:00 PM",
    tag: "Libre",
  },
  {
    date: { month: "AGO", day: "24" },
    title: "Taller de Producción Sonora",
    location: "Estudio de Grabación B",
    time: "2:00 – 5:00 PM",
    tag: "Inscripción",
  },
  {
    date: { month: "SEP", day: "07" },
    title: "Conversación con Artista en Residencia",
    location: "Sala de Conferencias, 2do Piso",
    time: "7:00 – 9:00 PM",
    tag: "Libre",
  },
  {
    date: { month: "SEP", day: "14" },
    title: "Encuentro Anual de Comunidad",
    location: "Terraza Platohedro",
    time: "7:00 PM",
    tag: "Registro",
  },
];

const sponsors = [
  { name: "Ministerio de Cultura", full: "Ministerio de Cultura de Colombia" },
  { name: "Alcaldía de Medellín", full: "Alcaldía de Medellín" },
  { name: "Idartes", full: "Instituto Distrital de las Artes" },
  { name: "Colciencias", full: "Ministerio de Ciencia y Tecnología" },
  { name: "Redes", full: "Red Nacional de Cultura" },
  { name: "Open Society", full: "Open Society Foundations" },
];

const artsThoughts = [
  {
    category: "Ensayo",
    title: "Por qué el arte comunitario es el acto político más urgente",
    date: "28 de julio, 2025",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop&auto=format",
  },
  {
    category: "Conversación",
    title: "Artistas en residencia: sobre el pertenecer y el hacer",
    date: "14 de julio, 2025",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format",
  },
  {
    category: "Notas de Campo",
    title: "Lo que 200 artistas jóvenes nos enseñaron este año",
    date: "30 de junio, 2025",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
  },
];

const techInitiatives = [
  {
    icon: "🖥️",
    title: "Laboratorio de Acceso Digital",
    desc: "Acceso libre a computadores, Wi-Fi y talleres de alfabetización digital para integrantes de la comunidad.",
  },
  {
    icon: "🎬",
    title: "Estudio de Cine y Podcast",
    desc: "Equipos de grabación de nivel profesional disponibles para residentes y participantes de programas.",
  },
  {
    icon: "🤖",
    title: "Arte, IA y Conocimiento Libre",
    desc: "Sesiones mensuales para explorar críticamente las tecnologías emergentes desde prácticas artísticas y el Buen Conocer.",
  },
];

const donorTiers = [
  { amount: "$50k", label: "Semilla", perks: "boletín, actualizaciones de eventos" },
  { amount: "$150k", label: "Raíz", perks: "Todo lo anterior + 2 entradas a eventos" },
  { amount: "$300k", label: "Árbol", perks: "Todo lo anterior + catálogo anual" },
  { amount: "$1M", label: "Bosque", perks: "Todo lo anterior + visita al estudio y encuentro con artistas" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [donateStep, setDonateStep] = useState(1);
  const [showRenovationPopup, setShowRenovationPopup] = useState(true);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {
      // ignore
    }
  }, [isDark]);

  const prevProgram = () => setCarouselIndex((i) => (i === 0 ? programs.length - 1 : i - 1));
  const nextProgram = () => setCarouselIndex((i) => (i === programs.length - 1 ? 0 : i + 1));

  const prevQuote = () => setQuoteIndex((i) => (i === 0 ? quotes.length - 1 : i - 1));
  const nextQuote = () => setQuoteIndex((i) => (i === quotes.length - 1 ? 0 : i + 1));

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >

      {/* ══════════════════════════════════════════════════════
          HEADER / NAVIGATION BAR
      ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#0051A2]/95 backdrop-blur border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 overflow-hidden bg-[#7dcfca] flex items-center justify-center p-1">
              <ImageWithFallback
                src={logoImg}
                alt="Platohedro logo — geometric lattice of connected diamonds"
                className="w-full h-full object-contain logo-img"
              />
            </div>
            <span className="text-base font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
              Platohedro
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              ["Educación", "#programs"],
              ["Residencias", "#residencies"],
              ["Tecnología", "#technology"],
              ["Tienda / Galería", "#shop"],
              ["Acerca de", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Donate CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#donate"
              className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold hover:bg-foreground transition-colors duration-200"
            >
              <Heart size={14} className="group-hover:scale-110 transition-transform" />
              Apoyar
            </a>
          </div>

          {/* Theme toggle (between Apoyar and menu) */}
          <button
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-md bg-transparent hover:bg-white/10 text-current mr-2"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Language switcher */}
          <div className="hidden lg:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center">
            <button
              className="lg:hidden text-white"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Abrir menú"
            >
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {navOpen && (
          <div className="lg:hidden bg-[#003d7a] border-t border-white/20 px-6 py-6 space-y-4">
            {[
              ["Educación", "#programs"],
              ["Residencias", "#residencies"],
              ["Tecnología", "#technology"],
              ["Tienda / Galería", "#shop"],
              ["Acerca de", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="block text-sm text-muted-foreground hover:text-foreground py-1"
                onClick={() => setNavOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href="#donate"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-bold w-fit"
              onClick={() => setNavOpen(false)}
            >
              <Heart size={14} /> Apoyar
            </a>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════
          ABOUT PAGE
      ══════════════════════════════════════════════════════ */}
      <section id="about">
        <AboutPage />
      </section>

      {/* ══════════════════════════════════════════════════════
          HERO / MISSION STATEMENT
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary">
          <img
            src="https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&h=800&fit=crop&auto=format"
            alt="Comunidad creativa reunida en un espacio de experimentación colectiva"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-36">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-accent" />
              <span className="text-xs text-accent tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
                Cultivando creatividad y comunidad desde 2004
              </span>
            </div>

            {/* Mission */}
            <h1
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] font-bold mb-8"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <span className="italic text-primary">Buen Vivir,</span><br />
              Buen Conocer.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              Platohedro es una organización cultural que trabaja en la intersección del arte, la tecnología y la educación para fomentar la transformación social, ambiental y personal. Colaboramos con comunidades para imaginar y construir nuevas posibilidades a través de la inteligencia colectiva, la experimentación creativa y las prácticas arraigadas en el territorio.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#programs"
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-foreground transition-colors duration-200 text-sm"
              >
                Explorar programas <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#donate"
                className="flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold hover:border-primary hover:text-primary transition-colors duration-200 text-sm"
              >
                <Heart size={16} /> Apoyar el proceso
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
            {[
              ["432", "Niñes y jóvenes al año (proyectado)"],
              ["79", "Madres participantes al año (proyectado)"],
              ["287", "Residencias desde 2004"],
              ["22 años", "De impacto en Medellín"],
            ].map(([num, label]) => (
              <div key={label} className="bg-background/80 backdrop-blur-sm px-6 py-5">
                <div
                  className="text-2xl md:text-3xl font-bold text-primary mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {num}
                </div>
                <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          QUOTES / TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="border-y border-white/20 py-20 px-6 md:px-10" style={{ backgroundColor: "#FF46A2" }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs text-white/70 tracking-widest uppercase block mb-10" style={{ fontFamily: "'DM Mono', monospace" }}>
            En sus palabras
          </span>

          <div className="relative min-h-[160px] flex flex-col items-center justify-center">
            <blockquote
              key={quoteIndex}
              className="text-xl md:text-2xl text-white leading-relaxed italic mb-8"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              "{quotes[quoteIndex].text}"
            </blockquote>
            <div>
              <div className="text-sm font-semibold text-white">{quotes[quoteIndex].author}</div>
              <div className="text-xs text-white/70 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                {quotes[quoteIndex].role}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevQuote}
              className="w-9 h-9 border border-white/40 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIndex(i)}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ backgroundColor: i === quoteIndex ? "#ffffff" : "rgba(255,255,255,0.35)" }}
                />
              ))}
            </div>
            <button
              onClick={nextQuote}
              className="w-9 h-9 border border-white/40 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          EDUCACIÓN — CAROUSEL / GRID
      ══════════════════════════════════════════════════════ */}
      <section id="programs" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs text-primary tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              Educación
            </span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Lo que ofrecemos
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevProgram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
              {carouselIndex + 1} / {programs.length}
            </span>
            <button onClick={nextProgram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {programs.map((prog, i) => (
            <div
              key={prog.id}
              className="group relative overflow-hidden border border-border transition-all duration-500 cursor-pointer flex flex-col"
              style={{ borderColor: i === carouselIndex ? prog.color + "80" : undefined }}
              onClick={() => setCarouselIndex(i)}
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-background/50 group-hover:bg-background/30 transition-colors duration-500" />
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: prog.color, color: "#0d0714", fontFamily: "'DM Mono', monospace" }}
                >
                  {prog.tag}
                </div>
                <div
                  className="absolute bottom-3 right-3 text-3xl font-bold opacity-30"
                  style={{ fontFamily: "'DM Serif Display', serif", color: prog.color }}
                >
                  {String(prog.id).padStart(2, "0")}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold mb-2 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {prog.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{prog.desc}</p>
                <button className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: prog.color }}>
                  Saber más <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden border border-border">
            <div className="relative aspect-[4/3] bg-muted">
              <img
                src={programs[carouselIndex].image}
                alt={programs[carouselIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/40" />
              <div
                className="absolute top-4 left-4 px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: programs[carouselIndex].color, color: "#0d0714", fontFamily: "'DM Mono', monospace" }}
              >
                {programs[carouselIndex].tag}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {programs[carouselIndex].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{programs[carouselIndex].desc}</p>
              <button className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: programs[carouselIndex].color }}>
                Saber más <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-4">
            {programs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: i === carouselIndex ? "#d4f500" : undefined }}
                aria-label={`Programa ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
            Ver todos los programas <ArrowUpRight size={16} />
          </a>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          RESIDENCIAS
      ══════════════════════════════════════════════════════ */}
      <section id="residencies" className="border-t border-white/20 py-24 px-6 md:px-10" style={{ backgroundColor: "#99CC33" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs text-[#0051A2] tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                Residencias
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Espacio para crear<br />
                <span className="italic text-[#FF46A2]">desde adentro.</span>
              </h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-[#0051A2]/70 hover:text-[#0051A2] transition-colors">
              Ver convocatorias <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Featured residency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#0051A2]/30 mb-8">
            <div className="relative overflow-hidden aspect-[4/3] bg-[#003d7a]">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop&auto=format"
                alt="Artista en residencia trabajando en el estudio de Platohedro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0051A2]/20" />
              <div className="absolute top-5 left-5 px-3 py-1 bg-[#FF46A2] text-white text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                Convocatoria abierta
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-white/90">
              <span className="text-xs text-[#FF46A2] tracking-widest uppercase block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                Residencia Principal · 6 semanas
              </span>
              <h3 className="text-3xl font-bold mb-4 leading-tight text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Residencia de Artes Visuales y Medios
              </h3>
              <p className="text-[#0051A2]/70 text-sm leading-relaxed mb-6">
                Seis semanas de inmersión creativa con espacio de estudio propio, mentoría semanal, acceso a todos los laboratorios y una exposición colectiva de cierre abierta a la comunidad.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[["6", "Semanas de duración"], ["4", "Artistas por cohorte"], ["Libre", "Acceso a laboratorios"], ["2004", "Primera residencia"]].map(([val, label]) => (
                  <div key={label} className="border border-[#0051A2]/20 p-3 bg-[#99CC33]/10">
                    <div className="text-lg font-bold text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>{val}</div>
                    <div className="text-xs text-[#0051A2]/60 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</div>
                  </div>
                ))}
              </div>
              <a href="#" className="group inline-flex items-center gap-2 px-6 py-3 bg-[#0051A2] text-white text-sm font-semibold hover:bg-[#FF46A2] transition-colors w-fit">
                Aplicar ahora <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Other residency types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Residencia de Investigación",
                tag: "3 semanas",
                desc: "Para investigadores, teóricos y curadores que quieren trabajar en el cruce entre arte, territorio y conocimiento.",
                color: "#a78bfa",
                image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&auto=format",
              },
              {
                title: "Residencia Sonora",
                tag: "4 semanas",
                desc: "Producción, composición y experimentación sonora en el estudio de grabación. Para músicos, podcasters y artistas de audio.",
                color: "#fb923c",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop&auto=format",
              },
              {
                title: "Residencia Comunitaria",
                tag: "8 semanas",
                desc: "Proceso de co-creación con comunidades del barrio. Arte situado, memoria colectiva y transformación desde el territorio.",
                color: "#34d399",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format",
              },
            ].map((res) => (
              <article key={res.title} className="group cursor-pointer border border-[#0051A2]/20 hover:border-[#0051A2]/50 transition-all bg-white/80 flex flex-col">
                <div className="overflow-hidden aspect-[16/9] bg-[#003d7a] relative">
                  <img src={res.image} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#0051A2]/30" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold bg-[#FF46A2] text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {res.tag}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold mb-2 text-[#0051A2] group-hover:text-[#FF46A2] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {res.title}
                  </h3>
                  <p className="text-xs text-[#0051A2]/70 leading-relaxed flex-1">{res.desc}</p>
                  <button className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0051A2] hover:text-[#FF46A2] transition-colors">
                    Saber más <ArrowUpRight size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          TECNOLOGÍA
      ══════════════════════════════════════════════════════ */}
      <section id="technology" className="border-t border-white/20 py-24 px-6 md:px-10" style={{ backgroundColor: "#FF46A2" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs text-white/70 tracking-widest uppercase block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
              Tecnología
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Herramientas creativas<br />
              <span className="italic text-[#0051A2]">para todas las personas.</span>
            </h2>
            <p className="text-white/75 leading-relaxed mb-10 max-w-md">
              El acceso a la tecnología creativa no puede depender del ingreso económico. Nuestros laboratorios digitales y estudios de medios están abiertos a toda la comunidad, de forma libre y gratuita, bajo principios de Buen Conocer.
            </p>

            <div className="space-y-6">
              {techInitiatives.map((item) => (
                <div key={item.title} className="flex gap-5 group cursor-pointer">
                  <div className="text-2xl shrink-0 w-10">{item.icon}</div>
                  <div>
                    <h3 className="font-bold mb-1 text-white group-hover:text-[#0051A2] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#" className="mt-10 inline-flex items-center gap-2 px-6 py-3 border border-white text-white text-sm font-semibold hover:bg-white hover:text-[#FF46A2] transition-colors duration-200">
              Reservar tiempo en estudio <ExternalLink size={14} />
            </a>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden border border-white/30 bg-[#003d7a]">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=800&fit=crop&auto=format"
                alt="Jóvenes usando computadores y software creativo en el laboratorio digital de Platohedro"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#0051A2] text-white px-6 py-4 hidden md:block">
              <div className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>340+</div>
              <div className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>Sesiones en lab / mes</div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          TIENDA / GALERÍA
      ══════════════════════════════════════════════════════ */}
      <section id="shop" className="border-t border-white/20 py-24 px-6 md:px-10" style={{ backgroundColor: "#99CC33" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs text-[#0051A2] tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                Tienda y Galería
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Arte que puedes llevar contigo
              </h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-[#0051A2]/70 hover:text-[#0051A2] transition-colors">
              Catálogo completo <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Sin título No. 7", artist: "Marcus Webb", price: "$240.000", image: "https://images.unsplash.com/photo-1549887534-1541e9326347?w=500&h=600&fit=crop&auto=format" },
              { title: "Sistemas Raíz", artist: "Amara K.", price: "$185.000", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=600&fit=crop&auto=format" },
              { title: "Cámara Eco", artist: "Serigrafía Residencia", price: "$45.000", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format" },
              { title: "Fanzine Anual 2024", artist: "Colectivo Platohedro", price: "$18.000", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop&auto=format" },
            ].map((item) => (
              <div key={item.title} className="group cursor-pointer">
                <div className="overflow-hidden aspect-[5/6] bg-[#003d7a] border border-[#0051A2]/30 mb-3">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#0051A2] group-hover:text-[#FF46A2] transition-colors">{item.title}</div>
                    <div className="text-xs text-[#0051A2]/60 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{item.artist}</div>
                  </div>
                  <div className="text-sm font-bold text-[#FF46A2]" style={{ fontFamily: "'DM Mono', monospace" }}>{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          VIDEO
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/20 py-24 px-6 md:px-10" style={{ backgroundColor: "#FF46A2" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs text-white/70 tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              Míranos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Platohedro en movimiento
            </h2>
          </div>

          <div className="relative aspect-video bg-muted border border-border overflow-hidden max-w-4xl mx-auto group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?w=1200&h=700&fit=crop&auto=format"
              alt="Comunidad reunida en el estudio principal de Platohedro durante una sesión abierta"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-background/50 group-hover:bg-background/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play size={32} className="text-primary-foreground ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block bg-background/90 backdrop-blur-sm px-4 py-2">
                <p className="text-sm font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  "Platohedro: Un año en el estudio" — Película anual 2024
                </p>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>12 min</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          EVENTOS Y CALENDARIO
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/20 py-24 px-6 md:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs text-primary tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                Próximamente
              </span>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Eventos y Calendario
              </h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Calendario completo <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="divide-y divide-border border-t border-b border-border">
            {events.map((event) => (
              <div
                key={event.title}
                className="group flex items-center gap-6 py-5 hover:bg-background/30 px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div className="w-16 text-center shrink-0 border border-border group-hover:border-primary/50 transition-colors py-2">
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{event.date.month}</div>
                  <div className="text-2xl font-bold text-primary leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{event.date.day}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <MapPin size={10} /> {event.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <Calendar size={10} /> {event.time}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span
                    className="px-2 py-0.5 text-xs font-bold"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      backgroundColor: event.tag === "Libre" ? "rgba(212,245,0,0.15)" : "rgba(255,51,102,0.15)",
                      color: event.tag === "Libre" ? "#d4f500" : "#ff3366",
                    }}
                  >
                    {event.tag}
                  </span>
                  <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          ALIADOS Y COLABORADORES
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/20 py-20 px-6 md:px-10" style={{ backgroundColor: "#99CC33" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-[#0051A2] tracking-widest uppercase block" style={{ fontFamily: "'DM Mono', monospace" }}>
              Posible gracias a nuestros aliados y financiadores
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#0051A2]/20 border border-[#0051A2]/20">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-[#99CC33] flex items-center justify-center px-6 py-8 hover:bg-white/50 transition-colors cursor-pointer group"
                title={sponsor.full}
              >
                <span className="text-[#0051A2] group-hover:text-[#0051A2] text-xs text-center font-semibold tracking-wide transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#0051A2]/70 mt-6" style={{ fontFamily: "'DM Mono', monospace" }}>
            ¿Interesado en ser aliado? <a href="#contact" className="text-primary hover:underline">Escríbenos →</a>
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          APOYAR / DONACIONES
      ══════════════════════════════════════════════════════ */}
      <section id="donate" className="border-t-4 border-[#99CC33] py-24 px-6 md:px-10" style={{ backgroundColor: "#003d7a" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Heart size={12} /> APOYAR — SOSTÉN EL PROCESO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Cada aporte sostiene<br />
              <span className="italic text-primary">vidas creativas reales.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Tu apoyo va directamente a los programas, residencias y laboratorios de Platohedro en Medellín. Aquí no hay intermediarios — solo comunidad.
            </p>
          </div>

          {/* Flow steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[
              [1, "Elegir monto"],
              [2, "Tus datos"],
              [3, "Pago"],
              [4, "Confirmar"],
            ].map(([step, label], i) => (
              <div key={step as number} className="flex items-center gap-2">
                <button onClick={() => setDonateStep(step as number)} className="flex items-center gap-2 group">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    style={{
                      backgroundColor: donateStep >= (step as number) ? "#d4f500" : "transparent",
                      color: donateStep >= (step as number) ? "#0d0714" : "#a08cb8",
                      border: donateStep >= (step as number) ? "none" : "1px solid #3a2050",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {donateStep > (step as number) ? <CheckCircle size={14} /> : step}
                  </div>
                  <span className="text-xs hidden md:block" style={{ fontFamily: "'DM Mono', monospace", color: donateStep >= (step as number) ? "#f0ead8" : "#a08cb8" }}>
                    {label}
                  </span>
                </button>
                {i < 3 && <div className="w-8 md:w-12 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
            {/* Left: tier picker */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                ELIGE UN NIVEL DE APOYO (COP)
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {donorTiers.map((tier, i) => (
                  <button
                    key={tier.label}
                    onClick={() => { setSelectedTier(i); setCustomAmount(""); }}
                    className="text-left p-4 border transition-all duration-200"
                    style={{
                      borderColor: selectedTier === i ? "#d4f500" : "rgba(212,245,0,0.12)",
                      backgroundColor: selectedTier === i ? "rgba(212,245,0,0.08)" : "transparent",
                    }}
                  >
                    <div className="text-xl font-bold text-primary mb-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>{tier.amount}</div>
                    <div className="text-xs font-bold mb-1">{tier.label}</div>
                    <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{tier.perks}</div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                  O INGRESA UN MONTO PERSONALIZADO (COP)
                </label>
                <div className="flex items-center border border-border focus-within:border-primary transition-colors">
                  <span className="px-3 text-muted-foreground text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>$</span>
                  <input
                    type="number"
                    placeholder="Otro monto"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(-1); }}
                    className="flex-1 bg-transparent py-3 pr-4 text-foreground text-sm focus:outline-none placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                  FRECUENCIA
                </label>
                <div className="flex">
                  {["Una vez", "Mensual", "Anual"].map((freq, i) => (
                    <button
                      key={freq}
                      className="flex-1 py-2.5 text-xs font-semibold border-y border-r first:border-l transition-colors"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        borderColor: "rgba(212,245,0,0.12)",
                        backgroundColor: i === 0 ? "rgba(212,245,0,0.1)" : "transparent",
                        color: i === 0 ? "#d4f500" : "#a08cb8",
                      }}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setDonateStep(2)}
                className="group w-full flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground font-bold hover:bg-foreground transition-colors duration-200"
              >
                <span className="flex items-center gap-2">
                  <CreditCard size={16} /> Continuar al pago
                </span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <p className="text-xs text-muted-foreground mt-3 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>
                🔒 Pago seguro · Platohedro, Medellín, Colombia
              </p>
            </div>

            {/* Right: impact + how to */}
            <div className="space-y-6">
              <div className="border border-border p-6 bg-background/30">
                <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  ¿Qué hace posible tu aporte?
                </h3>
                <div className="space-y-3">
                  {[
                    [<Users size={14} />, "$50k cubre materiales para un niñe durante un mes"],
                    [<CheckCircle size={14} />, "$150k financia una sesión de taller para 8 jóvenes"],
                    [<Heart size={14} />, "$300k sostiene una semana de residencia artística"],
                    [<ArrowUpRight size={14} />, "$1M patrocina una beca de residencia completa"],
                  ].map(([icon, text], i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                      style={{ opacity: selectedTier >= i || selectedTier === -1 ? 1 : 0.4, transition: "opacity 0.3s" }}
                    >
                      <span className="text-primary mt-0.5 shrink-0">{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-primary/30 p-6 bg-primary/5">
                <h3 className="font-bold mb-4 text-primary" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Cómo donar →
                </h3>
                <ol className="space-y-3">
                  {[
                    "Elige un nivel de apoyo o ingresa un monto libre arriba.",
                    "Selecciona la frecuencia: única, mensual o anual.",
                    "Ingresa tus datos de contacto y pago.",
                    "Revisa y confirma tu aporte.",
                    "Recibirás un comprobante por correo en minutos.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-border p-5 text-sm">
                <h4 className="font-semibold mb-3 text-xs text-muted-foreground tracking-widest uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Otras formas de apoyar
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="text-foreground font-medium">Transferencia:</span> Nequi / Bancolombia — contacta a donaciones@platohedro.org</p>
                  <p><span className="text-foreground font-medium">Especie:</span> Materiales, equipo o tiempo — escríbenos</p>
                  <p><span className="text-foreground font-medium">Voluntariado:</span> Únete a nuestros procesos comunitarios</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer className="border-t border-white/20 bg-[#002f5e] px-6 md:px-10 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#7dcfca] flex items-center justify-center p-1 overflow-hidden">
                <ImageWithFallback
                  src={logoImg}
                  alt="Platohedro logo"
                  className="w-full h-full object-contain logo-img"
                />
              </div>
              <span className="font-bold tracking-widest uppercase text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Platohedro</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>
              Organización cultural<br />Medellín, Colombia<br />Fundada en 2004
            </p>
          </div>

          {[
            ["Programas", ["Educación Artística", "Lab Digital", "Narrativas", "Música", "Residencias"]],
            ["Organización", ["Sobre Platohedro", "Arte y Pensamiento", "Tecnología", "Tienda / Galería", "Prensa"]],
            ["Contacto", ["Escríbenos", "Apoyar", "Voluntariado", "Boletín", "Instagram"]],
          ].map(([heading, links]) => (
            <div key={heading as string}>
              <h4 className="text-xs font-bold text-foreground mb-4 tracking-widest uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
                {heading}
              </h4>
              <ul className="space-y-2">
                {(links as string[]).map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
            © 2025 Platohedro. Medellín, Colombia.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
            {["Política de privacidad", "Términos de uso", "Accesibilidad"].map((item) => (
              <a key={item} href="#" className="hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

      <RenovationPopup
        isOpen={showRenovationPopup}
        onClose={() => setShowRenovationPopup(false)}
      />
    </div>
  );
}
