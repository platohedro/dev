"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Calendar,
  MapPin,
  Heart,
  CreditCard,
  Users,
  CheckCircle,
  ExternalLink,
  Wrench,
  Hammer,
  AlertCircle,
  Globe,
  Monitor,
  Clapperboard,
  Cpu,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { RenovationPopup } from "@/app/components/ui/renovation-popup";
import { AboutPage } from "@/app/components/AboutPage";
import { SiteHeader } from "@/app/components/SiteHeader";
import type { PublicEvent } from "@/lib/events";

const lightLogo = "/logos/ph_blanco.png";
const donationAmounts = [50_000, 150_000, 300_000, 1_000_000];

type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "diners" | "unknown";

function detectCardBrand(value: string): CardBrand {
  const number = value.replace(/\D/g, "");
  if (/^4/.test(number)) return "visa";
  if (/^(5[1-5]|2(?:2[2-9]|[3-6]\d|7[01]))/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  if (/^(6011|65|64[4-9])/.test(number)) return "discover";
  if (/^3(?:0[0-5]|[68])/.test(number)) return "diners";
  return "unknown";
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

const cardBrandLabels: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  amex: "AMERICAN EXPRESS",
  discover: "DISCOVER",
  diners: "DINERS CLUB",
  unknown: "TARJETA",
};

const parseHash = (hash: string): { page: "home" | "about"; section: string } => {
  const cleaned = hash.replace(/^#/, "");
  if (cleaned === "about" || cleaned === "/about" || cleaned.startsWith("/about")) {
    return { page: "about", section: "" };
  }

  if (cleaned.startsWith("/")) {
    return { page: "home", section: cleaned.slice(1) };
  }

  return { page: "home", section: cleaned };
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const programs = [
  {
    id: 1,
    titleKey: "programs.items.0.title",
    tagKey: "programs.items.0.tag",
    descKey: "programs.items.0.description",
    image: "https://backup.platohedro.org/wp-content/uploads/2022/04/c_buenvivir.jpg",
    color: "#d4f500",
  },
  {
    id: 2,
    titleKey: "programs.items.1.title",
    tagKey: "programs.items.1.tag",
    descKey: "programs.items.1.description",
    image: "https://backup.platohedro.org/wp-content/uploads/2022/05/lifepatch2.jpg",
    color: "#ff3366",
  },
  {
    id: 3,
    titleKey: "programs.items.2.title",
    tagKey: "programs.items.2.tag",
    descKey: "programs.items.2.description",
    image: "https://backup.platohedro.org/wp-content/uploads/2023/10/ideatorio.jpg",
    color: "#a78bfa",
  },
  {
    id: 4,
    titleKey: "programs.items.3.title",
    tagKey: "programs.items.3.tag",
    descKey: "programs.items.3.description",
    image: "https://backup.platohedro.org/wp-content/uploads/2023/10/amapolas.jpg",
    color: "#fb923c",
  },
  {
    id: 5,
    titleKey: "programs.items.4.title",
    tagKey: "programs.items.4.tag",
    descKey: "programs.items.4.description",
    image: "https://backup.platohedro.org/wp-content/uploads/2023/11/1697073676568-scaled.jpg",
    color: "#34d399",
  },
];

const quoteKeys = [
  "testimonials.quotes.0",
  "testimonials.quotes.1",
  "testimonials.quotes.2",
];

const events = [
  {
    date: { month: "AGO", day: "09" },
    key: "events.items.0",
    tagKey: "events.tags.free",
  },
  {
    date: { month: "AGO", day: "16" },
    key: "events.items.1",
    tagKey: "events.tags.free",
  },
  {
    date: { month: "AGO", day: "24" },
    key: "events.items.2",
    tagKey: "events.tags.registration",
  },
  {
    date: { month: "SEP", day: "07" },
    key: "events.items.3",
    tagKey: "events.tags.free",
  },
  {
    date: { month: "SEP", day: "14" },
    key: "events.items.4",
    tagKey: "events.tags.register",
  },
];

const sponsors = [
  { name: "Arts Collaboratory", full: "Arts Collaboratory", image: "https://backup.platohedro.org/wp-content/uploads/2022/04/ac_.png" },
  { name: "TDH", full: "TDH", image: "https://backup.platohedro.org/wp-content/uploads/2022/02/TDH-1.png" },
  { name: "Exploratorio", full: "Exploratorio", image: "https://backup.platohedro.org/wp-content/uploads/2022/04/LOGO_EXPLORATORIO-1.png" },
  { name: "Ministerio de Cultura", full: "Ministerio de Cultura de Colombia" },
  { name: "Alcaldía de Medellín", full: "Alcaldía de Medellín" },
  { name: "Idartes", full: "Instituto Distrital de las Artes" },
  { name: "Colciencias", full: "Ministerio de Ciencia y Tecnología" },
  { name: "Redes", full: "Red Nacional de Cultura" },
  { name: "Open Society", full: "Open Society Foundations" },
];

function AnimatedStat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = statRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    let frame = 0;
    let startTime = 0;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return <div ref={statRef}>{count}{suffix}</div>;
}

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
    Icon: Monitor,
    title: "Laboratorio de Acceso Digital",
    desc: "Acceso libre a computadores, Wi-Fi y talleres de alfabetización digital para integrantes de la comunidad.",
  },
  {
    Icon: Clapperboard,
    title: "Estudio de Cine y Podcast",
    desc: "Equipos de grabación de nivel profesional disponibles para residentes y participantes de programas.",
  },
  {
    Icon: Cpu,
    title: "Arte, IA y Conocimiento Libre",
    desc: "Sesiones mensuales para explorar críticamente las tecnologías emergentes desde prácticas artísticas y el Buen Conocer.",
  },
];

