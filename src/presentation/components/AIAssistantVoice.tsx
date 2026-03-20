"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles, ChevronRight, Bot } from "lucide-react";
import { NICHE_CONFIGS } from "../config/nicheConfig";

export function AIAssistantVoice({ color, niche = "medical", pos = "right" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "bot" | "user"; playing?: boolean }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const config = NICHE_CONFIGS[niche] || NICHE_CONFIGS.medical;
  const posClass = pos === "right" ? "right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-6";

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
      setShowOptions(false);
      setShowCTA(false);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, showOptions, showCTA]);

  const fetchAudio = async (text: string, msgId: string, onEnd: () => void) => {
    try {
      setIsProcessing(true);
      setMessages(prev => [...prev, { id: msgId, text, sender: "bot", playing: true }]);
      
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

  // Step 1: Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        fetchAudio(config.chatGreeting, "msg-1", () => {
           setShowOptions(true);
        });
      }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Step 2: User clicks a predefined chip
  const handleUserSelect = (text: string) => {
    if (isProcessing) return;
    setShowOptions(false);
    
    // Add user message
    setMessages(prev => [...prev, { id: "user-" + Date.now(), text, sender: "user" }]);
    
    // Step 3: Bot replies with Offer
    setTimeout(() => {
      fetchAudio(config.chatOffer, "msg-2", () => {
         setShowCTA(true);
      });
    }, 600);
  };

  const primaryButtonStyle = {
    backgroundColor: color,
    color: "#000",
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
             className={`fixed bottom-6 ${posClass} bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[300px] group`}
           >
             <div className="flex items-center gap-4">
               <div 
                 className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden bg-gray-50 group-hover:scale-105 transition-transform"
               >
                 <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }} />
                 <Sparkles size={28} style={{ color: color }} />
               </div>
               <span className="text-[17px] font-medium tracking-tight text-gray-800 leading-snug">
                 ¿Quieres hablar con nuestro <strong className="font-extrabold" style={{ color }}>Agente de IA</strong>?
               </span>
             </div>
             
             <button 
               className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-white shadow-md active:scale-95 transition-transform"
               style={{ backgroundColor: color }}
             >
               <Mic fill="white" size={20} /> Entrar al Chat de Voz
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
            className={`fixed bottom-6 ${posClass} w-[360px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5`}
          >
            {/* Header */}
            <div className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full text-black shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: `${color}40`, color: color }}
                >
                  <Sparkles size={20} className="relative z-10" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Agente de Voz</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs text-green-600 font-medium">{isProcessing ? "Hablando..." : "En línea"}</p>
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
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm relative"
                        style={{ backgroundColor: `${color}20`, color: color }}
                      >
                        {msg.playing ? (
                           <Volume2 size={16} className="animate-pulse" />
                        ) : (
                           <Bot size={16} />
                        )}
                        {msg.playing && <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: color }} />}
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.sender === "user" 
                          ? "rounded-tr-none font-medium text-black" 
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      }`}
                      style={msg.sender === "user" ? { backgroundColor: color } : {}}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {/* Interactive Chips for Demo Flow */}
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-4 items-end"
                  >
                    <span className="text-xs text-gray-400 mb-1 mr-1">Selecciona una respuesta:</span>
                    {[config.chatCta, "Tengo una consulta rápida"].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleUserSelect(opt)}
                        className="px-4 py-2 bg-white text-sm font-medium border border-gray-200 rounded-2xl shadow-sm hover:border-gray-300 transition-colors"
                        style={{ color: '#333' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Final Booking Call-To-Action */}
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full flex justify-center mt-6 mb-2 delay-150"
                  >
                    <button 
                      onClick={() => window.location.href = `?site=${new URLSearchParams(window.location.search).get('site')}&widget=form&color=${color.replace('#', '')}&niche=${niche}`}
                      className="w-[85%] py-3.5 rounded-xl text-white font-bold shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: color }}
                    >
                      {config.chatCta} <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Microphone Context Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col items-center gap-2 relative">
               {!showOptions && !showCTA && (
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full animate-bounce">
                   {isProcessing ? "Hablando..." : "El agente te está escuchando"}
                 </div>
               )}
               <motion.button
                 animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] opacity-50 select-none pointer-events-none"
                 style={{ backgroundColor: color }}
               >
                 <Mic size={24} fill="white" />
               </motion.button>
               <span className="text-[11px] font-medium text-gray-400">
                 Interacción por voz habilitada
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
