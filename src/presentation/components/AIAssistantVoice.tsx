"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, ChevronRight, Volume2 } from "lucide-react";
import { NICHE_CONFIGS } from "../config/nicheConfig";

export function AIAssistantVoice({ color, niche = "medical", pos = "right" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "speaking" | "closing">("idle");
  const [spokenText, setSpokenText] = useState("");
  
  const config = NICHE_CONFIGS[niche] || NICHE_CONFIGS.medical;
  const posClass = pos === "right" ? "right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-6";

  const toggleVoice = () => {
    if (isOpen) {
      setIsOpen(false);
      setPhase("idle");
      setSpokenText("");
    } else {
      setIsOpen(true);
      // Automatically starts listening
      setPhase("listening");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (phase === "listening") {
      const waitT = setTimeout(() => setPhase("thinking"), 3000);
      return () => clearTimeout(waitT);
    }
    
    if (phase === "thinking") {
      const waitT = setTimeout(() => {
        setPhase("speaking");
        setSpokenText("");
      }, 1500);
      return () => clearTimeout(waitT);
    }
    
    if (phase === "speaking") {
      // Simulate Polly typing out the Text-to-Speech transcript
      const fullText = config.chatGreeting + " " + config.chatOffer;
      let i = 0;
      const typeT = setInterval(() => {
        setSpokenText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(typeT);
          setTimeout(() => setPhase("closing"), 500);
        }
      }, 35);
      return () => clearInterval(typeT);
    }
  }, [isOpen, phase, config]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
           <motion.button
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             exit={{ scale: 0 }}
             onClick={toggleVoice}
             className={`fixed bottom-6 ${posClass} w-16 h-16 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center z-50 hover:scale-105 transition-transform`}
             style={{ backgroundColor: color }}
           >
             <Mic fill="white" className="text-white relative z-10" size={28} />
             <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
           </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className={`fixed bottom-6 ${posClass} w-[340px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-4xl p-6 z-50 flex flex-col gap-4 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex justify-between items-center w-full">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                 <Volume2 size={16} style={{ color }} /> 
                 {phase === 'listening' ? 'Bedrock: Escuchando...' : phase === 'thinking' ? 'Polly: Procesando...' : phase === 'speaking' ? 'Agente de Voz' : 'Concluido'}
               </div>
               <button onClick={toggleVoice} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                 <X size={20} />
               </button>
            </div>

            {/* Siri-like Waveform Visualizer */}
            <div className="h-24 w-full flex items-center justify-center gap-1.5">
               {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={
                     phase === 'listening' || phase === 'speaking' 
                     ? { height: ["15%", "100%", "30%", "90%", "20%"] } 
                     : phase === 'thinking' 
                     ? { height: "20%", opacity: [1, 0.3, 1] }
                     : { height: "10%" }
                   }
                   transition={{
                     duration: phase === 'thinking' ? 1.5 : 1.2,
                     repeat: Infinity,
                     ease: "easeInOut",
                     delay: i * 0.1
                   }}
                   className="w-2.5 rounded-full"
                   style={{ backgroundColor: color }}
                 />
               ))}
            </div>

            {/* Speech Transcript Space */}
            <div className="min-h-[80px] text-center text-gray-800 text-[15px] leading-relaxed font-medium px-2">
               {phase === 'listening' && <span className="opacity-50 italic">Háblale a tu dispositivo ahora...</span>}
               {phase === 'thinking' && <span className="opacity-50 italic">Consultando AWS Bedrock...</span>}
               {(phase === 'speaking' || phase === 'closing') && <span>&quot;{spokenText}&quot;</span>}
            </div>

            {/* Conversion CTA */}
            <AnimatePresence>
               {phase === 'closing' && (
                 <motion.button
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   onClick={() => window.location.href = `?site=${new URLSearchParams(window.location.search).get('site')}&widget=form&color=${color.replace('#', '')}&niche=${niche}`}
                   className="mt-2 w-full py-4 rounded-xl text-white font-black uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg"
                   style={{ backgroundColor: color }}
                 >
                   {config.chatCta} <ChevronRight size={20} className="stroke-3" />
                 </motion.button>
               )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
