"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, ChevronRight } from "lucide-react";

import { NICHE_CONFIGS } from "../config/nicheConfig";

export function AIAssistantChat({ color, niche = "medical", pos = "right" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "bot" | "user"; isCalendar?: boolean; isSuccess?: boolean; isFinalCard?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number }>({ options: [], stepId: 0 });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [brandName, setBrandName] = useState("nuestra clínica");
  const times = ["09.30", "10.00", "11.30", "16.00", "17.20"];

  const activeNiche = detectedNiche || niche || "medical";
  const config = NICHE_CONFIGS[activeNiche] || NICHE_CONFIGS.medical;
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
    docs: ["Especialista Titular", "Profesional Principal", "Jefe de Equipo"] as (string | { name: string; image?: string })[]
  }));
  if (scrapedData && scrapedData.categories && scrapedData.categories.length > 0) {
    categories = scrapedData.categories.map((scrapedCat, i) => {
       const fallbackCat = config.categories[i] || {};
       return { 
          ...fallbackCat, 
          name: scrapedCat.name || fallbackCat.name, 
          docs: scrapedCat.docs?.length ? scrapedCat.docs : ["Especialista Titular", "Profesional Principal", "Jefe de Equipo"] 
       };
    });
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setMessages([]);
      setStepInfo({ options: [], stepId: 0 });
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

    if (userSelection) {
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: userSelection, sender: "user" }]);
       
       const lowerSel = userSelection.toLowerCase();
       // Branch 1: User chose "consulta rápida"
       if (resolvedNextStepId === 1 && lowerSel.includes("consulta rápida")) {
          setStepInfo({ options: [], stepId: 1 });
          pushBotMessage("Entiendo. ¿Te gustaría agendar una breve consulta con alguno de nuestros profesionales para que estudien tu caso y te asesoren personalmente?", 1200, () => {
             setStepInfo({ options: ["Sí, ver profesionales", "No, solo información"], stepId: 10 });
          });
          return;
       }
       // Branch 2: User answered the Yes/No for consulta rápida
       if (resolvedNextStepId === 10) {
          setStepInfo({ options: [], stepId: 10 });
          if (lowerSel.includes("sí")) {
             resolvedNextStepId = 2; // Jump to Doctor selection
          } else {
             pushBotMessage("Sin problema, escríbeme tu duda. Si luego prefieres verlo en persona:", 1000, () => {
                setStepInfo({ options: ["Agendar una cita"], stepId: 100 });
             });
             return;
          }
       }

       if (resolvedNextStepId === 2) setSelectedService(userSelection);
       if (resolvedNextStepId === 3) setSelectedDoctor(userSelection);
    }
    setStepInfo({ options: [], stepId: resolvedNextStepId });

    if (resolvedNextStepId === 0) {
      pushBotMessage(`¡Hola! Bienvenido a ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}. Soy tu asistente virtual. ¿En qué te puedo ayudar hoy?`, 800, () => {
         setStepInfo({ options: ["Agendar una cita", "Tengo una consulta rápida"], stepId: 1 });
      });
    } 
    else if (resolvedNextStepId === 1) {
      pushBotMessage(`¡Perfecto! Nos encantará recibirte. ¿Con qué especialidad o tratamiento te gustaría tener tu sesión?`, 1000, () => {
         const chips = categories.filter((c: { name: string }) => c.name).map((c: { name: string }) => c.name);
         setStepInfo({ options: chips, stepId: 2 });
      });
    }
    else if (resolvedNextStepId === 2) {
      pushBotMessage(`He revisado disponibilidad y tengo a varios de nuestros mejores especialistas listos para ayudarte. ¿Con cuál preferirías agendar?`, 1200, () => {
         const category = categories.find((c: { name: string }) => c.name === userSelection) || categories[0];
         const docs = category.docs ? category.docs.map((d: string | { name: string }) => typeof d === 'string' ? d : d.name) : [];
         setStepInfo({ options: [...docs, "Cualquiera disponible"], stepId: 3 });
      });
    }
    else if (resolvedNextStepId === 3) {
      pushBotMessage("¡Buena elección! Aquí tienes mi calendario interactivo. Haz clic en la fecha y luego elige la hora que mejor te cuadre.", 1000, () => {
         setMessages(prev => [...prev, { id: "bot-cal", text: "Calendario", sender: "bot", isCalendar: true }]);
      });
    }
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    if (isProcessing) return;
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) triggerFlowStep(2, text);
    else if (currentStep === 3) triggerFlowStep(3, text);
    else if (currentStep === 10) triggerFlowStep(10, text);
    else if (currentStep === 100) triggerFlowStep(1, text); // Loop back to step 1
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const txt = input.trim();
    setInput("");
    
    // Si estamos en un step que espera respuesta, lo avanzamos simulando un click
    if ((stepInfo.stepId >= 1 && stepInfo.stepId <= 3) || stepInfo.stepId === 10 || stepInfo.stepId === 100) {
       if (stepInfo.stepId === 1) triggerFlowStep(1, txt);
       else if (stepInfo.stepId === 2) triggerFlowStep(2, txt);
       else if (stepInfo.stepId === 3) triggerFlowStep(3, txt);
       else if (stepInfo.stepId === 10) triggerFlowStep(10, txt);
       else if (stepInfo.stepId === 100) triggerFlowStep(1, txt);
    } else {
       // Si es charla libre
       setMessages(prev => [...prev, { id: "user-" + Date.now(), text: txt, sender: "user" }]);
       pushBotMessage(config.chatThinking, 800, () => {
          pushBotMessage("¡Gracias! He anotado esto en tu ficha para tu próxima visita.", 1200, () => {});
       });
    }
  };

  const handleConfirmBooking = () => {
     setMessages(prev => prev.filter(m => !m.isCalendar)); // remove calendar
     setMessages(prev => [...prev, { id: "user-confirm", text: `Confirmo la cita para el Oct ${selectedDate} a las ${selectedTime}`, sender: "user" }]);
     
     pushBotMessage(`¡Estupendo! Tu reserva con ${selectedDoctor || 'nuestro experto'} para el día ${selectedDate} a las ${selectedTime} ha quedado confirmada. Te esperamos.`, 600, () => {}, { isSuccess: true, isFinalCard: true });
  };

  const primaryButtonStyle = {
    backgroundColor: color,
    color: getContrastColor(color),
  };

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
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={toggleChat}
            className={`fixed bottom-6 md:bottom-8 ${posClass} bg-white p-3 sm:p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-2.5 sm:gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[210px] sm:w-[300px]`}
          >
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden bg-gray-50"
              >
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }} />
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: color }} />
              </div>
              <span className="text-[12px] sm:text-[16px] font-medium tracking-tight text-gray-800">
                ¿Necesitas ayuda?
              </span>
            </div>
            
            <button 
              className="w-full py-2.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-md active:scale-95 transition-transform text-[13px] sm:text-base"
              style={primaryButtonStyle}
            >
              <Bot fill={primaryButtonStyle.color} size={16} /> Chat de IA
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
            className={`fixed bottom-4 sm:bottom-6 ${posClass} w-[290px] sm:w-[420px] h-[480px] sm:h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5`}
          >
            {/* Header */}
            <div className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full text-black shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: `${color}40`, color: color }}
                >
                  <Bot size={20} className="relative z-10" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Chat de IA</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs text-green-600 font-medium">{isProcessing ? "Escribiendo..." : "En línea"}</p>
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
                             <ChevronRight size={16} className="text-gray-400 rotate-180" />
                             <span className="font-bold text-[13px] text-gray-800">Octubre 2026</span>
                             <ChevronRight size={16} className="text-gray-400" />
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase">
                             <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[12px] font-semibold mb-4">
                             {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                               const isRed = [5, 12, 19].includes(d);
                               const isGreen = [14, 15, 21].includes(d);
                               let btnClass = "w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-colors ";
                               if (selectedDate === d) btnClass += "text-white shadow-md scale-110";
                               else if (isRed) btnClass += "text-red-400 bg-red-50 font-bold cursor-not-allowed line-through";
                               else if (isGreen) btnClass += "text-emerald-700 bg-emerald-100 ring-1 ring-emerald-300 font-extrabold";
                               else btnClass += "text-gray-700 bg-white hover:bg-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]";
                               return (
                                 <button key={d} disabled={isRed} onClick={() => { setSelectedDate(d); setSelectedTime(""); }} className={btnClass} style={selectedDate === d ? { backgroundColor: color } : {}}>{d}</button>
                               )
                             })}
                           </div>
                           {selectedDate && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 pt-3">
                               <p className="text-[11px] font-bold text-gray-500 mb-2">Horarios:</p>
                               <div className="grid grid-cols-3 gap-2">
                                 {times.map(t => (
                                   <button key={t} onClick={() => setSelectedTime(t)} className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all w-full text-center ${selectedTime === t ? 'shadow-md border-transparent text-white' : 'border border-gray-200 text-gray-600'}`} style={selectedTime === t ? { backgroundColor: color, color: getContrastColor(color) } : {}}>{t}</button>
                                 ))}
                               </div>
                             </motion.div>
                           )}
                           <AnimatePresence>
                             {selectedDate && selectedTime && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                                 <button onClick={handleConfirmBooking} className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white shadow-md active:scale-95 transition-all" style={primaryButtonStyle}>
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
                             <Sparkles size={28} className="text-green-500" />
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
                               <span className="text-[14px] font-bold text-gray-800 tracking-tight">Oct {selectedDate}, {selectedTime}</span>
                             </div>
                           </div>
                           <button onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all text-[14px] flex items-center justify-center gap-2 group" style={primaryButtonStyle}>
                             Cerrar <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                         </div>
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
                    {stepInfo.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={isProcessing}
                        onClick={() => handleUserSelect(opt, stepInfo.stepId)}
                        className={`px-4 py-2 border-[1.5px] bg-white text-[13px] text-left font-bold rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md active:scale-95'}`}
                        style={{ borderColor: color, color: color }}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Sub-footer Input for Text Typing */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
               {isProcessing && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full animate-pulse">
                    Escribiendo...
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
