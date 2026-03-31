"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Play, Menu } from "lucide-react";
import { NICHE_CONFIGS } from "../config/nicheConfig";

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

export function AIAssistantVoice({ color, niche = "hair_transplant", pos = "right" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number }>({ options: [], stepId: 0 });
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedGreetingRef = useRef<string | null>(null);

  useEffect(() => {
    // Pre-fetch greeting for instantaneous startup
    const preloadGreeting = async () => {
      let currentBrand = "la Clínica Capilar";
      try {
         const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
         if (storedSite) {
            let parsedName = new URL(storedSite).hostname.replace('www.', '').split('.')[0];
            parsedName = parsedName.replace(/^cl[ií]nica/i, '').replace(/-?cl[ií]nica-?/i, '');
            if (!parsedName) parsedName = "especializada";
            // Fix TTS stuttering for domains like "mcapilar" perfectly by using initials
            parsedName = parsedName.replace(/^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz][a-z]+)/i, (_, p1, p2) => p1.toUpperCase() + '. ' + p2.charAt(0).toUpperCase() + p2.slice(1));
            currentBrand = "la clínica " + parsedName.charAt(0).toUpperCase() + parsedName.slice(1);
         }
      } catch {
        // Ignore
      }

      const greeting = `Hola. Bienvenido a ${currentBrand}. Soy Laura, tu asesora virtual. Sé que dar el paso es una decisión importante. ¿De qué servicios te gustaría recibir más información?`;
      try {
        let voiceProvider = "polly";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "polly"; } catch {}
        const res = await fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greeting, provider: voiceProvider, voiceType: 'guided' })
        });
        if (res.ok) {
          const blob = await res.blob();
          preloadedGreetingRef.current = URL.createObjectURL(blob);
        }
      } catch (e) {
        console.error("Polly Preload Error:", e);
      }
    };
    preloadGreeting();
  }, []);
  
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
  const monthNameStr = displayedDate.toLocaleString('es-ES', { month: 'long' });
  const currentMonthText = monthNameStr.charAt(0).toUpperCase() + monthNameStr.slice(1) + " " + dispYear;
  const monthShort = monthNameStr.substring(0, 3);

  // Ensure the explicitly selected niche from the dashboard takes precedence over auto-detection
  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");
  const config = NICHE_CONFIGS[activeNiche] || NICHE_CONFIGS.medical;
  const posClass = pos === "right" ? "right-4 sm:right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-4 sm:left-6";
  const contrastText = getContrastColor(color);
  const darkerBorder = getDarkerColor(color);

  const readableBrandText = contrastText === '#000000' ? darkerBorder : color;

  const [scrapedData, setScrapedData] = useState<{ categories: { name?: string, docs: ({name: string, image?: string} | string)[] }[] } | null>(null);

  useEffect(() => {
    try {
      const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
      if (storedSite) {
        setTimeout(() => setBrandName(new URL(storedSite).hostname.replace('www.', '').split('.')[0]), 0);
        fetch('/api/v1/scrape-team?url=' + encodeURIComponent(storedSite) + '&t=' + Date.now())
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

  let categories = config.categories;
  if (scrapedData && scrapedData.categories) {
    categories = categories.map((cat, i) => {
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
    if (isOpen) {
      stopAudio();
      setIsOpen(false);
      setMessages([]);
      setStepInfo({ options: [], stepId: 0 });
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedService("");
      setSelectedDoctor("");
    } else {
      setIsOpen(true);
      triggerFlowStep(0);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, stepInfo, selectedDate, selectedTime]);

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void, extraParams?: { isSuccess?: boolean; isFinalCard?: boolean; image?: string; isDoctorList?: boolean; doctorListData?: DoctorData[] }) => {
    try {
      setIsProcessing(true);
      // Remove SSML tags for the visual chat bubble
      const displayText = text.replace(/<[^>]*>/g, '');
      setMessages(prev => [...prev, { id: msgId, text: displayText, sender: "bot", playing: true, ...extraParams }]);
      
      let voiceProvider = "polly";
      try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "polly"; } catch {}

      const res = await fetch('/api/v1/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, provider: voiceProvider, voiceType: 'guided' })
      });
      
      if (!res.ok) throw new Error("Voice API Error");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => {
        let dur = audio.duration;
        if (dur === Infinity || isNaN(dur)) dur = 10;
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, duration: dur } : m));
      };
      
      audio.onended = () => {
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
         setIsProcessing(false);
         onEnd();
      };
      
      await audio.play();
    } catch (e) {
      console.error("Polly Error:", e);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
      setIsProcessing(false);
      onEnd();
    }
  };
  const AudioTimer = ({ isPlaying, duration }: { isPlaying?: boolean, duration?: number }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
      let timer: ReturnType<typeof setInterval>;
      if (isPlaying) {
        setElapsed(0);
        timer = setInterval(() => {
          setElapsed(prev => {
            if (duration && prev >= duration) return duration;
            return prev + 1;
          });
        }, 1000);
      } else {
        setElapsed(0);
      }
      return () => clearInterval(timer);
    }, [isPlaying, duration]);

    const display = isPlaying ? elapsed : (duration || 0);
    const m = Math.floor(display / 60);
    const s = Math.floor(display % 60);
    return <>{m}:{s.toString().padStart(2, '0')}</>;
  };

  const togglePlayAudio = (msgId: string) => {
    if (audioRef.current && audioRef.current.src) {
      if (!audioRef.current.paused) {
         audioRef.current.pause();
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
      } else {
         audioRef.current.play();
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: true } : m));
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
       if (nextStepId === 2) setSelectedService(userSelection);
       if (nextStepId === 3) setSelectedDoctor(userSelection);
    }
    setStepInfo({ options: [], stepId: nextStepId });

    setTimeout(() => {
      if (nextStepId === 0) {
        const parsedName = brandName.replace(/^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz][a-z]+)/i, (_, p1, p2) => p1.toUpperCase() + '. ' + p2.charAt(0).toUpperCase() + p2.slice(1));
        const formattedBrand = parsedName !== 'nuestra clínica' ? parsedName.charAt(0).toUpperCase() + parsedName.slice(1) : 'la clínica';
        const greeting = `Hola. Bienvenido a ${formattedBrand}. Soy Laura, tu asesora virtual. ¿De qué servicios te gustaría recibir más información?`;
        
        fetchAudio(greeting, "bot-0", () => {
          const initialChips = categories.slice(0, 3).map((c: { name: string }) => c.name);
          setStepInfo({ options: initialChips, stepId: 1 });
        });
      } 
      else if (nextStepId === 1) {
        const isHT = activeNiche === 'hair_transplant';

        let htIntro = "En tu valoración médica gratuita analizaremos tu caso particular sin compromiso.";
        if (isHT) {
           if (userSelection === "Técnica FUE / DHI") {
              htIntro = "La técnica <say-as interpret-as=\"characters\">FUE</say-as> trasplanta los folículos pelo a pelo, sin dolor ni cicatrices, aportando una densidad completamente natural. <break time=\"200ms\"/> En tu valoración médica gratuita analizaremos tu caso particular al milímetro.";
           } else if (userSelection === "Tratamientos Preventivos") {
              htIntro = "Nuestros tratamientos frenan de raíz la caída y estimulan el crecimiento de pelo nuevo, multiplicando toda tu densidad. <break time=\"200ms\"/> En tu valoración gratuita analizaremos las causas de tu caso particular.";
           } else if (userSelection === "Seguimiento Postoperatorio") {
              htIntro = "El correcto seguimiento posoperatorio es la clave maestra para garantizar que esos nuevos cabellos crezcan sanos y fuertes tras la cirugía. <break time=\"200ms\"/> En tu valoración gratuita podemos analizar tu evolución.";
           }
        }

        const serviceQuestion = isHT 
          ? `Estupendo. ${htIntro} ¿Te gustaría agendar una videollamada con el doctor? ¿O prefieres más información de nuestros servicios en clínica?`
          : `Perfecto. ¿Con qué especialidad o tratamiento te gustaría continuar tu sesión hoy?`;
        
        fetchAudio(serviceQuestion, "bot-1", () => {
          const extraChips = categories.length > 3 ? categories.slice(3, 5).map((c: { name: string }) => c.name) : ["Agendar Videollamada", "Más información"];
          setStepInfo({ options: extraChips, stepId: 2 });
        });
      }
      else if (nextStepId === 2) {
        let currentService = "nuestros tratamientos";
        if (userSelection && userSelection !== "Más información" && userSelection !== "Agendar Videollamada") {
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
             text: "Nuestra intervención capilar es el tratamiento estrella. Extraemos los folículos de forma individual sin dejar cicatrices, asegurando un diseño natural y densidad máxima gracias a la mejor tecnología."
           };
        } else if (srv.includes("preventivo") || srv.includes("prp") || srv.includes("mesoterapia") || srv.includes("plasma")) {
           match = {
             img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop",
             text: "Nuestros tratamientos preventivos intervienen de raíz, frenando la caída capilar y estimulando el crecimiento natural desde la primera sesión con aparatología indolora."
           };
        } else if (srv.includes("seguimiento") || srv.includes("post") || srv.includes("revisión")) {
           match = {
             img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop",
             text: "El postoperatorio es crucial para lograr el éxito. Nuestro equipo te acompañará con revisiones presenciales para garantizar que la intervención evolucione de forma impecable."
           };
        }
        
        const photoUrl = match ? match.img : (fallbackImages[activeNiche] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop');
        const pitchText = match ? match.text : `En ${currentService} garantizamos resultados excelentes gracias a tecnología punta y nuestros especialistas de primer nivel.`;
        
        const docPitch = `${pitchText} <break time="200ms"/> ¿Quieres ver al equipo médico? ¿O prefieres que agendemos tu valoración ahora?`;
        
        fetchAudio(docPitch, "bot-2", () => {
           setStepInfo({ options: ["Agendar Cita", "Ver Especialistas"], stepId: 25 });
        }, { image: photoUrl });
      }
      else if (nextStepId === 25) {
        if (userSelection === "Ahora no") {
           fetchAudio("No te preocupes. Estoy aquí cuando me necesites para dar ese gran paso.", "bot-bye", () => {
             setStepInfo({ options: [], stepId: 0 });
           });
           return;
        }

        if (userSelection === "Ver Especialistas" || userSelection === "Ver otros Especialistas") {
           const othersMsg = "Claro, aquí tienes al resto del equipo titular. Dime con quién prefieres agendar.";
           const category = categories[0];
           const rawDocs = category.docs.slice(0, 3);
           const seenImages = new Set<string>();
           const docPayload = rawDocs.map((d: string | { name: string; image?: string; specialty?: string; bio?: string }, idx: number) => {
             const baseName = typeof d === 'string' ? d : d.name;
             
             let finalName = baseName;
             let isFemale = /^(Dra\.|Doctora|María|Ana|Laura|Sof[ií]a|Carmen|Luc[ií]a|Elena|Paula|Claudia|Blanca|Sara|Marta)/i.test(finalName);
             const hairSpecialties = ["Cirujana Capilar FUE", "Especialista DHI", "Directora Médica", "Tricóloga Avanzada", "Microinjerto Capilar", "Cirujano Titular"];
             let assignedSpecialty = hairSpecialties[idx % hairSpecialties.length];

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
               return { name: finalName, specialty: assignedSpecialty, image: finalImg, bio: 'Especialista titular con miles de folículos trasplantados, apostando por el diseño 100% natural.' };
             } else {
               return { ...d, name: finalName, specialty: d.specialty || assignedSpecialty, image: finalImg, bio: d.bio || 'Reconocida especialista internacional con gran experiencia en casos complejos de alopecia.' };
             }
           });
           
           fetchAudio(othersMsg, "bot-others", () => {
             setStepInfo({ options: ["Cualquiera disponible"], stepId: 25 });
           }, { isDoctorList: true, doctorListData: docPayload });
           return;
        }

        let pQuestion = `Excelente decisión. Antes de abrir el calendario, ¿podrías subir 3 fotos rápidas de tu caso? Así el equipo médico podrá evaluarlas antes de tu cita.`;

        if (userSelection && userSelection.startsWith("Reservar")) {
           const docNameExtracted = userSelection.replace("Reservar con ", "");
           setSelectedDoctor(docNameExtracted);
           pQuestion = `Excelente elección. Antes de abrir la agenda de ${docNameExtracted}, ¿podrías subir 3 fotos de tu caso? Así las revisará antes de conectarse.`;
        } else if (userSelection && userSelection !== "Cualquiera disponible" && userSelection !== "Agendar Cita") {
           setSelectedDoctor(userSelection);
        }

        fetchAudio(pQuestion, "bot-photos", () => {
           setStepInfo({ options: ["📸 Subir fotos", "Omitir e ir al calendario"], stepId: 3 });
        });
      }
      else if (nextStepId === 3) {
        let calQuestion = "De acuerdo, accede al calendario y selecciona la fecha y hora que prefieras.";
        if (userSelection === "Fotos subidas") {
           calQuestion = "¡Perfecto! Las he adjuntado a tu expediente seguro. Ahora sí, elige el día y la hora que mejor te vengan aquí abajo.";
        }
        
        fetchAudio(calQuestion, "bot-3", () => {
           setMessages(prev => [...prev, { id: "bot-cal", text: "Calendario", sender: "bot", isCalendar: true }]);
        });
      }
    }, 600);
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    if (isProcessing) return;
    if (text === "📸 Subir fotos") {
       document.getElementById('hidden-photo-input')?.click();
       return;
    }
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) triggerFlowStep(2, text);
    else if (currentStep === 25) triggerFlowStep(25, text);
    else if (currentStep === 3) triggerFlowStep(3, text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: "📸 3 fotos adjuntadas", sender: "user" }]);
       triggerFlowStep(3, "Fotos subidas");
    }
  };

  const handleConfirmBooking = () => {
     setMessages(prev => [...prev.filter(m => !m.isCalendar), { id: "user-confirm", text: `Confirmo la cita para el ${selectedDate} de ${monthNameStr} a las ${selectedTime}`, sender: "user" }]);
     
     const spokenTime = selectedTime === "09.30" ? "nueve y media de la mañana" :
                        selectedTime === "10.00" ? "diez de la mañana" :
                        selectedTime === "11.30" ? "once y media de la mañana" :
                        selectedTime === "16.00" ? "cuatro de la tarde" :
                        selectedTime === "17.20" ? "cinco y veinte de la tarde" :
                        selectedTime.replace('.', ':');

     setTimeout(() => {
        const docName = selectedDoctor || 'nuestro experto';
        const isHT = activeNiche === 'hair_transplant';
        const confirmMsg = isHT 
             ? `¡Estupendo! <break time="400ms"/> Tu reserva con ${docName} en nuestra clínica ha quedado confirmada. <break time="300ms"/> Te esperamos.`
             : `¡Estupendo! Tu reserva con ${docName} para el día ${selectedDate} a las ${spokenTime} ha quedado confirmada, te esperamos.`;
        fetchAudio(confirmMsg, "bot-success", () => {}, { isSuccess: true, isFinalCard: true });
     }, 600);
  };

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
                 Da el primer paso<br /> hacia <strong className="font-extrabold" style={{ color: readableBrandText }}>tu cambio</strong>
               </span>
             </div>
             
             <button 
               className="w-full py-2.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-md active:scale-95 transition-transform text-[14px] sm:text-[15px]"
               style={{ backgroundColor: color, color: contrastText }}
             >
               <Mic fill={contrastText} size={16} /> Tu Asistente Capilar
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
            <div className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden shadow-sm border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Asesora" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight text-gray-900 whitespace-nowrap">Laura · Asesora Capilar</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[12px] text-green-600 font-medium tracking-tight">{isProcessing ? "Hablando..." : "En línea"}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleVoice}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
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
                               <p className="text-[11px] font-bold text-gray-500 mb-2">Horarios:</p>
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
                           <h3 className="font-extrabold text-[17px] text-gray-900 mb-1 tracking-tight">¡Reserva Confirmada!</h3>
                           <p className="text-[12px] text-gray-500 mb-6 font-medium leading-relaxed px-2">Hemos enviado un email con todos los detalles y preparación previa para tu visita.</p>
                           
                           <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 text-left space-y-3.5 border border-gray-100">
                             {selectedDoctor && (
                               <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-3">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Especialista</span>
                                 <span className="text-[14px] font-bold text-gray-800 tracking-tight">{selectedDoctor}</span>
                               </div>
                             )}
                             {selectedService && (
                               <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-3">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Servicio</span>
                                 <span className="text-[14px] font-bold text-gray-800 tracking-tight">{selectedService}</span>
                               </div>
                             )}
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha y Horario</span>
                               <span className="text-[14px] font-bold text-gray-800 tracking-tight">{monthShort} {selectedDate}, {selectedTime}</span>
                             </div>
                           </div>

                           <button onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all text-[14px] flex items-center justify-center gap-2 group" style={{ backgroundColor: color, color: contrastText }}>
                             Volver a la web <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
                                  <div className="h-1.5 bg-gray-200 rounded-full w-full relative mb-2 flex items-center">
                                     <motion.div 
                                       initial={{ width: "0%" }}
                                       animate={{ width: msg.playing ? "100%" : "100%" }}
                                       transition={msg.playing ? { duration: msg.duration || 10, ease: "linear" } : { duration: 0 }}
                                       className={`absolute top-0 left-0 h-full rounded-full ${!msg.playing ? 'opacity-50' : ''}`}
                                       style={{ backgroundColor: color }}
                                     />
                                     <motion.div
                                       initial={{ left: "0%" }}
                                       animate={{ left: msg.playing ? "100%" : "100%" }}
                                       transition={msg.playing ? { duration: msg.duration || 10, ease: "linear" } : { duration: 0 }}
                                       className="absolute w-3 h-3 rounded-full bg-white shadow-sm border border-gray-300 -ml-1.5 z-10"
                                     />
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                     <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 tracking-wide">
                                       <AudioTimer isPlaying={msg.playing} duration={msg.duration} />
                                     </span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="mt-3 pt-2.5 border-t border-gray-100/80 w-full overflow-hidden">
                              {msg.image && (
                                <motion.img 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  src={msg.image} 
                                  alt="Visual Context" 
                                  className="w-[calc(100%+0.5rem)] -mx-1 h-[140px] sm:h-[150px] object-cover rounded-[14px] mt-1 mb-3.5 shadow-sm border border-gray-100/50" 
                                />
                              )}
                              <button 
                                onClick={() => toggleTranscript(msg.id)}
                                className="text-[11px] sm:text-[13px] text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1.5 transition-colors w-full"
                              >
                                <Menu size={12}/> {msg.showTranscript ? "Ocultar transcripción" : "Ver transcripción"}
                              </button>

                              {msg.isDoctorList && msg.doctorListData && (
                                 <div className="flex flex-col gap-2.5 w-full mt-3.5 pt-3 border-t border-gray-100/80">
                                   <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">Equipo Médico</span>
                                   {msg.doctorListData.map((doc, idx) => {
                                     const isExpanded = expandedDocIdx === idx;
                                     return (
                                       <motion.div layout key={idx} className="flex flex-col p-3 bg-white border border-gray-100 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gray-200 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden relative" onClick={() => setExpandedDocIdx(isExpanded ? null : idx)}>
                                         <div className="flex items-center justify-between">
                                           <div className="flex items-center gap-3">
                                             <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={doc.image || `https://randomuser.me/api/portraits/${/(Dra\.|Maria|Ana|Laura|Elena|Sofia)/i.test(doc.name) ? 'women' : 'men'}/${40 + idx}.jpg`} className="w-full h-full object-cover" alt={doc.name} />
                                             </div>
                                             <div className="flex flex-col">
                                               <span className="text-[14px] font-bold text-gray-900 tracking-tight leading-none mb-1">{doc.name}</span>
                                               <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-500">{doc.specialty || "ESPECIALISTA TITULAR"}</span>
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
                                                  onClick={(e) => { e.stopPropagation(); handleUserSelect(`Reservar con ${doc.name}`, 25); }}
                                                >
                                                  Reservar cita <ChevronRight size={14} strokeWidth={3} />
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
                      const isPrimary = opt === "📸 Subir fotos";
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
