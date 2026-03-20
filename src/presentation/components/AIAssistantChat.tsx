"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Phone, ChevronRight } from "lucide-react";

import { NICHE_CONFIGS } from "../config/nicheConfig";

export function AIAssistantChat({ color, niche = "medical", pos = "right" }: { color: string, niche?: string, pos?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "bot" | "user" }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [showCTA, setShowCTA] = useState(false);

  const config = NICHE_CONFIGS[niche] || NICHE_CONFIGS.medical;
  const posClass = pos === "right" ? "right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-6";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: "1", text: "Conectando con tu agente asignado...", sender: "bot" }]);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: "2", text: "Analizando contexto de tu visita...", sender: "bot" }
        ]);
      }, 1000);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: "3", text: config.chatGreeting, sender: "bot" }
        ]);
      }, 2500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: input, sender: "user" }]);
    setInput("");
    
    // Smooth conversation flow
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + "b", text: config.chatThinking, sender: "bot" }
        ]);
        
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "c", text: config.chatOffer, sender: "bot" }
          ]);
          
          setTimeout(() => {
            setShowCTA(true);
          }, 800);
        }, 1500);
      }, 800);
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
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 ${posClass} bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[300px]`}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden bg-gray-50"
              >
                {/* Simulated 3D gold abstract icon */}
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }} />
                <Sparkles size={28} style={{ color: color }} />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-800">
                ¿Necesitas ayuda?
              </span>
            </div>
            
            <button 
              className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-white shadow-md active:scale-95 transition-transform"
              style={{ backgroundColor: color }}
            >
              <Phone fill="white" size={20} /> Asistente de IA
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
            <div 
              className="px-6 py-4 text-black flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full text-black shrink-0"
                  style={{ backgroundColor: `${color}40`, color: color }}
                >
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Agente IA</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs text-green-600 font-medium">En línea</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
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
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm"
                        style={{ backgroundColor: `${color}20`, color: color }}
                      >
                        <Bot size={16} />
                      </div>
                    )}
                    <div 
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
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

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 p-3 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-black/5 text-black"
                />
                <button
                  onClick={handleSend}
                  className="p-3 rounded-full flex items-center justify-center text-black shadow-sm hover:scale-105 transition-transform"
                  style={primaryButtonStyle}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="text-center mt-3">
                 <span className="text-[10px] text-gray-400">Powered by Widget Injector AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
