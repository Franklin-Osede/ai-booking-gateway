"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Play, Menu, ChevronDown, Check } from "lucide-react";
import { resolveConfig } from "../config/resolveConfig";
import { getVoices, VoiceProfile } from "../config/voiceConfig";
import { VoiceIntent } from "../../domain/voice/VoiceIntent";
import { VoicePromptService } from "../../domain/voice/VoicePromptService";
import { useVoicePreloader } from "./hooks/useVoicePreloader";

function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 6) return '#ffffff';
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 150) ? '#000000' : '#ffffff';
}

function getDarkerColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 6) return '#000';
  const hex = hexcolor.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.max(0, r - 40);
  g = Math.max(0, g - 40);
  b = Math.max(0, b - 40);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export type DoctorData = { name: string; image?: string; specialty?: string; bio?: string; };

type Msg = { id: string; text: string; sender: "bot" | "user"; playing?: boolean; isCalendar?: boolean; isSuccess?: boolean; isFinalCard?: boolean; showTranscript?: boolean; duration?: number; image?: string; isDoctorList?: boolean; doctorListData?: DoctorData[]; };

const AudioProgress = ({ isPlaying, duration, color, audioRef }: { isPlaying?: boolean, duration?: number, color: string, audioRef: React.RefObject<HTMLAudioElement | null> }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setElapsed(audioRef.current.currentTime);
    }
    
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        if (audioRef.current && !audioRef.current.paused) {
           setElapsed(audioRef.current.currentTime);
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, audioRef]);

  const display = Math.min(elapsed, duration || 10);
  const m = Math.floor(display / 60);
  const s = Math.floor(display % 60);
  const percentage = duration ? Math.min((display / duration) * 100, 100) : 0;

  return (
    <>
      <div className="h-1.5 bg-gray-200 rounded-full w-full relative mb-2 flex items-center">
         <div 
           className={`absolute top-0 left-0 h-full rounded-full transition-all duration-100 linear ${!isPlaying ? 'opacity-50' : ''}`}
           style={{ width: `${percentage}%`, backgroundColor: color }}
         />
         <div
           className="absolute w-3 h-3 rounded-full bg-white shadow-sm border border-gray-300 z-10 transition-all duration-100 linear pointer-events-none"
           style={{ left: `calc(${percentage}% - 6px)` }}
         />
         <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.01"
            value={elapsed}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              const maxTime = duration || 100;
              const safeTime = newTime >= maxTime - 0.1 ? Math.max(0, maxTime - 0.1) : newTime;
              setElapsed(safeTime);
              if (audioRef.current) {
                audioRef.current.currentTime = safeTime;
              }
            }}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
         />
      </div>
      <div className="flex justify-between items-center mt-1">
         <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 tracking-wide">
           {m}:{s.toString().padStart(2, '0')}
         </span>
      </div>
    </>
  );
};

