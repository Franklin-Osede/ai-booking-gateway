"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";

export function LeadGenBanner({ color, pos = "left" }: { color: string, pos?: string }) {
  const [sent, setSent] = useState(false);

  const posClass = pos === "right" ? "right-6" : pos === "center" ? "left-1/2 -translate-x-1/2" : "left-6";

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed bottom-6 ${posClass} w-[340px] bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden`}
    >
      {/* Accent glow line at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />
      
      {!sent ? (
        <>
          <h3 className="text-black font-bold text-lg mb-1 flex items-center gap-2">
            <Mail size={18} style={{ color }} />
            Newsletter Clínica
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Recibe nuestros consejos de salud en tu correo semanalmente.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="flex-1 w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none text-black min-w-0"
            />
            <button 
              onClick={() => setSent(true)}
              className="px-3 py-2 rounded-xl text-black font-medium flex items-center gap-1 hover:brightness-95 transition-all shrink-0"
              style={{ backgroundColor: color }}
            >
               Suscribirse <ArrowRight size={14} />
            </button>
          </div>
        </>
      ) : (
        <div className="py-3 text-center">
           <h3 className="font-bold text-gray-800 text-lg mb-1">¡Gracias!</h3>
           <p className="text-sm text-gray-500">Te hemos suscrito correctamente.</p>
        </div>
      )}
    </motion.div>
  );
}
