"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles, Play, Menu, Camera, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
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

type Msg = { 
  id: string; 
  text: string; 
  sender: "bot" | "user"; 
  playing?: boolean; 
  isCalendar?: boolean; 
  isSuccess?: boolean; 
  isFinalCard?: boolean; 
  showTranscript?: boolean; 
  duration?: number;
  isPhotos?: boolean;
  photoUrls?: string[];
};

export function AIAssistantVoiceFree({ color, niche = "hair_transplant", pos = "left" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number }>({ options: [], stepId: 0 });
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [micTime, setMicTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor] = useState("Laura - Asesora");
  const [selectedService] = useState("Valoración Capilar Gratuita");
  const [brandName, setBrandName] = useState("la Clínica Capilar");
  const times = ["09:00", "10:30", "12:00", "16:00", "17:30", "18:45"];

  useEffect(() => {
    try {
      const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
      const brandParam = new URLSearchParams(window.location.search).get('brand');
      if (brandParam) {
        setBrandName(brandParam);
      } else if (storedSite) {
        let parsed = new URL(storedSite).hostname.replace('www.', '').split('.')[0];
        parsed = parsed.replace(/^cl[ií]nica/i, '').replace(/-?cl[ií]nica-?/i, '');
        if (!parsed) parsed = "Especializada";
        parsed = parsed.replace(/^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz][a-z]+)/i, (_, p1, p2) => p1.toUpperCase() + '. ' + p2.charAt(0).toUpperCase() + p2.slice(1));
        setBrandName("la clínica " + parsed.charAt(0).toUpperCase() + parsed.slice(1));
      }
    } catch {
      // Ignore
    }
  }, []);
  
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

  const handleConfirmBooking = () => {
    setMessages(prev => [...prev.filter(m => !m.isCalendar), { id: "bot-done-card", text: "¡Confirmado!", sender: "bot", isFinalCard: true }]);
    setTimeout(() => {
       const confirmationText = `Perfecto. Tu cita para el día ${selectedDate} de ${monthNameStr} a las ${selectedTime} ha sido reservada con éxito. Te hemos enviado un correo con todos los detalles. ¡Nos vemos pronto!`;
       fetchAudio(confirmationText, "bot-done-audio", () => {});
    }, 500);
  };
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRecognizedRef = useRef(false);
  const preloadedGreetingRef = useRef<string | null>(null);

  useEffect(() => {
    // Pre-fetch greeting for instantaneous startup
    const preloadGreeting = async () => {
      let currentBrand = "la Clínica Capilar";
      try {
         const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
         const brandParam = new URLSearchParams(window.location.search).get('brand');
         if (brandParam) {
            currentBrand = brandParam;
         } else if (storedSite) {
            let parsedName = new URL(storedSite).hostname.replace('www.', '').split('.')[0];
            parsedName = parsedName.replace(/^cl[ií]nica/i, '').replace(/-?cl[ií]nica-?/i, '');
            if (!parsedName) parsedName = "especializada";
            parsedName = parsedName.replace(/^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz][a-z]+)/i, (_, p1, p2) => p1.toUpperCase() + '. ' + p2.charAt(0).toUpperCase() + p2.slice(1));
            currentBrand = "la clínica " + parsedName.charAt(0).toUpperCase() + parsedName.slice(1);
         }
      } catch {
        // Ignore
      }

      const greeting = `¡Hola! Bienvenido a ${currentBrand}. Soy Laura, tu asesora médica. Sé que dar el paso es una decisión importante. ¿Qué te gustaría saber sobre nuestros tratamientos?`;
      try {
        let voiceProvider = "polly";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "polly"; } catch {}
        const res = await fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greeting, provider: voiceProvider, voiceType: 'free' })
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
  

  // Ensure the explicitly selected niche from the dashboard takes precedence over auto-detection
  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");
  const config = NICHE_CONFIGS[activeNiche] || NICHE_CONFIGS.medical;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _config = config; 
  const posClass = pos === "right" ? "right-4 sm:right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-4 sm:left-6";
  const contrastText = getContrastColor(color);
  const darkerBorder = getDarkerColor(color);

  const readableBrandText = contrastText === '#000000' ? darkerBorder : color;

  useEffect(() => {
    try {
      const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
      if (storedSite) {
        fetch('/api/v1/scrape-team?url=' + encodeURIComponent(storedSite) + '&t=' + Date.now())
          .then(res => res.json())
          .then(data => {
            if (data && data.success) {
              if (data.detectedNiche) setDetectedNiche(data.detectedNiche);
            } else if (data && data.detectedNiche) {
              setDetectedNiche(data.detectedNiche);
            }
          })
          .catch(e => console.error(e));
      }
    } catch {}
  }, []);

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
    } else {
      setIsOpen(true);
      triggerFlowStep(0);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, stepInfo]);

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void, extraProps?: Partial<Msg>) => {
    try {
      setIsProcessing(true);
      const displayText = text.replace(/<[^>]*>/g, '');
      setMessages(prev => [...prev, { id: msgId, text: displayText, sender: "bot", playing: true, ...extraProps }]);
      
      let audioUrl = "";
      if (msgId === "bot-0" && preloadedGreetingRef.current) {
        audioUrl = preloadedGreetingRef.current;
      } else {
        let voiceProvider = "polly";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "polly"; } catch {}
        const res = await fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, provider: voiceProvider, voiceType: 'free' })
        });
        if (!res.ok) throw new Error("Voice API Error");
        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);
      }
      
      const audio = new Audio(audioUrl);
      
      audio.onloadedmetadata = () => {
        let dur = audio.duration;
        if (dur === Infinity || isNaN(dur)) dur = 10;
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, duration: dur } : m));
      };

      audioRef.current = audio;
      
      audio.onended = () => {
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: false } : m));
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
         setMessages(prev => prev.map(m => m.id === msgId ? { ...m, playing: true } : m));
      }
    }
  };

  const triggerFlowStep = (nextStepId: number, userSelection?: string) => {
    if (userSelection) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: userSelection, sender: "user" }]);
    }
    setStepInfo({ options: [], stepId: nextStepId });

    const delay = nextStepId === 0 ? 200 : 700;

    setTimeout(() => {
      if (nextStepId === 0) {
        const greeting = `¡Hola! Bienvenido a ${brandName}. Soy Laura, tu asesora médica. Sé que dar el paso es una decisión importante. ¿Qué te gustaría saber sobre nuestros tratamientos?`;
        fetchAudio(greeting, "bot-0", () => {
          setStepInfo({ options: [], stepId: 1 });
        });
      } 
      else if (nextStepId === 1) {
        const serviceQuestion = `Buena pregunta. <break time="300ms"/> La técnica F-U-E se usa para zonas amplias, <break time="200ms"/> y la D-H-I es perfecta para dar máxima densidad sin rapar del todo. <break time="400ms"/> Ambas son indoloras. <break time="400ms"/> Para orientarte mejor... <break time="250ms"/> ¿Dirías que tu pérdida de cabello es solo en las entradas? ¿O también afecta a la coronilla?`;
        fetchAudio(serviceQuestion, "bot-1", () => {
          setStepInfo({ options: [], stepId: 2 });
        });
      }
      else if (nextStepId === 2) {
        const photoQuestion = `Entendido. Cada paciente es único, así que lo ideal en estos casos es que el cirujano evalúe tu zona donante. ¿Podrías subir un par de fotos usando el botón de cámara que aparecerá a continuación en el chat? Es 100% confidencial.`;
        fetchAudio(photoQuestion, "bot-2", () => {
          setShowPhotoUpload(true);
        });
      }
      else if (nextStepId === 3) {
        setShowPhotoUpload(false);
        const calQuestion = `Fotos procesadas con éxito. El doctor ya puede valorarlas. ¿Agendamos una breve videollamada gratuita para explicarte tus opciones de diseño?`;
        fetchAudio(calQuestion, "bot-3", () => {
           setStepInfo({ options: [], stepId: 4 });
        });
      }
      else if (nextStepId === 4) {
        const calQuestionFinal = `Fantástico. Aquí tienes mi disponibilidad para los próximos días. Selecciona el hueco que mejor te venga y dejaremos tu cita bloqueada.`;
        fetchAudio(calQuestionFinal, "bot-4", () => {
           setMessages(prev => [...prev, { id: "bot-cal", text: "Calendario", sender: "bot", isCalendar: true }]);
        });
      }
    }, delay);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const urls = Array.from(e.target.files).map(f => URL.createObjectURL(f));
      setIsUploading(true);
      setShowPhotoUpload(false);
      setTimeout(() => {
        setIsUploading(false);
        setMessages(prev => [...prev, { id: "user-photo-" + Date.now(), text: "Fotos subidas", sender: "user", isPhotos: true, photoUrls: urls }]);
        setTimeout(() => triggerFlowStep(3, "Fotos subidas"), 800);
      }, 1500);
    }
  };

  const isBotPlaying = messages.some(m => m.playing);

  const handleMicClick = () => {
    if (isProcessing || isBotPlaying) return;
    
    if (isListening) {
       setIsListening(false);
       if ((window as any).recognitionInstance) {
          (window as any).recognitionInstance.stop();
       } else {
          // Fallback simulation (si no hay Speech API)
          if (stepInfo.stepId === 1) triggerFlowStep(1, "Diferencia entre FUE y DHI.");
          else if (stepInfo.stepId === 2) triggerFlowStep(2, "Entradas y coronilla.");
          else if (stepInfo.stepId === 4) triggerFlowStep(4, "Sí, perfecto.");
       }
       return;
    }

    setIsListening(true);
    setMicTime(0);
    hasRecognizedRef.current = false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.continuous = true;
      (window as any).currentTranscriptChunk = "";

      recognition.onresult = (event: any) => {
        hasRecognizedRef.current = true;
        let chunk = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
           chunk += event.results[i][0].transcript + " ";
        }
        (window as any).currentTranscriptChunk = chunk;
      };

      recognition.onerror = (event: any) => {
         console.warn("Speech error:", event.error);
         setIsListening(false);
      };
      
      recognition.onend = () => {
         setIsListening(false);
         const text = ((window as any).currentTranscriptChunk || "").trim();
         if (hasRecognizedRef.current && text.length > 0) {
            triggerFlowStep(stepInfo.stepId, text);
         } else {
            if (stepInfo.stepId === 1) triggerFlowStep(1, "Diferencia entre FUE y DHI.");
            else if (stepInfo.stepId === 2) triggerFlowStep(2, "Entradas y coronilla.");
            else if (stepInfo.stepId === 4) triggerFlowStep(4, "Sí, perfecto.");
         }
         (window as any).currentTranscriptChunk = "";
      };

      recognition.start();
      (window as any).recognitionInstance = recognition;
    } else {
      console.warn("Speech API not supported in this browser");
    }
  };

  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => setMicTime(prev => prev + 1), 1000);
    } else {
      setMicTime(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleTranscript = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showTranscript: !m.showTranscript } : m));
  };

  return (
    <>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === "bot" ? "w-[98%] self-start" : "max-w-[85%] self-end"}`}
                >
                  <div 
                    className={`rounded-2xl p-4 shadow-sm relative group overflow-hidden ${
                      msg.sender === "bot" 
                        ? 'bg-white border border-gray-100 rounded-tl-sm ring-1 ring-black/5 w-full' 
                        : 'bg-black text-white rounded-tr-sm border border-black/5'
                    }`}
                  >
                    {msg.sender === "bot" && !msg.isCalendar && !msg.isFinalCard ? (
                      <div className="flex flex-col w-full">
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
                                   className="absolute w-3 h-3 rounded-full bg-white shadow-sm border border-gray-300 md:border-gray-200 -ml-1.5 z-10"
                                 />
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                 <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 tracking-wide">
                                   <AudioTimer isPlaying={msg.playing} duration={msg.duration} />
                                 </span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="mt-3 pt-2.5 border-t border-gray-100/80">
                          <button 
                            onClick={() => toggleTranscript(msg.id)}
                            className="text-[11px] sm:text-[13px] text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1.5 transition-colors w-full"
                          >
                            <Menu size={12}/> {msg.showTranscript ? "Ocultar transcripción" : "Ver transcripción"}
                          </button>
                        </div>

                        <AnimatePresence>
                          {msg.showTranscript && (
                            <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: "auto" }}
                               exit={{ opacity: 0, height: 0 }}
                               className="text-[13px] sm:text-[14px] leading-relaxed text-gray-700 mt-2 font-medium bg-gray-50/50 p-2.5 rounded-xl border border-gray-100"
                            >
                               {msg.text}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : msg.sender === "user" && msg.isPhotos && msg.photoUrls ? (
                      <div className="flex gap-2 p-1">
                        {msg.photoUrls.slice(0, 3).map((url, i) => (
                           <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-800 overflow-hidden border-2 border-transparent shadow-md">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                           </div>
                        ))}
                      </div>
                    ) : msg.isCalendar ? (
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
                           <h3 className="font-extrabold text-[17px] text-gray-900 mb-1 tracking-tight">¡Cita Solicitada!</h3>
                           <p className="text-[12px] text-gray-500 mb-6 font-medium leading-relaxed px-2">Hemos enviado un email con todos los detalles e información para preparar tu visita a la clínica.</p>
                           
                           <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 text-left space-y-3.5 border border-gray-100">
                             {selectedDoctor && (
                               <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-3">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asesora</span>
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
                    ) : (
                      <div className="text-[13px] sm:text-[15px] leading-relaxed font-medium">
                        {msg.text}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
                
                {showPhotoUpload && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex justify-end mb-2">
                     <div className="bg-white rounded-2xl p-4 w-[280px] shadow-sm flex flex-col items-center justify-center gap-3 border border-gray-100">
                        {isUploading ? (
                           <div className="flex flex-col items-center gap-3 py-3">
                             <div className="w-6 h-6 border-3 border-t-3 border-gray-100 rounded-full animate-spin" style={{ borderTopColor: color }}></div>
                             <span className="text-[12px] font-bold text-gray-500">Subiendo fotos seguras...</span>
                           </div>
                        ) : (
                           <>
                              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                              <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-[13px] shadow-md transition-all active:scale-95 group" style={{ backgroundColor: color }}>
                                 <Camera size={16} className="group-hover:scale-110 transition-transform"/> Subir imágenes
                              </button>
                           </>
                        )}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Microphone Context Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col items-center gap-2 relative">
               {(isListening || isProcessing) && stepInfo.options.length === 0 && !messages.some(m => m.isCalendar) && (
                 <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shadow-md ${isListening ? 'bg-red-500 animate-pulse' : 'bg-black/80'}`}>
                   {isListening && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
                   {isProcessing ? "Procesando..." : `Grabando... 0:0${micTime}`}
                 </div>
               )}
               <motion.button
                 onClick={handleMicClick}
                 animate={isProcessing || isListening ? { scale: [1, 1.1, 1] } : {}}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isProcessing || isBotPlaying ? 'opacity-40 grayscale cursor-not-allowed shadow-none' : 'cursor-pointer hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.15)] opacity-90 hover:opacity-100'} ${isListening ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}`}
                 style={!(isListening || isProcessing || isBotPlaying) ? { backgroundColor: color, color: contrastText } : (isProcessing || isBotPlaying) ? { backgroundColor: '#e5e7eb', color: '#9ca3af' } : { color: '#ffffff' }}
                 title={isProcessing || isBotPlaying ? "Espera a que termine de hablar" : "Haz clic para grabar"}
               >
                 <Mic size={24} fill={isListening ? "currentColor" : "none"} color={isListening ? "#ffffff" : (isProcessing || isBotPlaying) ? "#9ca3af" : contrastText} />
               </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
