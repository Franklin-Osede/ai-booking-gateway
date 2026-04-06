"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Phone, MessageCircle } from "lucide-react";

type Msg = { id: string; text: string; sender: "bot" | "user"; playing?: boolean; isCalendar?: boolean; isSuccess?: boolean; isFinalCard?: boolean };

export function AIAssistantPhone({ color, niche, pos = "right" }: { color: string, niche?: string, pos?: string }): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [stepInfo, setStepInfo] = useState<{ options: string[]; stepId: number }>({ options: [], stepId: 0 });
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [brandName, setBrandName] = useState("nuestra clínica");
  const posClass = pos === "right" ? "right-4 sm:right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-4 sm:left-6";

  const [detectedNiche, setDetectedNiche] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<{ categories: { name?: string }[] } | null>(null);

  const activeNiche = (niche && niche !== 'default') ? niche : (detectedNiche || "hair_transplant");

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => setCallDuration(p => p + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
      setIsListening(false);
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

  // Hidden Keyboard Controls for Seamless Loom Demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stepInfo.options.length > 0 && e.key === "1" && !isProcessing) {
        handleUserSelect(stepInfo.options[0], stepInfo.stepId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepInfo, isProcessing]);

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void, extraProps?: Partial<Msg>) => {
    try {
      setIsListening(false);
      setIsProcessing(true);
      setMessages(prev => [...prev, { id: msgId, text, sender: "bot", playing: true, ...extraProps }]);
      
      const res = await fetch('/api/v1/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: "Sergio" }) // Male voice!
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
    }
    setStepInfo({ options: [], stepId: nextStepId });

    setTimeout(() => {
      // Inbound Phone Call Flow (Pure Voice, No Chat/Calendar UI)
      if (nextStepId === 0) {
        const greeting = `Hola, te comunicas con la recepción web de ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}. Mi nombre es Marcos, ¿en qué te puedo ayudar hoy?`;
        fetchAudio(greeting, "bot-0", () => {
          setStepInfo({ options: ["¿Qué servicios tenéis?"], stepId: 1 });
        });
      } 
      else if (nextStepId === 1) {
        const fallbacks = activeNiche === 'dental' 
           ? ["Odontología Estética", "Ortodoncia", "Implantología Avanzada"] 
           : ["Injerto Capilar FUE", "Tratamiento DHI", "Mesoterapia"];
           
        const catNames = scrapedData?.categories?.map(c => c.name) || fallbacks;
        const listedCats = catNames.slice(0, 3).join(", ");
        const serviceQuestion = `Claro, contamos con especialistas excelentes en áreas como ${listedCats}, ¿te gustaría agendar una cita con alguno de ellos para esta semana?`;
        fetchAudio(serviceQuestion, "bot-1", () => {
          setStepInfo({ options: ["Sí"], stepId: 2 });
        });
      }
      else if (nextStepId === 2) {
        const calQuestion = "Perfecto, he revisado el calendario del doctor y tengo un hueco libre mañana a las 10 de la mañana, o el jueves por la tarde. ¿Qué horario prefieres?";
        fetchAudio(calQuestion, "bot-2", () => {
           setStepInfo({ options: ["El jueves"], stepId: 3 });
        });
      }
      else if (nextStepId === 3) {
        const confirm = "¡Estupendo! Tu cita ha quedado reservada en nuestra agenda, te acabo de enviar un SMS con los detalles para que lo tengas a mano. ¡Nos vemos pronto!";
        fetchAudio(confirm, "bot-3", () => {
           setStepInfo({ options: [], stepId: 4 });
           setTimeout(() => setIsOpen(false), 3000); // Hang up simulation
        });
      }
    }, 600);
  };

  const handleUserSelect = (text: string, currentStep: number) => {
    stopAudio();
    setIsProcessing(false);
    setIsListening(false);
    if (currentStep === 1) triggerFlowStep(1, text);
    else if (currentStep === 2) triggerFlowStep(2, text);
    else if (currentStep === 3) triggerFlowStep(3, text);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
           <motion.div
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             onClick={toggleVoice}
             className={`fixed bottom-6 md:bottom-8 ${posClass} z-50 cursor-pointer group flex flex-col items-center gap-2`}
           >
             <div className="bg-white px-3 py-1.5 rounded-full shadow-md text-[11px] font-bold text-gray-800 animate-bounce">
                Llámame
             </div>
             <div 
               className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform relative overflow-hidden"
               style={{ backgroundColor: "#22c55e" }}
             >
               <div className="absolute inset-0 animate-ping opacity-30 bg-white" />
               <Phone className="w-7 h-7 text-white fill-white" />
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed bottom-4 sm:bottom-6 ${posClass} w-[280px] h-[520px] bg-[#1C1C1E] rounded-[48px] shadow-2xl overflow-hidden flex flex-col z-50 ring-4 ring-black/20`}
          >
            {/* iOS Phone Header */}
            <div className="w-full pt-10 pb-2 flex flex-col items-center">
               <motion.div 
                 animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-20 h-20 rounded-full border-2 border-gray-600 overflow-hidden relative shadow-lg bg-gray-800 mb-3"
                 style={isProcessing ? { borderColor: color, boxShadow: `0 0 30px ${color}30` } : {}}
               >
                 {isProcessing && <div className="absolute inset-0 animate-ping opacity-20" style={{ backgroundColor: color }} />}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&auto=format&fit=crop" alt="Marcos" className="w-full h-full object-cover" />
               </motion.div>
               <h2 className="text-white text-2xl font-normal tracking-tight px-4 text-center truncate w-full">
                 {brandName.charAt(0).toUpperCase() + brandName.slice(1)}
               </h2>
               <p className="text-gray-400 text-[14px] mt-1 font-normal font-mono">
                 {formatTime(callDuration)}
               </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
               {isListening && (
                 <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0.5, 1, 0.5] }}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   className="text-green-400 text-sm font-medium tracking-wide mt-2"
                 >
                   Escuchándote...
                 </motion.p>
               )}
            </div>

            {/* iOS 3-Button Row */}
            <div className="flex justify-center gap-6 px-8 mb-8 z-20">
               {[
                 { icon: Mic, label: "silencio", onClick: () => {} },
                 { icon: Volume2, label: "altavoz", active: true, onClick: () => {} },
                 { 
                    icon: MessageCircle, 
                    label: isListening ? "enviar" : "responder", 
                    active: isListening,
                    isInteractive: true,
                    onClick: () => {
                       if (isListening) {
                          if (stepInfo.options.length > 0) {
                             handleUserSelect(stepInfo.options[0], stepInfo.stepId);
                          }
                       } else {
                          stopAudio();
                          setIsProcessing(false);
                          setIsListening(true);
                       }
                    }
                 },
               ].map((btn, i) => (
                 <div key={i} className="flex flex-col items-center gap-1.5">
                   <button 
                     onClick={btn.onClick}
                     className={`w-[56px] h-[56px] rounded-full flex items-center justify-center transition-colors ${
                       btn.active && btn.isInteractive ? 'bg-green-500 text-white' : 
                       btn.active ? 'bg-white text-black' : 
                       'bg-[#333333] text-white hover:bg-gray-600'
                     } ${!btn.isInteractive && 'opacity-80'}`}
                   >
                     <btn.icon size={24} strokeWidth={1.5} className={btn.active && !btn.isInteractive ? 'fill-black' : ''} />
                   </button>
                   <span className="text-white/60 text-[10px] font-medium">{btn.label}</span>
                 </div>
               ))}
            </div>

            {/* Hangup Bottom */}
            <div className="pb-8 flex justify-center z-20">
               <button onClick={toggleVoice} className="w-[64px] h-[64px] rounded-full bg-[#EB5545] hover:bg-red-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                 <Phone size={30} className="rotate-135 fill-white" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