export function AIAssistantVoice({ color, niche = "hair_transplant", pos = "right", lang = "es" }: { color: string, niche?: string, pos?: string, lang?: string }) {
  const isEng = (lang || '').toLowerCase().startsWith('en');
  const [isOpen, setIsOpen] = useState(false);
  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number }>({ options: [], stepId: 0 });
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedGreetingRef = useRef<string | null>(null);
  const blobTrackerRef = useRef<string[]>([]);

  const [activeVoiceId, setActiveVoiceId] = useState("f_laura");
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const availableVoicesForInit = getVoices(lang);
  const activeVoice: VoiceProfile = availableVoicesForInit.find(v => v.id === activeVoiceId) || availableVoicesForInit[0];

  // Clean up all localized blobs on unmount
  useEffect(() => {
    return () => {
      blobTrackerRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const getGreetingText = useCallback((voice: VoiceProfile) => {
    let voiceProvider = "elevenlabs";
    try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
    const rawGreeting = VoicePromptService.getPrompt(VoiceIntent.GREETING, { brandName: brandName, locale: lang || 'es' }, voiceProvider);
    let greeting = rawGreeting.replace(/Soy [a-zA-ZáéíóúÁÉÍÓÚñÑ]+/, `Soy ${voice.name}`);
    if (voice.gender === 'M') {
        greeting = greeting.replace(/asesora/gi, 'asesor');
    }
    return greeting;
  }, [lang, brandName]);

  const { getPreloadedUrl } = useVoicePreloader({
    lang: lang || 'es',
    brandName,
    niche: detectedNiche || niche || "hair_transplant",
    getGreetingText,
    enabled: true
  });
  
  // Inline Calendar & Flow States
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [expandedDocIdx, setExpandedDocIdx] = useState<number | null>(null);
  const [brandName, setBrandName] = useState("nuestra clínica");
  const times = ["09:00", "10:30", "12:00", "16:00", "17:30", "18:45"];

  const [today, setToday] = useState<Date | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  useEffect(() => setToday(new Date()), []);
  
  const realYear = today ? today.getFullYear() : 2026;
  const realMonth = today ? today.getMonth() : 9;
  const currentDay = today ? today.getDate() : 15;

  const displayedDate = new Date(realYear, realMonth + monthOffset, 1);
  const dispYear = displayedDate.getFullYear();
  const dispMonthIdx = displayedDate.getMonth();
  const daysInMonth = new Date(dispYear, dispMonthIdx + 1, 0).getDate();
  const monthNameStr = displayedDate.toLocaleString(lang || 'es-ES', { month: 'long' });
  const currentMonthText = monthNameStr.charAt(0).toUpperCase() + monthNameStr.slice(1) + " " + dispYear;
  const monthShort = monthNameStr.substring(0, 3);

  const handleVoiceSelection = (id: string, name: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = null;
    setActiveVoiceId(id);
    setShowVoiceSelector(false);
    
    // Wipe Context
    setMessages([]);
    setStepInfo({ options: [], stepId: 0 });

    const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");
    const { niche: nicheCfg, locale: confLocale } = resolveConfig({ niche: activeNiche, locale: lang || 'es' });
    let currentBrand = nicheCfg.brandLabel || "la clínica";
    try {
      const brandParam = new URLSearchParams(window.location.search).get('brand');
      const storedSite = localStorage.getItem('onboarding_site_url');
      if (brandParam) {
        currentBrand = brandParam;
      } else if (storedSite) {
        let actualSite = storedSite;
        if (storedSite.includes('url=')) {
           try { actualSite = decodeURIComponent(storedSite.split('url=')[1].split('&')[0]); } catch {}
        }
        let host = actualSite;
        try { host = new URL(actualSite).hostname; } catch { host = actualSite.replace(/^https?:\/\//, '').split('/')[0]; }
        currentBrand = "la clínica " + host.replace('www.', '').split('.')[0];
      }
    } catch {}
        
    let voiceProvider = "elevenlabs";
    try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
    const currentAvailVoices = getVoices(lang);
    const selectedVoice = currentAvailVoices.find(v => v.id === id) || currentAvailVoices[0];

    const greeting = getGreetingText(selectedVoice);
    
    setTimeout(() => {
       fetchAudio(greeting, "bot-res-" + Date.now(), () => {
         setStepInfo({ options: [confLocale.chat_scripts?.options_first_step[0] || "¿Cuánto cuesta?", "Quiero ver resultados", "Agendar cita"], stepId: 1 });
       }, { overrideVoice: selectedVoice, intent: "GREETING", preloadedUrl: getPreloadedUrl(selectedVoice.id) });
    }, 100);
  };

  // Ensure the explicitly selected niche from the dashboard takes precedence over auto-detection
  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");
  const effectiveConfig = resolveConfig({ niche: activeNiche, locale: lang || 'es' });
  const config = effectiveConfig.locale;
  const posClass = pos === "right" ? "right-4 sm:right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-4 sm:left-6";
  const contrastText = getContrastColor(color);
  const darkerBorder = getDarkerColor(color);

  const readableBrandText = contrastText === '#000000' ? darkerBorder : color;

  const [scrapedData, setScrapedData] = useState<{ categories: { name?: string, docs: ({name: string, image?: string} | string)[] }[] } | null>(null);

  useEffect(() => {
    try {
      const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
      const brandParam = new URLSearchParams(window.location.search).get('brand');
      
      let actualSite = storedSite || '';
      if (actualSite.includes('url=')) {
         try { actualSite = decodeURIComponent(actualSite.split('url=')[1].split('&')[0]); } catch {}
      }

      if (brandParam) {
        setTimeout(() => setBrandName(brandParam), 0);
      } else if (actualSite) {
        let host = actualSite;
        try { host = new URL(actualSite).hostname; } catch { host = actualSite.replace(/^https?:\/\//, '').split('/')[0]; }
        setTimeout(() => setBrandName(host.replace('www.', '').split('.')[0]), 0);
      }
      
      if (actualSite) {
        fetch('/api/v1/scrape-team?url=' + encodeURIComponent(actualSite) + '&t=' + Date.now())
          .then(res => res.json())
          .then(data => {
            if (data && data.success) {
              setScrapedData(data);
              if (data.detectedNiche) setDetectedNiche(data.detectedNiche);
            } else if (data && data.detectedNiche) {
              setDetectedNiche(data.detectedNiche);
            }
          })
          .catch(e => console.error(e));
      }
    } catch {}
  }, []);

  type Category = (typeof config.categories)[number];
  let categories = config.categories;
  if (scrapedData && scrapedData.categories) {
    categories = categories.map((cat: Category, i: number) => {
       const scrapedCat = scrapedData.categories![i];
       if (!scrapedCat) return cat;
       return {
          ...cat,
          name: scrapedCat.name || cat.name,
          docs: scrapedCat.docs?.length ? scrapedCat.docs : cat.docs
       };
    });
    if (scrapedData.categories.length > 0) {
      categories = categories.slice(0, scrapedData.categories.length);
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const toggleVoice = () => {
    // SILENT AUDIO UNLOCK FOR SAFARI/IOS AUTOPLAY POLICY
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
      }
      const silentAudio = new Audio("data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
      silentAudio.play().catch(() => {});
    } catch {
      // ignore
    }

    if (isOpen) {
      stopAudio();
      setIsOpen(false);
      setMessages([]);
      setStepInfo({ options: [], stepId: 0 });
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedService("");
      setSelectedDoctor("");
      blobTrackerRef.current.forEach(url => URL.revokeObjectURL(url));
      blobTrackerRef.current = [];
      const initUrl = getPreloadedUrl(activeVoiceId || "1");
      if (initUrl) {
        blobTrackerRef.current.push(initUrl);
      }
    } else {
      setIsOpen(true);
      triggerFlowStep(0);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, stepInfo, selectedDate, selectedTime]);

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void, extraParams?: { isSuccess?: boolean; isFinalCard?: boolean; image?: string; isDoctorList?: boolean; doctorListData?: DoctorData[], overrideVoice?: VoiceProfile, intent?: string, preloadedUrl?: string | null }) => {
    try {
      setIsProcessing(true);
      if (audioRef.current && !audioRef.current.paused) {
         audioRef.current.pause();
      }
      audioRef.current = null;
      // Remove SSML tags for the visual chat bubble
      const displayText = text.replace(/<[^>]*>/g, '');
      setMessages(prev => [...prev.map(m => ({...m, playing: false})), { id: msgId, text: displayText, sender: "bot", playing: true, ...extraParams }]);
      
      let voiceProvider = "elevenlabs";
      try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}

      const voiceToUse = extraParams?.overrideVoice || activeVoice;
      let url = extraParams?.preloadedUrl;
      
      if (!url) {
        const res = await fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, intent: extraParams?.intent || "OTHERS", provider: voiceProvider, voiceType: 'guided', elevenlabs_voice_id: voiceToUse.elevenLabsId, gender: voiceToUse.gender, niche: activeNiche, clinicId: brandName || null, locale: lang || 'es' })
        });
        
        if (!res.ok) throw new Error("Voice API Error");
        
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        blobTrackerRef.current.push(url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => {
        let dur = audio.duration;
        if (dur === Infinity || isNaN(dur)) dur = 10;
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, duration: dur } : m));
      };
      
      audio.onended = () => {
         let finalDur = audio.duration;
         if (finalDur === Infinity || isNaN(finalDur)) finalDur = audio.currentTime || 10;
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false, duration: Math.floor(finalDur) } : m));
         onEnd();
      };
      
      await audio.play();
      setIsProcessing(false);
    } catch (e) {
      console.error("Polly Error:", e);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
      setIsProcessing(false);
      onEnd();
    }
  };


  const togglePlayAudio = (msgId: string) => {
    if (audioRef.current && audioRef.current.src) {
      if (!audioRef.current.paused) {
         audioRef.current.pause();
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
      } else {
         audioRef.current.play();
         setMessages(prev => prev.map(m => ({ ...m, playing: m.id === msgId })));
      }
    }
  };

  const toggleTranscript = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showTranscript: !m.showTranscript } : m));
  };

  const triggerFlowStep = (nextStepId: number, userSelection?: string) => {
    if (userSelection) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: userSelection, sender: "user" }]);
       // Extract contextual data organically based on the conversational funnel depth
       const _isMeta = (val: string) => !!val.toLowerCase().match(/(omitir|skip|cualquiera|anyone|agendar|book|ver|see|foto|photo)/);
       if (nextStepId === 2 && !_isMeta(userSelection)) setSelectedService(userSelection);
       if (nextStepId === 3 && !_isMeta(userSelection)) setSelectedDoctor(userSelection);
    }
    setStepInfo({ options: [], stepId: nextStepId });

    setTimeout(() => {
      if (nextStepId === 0) {
        let formattedBrand = brandName;
        if (!new URLSearchParams(window.location.search).get('brand')) {
          const parsedName = brandName;
          formattedBrand = parsedName !== 'nuestra clínica' ? parsedName.charAt(0).toUpperCase() + parsedName.slice(1) : 'la clínica';
        }
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        const rawGreeting = VoicePromptService.getPrompt(VoiceIntent.GREETING, { brandName: formattedBrand, locale: lang || 'es' }, voiceProvider);
        let greeting = rawGreeting.replace(/Soy [a-zA-ZáéíóúÁÉÍÓÚñÑ]+/, `Soy ${activeVoice.name}`);
        if (activeVoice.gender === 'M') {
            greeting = greeting.replace(/asesora/gi, 'asesor');
        }
        
        fetchAudio(greeting, "bot-0", () => {
          const initialChips = categories.slice(0, 3).map((c: { name: string }) => c.name);
          setStepInfo({ options: initialChips, stepId: 1 });
        }, { intent: "GREETING" });
      } 
      else if (nextStepId === 1) {
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        const serviceQuestion = VoicePromptService.getPrompt(VoiceIntent.ASK_SERVICE, { userSelection, niche: activeNiche, locale: lang || 'es' }, voiceProvider);
        
        fetchAudio(serviceQuestion, "bot-1", () => {
          const nicheConf = config;
          if (userSelection && nicheConf?.voice_scripts?.deep_dive_chips && nicheConf.voice_scripts.deep_dive_chips[userSelection]) {
             setStepInfo({ options: nicheConf.voice_scripts.deep_dive_chips[userSelection], stepId: 15 });
          } else {
             setStepInfo({ options: isEng ? ["Book Appointment", "More info"] : ["Agendar Cita", "Más información"], stepId: 2 });
          }
        }, { intent: "QUESTION" });
      }
      else if (nextStepId === 15) {
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        const deepDivePrompt = VoicePromptService.getPrompt(VoiceIntent.SERVICE_DEEP_DIVE, { userSelection, niche: activeNiche, locale: lang || 'es' }, voiceProvider);
        
        fetchAudio(deepDivePrompt, "bot-15", () => {
          setStepInfo({ options: isEng ? ["Book Appointment", "More info"] : ["Agendar Cita", "Más información"], stepId: 2 });
        }, { intent: "QUESTION" });
      }
      else if (nextStepId === 2) {
        let currentService = "nuestros tratamientos";
        if (userSelection && userSelection !== "Más información" && userSelection !== "Agendar Videollamada" && userSelection !== "More info") {
           currentService = userSelection;
        } else if (categories[0] && categories[0].name) {
           currentService = categories[0].name;
        }

        const fallbackImages: Record<string, string> = {
          'hair_transplant': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop', // Scalp treatment
          'regenerative': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2000&auto=format&fit=crop',
          'dental': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop',
          'beauty': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000&auto=format&fit=crop',
          'auto': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop',
          'legal': 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=2000&auto=format&fit=crop',
        };

        let match = null;
        const srv = currentService.toLowerCase();
        if (srv.includes("fue") || srv.includes("dhi") || srv.includes("implante") || srv.includes("injerto") || srv.includes("trasplante") || srv.includes("técnica capilar")) {
           match = {
             img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop",
             text: isEng ? "Our hair intervention is truly our flagship treatment. We extract follicles one by one, leaving no scars... ensuring a natural design and maximum possible density, thanks to cutting-edge technology." : "Nuestra intervención capilar, es verdaderamente el tratamiento estrella. Extraemos los folículos uno a uno, sin dejar cicatrices... asegurando un diseño natural y la máxima densidad posible, gracias a tecnología de punta."
           };
        } else if (srv.includes("preventivo") || srv.includes("prp") || srv.includes("mesoterapia") || srv.includes("plasma")) {
           match = {
             img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop",
             text: isEng ? "Our preventive treatments intervene at the root, stopping hair loss and stimulating natural growth from the first session with painless equipment." : "Nuestros tratamientos preventivos intervienen de raíz, frenando la caída capilar y estimulando el crecimiento natural desde la primera sesión con aparatología indolora."
           };
        } else if (srv.includes("seguimiento") || srv.includes("post") || srv.includes("revisión")) {
           match = {
             img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop",
             text: isEng ? "Post-operative care is crucial for success. Our team will accompany you with face-to-face check-ups to ensure the intervention evolves flawlessly." : "El postoperatorio es crucial para lograr el éxito. Nuestro equipo te acompañará con revisiones presenciales para garantizar que la intervención evolucione de forma impecable."
           };
        }
        
        const photoUrl = match ? match.img : (fallbackImages[activeNiche] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop');
        const pitchText = match ? match.text : (isEng ? `In our clinic we guarantee excellent results thanks to cutting-edge technology and our top-tier specialists.` : `En nuestra clínica garantizamos resultados excelentes gracias a tecnología punta y nuestros especialistas de primer nivel.`);
        
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        const docPitch = VoicePromptService.getPrompt(VoiceIntent.DOCTOR_PITCH, { pitchText, locale: lang || 'es' }, voiceProvider);
        
        fetchAudio(docPitch, "bot-2", () => {
           setStepInfo({ options: isEng ? ["Book Appointment", "View Specialists"] : ["Agendar Cita", "Ver Especialistas"], stepId: 25 });
        }, { image: photoUrl, intent: "QUESTION" });
      }
      else if (nextStepId === 25) {
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}

        if (userSelection === "Ahora no" || userSelection === "Not now") {
           const byeMsg = VoicePromptService.getPrompt(VoiceIntent.BYE, { locale: lang || 'es' }, voiceProvider);
           fetchAudio(byeMsg, "bot-bye", () => {
             setStepInfo({ options: [], stepId: 0 });
           }, { intent: "GREETING" });
           return;
        }

        if (userSelection === "Ver Especialistas" || userSelection === "Ver otros Especialistas" || userSelection === "View Specialists" || userSelection === "View other Specialists") {
           const othersMsg = VoicePromptService.getPrompt(VoiceIntent.OTHERS, { locale: lang || 'es' }, voiceProvider);
           const category = categories[0];
           const rawDocs = category.docs ? category.docs.slice(0, 3) : [];
           if (rawDocs.length > 0 && rawDocs.length < 3) {
              const fallbackDocs = effectiveConfig.niche.categories[0]?.docs || [];
              for(let j = rawDocs.length; j < 3; j++) {
                 if (fallbackDocs[j]) rawDocs.push(fallbackDocs[j]);
              }
           }
           const seenImages = new Set<string>();
           const docPayload = rawDocs.map((d: string | { name: string; image?: string; specialty?: string; bio?: string }, idx: number) => {
             const baseName = typeof d === 'string' ? d : d.name;
             
             let finalName = baseName;
             let isFemale = /^(Dra\.|Doctora|María|Ana|Laura|Sof[ií]a|Carmen|Luc[ií]a|Elena|Paula|Claudia|Blanca|Sara|Marta)/i.test(finalName);
             const nicheConfig = effectiveConfig.niche;
             const dynamicSpecialties = nicheConfig.fallbackSpecialties;
             const engSpecialties = ["FUE Hair Surgeon", "DHI Specialist", "Medical Director", "Advanced Trichologist", "Lead Surgeon"];
             let assignedSpecialty = isEng ? engSpecialties[idx % engSpecialties.length] : dynamicSpecialties[idx % dynamicSpecialties.length];
             const engBio = "Lead specialist with extensive clinical experience, delivering 100% natural results.";
             const finalBio = isEng ? engBio : nicheConfig.fallbackBio;

             // If the scraped "name" is actually a generic medical title...
             if (/^(Médico|Cirujan[oa]|Especialista|Tricólog[oa]|Director[a]?|Docente|Experto|Asesor)/i.test(finalName) && finalName.split(' ').length <= 4) {
                 assignedSpecialty = finalName; // Use the generic title as the specialty
                 
                 const femaleNames = ["Dra. Elena Martín", "Dra. Sofía Navarro", "Dra. Carmen Ríos"];
                 const maleNames = ["Dr. Alejandro Gómez", "Dr. Carlos Ruiz", "Dr. Javier López"];
                 
                 isFemale = /(Cirujana|Doctora|Médica|Tricóloga|Directora|Experta|Asesora)/i.test(finalName);
                 if (!/(Cirujano|Médico|Tricólogo|Director|Experto|Asesor)/i.test(finalName) && !isFemale) {
                     isFemale = Math.random() > 0.5; // Randomize if gender neutral like "Especialista"
                 }
                 
                 finalName = isFemale ? femaleNames[idx % femaleNames.length] : maleNames[idx % maleNames.length];
             }

             const gender = isFemale ? 'women' : 'men';
             const seed = Math.floor(Math.random() * 80) + 10 + idx;
             const genericImage = `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;

             let finalImg = genericImage;
             if (typeof d !== 'string' && d.image) {
                if (!seenImages.has(d.image)) {
                   finalImg = d.image;
                   seenImages.add(d.image);
                }
             }

             if (typeof d === 'string') {
               return { name: finalName, specialty: assignedSpecialty, image: finalImg, bio: finalBio };
             } else {
               return { ...d, name: finalName, specialty: d.specialty || assignedSpecialty, image: finalImg, bio: d.bio || finalBio };
             }
           });
           
           fetchAudio(othersMsg, "bot-others", () => {
             setStepInfo({ options: [isEng ? "Anyone available" : (effectiveConfig.locale.chat_scripts?.doctor_found_options[0] || "Cualquiera disponible")], stepId: 25 });
           }, { isDoctorList: true, doctorListData: docPayload, intent: "QUESTION" });
           return;
        }

        let docNameExtracted = isEng ? "medical team" : "equipo médico";
        if (userSelection && (userSelection.startsWith("Reservar") || userSelection.startsWith("Book"))) {
           docNameExtracted = userSelection.replace("Reservar con ", "").replace("Book with ", "");
           setSelectedDoctor(docNameExtracted);
        } else if (userSelection && userSelection !== "Cualquiera disponible" && userSelection !== "Agendar Cita" && userSelection !== "Book Appointment" && userSelection !== "Anyone available") {
           setSelectedDoctor(userSelection);
           docNameExtracted = userSelection;
        }

        const nicheCfg = effectiveConfig.niche;
        if (nicheCfg.requiresPhotos) {
           const pQuestion = VoicePromptService.getPrompt(VoiceIntent.ASK_PHOTOS, { userSelection, doctorName: docNameExtracted, locale: lang || 'es' }, voiceProvider);
           fetchAudio(pQuestion, "bot-photos", () => {
              setStepInfo({ options: isEng ? ["📸 Upload photos", "Skip to calendar"] : (effectiveConfig.locale.chat_scripts?.photos_options || ["📸 Subir fotos", "Omitir e ir al calendario"]), stepId: 3 });
           }, { intent: "QUESTION" });
        } else {
           setTimeout(() => triggerFlowStep(3), 100);
        }
      }
      else if (nextStepId === 3) {
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        
        const calQuestion = VoicePromptService.getPrompt(VoiceIntent.ASK_CALENDAR, { userSelection, locale: lang || 'es' }, voiceProvider);
        
        fetchAudio(calQuestion, "bot-3", () => {
           const isEng = (lang || "es").toLowerCase().startsWith("en");
           setMessages(prev => [...prev, { id: "bot-cal", text: isEng ? "Calendar" : "Calendario", sender: "bot", isCalendar: true }]);
        }, { intent: "QUESTION" });
      }
    }, 600);
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    if (isProcessing) return;
    if (text === "📸 Subir fotos" || text === "📸 Upload photos") {
       document.getElementById('hidden-photo-input')?.click();
       return;
    }
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) triggerFlowStep(2, text);
    else if (currentStep === 25) triggerFlowStep(25, text);
    else if (currentStep === 15) triggerFlowStep(15, text);
    else if (currentStep === 3) triggerFlowStep(3, text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: "📸 3 fotos adjuntadas", sender: "user" }]);
       triggerFlowStep(3, "Fotos subidas");
    }
  };

  const handleConfirmBooking = () => {
     const isEng = (lang || '').toLowerCase().startsWith('en');
     const confirmText = isEng 
        ? `I confirm the appointment for the ${selectedDate} of ${monthNameStr} at ${selectedTime}`
        : `Confirmo la cita para el ${selectedDate} de ${monthNameStr} a las ${selectedTime}`;
     setMessages(prev => [...prev.filter(m => !m.isCalendar), { id: "user-confirm", text: confirmText, sender: "user" }]);
     
     const spokenTime = selectedTime === "09.30" ? "nueve y media de la mañana" :
                        selectedTime === "10.00" ? "diez de la mañana" :
                        selectedTime === "11.30" ? "once y media de la mañana" :
                        selectedTime === "16.00" ? "cuatro de la tarde" :
                        selectedTime === "17.20" ? "cinco y veinte de la tarde" :
                        selectedTime.replace('.', ':');

     setTimeout(() => {
        const docName = selectedDoctor || 'nuestro experto';
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}
        
        const confirmMsg = VoicePromptService.getPrompt(VoiceIntent.CONFIRM_BOOKING, { doctorName: docName, selectedDate: selectedDate || 1, spokenTime, niche: activeNiche, locale: lang || 'es' }, voiceProvider);
        
        fetchAudio(confirmMsg, "bot-success", () => {}, { isSuccess: true, isFinalCard: true, intent: "CONFIRMATION" });
     }, 600);
  };

  const isBotPlaying = messages.some(m => m.playing);
  const disableVoiceChange = isProcessing || isBotPlaying;

  return (
    <>
      <input type="file" id="hidden-photo-input" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
      <AnimatePresence>
        {!isOpen && (
           <motion.div
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 50, opacity: 0 }}
             onClick={toggleVoice}
             className={`fixed bottom-6 md:bottom-8 ${posClass} bg-white p-3 sm:p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-2.5 sm:gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[210px] sm:w-[300px] group`}
           >
             <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
               <div 
                 className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden bg-gray-50 group-hover:scale-105 transition-transform"
               >
                 <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }} />
                 <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: readableBrandText }} />
               </div>
               <span className="text-[14px] sm:text-[17px] font-medium tracking-tight text-gray-800 leading-snug text-center">
                 {isEng ? "Take the first step" : "Da el primer paso"}<br /> {isEng ? "towards" : "hacia"} <strong className="font-extrabold" style={{ color: readableBrandText }}>{isEng ? "your change" : "tu cambio"}</strong>
               </span>
             </div>
             
             <button 
               className="w-full py-2.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-md active:scale-95 transition-transform text-[14px] sm:text-[15px]"
               style={{ backgroundColor: color, color: contrastText }}
             >
               <Mic fill={contrastText} size={16} /> {isEng ? "Your Assistant" : "Tu Asistente"} {(effectiveConfig.niche && effectiveConfig.niche.title.includes('Especialistas')) ? (isEng ? 'Medical' : 'Médico') : (isEng ? 'Virtual' : 'Virtual')}
             </button>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-4 sm:bottom-6 ${posClass} w-[280px] sm:w-[330px] h-[400px] sm:h-[460px] max-h-[60vh] sm:max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5`}
          >
            {/* Header */}
            <div className="relative z-50">
              <div className="px-5 py-3 text-black flex justify-between items-center bg-gray-50/95 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden shadow-sm border border-gray-200">
                    <Image src={activeVoice.avatarUrl} alt={activeVoice.name} fill sizes="40px" unoptimized className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[13px] sm:text-[14px] leading-tight text-gray-900 whitespace-nowrap">{activeVoice.fullName}</h3>
                    <div className="flex flex-col mt-1.5">
                         <div 
                          onClick={() => { if (!disableVoiceChange) setShowVoiceSelector(!showVoiceSelector); }}
                          className={`group flex items-center w-fit ${disableVoiceChange ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                         >
                           <span className={`px-2 py-[2px] rounded-md text-[10px] sm:text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${disableVoiceChange ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 hover:bg-gray-200 border border-transparent text-gray-600'}`}>
                             {isProcessing ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                  {isEng ? "Thinking..." : "Pensando..."}
                                </>
                             ) : isBotPlaying ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                  {isEng ? "Speaking..." : "Hablando..."}
                                </>
                             ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                  {isEng ? "Change Assistant" : "Cambiar Asistente"} <ChevronDown size={10} className="text-gray-400 group-hover:text-gray-600" />
                                </>
                             )}
                           </span>
                         </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleVoice(); }}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                 {showVoiceSelector && (
                    <motion.div 
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-lg max-h-[300px] overflow-y-auto z-40 rounded-b-xl"
                    >
                       <div className="p-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 pt-1">Mujeres</p>
                          {getVoices(lang).slice(0, 3).map((v: VoiceProfile) => (
                             <div 
                               key={v.id}
                               onClick={() => handleVoiceSelection(v.id, v.name)}
                               className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${activeVoiceId === v.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                             >
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 relative shrink-0">
                                  <Image src={v.avatarUrl} alt={v.name} fill sizes="40px" unoptimized className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className={`text-sm font-semibold truncate ${activeVoiceId === v.id ? 'text-blue-700' : 'text-gray-900'}`}>{v.name} · <span className="font-normal opacity-70">{v.role}</span></p>
                                   <p className="text-xs text-gray-500 truncate">{v.tone} <span className="opacity-50">|</span> {v.useCase}</p>
                                </div>
                                {activeVoiceId === v.id && <Check size={16} className="text-blue-600 mr-2 shrink-0" />}
                             </div>
                          ))}
                          
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Hombres</p>
                          {getVoices(lang).slice(6, 9).map((v: VoiceProfile) => (
                             <div 
                               key={v.id}
                               onClick={() => handleVoiceSelection(v.id, v.name)}
                               className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${activeVoiceId === v.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                             >
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 relative shrink-0 opacity-90">
                                  <Image src={v.avatarUrl} alt={v.name} fill sizes="40px" unoptimized className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className={`text-sm font-semibold truncate ${activeVoiceId === v.id ? 'text-blue-700' : 'text-gray-900'}`}>{v.name} · <span className="font-normal opacity-70">{v.role}</span></p>
                                   <p className="text-xs text-gray-500 truncate">{v.tone} <span className="opacity-50">|</span> {v.useCase}</p>
                                </div>
                                {activeVoiceId === v.id && <Check size={16} className="text-blue-600 mr-2 shrink-0" />}
                             </div>
                          ))}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 mb-2 ${msg.sender === "user" ? "justify-end flex-row-reverse" : "justify-start"}`}
                  >
                    {/* Chat Bubble OR Inline Calendar */}
                    {msg.isCalendar ? (
                      <div className="w-full pl-3 pr-1 pt-2">
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm w-full">
                           <div className="flex justify-between items-center mb-4">
                             <button onClick={() => setMonthOffset(p => p - 1)} disabled={monthOffset <= 0} className="p-1 disabled:opacity-30"><ChevronLeft size={16} className="text-gray-400" /></button>
                             <span className="font-bold text-[13px] text-gray-800">{currentMonthText}</span>
                             <button onClick={() => setMonthOffset(p => p + 1)} className="p-1 hover:bg-gray-50 rounded-full"><ChevronRight size={16} className="text-gray-400" /></button>
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase">
                             <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span className="opacity-40">S</span><span className="opacity-40">D</span>
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[12px] font-semibold mb-4">
                             {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                               const isWeekend = (d - 1) % 7 === 5 || (d - 1) % 7 === 6;
                               const isPast = monthOffset < 0 || (monthOffset === 0 && d < currentDay) || isWeekend;
                               const hash = (d * 13 + dispMonthIdx * 31) % 100;
                               const isRed = !isPast && !isWeekend && hash < 25;
                               const isGreen = !isPast && !isWeekend && !isRed && hash > 40 && hash < 85;
                               let btnClass = "w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-colors ";
                               if (selectedDate === d) btnClass += "text-white shadow-md scale-110";
                               else if (isPast) btnClass += "text-gray-300 font-normal cursor-not-allowed";
                               else if (isRed) btnClass += "text-red-400 bg-red-50 font-bold cursor-not-allowed line-through";
                               else if (isGreen) btnClass += "bg-[#10b98115] text-[#10b981] font-semibold hover:bg-[#10b98130] cursor-pointer";
                               else btnClass += "text-gray-700 bg-white hover:bg-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]";
                               return (
                                 <button key={d} disabled={isPast || isRed} onClick={() => { setSelectedDate(d); setSelectedTime(""); }} className={btnClass} style={selectedDate === d ? { backgroundColor: color, color: '#fff' } : {}}>{d}</button>
                               )
                             })}
                           </div>
                           {selectedDate && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 pt-3">
                               <p className="text-[11px] font-bold text-gray-500 mb-2">{isEng ? "Availability:" : "Horarios:"}</p>
                               <div className="grid grid-cols-3 gap-2">
                                 {times.map(t => (
                                   <button key={t} onClick={() => setSelectedTime(t)} className={`w-full py-1.5 rounded-[10px] text-[12px] font-bold transition-all ${selectedTime === t ? 'shadow-md border-transparent text-white' : 'border border-gray-200 text-gray-600'}`} style={selectedTime === t ? { backgroundColor: color, color: contrastText } : {}}>{t}</button>
                                 ))}
                               </div>
                             </motion.div>
                           )}
                           <AnimatePresence>
                             {selectedDate && selectedTime && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                                 <button onClick={handleConfirmBooking} className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white shadow-md active:scale-95 transition-all" style={{ backgroundColor: color, color: contrastText }}>
                                   Confirmar Reserva
                                 </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      </div>
                    ) : msg.isFinalCard ? (
                      <div className="w-full pt-1 pb-2">
                         <div className="bg-white border text-center border-gray-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] w-full relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
                           <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm ring-1 ring-gray-50">
                             <CheckCircle2 size={28} className="text-green-500" />
                           </div>
                           <h3 className="font-extrabold text-[17px] text-gray-900 mb-1 tracking-tight">{isEng ? "Booking Confirmed!" : "¡Reserva Confirmada!"}</h3>
                           <p className="text-[12px] text-gray-500 mb-6 font-medium leading-relaxed px-2">{isEng ? "We have sent an email with all the details and preparation guidelines for your visit." : "Hemos enviado un email con todos los detalles y preparación previa para tu visita."}</p>
                           
                           <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 text-left space-y-3.5 border border-gray-100">
                             {selectedDoctor && (
                               <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-3">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEng ? "Specialist" : "Especialista"}</span>
                                 <span className="text-[14px] font-bold text-gray-800 tracking-tight">{selectedDoctor}</span>
                               </div>
                             )}
                             {selectedService && (
                               <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-3">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEng ? "Service" : "Servicio"}</span>
                                 <span className="text-[14px] font-bold text-gray-800 tracking-tight">{selectedService}</span>
                               </div>
                             )}
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEng ? "Date and Time" : "Fecha y Horario"}</span>
                               <span className="text-[14px] font-bold text-gray-800 tracking-tight">{monthShort} {selectedDate}, {selectedTime}</span>
                             </div>
                           </div>

                           <button onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all text-[14px] flex items-center justify-center gap-2 group" style={{ backgroundColor: color, color: contrastText }}>
                             {isEng ? "Back to website" : "Volver a la web"} <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                         </div>
                      </div>
                    ) : msg.sender === "bot" ? (
                      <div className="flex flex-col w-[98%] self-start">
                         <div 
                           className={`rounded-2xl p-4 shadow-sm relative group overflow-hidden bg-white border border-gray-100 rounded-tl-sm ring-1 ring-black/5 w-full`}
                         >
                            <div className="flex items-center gap-4 w-full">
                               <div className="relative shrink-0 cursor-pointer" onClick={() => togglePlayAudio(msg.id)}>
                                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 z-10 relative" style={{ backgroundColor: color }}>
                                    {msg.playing ? <Volume2 size={24} color="#fff" className="animate-pulse" /> : <Play size={24} color="#fff" className="ml-1" />}
                                 </div>
                                 {msg.playing && <div className="absolute inset-0 rounded-full animate-ping opacity-40 z-0" style={{ backgroundColor: color }} />}
                               </div>
                               
                               <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                                  <AudioProgress isPlaying={msg.playing} duration={msg.duration} color={color} audioRef={audioRef} />
                               </div>
                            </div>
                            
                            <div className="mt-3 pt-2.5 border-t border-gray-100/80 w-full overflow-hidden">
                              {msg.image && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="w-[calc(100%+0.5rem)] -mx-1 h-[140px] sm:h-[150px] rounded-[14px] mt-1 mb-3.5 shadow-sm border border-gray-100/50 overflow-hidden relative"
                                >
                                  <Image src={msg.image} alt="Visual Context" fill sizes="(max-width: 640px) 100vw, 320px" unoptimized className="object-cover" />
                                </motion.div>
                              )}
                              <button 
                                onClick={() => toggleTranscript(msg.id)}
                                className="text-[11px] sm:text-[13px] text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1.5 transition-colors w-full"
                              >
                                <Menu size={12}/> {msg.showTranscript ? (isEng ? "Hide transcript" : "Ocultar transcripción") : (isEng ? "View transcript" : "Ver transcripción")}
                              </button>

                              {msg.isDoctorList && msg.doctorListData && (
                                 <div className="flex flex-col gap-2.5 w-full mt-3.5 pt-3 border-t border-gray-100/80">
                                   <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">{isEng ? "Medical Team" : "Equipo Médico"}</span>
                                   {msg.doctorListData.map((doc, idx) => {
                                     const isExpanded = expandedDocIdx === idx;
                                     return (
                                       <motion.div layout key={idx} className="flex flex-col p-3 bg-white border-2 border-gray-200 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gray-300 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden relative" onClick={() => setExpandedDocIdx(isExpanded ? null : idx)}>
                                         <div className="flex items-center justify-between">
                                           <div className="flex items-center gap-3">
                                             <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                                                <Image
                                                  src={doc.image || `https://randomuser.me/api/portraits/${/(Dra\.|Maria|Ana|Laura|Elena|Sofia)/i.test(doc.name) ? 'women' : 'men'}/${40 + idx}.jpg`}
                                                  alt={doc.name}
                                                  fill
                                                  sizes="48px"
                                                  unoptimized
                                                  className="object-cover"
                                                />
                                             </div>
                                             <div className="flex flex-col">
                                               <span className="text-[14px] font-bold text-gray-900 tracking-tight leading-none mb-1">{doc.name}</span>
                                               <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-500">{doc.specialty || (isEng ? "LEAD SPECIALIST" : "ESPECIALISTA TITULAR")}</span>
                                             </div>
                                           </div>
                                           
                                           <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600 transition-colors">
                                              <ChevronRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                           </div>
                                         </div>
                                         <AnimatePresence>
                                            {isExpanded && (
                                              <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 flex flex-col relative"
                                              >
                                                <div className="w-full h-px bg-gray-100 mb-3" />
                                                <p className="text-[12.5px] text-gray-500 leading-relaxed font-medium px-1 mb-3">
                                                  {doc.bio || "Especialista con amplia trayectoria clínica y vocación por la atención personalizada."}
                                                </p>
                                                <button 
                                                  className="w-full text-[13px] py-2.5 rounded-[10px] font-bold transition-all shadow-sm hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-1.5" 
                                                  style={{ backgroundColor: color + "15", color: getDarkerColor(color) }}
                                                  onClick={(e) => { e.stopPropagation(); handleUserSelect(isEng ? `Book with ${doc.name}` : `Reservar con ${doc.name}`, 25); }}
                                                >
                                                  {isEng ? "Book appointment" : "Reservar cita"} <ChevronRight size={14} strokeWidth={3} />
                                                </button>
                                              </motion.div>
                                            )}
                                         </AnimatePresence>
                                       </motion.div>
                                     );
                                   })}
                                 </div>
                              )}
                            </div>
                         </div>

                         <AnimatePresence>
                           {msg.showTranscript && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-[13px] sm:text-[14px] leading-relaxed text-gray-700 mt-2 font-medium bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 w-full self-start"
                              >
                                {msg.text}
                              </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    ) : (
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm rounded-tr-none`}
                        style={{ backgroundColor: color, color: contrastText }}
                      >
                        {msg.text}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Interactive Chips for Demo Flow */}
                {stepInfo.options.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-4 items-end"
                  >
                    {stepInfo.options.map((opt, i) => {
                      const isPrimary = opt === "📸 Subir fotos" || opt === "📸 Upload photos";
                      const isSecondary = opt.includes("Omitir");
                      return (
                        <button
                          key={i}
                          onClick={() => handleUserSelect(opt, stepInfo.stepId)}
                          className={`px-4 py-2.5 text-[14px] text-center font-bold rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all ${
                             isPrimary 
                               ? 'w-[90%] mx-auto hover:brightness-110 active:scale-95 border-transparent py-3 text-[14px]' 
                               : isSecondary
                               ? 'w-[80%] mx-auto bg-gray-100/90 text-gray-600 hover:bg-gray-200 border-transparent text-[12px]'
                               : 'text-right'
                          }`}
                          style={isPrimary || (!isPrimary && !isSecondary) ? { backgroundColor: color, color: contrastText } : {}}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Padding bottom buffer */}
            <div className="p-2 bg-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
