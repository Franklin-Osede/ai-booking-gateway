"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
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

type Msg = { id: string; text: string; sender: "bot" | "user"; playing?: boolean; isCalendar?: boolean; isSuccess?: boolean; isFinalCard?: boolean };

export function AIAssistantVoice({ color, niche = "medical", pos = "right" }: { color: string, niche?: string, pos?: string }) {
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
      const greeting = `¡Hola! <break time="200ms"/> Bienvenido a la Clínica Capilar. <break time="150ms"/> Soy Laura, tu asesora médica. <break time="300ms"/> Sé que dar el paso es una decisión importante. <break time="200ms"/> ¿Qué te gustaría saber sobre nuestros tratamientos?`;
      try {
        const res = await fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greeting })
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
  const [brandName, setBrandName] = useState("nuestra clínica");
  const times = ["09.30", "10.00", "11.30", "16.00", "17.20"];

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
  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "medical");
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

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void, extraProps?: Partial<Msg>) => {
    try {
      setIsProcessing(true);
      // Remove SSML tags for the visual chat bubble
      const displayText = text.replace(/<[^>]*>/g, '');
      setMessages(prev => [...prev, { id: msgId, text: displayText, sender: "bot", playing: true, ...extraProps }]);
      
      const res = await fetch('/api/v1/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!res.ok) throw new Error("Voice API Error");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
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
        const isHT = activeNiche === 'hair_transplant';
        const greeting = isHT 
          ? `¡Hola! <break time="400ms"/> Bienvenido a la clínica. <break time="400ms"/> ¿En qué especialidad capilar necesitas ayuda hoy?` 
          : `¡Hola! Bienvenido a ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}. Soy tu asistente virtual. ¿En qué área necesitas ayuda hoy?`;
        
        fetchAudio(greeting, "bot-0", () => {
          setStepInfo({ options: isHT ? ["Técnica F.U.E.", "Técnica D.H.I.", "Postoperatorio"] : ["Agendar una cita", "Tengo una consulta rápida"], stepId: 1 });
        });
      } 
      else if (nextStepId === 1) {
        const isHT = activeNiche === 'hair_transplant';
        let scrapedDoc = "nuestra Directora Médica";
        if (categories[0] && categories[0].docs && categories[0].docs.length > 0) {
           const d = categories[0].docs[0];
           scrapedDoc = typeof d === 'string' ? d : d.name;
        }

        const serviceQuestion = isHT 
          ? `Excelente decisión. <break time="400ms"/> Para la técnica FUE tenemos a los mejores cirujanos disponibles, <break time="200ms"/> incluyendo a ${scrapedDoc}. <break time="600ms"/> ¿Prefieres reservar directamente con ${scrapedDoc} <break time="200ms"/> o ver más alternativas?`
          : `Perfecto, ¿con qué especialidad o tratamiento te gustaría tu sesión hoy?`;
        
        fetchAudio(serviceQuestion, "bot-1", () => {
          const defaultChips = categories.slice(0, 2).map((c: { name: string }) => c.name);
          setStepInfo({ options: isHT ? [scrapedDoc, "Ver Alternativas"] : [...defaultChips], stepId: 2 });
        });
      }
      else if (nextStepId === 2) {
        const isHT = activeNiche === 'hair_transplant';
        if (isHT) {
           triggerFlowStep(3); // skip doc question naturally to calendar
           return;
        }
        const docQuestion = `Excelente opción, aquí tienes algunos de nuestros especialistas disponibles para esa área. ¿Cuál prefieres?`;
        fetchAudio(docQuestion, "bot-2", () => {
           const category = categories[0];
           const docs = category.docs.slice(0, 2).map((d: string | { name: string }) => typeof d === 'string' ? d : d.name);
           setStepInfo({ options: [...docs, "Cualquiera disponible"], stepId: 3 });
        });
      }
      else if (nextStepId === 3) {
        const calQuestion = "Genial, aquí tienes mi disponibilidad para los próximos días. Selecciona la fecha y hora que prefieras.";
        fetchAudio(calQuestion, "bot-3", () => {
           // We do not set showCTA anymore, we append a Calendar Bubble!
           setMessages(prev => [...prev, { id: "bot-cal", text: "Calendario", sender: "bot", isCalendar: true }]);
        });
      }
    }, 600);
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    if (isProcessing) return;
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) {
       if (activeNiche === 'hair_transplant') triggerFlowStep(3, text);
       else triggerFlowStep(2, text);
    }
    else if (currentStep === 3) triggerFlowStep(3, text);
  };

  const handleConfirmBooking = () => {
     setMessages(prev => [...prev.filter(m => !m.isCalendar), { id: "user-confirm", text: `Confirmo la cita para el ${selectedDate} de ${monthNameStr} a las ${selectedTime}`, sender: "user" }]);
     
     const spokenTime = selectedTime === "09.30" ? "nueve y media de la mañana" :
                        selectedTime === "10.00" ? "diez de la mañana" :
                        selectedTime === "11.30" ? "once y media de la mañana" :
                        selectedTime === "16.00" ? "cuatro de la tarde" :
                        selectedTime === "17.20" ? "cinco y veinte de la tarde" :
                        selectedTime.replace('.', ':');

     const isHT = activeNiche === 'hair_transplant';
     setTimeout(() => {
        const docName = selectedDoctor || 'nuestro experto';
        const confirmMsg = isHT 
             ? `¡Estupendo! <break time="400ms"/> Tu reserva con ${docName} en nuestra clínica ha quedado confirmada. <break time="300ms"/> Te esperamos.`
             : `¡Estupendo! Tu reserva con ${docName} para el día ${selectedDate} a las ${spokenTime} ha quedado confirmada, te esperamos.`;
        fetchAudio(confirmMsg, "bot-success", () => {}, { isSuccess: true, isFinalCard: true });
     }, 600);
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
            className={`fixed bottom-4 sm:bottom-6 ${posClass} w-[290px] sm:w-[320px] h-[480px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5`}
          >
            {/* Header */}
            <div className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden shadow-sm border border-gray-200">
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
                    {msg.sender === "bot" && (
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm relative overflow-hidden"
                        style={{ backgroundColor: msg.isSuccess ? '#10b98120' : `${color}20`, color: msg.isSuccess ? '#10b981' : readableBrandText }}
                      >
                        {msg.playing ? (
                           <Volume2 size={16} className="animate-pulse relative z-10" />
                        ) : msg.isSuccess ? (
                           <CheckCircle2 size={16} className="relative z-10" />
                        ) : (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src="https://i.pravatar.cc/150?img=47" alt="AI Agent" className="w-full h-full object-cover" />
                        )}
                        {msg.playing && <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: color }} />}
                      </div>
                    )}

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
                             <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[12px] font-semibold mb-4">
                             {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                               const isPast = monthOffset < 0 || (monthOffset === 0 && d < currentDay);
                               const isRed = !isPast && (monthOffset === 0 ? [currentDay + 2, currentDay + 7, currentDay + 11].includes(d) : [4, 11, 18, 25].includes(d));
                               const isGreen = !isPast && (monthOffset === 0 ? [currentDay + 1, currentDay + 3, currentDay + 6, currentDay + 8].includes(d) : [2, 7, 9, 14, 16, 21, 23, 28].includes(d));
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
                               <div className="flex flex-wrap gap-2">
                                 {times.map(t => (
                                   <button key={t} onClick={() => setSelectedTime(t)} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${selectedTime === t ? 'shadow-md border-transparent text-white' : 'border border-gray-200 text-gray-600'}`} style={selectedTime === t ? { backgroundColor: color, color: contrastText } : {}}>{t}</button>
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
                    ) : (
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                          msg.sender === "user" 
                            ? "rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                        style={msg.sender === "user" ? { backgroundColor: color, color: contrastText } : {}}
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
                    {stepInfo.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleUserSelect(opt, stepInfo.stepId)}
                        className="px-4 py-2.5 text-[14px] text-right font-medium rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                        style={{ backgroundColor: color, color: contrastText }}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Microphone Context Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col items-center gap-2 relative">
               {stepInfo.options.length === 0 && !messages.some(m => m.isCalendar) && (
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full animate-pulse">
                   {isProcessing ? "Hablando..." : "Escuchando..."}
                 </div>
               )}
               <motion.button
                 animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] opacity-50 select-none pointer-events-none"
                 style={{ backgroundColor: color, color: contrastText }}
               >
                 <Mic size={24} fill={contrastText} />
               </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