const residencyTypeAssets = [
  {
    color: "#0051A2",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/on.jpg",
  },
  {
    color: "#FF46A2",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/IMG_4154-1024x768-1.jpg",
  },
  {
    color: "#99CC33",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/Lokakarya_Squaresynth_01.jpg",
  },
];

const residencyApplicationPaths = [
  "/residencias/residencia-artistica",
  "/residencias/residencia-de-investigacion",
  "/residencias/residencia-tecnologica",
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function App({ initialPage = "home" }: { initialPage?: "home" | "about" }) {
  const { t } = useTranslation();
  const [route, setRoute] = useState<{ page: "home" | "about"; section: string }>(() => {
    if (initialPage === "about") {
      return { page: "about", section: "" };
    }
    if (typeof window === "undefined") {
      return { page: "home", section: "" };
    }
    return parseHash(window.location.hash);
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [donationFrequency, setDonationFrequency] = useState<"one_time" | "monthly" | "annual">("one_time");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPersonalData, setAcceptPersonalData] = useState(false);
  const [acceptance, setAcceptance] = useState<{ publicKey: string; acceptance: { acceptance_token: string; permalink: string }; personalAuth: { acceptance_token: string; permalink: string } } | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardExpMonth, setCardExpMonth] = useState("");
  const [cardExpYear, setCardExpYear] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [donateStep, setDonateStep] = useState(1);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [donationError, setDonationError] = useState("");
  const [showRenovationPopup, setShowRenovationPopup] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [publishedEvents, setPublishedEvents] = useState<PublicEvent[]>([]);
  const [publishedProducts, setPublishedProducts] = useState<Array<{ id: string; slug: string; name: string; image_url: string | null; price_cop: number }>>([]);

  useEffect(() => {
    if (donationFrequency === "one_time") { setAcceptance(null); return; }
    fetch("/api/wompi/acceptance").then((response) => response.ok ? response.json() : Promise.reject(new Error("No fue posible cargar los términos de Wompi."))).then(setAcceptance).catch((error) => setDonationError(error instanceof Error ? error.message : "No fue posible cargar los términos de Wompi."));
  }, [donationFrequency]);

  const quotes = t("testimonials.quotes", { returnObjects: true }) as Array<{ text: string; author: string; role: string }>;
  const programsData = programs.map((prog) => ({
    ...prog,
    title: t(prog.titleKey),
    tag: t(prog.tagKey),
    desc: t(prog.descKey),
  }));
  const residencyFeatured = t("residencies.featured", { returnObjects: true }) as {
    tag: string;
    subtitle: string;
    title: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
    apply: string;
  };
  const residencyTypes = (t("residencies.types", { returnObjects: true }) as Array<{ title: string; tag: string; description: string }>).map((res, index) => ({ ...res, ...residencyTypeAssets[index] }));
  const techInitiativesData = techInitiatives.map((item, index) => ({
    ...item,
    title: t(`technology.initiatives.${index}.title`),
    description: t(`technology.initiatives.${index}.description`),
  }));
  const donateSteps = t("donate.steps", { returnObjects: true }) as string[];
  const donateTiersData = t("donate.tiers.items", { returnObjects: true }) as Array<{ amount: string; label: string; perks: string }>;
  const donateBadge = t("donate.badge");
  const donateTitlePart1 = t("donate.title.part1");
  const donateTitlePart2 = t("donate.title.part2");
  const donateDescription = t("donate.description");
  const donateCustom = t("donate.tiers.custom");
  const donatePlaceholder = t("donate.tiers.placeholder");
  const donateButton = t("donate.form.submit");
  const donateTierLabel = t("donate.tiers.label");
  const donateFrequencyLabel = t("donate.frequency.label");
  const donateFrequencyOptions = t("donate.frequency.options", { returnObjects: true }) as string[];
  const donateImpactTitle = t("donate.impact.title");
  const donateImpactItems = t("donate.impact.items", { returnObjects: true }) as string[];
  const donateHowToTitle = t("donate.howTo.title");
  const donateInstructions = t("donate.instructions", { returnObjects: true }) as string[];
  const donateSecurePaymentNote = t("donate.securePaymentNote");
  const footerContact = t("footer.contact", { returnObjects: true }) as { title: string; address: string; email: string; phone: string };
  const footerLinks = t("footer.links", { returnObjects: true }) as {
    programs: string;
    residencies: string;
    technology: string;
    shop: string;
    events: string;
    donate: string;
  };
  const footerSocial = t("footer.social", { returnObjects: true }) as { instagram: string; facebook: string; youtube: string; twitter: string };
  const footerOrganizationDescription = t("footer.organizationDescription");
  const footerCopyright = t("footer.copyright", { year: new Date().getFullYear() });

  useEffect(() => {
    if (initialPage === "about") return;
    const updateRoute = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, [initialPage]);

  useEffect(() => {
    const updateBackToTopVisibility = () => setShowBackToTop(window.scrollY > 500);
    updateBackToTopVisibility();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTopVisibility);
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.ok ? response.json() : { events: [] })
      .then(({ events: nextEvents }) => setPublishedEvents(Array.isArray(nextEvents) ? nextEvents : []))
      .catch(() => setPublishedEvents([]));
  }, []);

  useEffect(() => {
    fetch("/api/products").then((response) => response.ok ? response.json() : { products: [] }).then(({ products }) => setPublishedProducts(Array.isArray(products) ? products : [])).catch(() => setPublishedProducts([]));
  }, []);

  const prevProgram = () => setCarouselIndex((i) => (i === 0 ? programs.length - 1 : i - 1));
  const nextProgram = () => setCarouselIndex((i) => (i === programs.length - 1 ? 0 : i + 1));

  const prevQuote = () => setQuoteIndex((i) => (i === 0 ? quotes.length - 1 : i - 1));
  const nextQuote = () => setQuoteIndex((i) => (i === quotes.length - 1 ? 0 : i + 1));

  const startWompiCheckout = async () => {
    const amount = selectedTier >= 0 ? donationAmounts[selectedTier] ?? 0 : Number(customAmount);
    if (!Number.isSafeInteger(amount) || amount < 1_000) {
      setDonationError("Ingresa un aporte válido de al menos $1.000 COP.");
      return;
    }

    setDonationError("");
    setIsCreatingCheckout(true);

    try {
      const response = await fetch("/api/wompi/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency: "one_time" }),
      });
      const data = await response.json() as { error?: string; checkoutUrl?: string; fields?: Record<string, string> };
      if (!response.ok || !data.checkoutUrl || !data.fields) {
        throw new Error(data.error || "No fue posible iniciar el pago con Wompi.");
      }

      const form = document.createElement("form");
      form.method = "GET";
      form.action = data.checkoutUrl;
      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setDonationError(error instanceof Error ? error.message : "No fue posible iniciar el pago con Wompi.");
      setIsCreatingCheckout(false);
    }
  };

  const startRecurringDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = selectedTier >= 0 ? donationAmounts[selectedTier] ?? 0 : Number(customAmount);
    const number = cardNumber.replace(/\s+/g, "");
    const apiBase = process.env.NEXT_PUBLIC_WOMPI_API_BASE_URL || "https://api-sandbox.wompi.co/v1";
    if (!acceptance || !acceptTerms || !acceptPersonalData || !donorName || !donorEmail || !Number.isSafeInteger(amount) || amount < 1_000 || !/^\d{13,19}$/.test(number) || !/^\d{3,4}$/.test(cardCvc) || !/^\d{2}$/.test(cardExpMonth) || !/^\d{2}$/.test(cardExpYear) || !cardHolder.trim()) {
      setDonationError("Completa correctamente los datos de la tarjeta y las autorizaciones.");
      return;
    }

    setDonationError("");
    setIsCreatingCheckout(true);
    try {
      const tokenResponse = await fetch(`${apiBase}/tokens/cards`, {
        method: "POST",
        headers: { Authorization: `Bearer ${acceptance.publicKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ number, cvc: cardCvc, exp_month: cardExpMonth, exp_year: cardExpYear, card_holder: cardHolder.trim() }),
      });
      const tokenPayload = await tokenResponse.json().catch(() => null) as { data?: { id?: string }; error?: { reason?: string; type?: string } } | null;
      const token = tokenPayload?.data?.id;
      if (!tokenResponse.ok || !token) throw new Error(tokenPayload?.error?.reason || "Wompi no pudo tokenizar la tarjeta. Verifica los datos e inténtalo nuevamente.");

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/wompi/recurring";
      const fields: Record<string, string> = {
        token,
        frequency: donationFrequency,
        amount: String(amount),
        email: donorEmail,
        fullName: donorName,
        acceptance_token: acceptance.acceptance.acceptance_token,
        accept_personal_auth: acceptance.personalAuth.acceptance_token,
      };
      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.append(input);
      });
      document.body.append(form);
      form.submit();
    } catch (error) {
      setDonationError(error instanceof Error ? error.message : "No fue posible iniciar la suscripción.");
      setIsCreatingCheckout(false);
    }
  };

  const cardBrand = detectCardBrand(cardNumber);

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >

      <SiteHeader />

      {/* ══════════════════════════════════════════════════════
          MAIN PAGE CONTENT
      ══════════════════════════════════════════════════════ */}
      {route.page === "about" ? (
        <AboutPage />
      ) : (
        <>
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
              <span className="text-xs font-bold text-accent tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
                {t("hero.label")}
              </span>
            </div>

            {/* Mission */}
            <h1
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] font-bold mb-8"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <span className="italic text-primary">{t("hero.title.part1")}</span><br />
              {t("hero.title.part2")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#programs"
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-foreground transition-colors duration-200 text-sm"
              >
                {t("hero.cta.explore")} <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#donate"
                className="flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold hover:border-primary hover:text-primary transition-colors duration-200 text-sm"
              >
                <Heart size={16} /> {t("hero.cta.support")}
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
            {[
              { value: 432, label: t("hero.stats.youth") },
              { value: 79, label: t("hero.stats.mothers") },
              { value: 287, label: t("hero.stats.residencies") },
              { value: 22, suffix: " años", label: t("hero.stats.years") },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="bg-background/80 backdrop-blur-sm px-6 py-5">
                <div
                  className="text-2xl md:text-3xl font-bold text-primary mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  <AnimatedStat value={value} suffix={suffix} />
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
          EDUCACIÓN — CAROUSEL / GRID
      ══════════════════════════════════════════════════════ */}
      <section id="programs" className="border-t border-[#0051A2]/20 bg-[#99CC33] py-24 px-6 md:px-10 text-[#0051A2]">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-[#0051A2] tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              {t("programs.label")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {t("programs.title")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevProgram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-[#0051A2]/70" style={{ fontFamily: "'DM Mono', monospace" }}>
              {carouselIndex + 1} / {programs.length}
            </span>
            <button onClick={nextProgram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {programsData.map((prog, i) => (
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
                <p className="text-xs text-[#0051A2]/80 leading-relaxed flex-1">{prog.desc}</p>
                <button className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0051A2] transition-colors hover:text-[#FF46A2]">
                  {t("programs.learnMore")} <ArrowUpRight size={12} />
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
                src={programsData[carouselIndex].image}
                alt={programsData[carouselIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/40" />
              <div
                className="absolute top-4 left-4 px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: programsData[carouselIndex].color, color: "#0d0714", fontFamily: "'DM Mono', monospace" }}
              >
                {programsData[carouselIndex].tag}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {programsData[carouselIndex].title}
              </h3>
              <p className="text-sm text-[#0051A2]/80 leading-relaxed">{programsData[carouselIndex].desc}</p>
              <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#0051A2] transition-colors hover:text-[#FF46A2]">
                {t("programs.learnMore")} <ArrowUpRight size={14} />
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
          <a href="/d-formacion" className="inline-flex items-center gap-2 px-6 py-3 border border-[#0051A2] text-[#0051A2] text-sm font-semibold hover:bg-[#0051A2] hover:text-white transition-colors duration-200">
            {t("programs.viewAll")} <ArrowUpRight size={16} />
          </a>
        </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          QUOTES / TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="border-y border-white/20 py-20 px-6 md:px-10" style={{ backgroundColor: "#FF46A2" }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs text-white/70 tracking-widest uppercase block mb-10" style={{ fontFamily: "'DM Mono', monospace" }}>
            {t("testimonials.label")}
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
          RESIDENCIAS
      ══════════════════════════════════════════════════════ */}
      <section id="residencies" className="border-t border-white/20 py-24 px-6 md:px-10" style={{ backgroundColor: "#99CC33" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#0051A2] tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                {t("residencies.label")}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {t("residencies.title.part1")}<br />
                <span className="italic text-[#FF46A2]">{t("residencies.title.part2")}</span>
              </h2>
            </div>
            <a href="/tienda" className="hidden md:flex items-center gap-2 text-sm text-[#0051A2]/70 hover:text-[#0051A2] transition-colors">
              {t("residencies.viewAll")} <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Featured residency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#0051A2]/30 mb-8">
            <div className="relative overflow-hidden aspect-[4/3] bg-[#003d7a]">
              <img
                src="https://backup.platohedro.org/wp-content/uploads/2023/10/becomingfungal.jpg"
                alt="Artista en residencia trabajando en el estudio de Platohedro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0051A2]/20" />
              <div className="absolute top-5 left-5 px-3 py-1 bg-[#FF46A2] text-white text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                {residencyFeatured.tag}
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-white/90">
              <span className="text-xs text-[#FF46A2] tracking-widest uppercase block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                {residencyFeatured.tag} · {residencyFeatured.subtitle}
              </span>
              <h3 className="text-3xl font-bold mb-4 leading-tight text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {residencyFeatured.title}
              </h3>
              <p className="text-[#0051A2]/70 text-sm leading-relaxed mb-6">
                {residencyFeatured.description}
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
                {residencyFeatured.apply} <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Other residency types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {residencyTypes.map((res, index) => (
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
                  <p className="text-xs text-[#0051A2]/70 leading-relaxed flex-1">{res.description}</p>
                  <a href={residencyApplicationPaths[index]} className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0051A2] hover:text-[#FF46A2] transition-colors">
                    {t("residencies.learnMore")} <ArrowUpRight size={12} />
                  </a>
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
            <span className="text-xs font-bold text-white/70 tracking-widest uppercase block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {t("technology.label")}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {t("technology.title.part1")}<br />
                  <span className="italic text-[#0051A2]">{t("technology.title.part2")}</span>
                </h2>
                <p className="text-white/75 leading-relaxed mb-10 max-w-md">
                  {t("technology.description")}
                </p>
            <div className="space-y-6">
              {techInitiativesData.map((item) => (
                <div key={item.title} className="flex gap-5 group cursor-pointer">
                  <div className="grid size-10 shrink-0 place-items-center border border-white/50 text-white transition-colors group-hover:border-[#0051A2] group-hover:bg-[#0051A2]" aria-hidden="true">
                    <item.Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-white group-hover:text-[#0051A2] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.description || item.desc || item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#" className="mt-10 inline-flex items-center gap-2 px-6 py-3 border border-white text-white text-sm font-semibold hover:bg-white hover:text-[#FF46A2] transition-colors duration-200">
              {t("technology.reserve")} <ExternalLink size={14} />
            </a>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden border border-white/30 bg-[#003d7a]">
              <img
                src="https://backup.platohedro.org/wp-content/uploads/2022/04/IMG_1870.jpg"
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
              <span className="text-xs font-bold text-[#0051A2] tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                {t("shop.label")}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0051A2]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {t("shop.title")}
              </h2>
            </div>
            <a href="/tienda" className="hidden md:flex items-center gap-2 text-sm text-[#0051A2]/70 hover:text-[#0051A2] transition-colors">
              {t("shop.viewAll")} <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {publishedProducts.map((item) => (
              <a href={`/tienda/${item.slug}`} key={item.id} className="group cursor-pointer">
                <div className="overflow-hidden aspect-[5/6] bg-[#003d7a] border border-[#0051A2]/30 mb-3">
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#0051A2] group-hover:text-[#FF46A2] transition-colors">{item.name}</div>
                    <div className="text-xs text-[#0051A2]/60 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>Tienda Platohedro</div>
                  </div>
                  <div className="text-sm font-bold text-[#FF46A2]" style={{ fontFamily: "'DM Mono', monospace" }}>${Number(item.price_cop).toLocaleString("es-CO")}</div>
                </div>
              </a>
            ))}
            {publishedProducts.length === 0 && <p className="col-span-full text-sm text-[#0051A2]/70">Próximamente habrá productos disponibles.</p>}
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
              {t("video.label")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {t("video.title")}
            </h2>
          </div>

          <div className="relative aspect-video bg-muted border border-border overflow-hidden max-w-4xl mx-auto group cursor-pointer">
            <video autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-label="Platohedro en movimiento">
              <source src="https://backup.platohedro.org/wp-content/uploads/2022/02/intro.mp4" type="video/mp4" />
              Tu navegador no puede reproducir este video.
            </video>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block bg-background/90 backdrop-blur-sm px-4 py-2">
                <p className="text-sm font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {t("video.videoTitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a href="/about" className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#FF46A2]">
              {t("video.aboutCta")} <ArrowUpRight size={16} />
            </a>
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
              <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                {t("events.label")}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {t("events.title")}
              </h2>
            </div>
            <a href="/eventos" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("events.viewAll")} <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="divide-y divide-border border-t border-b border-border">
            {publishedEvents.map((event) => {
              const date = new Date(event.starts_at);
              const month = new Intl.DateTimeFormat("es-CO", { month: "short" }).format(date).replace(".", "").toUpperCase();
              const day = new Intl.DateTimeFormat("es-CO", { day: "2-digit" }).format(date);
              const time = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit" }).format(date);
              return <a
                key={event.id}
                href={`/eventos/${event.slug}`}
                className="group flex items-center gap-6 py-5 hover:bg-background/30 px-2 -mx-2 transition-colors"
              >
                <div className="w-16 text-center shrink-0 border border-border group-hover:border-primary/50 transition-colors py-2">
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{month}</div>
                  <div className="text-2xl font-bold text-primary leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{day}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <MapPin size={10} /> {[event.venue, event.city].filter(Boolean).join(" · ")}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <Calendar size={10} /> {time}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span
                    className="px-2 py-0.5 text-xs font-bold"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      backgroundColor: "rgba(212,245,0,0.15)",
                      color: "#d4f500",
                    }}
                  >
                    {event.category || "Evento"}
                  </span>
                  <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                </div>
              </a>;
            })}
            {publishedEvents.length === 0 && <p className="py-8 text-sm text-muted-foreground">No hay eventos próximos publicados.</p>}
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
              {t("partners.label")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#0051A2]/20 border border-[#0051A2]/20">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-[#99CC33] flex items-center justify-center px-6 py-8 hover:bg-white/50 transition-colors cursor-pointer group"
                title={sponsor.full}
              >
                {sponsor.image ? <img src={sponsor.image} alt={sponsor.full} className={sponsor.name === "TDH" || sponsor.name === "Exploratorio" ? "h-24 max-w-[95%] scale-[1.7] object-contain" : "h-24 max-w-[95%] object-contain"} /> : <span className="text-[#0051A2] group-hover:text-[#0051A2] text-xs text-center font-semibold tracking-wide transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {sponsor.name}
                </span>}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#0051A2]/70 mt-6" style={{ fontFamily: "'DM Mono', monospace" }}>
            {t("partners.cta")} <a href="#contact" className="text-primary hover:underline">{t("partners.contact")}</a>
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          APOYAR / DONACIONES
      ══════════════════════════════════════════════════════ */}
      <section id="donate" className="border-t-4 border-[#99CC33] bg-white py-24 px-6 text-[#0051A2] [--background:#fff] [--foreground:#0051A2] [--muted-foreground:rgba(0,81,162,0.72)] [--border:rgba(0,81,162,0.2)] [--primary:#0051A2] [--primary-foreground:#fff] md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Heart size={12} /> {donateBadge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {donateTitlePart1}<br />
              <span className="italic text-primary">{donateTitlePart2}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {donateDescription}
            </p>
          </div>

          {/* Flow steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {donateSteps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <button onClick={() => setDonateStep(i + 1)} className="flex items-center gap-2 group">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    style={{
                      backgroundColor: donateStep >= i + 1 ? "#d4f500" : "transparent",
                      color: donateStep >= i + 1 ? "#0d0714" : "#a08cb8",
                      border: donateStep >= i + 1 ? "none" : "1px solid rgba(0,81,162,0.4)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {donateStep > i + 1 ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className="text-xs hidden md:block" style={{ fontFamily: "'DM Mono', monospace", color: donateStep >= i + 1 ? "#0051A2" : "rgba(0,81,162,0.6)" }}>
                    {label}
                  </span>
                </button>
                {i < donateSteps.length - 1 && <div className="w-8 md:w-12 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
            {/* Left: tier picker */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                {donateTierLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {donateTiersData.map((tier, i) => (
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
                  {donateCustom}
                </label>
                <div className="flex items-center border border-border focus-within:border-primary transition-colors">
                  <span className="px-3 text-muted-foreground text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>$</span>
                  <input
                    type="number"
                    placeholder={donatePlaceholder}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(-1); }}
                    className="flex-1 bg-transparent py-3 pr-4 text-foreground text-sm focus:outline-none placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {donateFrequencyLabel}
                </label>
                <div className="flex">
                  {donateFrequencyOptions.map((freq, i) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setDonationFrequency(i === 0 ? "one_time" : i === 1 ? "monthly" : "annual")}
                      className="flex-1 py-2.5 text-xs font-semibold border-y border-r first:border-l transition-colors"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        borderColor: "rgba(212,245,0,0.12)",
                        backgroundColor: (i === 0 && donationFrequency === "one_time") || (i === 1 && donationFrequency === "monthly") || (i === 2 && donationFrequency === "annual") ? "rgba(212,245,0,0.1)" : "transparent",
                        color: (i === 0 && donationFrequency === "one_time") || (i === 1 && donationFrequency === "monthly") || (i === 2 && donationFrequency === "annual") ? "#0051A2" : "rgba(0,81,162,0.6)",
                      }}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {donationFrequency !== "one_time" && <div className="mb-6 grid gap-3">
                <input required value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Nombre completo" className="border border-[#0051A2]/20 bg-white p-3 text-sm text-[#0051A2] placeholder:text-[#0051A2]/50" />
                <input required type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder="Correo electrónico" className="border border-[#0051A2]/20 bg-white p-3 text-sm text-[#0051A2] placeholder:text-[#0051A2]/50" />
                {acceptance && <div className="grid gap-2 text-xs text-[#0051A2]/80"><label><input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} className="mr-2" />Acepto los <a className="underline" target="_blank" rel="noreferrer" href={acceptance.acceptance.permalink}>términos de Wompi</a>.</label><label><input type="checkbox" checked={acceptPersonalData} onChange={(event) => setAcceptPersonalData(event.target.checked)} className="mr-2" />Acepto la <a className="underline" target="_blank" rel="noreferrer" href={acceptance.personalAuth.permalink}>autorización de datos personales</a>.</label></div>}
                {acceptance && acceptTerms && acceptPersonalData && <form onSubmit={startRecurringDonation} className="grid gap-3 border border-[#0051A2]/20 p-4">
                  <div className="flex items-center justify-between border border-[#0051A2]/20 bg-[#0051A2]/5 px-3 py-3">
                    <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#0051A2]/10"><CreditCard size={18} /></span><span className="text-sm font-semibold">{cardBrandLabels[cardBrand]}</span></div>
                    <span className="text-right text-[10px] tracking-widest text-[#0051A2]/50">VISA · MC · AMEX</span>
                  </div>
                  <p className="text-xs text-[#0051A2]/70">La tarjeta se tokeniza directamente con Wompi. Platohedro no recibe ni almacena el número, CVC o fecha.</p>
                  <label className="grid gap-1 text-xs text-[#0051A2]/75">Número de tarjeta
                    <input required inputMode="numeric" autoComplete="cc-number" value={cardNumber} onChange={(event) => setCardNumber(formatCardNumber(event.target.value))} placeholder="0000 0000 0000 0000" className="border border-[#0051A2]/20 bg-white p-3 text-sm tracking-widest text-[#0051A2] placeholder:text-[#0051A2]/40" />
                  </label>
                  <label className="grid gap-1 text-xs text-[#0051A2]/75">Nombre del titular
                    <input required autoComplete="cc-name" value={cardHolder} onChange={(event) => setCardHolder(event.target.value.slice(0, 120))} placeholder="Como aparece en la tarjeta" className="border border-[#0051A2]/20 bg-white p-3 text-sm uppercase text-[#0051A2] placeholder:text-[#0051A2]/40" />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="grid gap-1 text-xs text-[#0051A2]/75">Mes
                      <input required inputMode="numeric" autoComplete="cc-exp-month" value={cardExpMonth} onChange={(event) => setCardExpMonth(event.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="MM" className="border border-[#0051A2]/20 bg-white p-3 text-sm text-[#0051A2] placeholder:text-[#0051A2]/50" />
                    </label>
                    <label className="grid gap-1 text-xs text-[#0051A2]/75">Año
                      <input required inputMode="numeric" autoComplete="cc-exp-year" value={cardExpYear} onChange={(event) => setCardExpYear(event.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="YY" className="border border-[#0051A2]/20 bg-white p-3 text-sm text-[#0051A2] placeholder:text-[#0051A2]/50" />
                    </label>
                    <label className="grid gap-1 text-xs text-[#0051A2]/75">CVC
                      <input required inputMode="numeric" autoComplete="cc-csc" value={cardCvc} onChange={(event) => setCardCvc(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className="border border-[#0051A2]/20 bg-white p-3 text-sm text-[#0051A2] placeholder:text-[#0051A2]/50" />
                    </label>
                  </div>
                  <button type="submit" disabled={isCreatingCheckout} className="w-full bg-primary px-4 py-3 font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-70">
                    {isCreatingCheckout ? "Conectando con Wompi…" : `Activar aporte ${donationFrequency === "monthly" ? "mensual" : "anual"}`}
                  </button>
                </form>}
              </div>}

              {donationFrequency === "one_time" && <button
                onClick={startWompiCheckout}
                disabled={isCreatingCheckout}
                className="group w-full flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground font-bold hover:bg-foreground transition-colors duration-200 disabled:cursor-wait disabled:opacity-70"
              >
                <span className="flex items-center gap-2">
                  <CreditCard size={16} /> {isCreatingCheckout ? "Conectando con Wompi…" : donateButton}
                </span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>}

              {donationError && <p role="alert" className="mt-3 text-center text-sm text-[#C22670]">{donationError}</p>}

              <p className="text-xs text-muted-foreground mt-3 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>
                {donateSecurePaymentNote}
              </p>
            </div>

            {/* Right: impact + how to */}
            <div className="space-y-6">
              <div className="border border-border p-6 bg-background/30">
                <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {donateImpactTitle}
                </h3>
                <div className="space-y-3">
                  {donateImpactItems.map((text, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                      style={{ opacity: selectedTier >= i || selectedTier === -1 ? 1 : 0.4, transition: "opacity 0.3s" }}
                    >
                      <span className="text-primary mt-0.5 shrink-0">{[<Users size={14} />, <CheckCircle size={14} />, <Heart size={14} />, <ArrowUpRight size={14} />][i]}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-primary/30 p-6 bg-primary/5">
                <h3 className="font-bold mb-4 text-primary" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {donateHowToTitle}
                </h3>
                <ol className="space-y-3">
                  {donateInstructions.map((step: string, i: number) => (
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
                  {t("donate.otherWays.title")}
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="text-foreground font-medium">{t("donate.otherWays.transfer.title")}</span> {t("donate.otherWays.transfer.description")}</p>
                  <p><span className="text-foreground font-medium">{t("donate.otherWays.inKind.title")}</span> {t("donate.otherWays.inKind.description")}</p>
                  <p><span className="text-foreground font-medium">{t("donate.otherWays.volunteer.title")}</span> {t("donate.otherWays.volunteer.description")}</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a href="https://patreon.com/Platohedro?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" target="_blank" rel="noreferrer" className="group border border-[#0051A2]/20 p-4 transition-colors hover:border-[#0051A2] hover:bg-[#0051A2]/5">
                    <p className="font-bold text-[#0051A2]">{t("donate.otherWays.patreon.title")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("donate.otherWays.patreon.description")}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0051A2] group-hover:text-[#FF46A2]">{t("donate.otherWays.patreon.cta")} <ExternalLink size={12} /></span>
                  </a>
                  <div className="border border-dashed border-[#0051A2]/30 p-4">
                    <p className="font-bold text-[#0051A2]">{t("donate.otherWays.vaki.title")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("donate.otherWays.vaki.description")}</p>
                    <span className="mt-3 inline-flex text-xs font-bold text-[#0051A2]/60">{t("donate.otherWays.vaki.cta")}</span>
                  </div>
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
            <div className="mb-4 flex items-center">
              <img src={lightLogo} alt="Platohedro" className="h-16 w-[102px] object-contain" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'DM Mono', monospace", whiteSpace: "pre-line" }}>
              {footerOrganizationDescription}
            </p>
          </div>

          {[
            [t("footer.links.programs"), [t("footer.links.education"), t("footer.links.lab"), t("footer.links.narratives"), t("footer.links.music"), t("footer.links.residencies")]],
            [t("footer.links.organization"), [t("footer.links.about"), t("footer.links.artAndThought"), t("footer.links.technology"), t("footer.links.shop"), t("footer.links.press")]],
            [t("footer.contact.title"), [t("footer.links.contactUs"), t("footer.links.donate"), t("footer.links.volunteer"), t("footer.links.newsletter"), t("footer.social.instagram")]],
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
            {footerCopyright}
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
            {[t("footer.privacy"), t("footer.terms"), t("footer.accessibility")].map((item) => (
              <a key={item} href="#" className="hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

      <RenovationPopup
        isOpen={showRenovationPopup}
        onClose={() => setShowRenovationPopup(false)}
      />
      {showBackToTop && <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-6 bottom-6 z-40 grid size-12 place-items-center rounded-full bg-[#0051A2] text-white shadow-lg transition-colors hover:bg-[#FF46A2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99CC33] focus-visible:ring-offset-2"
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <ChevronUp size={22} aria-hidden="true" />
      </button>}
      </>) }
    </div>
  );
}
