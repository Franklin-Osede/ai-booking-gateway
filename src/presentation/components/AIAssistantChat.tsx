"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, ChevronRight } from "lucide-react";

import { resolveConfig } from "../config/resolveConfig";

export function AIAssistantChat({ color, niche = "hair_transplant", pos = "right", lang = "es" }: { color: string, niche?: string, pos?: string, lang?: string }) {
  const isEng = (lang || '').toLowerCase().startsWith('en');
  const [isOpen, setIsOpen] = useState(false);
  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "bot" | "user"; isCalendar?: boolean; isSuccess?: boolean; isFinalCard?: boolean; isDoctorList?: boolean; doctorListData?: { name: string; image?: string; specialty?: string; bio?: string }[] }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedDocIdx, setExpandedDocIdx] = useState<number | null>(null);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number; type?: string }>({ options: [], stepId: 0 });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [brandName, setBrandName] = useState("nuestra clínica");
  const times = ["09.30", "10.00", "11.30", "16.00", "17.20", "18.00"];

  const [today, setToday] = useState<Date | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setToday(new Date()), 1);
    return () => clearTimeout(t);
  }, []);
  
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

  // Ensure the explicitly selected niche from the dashboard takes precedence over auto-detection
  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");
  const effectiveConfig = resolveConfig({ niche: activeNiche, locale: lang || 'es' });
  const config = effectiveConfig.locale;
  const posClass = pos === "right" ? "right-4 sm:right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-4 sm:left-6";

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
          }).catch(e => console.error(e));
      }
    } catch {}
  }, []);

  let categories = config.categories.map((c: { name: string; icon: unknown; docs: (string | { name: string; image?: string })[] }) => ({
    ...c,
    docs: (isEng ? ["Lead Specialist", "Senior Professional", "Team Leader"] : ["Especialista Titular", "Profesional Principal", "Jefe de Equipo"]) as (string | { name: string; image?: string })[]
  }));
  if (scrapedData && scrapedData.categories && scrapedData.categories.length > 0) {
    categories = scrapedData.categories.map((scrapedCat, i) => {
       const fallbackCat = config.categories[i] || {};
       return { 
          ...fallbackCat, 
          name: scrapedCat.name || fallbackCat.name, 
          docs: scrapedCat.docs?.length ? scrapedCat.docs : (isEng ? ["Lead Specialist", "Senior Professional", "Team Leader"] : ["Especialista Titular", "Profesional Principal", "Jefe de Equipo"])
       };
    });
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setMessages([]);
      setStepInfo({ options: [], stepId: 0 });
      setExpandedDocIdx(null);
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedService("");
      setSelectedDoctor("");
      setInput("");
    } else {
      setIsOpen(true);
      triggerFlowStep(0);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, stepInfo, selectedDate, selectedTime]);

  const pushBotMessage = (text: string, delay: number, nextFn: () => void, extraProps?: Record<string, unknown>) => {
    setIsProcessing(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: "bot-" + Date.now(), text, sender: "bot", ...extraProps }]);
      setIsProcessing(false);
      nextFn();
    }, delay);
  };

  const triggerFlowStep = (nextStepId: number, userSelection?: string) => {
    let resolvedNextStepId = nextStepId;

    const chatScripts = effectiveConfig.locale.chat_scripts;
    
    if (userSelection) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: userSelection, sender: "user" }]);
       
       const lowerSel = userSelection.toLowerCase();
       // Branch 1: User chose "consulta rápida"
       if (resolvedNextStepId === 1 && (lowerSel.includes("consulta rápida") || lowerSel.includes("quick question"))) {
          setStepInfo({ options: [], stepId: 1 });
          pushBotMessage(chatScripts.quick_consult_prompt, 1200, () => {
             setStepInfo({ options: chatScripts.quick_consult_options, stepId: 10 });
          });
          return;
       }
       // Branch 2: User answered the Yes/No for consulta rápida
       if (resolvedNextStepId === 10) {
          setStepInfo({ options: [], stepId: 10 });
          if (lowerSel.includes("sí") || lowerSel.includes("yes")) {
             resolvedNextStepId = 2; // Jump to Doctor selection
          } else {
             pushBotMessage(chatScripts.quick_consult_no_thanks, 1000, () => {
                setStepInfo({ options: [chatScripts.options_first_step[0]], stepId: 100 });
             });
             return;
          }
       }
    }

    const _isMeta = (val: string) => !!val.toLowerCase().match(/(omitir|skip|cualquiera|anyone|agendar|book|ver|see|foto|photo)/);
    if (resolvedNextStepId === 2 && userSelection && !_isMeta(userSelection)) setSelectedService(userSelection);
    if (resolvedNextStepId === 3 && userSelection && !_isMeta(userSelection)) setSelectedDoctor(userSelection);
    setStepInfo({ options: [], stepId: resolvedNextStepId });

    if (resolvedNextStepId === 0) {
      pushBotMessage(chatScripts.welcome_message.replace("BRAND_NAME", brandName.charAt(0).toUpperCase() + brandName.slice(1)), 800, () => {
         setStepInfo({ options: chatScripts.options_first_step, stepId: 1 });
      });
    } 
    else if (resolvedNextStepId === 1) {
      pushBotMessage(chatScripts.specialty_prompt, 1000, () => {
         const chips = categories.filter((c: { name: string }) => c.name).map((c: { name: string }) => c.name);
         setStepInfo({ options: chips, stepId: 2 });
      });
    }
    else if (resolvedNextStepId === 2) {
      const category = categories.find((c: { name: string }) => c.name === userSelection) || categories[0];
      const docsObj = category.docs ? category.docs.map((d: string | { name: string; image?: string; specialty?: string; bio?: string }, idx: number) => {
         const nicheCfg = effectiveConfig.niche;
         const dynamicSpecialties = nicheCfg.fallbackSpecialties;
         const engSpecialties = ["FUE Hair Surgeon", "DHI Specialist", "Medical Director", "Advanced Trichologist", "Lead Surgeon"];
         const assignedSpecialty = isEng ? engSpecialties[idx % engSpecialties.length] : dynamicSpecialties[idx % dynamicSpecialties.length];
         
         const engBio = "Lead specialist with extensive clinical experience, delivering 100% natural results.";
         const fallbackBio = isEng ? engBio : nicheCfg.fallbackBio;
            
         if (typeof d === 'string') return { name: d, specialty: assignedSpecialty, bio: fallbackBio };
         return { ...d, specialty: d.specialty || assignedSpecialty, bio: d.bio || fallbackBio };
      }) : [];
      pushBotMessage(chatScripts.doctor_found_prompt, 1200, () => {
         setStepInfo({ options: chatScripts.doctor_found_options, stepId: 25 });
      }, { isDoctorList: true, doctorListData: docsObj });
    }
    let skipPhotosFallback = false;
    if (resolvedNextStepId === 25) {
      if (!effectiveConfig.niche.requiresPhotos) {
         skipPhotosFallback = true;
      } else {
         let docNameExtracted = "";
         let pQuestion = chatScripts.photos_prompt_generic;

         if (userSelection && (userSelection.startsWith("Reservar") || userSelection.startsWith("Book"))) {
            docNameExtracted = userSelection.replace("Reservar con ", "").replace("Book with ", "");
            setSelectedDoctor(docNameExtracted);
            pQuestion = chatScripts.photos_prompt_doctor.replace("DOCTOR_NAME", docNameExtracted);
         } else if (userSelection && userSelection !== chatScripts.doctor_found_options[0] && userSelection !== chatScripts.options_first_step[0]) {
            setSelectedDoctor(userSelection);
         }

         pushBotMessage(pQuestion, 1200, () => {
            setStepInfo({ options: chatScripts.photos_options, stepId: 3 });
         });
         return;
      }
    }
    
    if (resolvedNextStepId === 3 || resolvedNextStepId === 10 || skipPhotosFallback) {
      if (!skipPhotosFallback && userSelection && (userSelection.toLowerCase().includes("pensar") || userSelection.toLowerCase() === "skip" || userSelection.toLowerCase() === "saltar")) {
         pushBotMessage(chatScripts.think_skip_message, 600, () => {
            setStepInfo({ options: [], stepId: 0 });
         });
         return;
      }
      
      let calQuestion = "¡Buena elección! Aquí tienes mi calendario interactivo. Haz clic en la fecha y luego elige la hora que mejor te cuadre.";
      if (userSelection === "Fotos subidas" || userSelection === "📸 Upload photos" || userSelection === "📸 Subir fotos" || userSelection === "Uploaded photos") {
         calQuestion = "¡Perfecto! Hemos adjuntado las fotos de forma segura. Aquí tienes el calendario en tiempo real, elige tu ranura.";
      }
      
      const isEn = (lang || "es").toLowerCase().startsWith("en");
      if (isEn) {
         calQuestion = "Great choice! Here is my interactive calendar. Choose the date and time that fits you best.";
         if (userSelection === "Fotos subidas" || userSelection === "📸 Upload photos" || userSelection === "📸 Subir fotos" || userSelection === "Uploaded photos") {
             calQuestion = "Perfect! Your photos have been safely attached. Here is the real-time calendar, pick your spot.";
         }
      }
      
      pushBotMessage(calQuestion, 1000, () => {
         setMessages(prev => [...prev, { id: "bot-cal", text: isEn ? "Calendar" : "Calendario", sender: "bot", isCalendar: true }]);
      });
    }
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    if (isProcessing) return;
    if (text === "📸 Subir fotos") {
       document.getElementById('hidden-photo-input-chat')?.click();
       return;
    }
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) triggerFlowStep(2, text);
    else if (currentStep === 25) triggerFlowStep(25, text);
    else if (currentStep === 3) triggerFlowStep(3, text);
    else if (currentStep === 10) triggerFlowStep(10, text);
    else if (currentStep === 100) triggerFlowStep(1, text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: "📸 3 fotos adjuntadas", sender: "user" }]);
       triggerFlowStep(3, "Fotos subidas");
    }
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const txt = input.trim();
    setInput("");
    
    if ((stepInfo.stepId >= 1 && stepInfo.stepId <= 3) || stepInfo.stepId === 10 || stepInfo.stepId === 100) {
       if (stepInfo.stepId === 1) triggerFlowStep(1, txt);
       else if (stepInfo.stepId === 2) triggerFlowStep(2, txt);
       else if (stepInfo.stepId === 3) triggerFlowStep(3, txt);
       else if (stepInfo.stepId === 10) triggerFlowStep(10, txt);
       else if (stepInfo.stepId === 100) triggerFlowStep(1, txt);
    } else {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: txt, sender: "user" }]);
       
       const lowerTxt = txt.toLowerCase();
       const nicheCfg = effectiveConfig.niche;
       
       const isObjection = nicheCfg.chatObjection.keywords.some(k => lowerTxt.includes(k.toLowerCase()));
       if (isObjection) {
         pushBotMessage(config.chatThinking, 800, () => {
           pushBotMessage(nicheCfg.chatObjection.responseBot, 1500, () => {
              pushBotMessage(nicheCfg.chatObjection.followUpBot, 500, () => {
                 setStepInfo({ options: [nicheCfg.chatObjection.acceptOption, "Lo pensaré"], stepId: 10 });
              });
           });
         });
       } else {
         pushBotMessage(config.chatThinking, 800, () => {
            pushBotMessage("¡Gracias! He anotado esto en tu ficha para tu próxima visita.", 1200, () => {});
         });
       }
    }
  };

  const handleConfirmBooking = () => {
     const isEng = (lang || '').toLowerCase().startsWith('en');
     const confirmText = isEng 
        ? `I confirm the appointment for the ${selectedDate} of ${monthNameStr} at ${selectedTime}`
        : `Confirmo la cita para el ${selectedDate} de ${monthNameStr} a las ${selectedTime}`;
     setMessages(prev => [...prev.filter(m => !m.isCalendar), { id: "user-confirm", text: confirmText, sender: "user" }]);
     
     const botResp = isEng
        ? `Great! Your reservation with ${selectedDoctor || 'our expert'} for the ${selectedDate} at ${selectedTime} has been confirmed. We look forward to seeing you.`
        : `¡Estupendo! Tu reserva con ${selectedDoctor || 'nuestro experto'} para el día ${selectedDate} a las ${selectedTime} ha quedado confirmada. Te esperamos.`;
     pushBotMessage(botResp, 600, () => {}, { isSuccess: true, isFinalCard: true });
  };

  const primaryButtonStyle = {
    backgroundColor: color,
    color: getContrastColor(color),
  };

  function getDarkerColor(hexcolor: string) {
    if (!hexcolor || hexcolor.length < 6) return '#374151';
    const hex = hexcolor.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  function getContrastColor(hexcolor: string) {
    if (!hexcolor || hexcolor.length < 6) return '#ffffff';
    const hex = hexcolor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 150) ? '#000000' : '#ffffff';
  }

  return (
    <>
      <input type="file" id="hidden-photo-input-chat" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={toggleChat}
            className={`fixed bottom-6 md:bottom-8 ${posClass} bg-white p-3 sm:p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-2.5 sm:gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[210px] sm:w-[300px]`}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <div 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden bg-gray-50"
              >
              <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }} />
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: color }} />
              </div>
              <span className="text-[14px] sm:text-[17px] font-medium tracking-tight text-gray-800 leading-snug text-center">
                {isEng ? "Take the first step" : "Da el primer paso"}<br /> {isEng ? "towards" : "hacia"} <strong className="font-extrabold" style={{ color: color }}>{isEng ? "your change" : "tu cambio"}</strong>
              </span>
            </div>
            
            <button 
              className="w-full py-2.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-md active:scale-95 transition-transform text-[14px] sm:text-[15px]"
              style={primaryButtonStyle}
            >
              <Bot fill={primaryButtonStyle.color} size={16} /> {isEng ? "Your Virtual Assistant" : "Tu Asistente Virtual"}
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
            className={`fixed bottom-4 sm:bottom-6 ${posClass} w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] max-h-[55vh] sm:max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5`}
          >
            {/* Header */}
            <div className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden shadow-sm border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Asesora" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight text-gray-900 whitespace-nowrap">Laura · Asesora Médica</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[12px] text-green-600 font-medium tracking-tight">{isProcessing ? (isEng ? "Typing..." : "Escribiendo...") : (isEng ? "Online" : "En línea")}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleChat}
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
                        style={{ backgroundColor: msg.isSuccess ? '#10b98120' : `${color}20`, color: msg.isSuccess ? '#10b981' : color }}
                      >
                         {msg.isSuccess ? (
                            <Sparkles size={16} className="relative z-10" />
                         ) : (
                            <Bot size={18} className="relative z-10" />
                         )}
                      </div>
                    )}

                    {/* Chat Bubble OR Inline Calendar */}
                    {msg.isCalendar ? (
                      <div className="w-full pl-0 pr-1 pt-2">
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm w-full">
                           <div className="flex justify-between items-center mb-4">
                             <button onClick={() => setMonthOffset(p => p - 1)} disabled={monthOffset <= 0} className="p-1 disabled:opacity-30"><ChevronRight size={16} className="text-gray-400 rotate-180" /></button>
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
                                   <button key={t} onClick={() => setSelectedTime(t)} className={`w-full py-1.5 rounded-[10px] text-[12px] font-bold transition-all ${selectedTime === t ? 'shadow-md border-transparent text-white bg-blue-500' : 'border border-gray-200 text-gray-600 hover:border-blue-200'}`} style={selectedTime === t ? { backgroundColor: color, color: getContrastColor(color) } : {}}>{t}</button>
                                 ))}
                               </div>
                             </motion.div>
                           )}
                           <AnimatePresence>
                             {selectedDate && selectedTime && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                                 <button onClick={handleConfirmBooking} className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white shadow-md active:scale-95 transition-all" style={primaryButtonStyle}>
                                   {isEng ? "Confirm Booking" : "Confirmar Reserva"}
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
                             <Sparkles size={28} className="text-green-500" />
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
                           <button onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all text-[14px] flex items-center justify-center gap-2 group" style={primaryButtonStyle}>
                             {isEng ? "Close" : "Cerrar"} <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                         </div>
                      </div>
                    ) : msg.isDoctorList && msg.doctorListData ? (
                       <div className="flex flex-col gap-2.5 w-[90%] mt-1.5 pt-2 mb-2">
                         <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">{isEng ? "Medical Team" : "Equipo Médico"}</span>
                         {msg.doctorListData.map((doc, idx) => {
                           const isExpanded = expandedDocIdx === idx;
                           return (
                             <motion.div layout key={idx} className="flex flex-col p-3 bg-white border border-gray-100 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all cursor-pointer overflow-hidden relative" onClick={() => setExpandedDocIdx(isExpanded ? null : idx)}>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                   <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={doc.image || `https://randomuser.me/api/portraits/${/(Dra\.|Maria|Ana|Laura|Elena|Sofia)/i.test(doc.name) ? 'women' : 'men'}/${40 + idx}.jpg`} className="w-full h-full object-cover" alt={doc.name} />
                                   </div>
                                   <div className="flex flex-col">
                                     <span className="text-[14px] font-bold text-gray-900 tracking-tight leading-none mb-1">{doc.name}</span>
                                     <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-400">{doc.specialty || (isEng ? "LEAD SPECIALIST" : "ESPECIALISTA TITULAR")}</span>
                                   </div>
                                 </div>
                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400">
                                    <ChevronRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                 </div>
                               </div>
                               <AnimatePresence>
                                 {isExpanded && (
                                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex flex-col relative">
                                     <div className="w-full h-px bg-gray-100 mb-2" />
                                     <p className="text-[12.5px] text-gray-500 leading-relaxed font-medium px-1 mb-3">
                                       {doc.bio || "Especialista con amplia trayectoria clínica y vocación por la atención personalizada."}
                                     </p>
                                     <button 
                                       className="w-full text-[13px] py-2.5 rounded-[10px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5" 
                                       style={{ backgroundColor: color + "15", color: getDarkerColor(color) }}
                                       onClick={(e) => { e.stopPropagation(); setStepInfo({ options: [], stepId: 0 }); handleUserSelect(isEng ? `Book with ${doc.name}` : `Reservar con ${doc.name}`, 25); }}
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
                    ) : (
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                          msg.sender === "user" 
                            ? "rounded-tr-none font-medium text-black" 
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                        style={msg.sender === "user" ? { backgroundColor: color, color: getContrastColor(color) } : {}}
                      >
                        {msg.text}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Interactive Chips for Demo Flow */}
                {stepInfo.options.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mt-2 items-start pl-12"
                  >
                    {stepInfo.options.map((opt, i) => {
                        const isPrimary = opt === "📸 Subir fotos" || opt === "📸 Upload photos";
                        const isSecondary = opt.includes("Omitir");
                        return (
                          <button
                            key={i}
                            disabled={isProcessing}
                            onClick={() => handleUserSelect(opt, stepInfo.stepId)}
                            className={`px-4 py-2 border-[1.5px] text-[13px] text-center font-bold rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all flex items-center justify-center ${
                               isPrimary 
                                 ? 'w-[90%] mx-auto hover:brightness-110 active:scale-95 text-white border-transparent py-3 text-[14px]' 
                                 : isSecondary
                                 ? 'w-[80%] mx-auto bg-gray-100/80 text-gray-500 hover:bg-gray-200 border-transparent text-[12px]'
                                 : 'text-gray-700 bg-white hover:scale-105 hover:shadow-md hover:bg-gray-50 active:scale-95'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={isPrimary ? { backgroundColor: color, color: getContrastColor(color) } : (isSecondary ? {} : { borderColor: color })}
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

            {/* Sub-footer Input for Text Typing */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
               {isProcessing && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full animate-pulse">
                    {isEng ? "Typing..." : "Escribiendo..."}
                  </div>
               )}
               <div className="flex gap-2 relative">
                 <input 
                   type="text"
                   value={input}
                   disabled={isProcessing}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === "Enter" && handleSend()}
                   placeholder="Mensaje (o clic en las opciones)..."
                   className="flex-1 border bg-gray-50 border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-[13px] disabled:opacity-50"
                 />
                 <button 
                   disabled={isProcessing || !input.trim()}
                   onClick={handleSend}
                   className="w-12 h-12 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-sm disabled:opacity-50"
                   style={primaryButtonStyle}
                 >
                   <Send size={18} />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
