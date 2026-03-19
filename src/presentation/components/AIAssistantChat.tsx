"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Phone } from "lucide-react";

export function AIAssistantChat({ color, niche = "medical" }: { color: string, niche?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "bot" | "user" }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    let t0: ReturnType<typeof setTimeout>;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    
    if (isOpen && messages.length === 0) {
      t0 = setTimeout(() => {
        setMessages([{ id: "1", text: "Conectando con tu agente asignado...", sender: "bot" }]);
      }, 0);
      
      t1 = setTimeout(() => {
        setMessages([
          { id: "1", text: "Analizando contexto de tu visita...", sender: "bot" }
        ]);
      }, 1000);

      t2 = setTimeout(() => {
        const saludo = niche === "dental" ? "una de las mejores clínicas dentales de la zona" 
                     : niche === "legal" ? "este increíble bufete de abogados"
                     : niche === "medical" ? "este gran centro médico"
                     : "los servicios de esta web";
        
        setMessages([
          { id: "2", text: "¡Hola! Soy tu asistente especialista AI.", sender: "bot" },
          { id: "3", text: `He analizado la página y veo que ofrecemos excelentes servicios en ${saludo}. ¿En qué te puedo ayudar hoy?`, sender: "bot" },
        ]);
      }, 2500);
    }
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [isOpen, messages.length, niche]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: input, sender: "user" }]);
    setInput("");
    
    // Smooth conversation flow
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "b", text: "Entiendo perfectamente. Esa es una gran solicitud.", sender: "bot" }
      ]);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + "c", text: "Para darte máxima prioridad y que nuestro especialista resuelva esto en su próxima hora libre, ¿me podrías dejar tu WhatsApp o correo aquí?", sender: "bot" }
        ]);
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
            className="fixed bottom-6 right-6 bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4 z-50 border border-gray-100/50 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-shadow w-[300px]"
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
            className="fixed bottom-6 right-6 w-[360px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 ring-1 ring-black/5"
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
