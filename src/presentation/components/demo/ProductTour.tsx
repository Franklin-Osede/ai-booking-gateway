"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Check } from "lucide-react";

interface ProductTourProps {
  primaryColor?: string;
}

export function ProductTour({ primaryColor = "#1a4b8c" }: ProductTourProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number; } | null>(null);

  const steps = [
    { targetId: 'center', title: 'Automatización Integral', text: 'Filtra contactos 24/7, extrae datos críticos y los organiza en tu agenda antes de que saturen recepción.' },
    { targetId: 'tour-mod-triage', title: 'Triaje Predictivo', text: 'Clasifica urgencias y patologías de forma interactiva. Descarta curiosos para que el equipo atienda casos rentables.' },
    { targetId: 'tour-mod-voice', title: 'Entrevista por Voz Guiada', text: 'Conduce al usuario paso a paso de forma conversacional para recopilar sus datos clínicos antes de derivarlo al equipo.' },
    { targetId: 'tour-mod-voice-free', title: 'Agente Telefónico Digital', text: 'Como tener un agente respondiendo llamadas 24/7. Escucha, comprende y responde con total coherencia.' },
    { targetId: 'tour-mod-text', title: 'Asistente Textual', text: 'Un perfilado digital dinámico. El motor dialoga por chat con la visita para validar su perfil antes de capturarlo.' },
    { targetId: 'tour-video-intro', title: 'Videodemostración', text: 'Te explico personalmente cómo funciona cada asistente y te enseño su vinculación invisible con tu agenda habitual.' },
    { targetId: 'tour-agendar', title: 'Auditoría Técnica', text: 'Descubre en 15 min cómo integrar y adaptar este ecosistema a las especialidades concretas de tu propio centro.' }
  ];

  useEffect(() => {
    // Check if tour was already seen
    if (typeof window !== 'undefined') {
      const isCompleted = localStorage.getItem('tour_completed_b2b');
      if (isCompleted !== 'true') {
        const t = setTimeout(() => setIsVisible(true), 1500); // delay start
        return () => clearTimeout(t);
      }
    }
  }, []);

  const calculatePosition = () => {
    const currentTarget = steps[step]?.targetId;
    if (!currentTarget || currentTarget === 'center') {
      setTargetRect(null);
      return;
    }

    const el = document.getElementById(currentTarget);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    } else {
      setTargetRect(null); // fallback to center if not found
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(calculatePosition, 50); // slight delay to let layout settle and avoid synchronous setState lint
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isVisible]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tour_completed_b2b', 'true');
    }
  };

  if (!isVisible) return null;

  const currentStepInfo = steps[step];
  const isCenter = !targetRect;

  // Real CSS wrapper avoids motion transforming conflicts
  let wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999
  };

  let arrowClass = "hidden";

  if (targetRect) {
    const topPos = targetRect.top + targetRect.height + 15;
    let leftPos = targetRect.left + (targetRect.width / 2);
    
    // Safety check for mobile (prevent overflow right)
    if (typeof window !== 'undefined') {
       if (leftPos + 160 > window.innerWidth) {
           leftPos = window.innerWidth - 170;
       }
    }

    // Safety check for bottom overflow
    const estimatedTooltipHeight = 220; // safe assumption for mobile
    const isOverflowBottom = typeof window !== 'undefined' && (topPos + estimatedTooltipHeight > window.innerHeight);

    if (isOverflowBottom) {
      wrapperStyle = {
        position: 'absolute',
        bottom: (window.innerHeight - targetRect.top + 15) + 'px',
        left: leftPos + 'px',
        transform: 'translateX(-50%)',
        zIndex: 9999
      };
      arrowClass = "absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-gray-700/50";
    } else {
      wrapperStyle = {
        position: 'absolute',
        top: topPos + 'px',
        left: leftPos + 'px',
        transform: 'translateX(-50%)',
        zIndex: 9999
      };
      arrowClass = "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-gray-700/50";
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-auto" style={{ zIndex: 9999 }}>
        
        {/* Subtle backdrop highlight */}
        {targetRect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/10 mix-blend-multiply transition-opacity"
            style={{
              clipPath: `polygon(0% 0%, 0% 100%, ${targetRect.left - 5}px 100%, ${targetRect.left - 5}px ${targetRect.top - 5}px, ${targetRect.left + targetRect.width + 5}px ${targetRect.top - 5}px, ${targetRect.left + targetRect.width + 5}px ${targetRect.top + targetRect.height + 5}px, ${targetRect.left - 5}px ${targetRect.top + targetRect.height + 5}px, ${targetRect.left - 5}px 100%, 100% 100%, 100% 0%)`
            }}
          />
        )}
        {isCenter && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto"
          />
        )}

        <div style={wrapperStyle}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="relative pointer-events-auto bg-gray-900 border border-gray-700/50 rounded-3xl p-5 shadow-2xl w-[320px]"
          >
          <div className={arrowClass} />
          
          <div className="flex justify-between items-start mb-3">
             <h4 className="font-bold text-white text-base">{currentStepInfo.title}</h4>
             <button onClick={handleClose} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
               <X className="w-4 h-4" />
             </button>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
             {currentStepInfo.text}
          </p>
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800/50">
             <span className="text-xs font-semibold text-gray-500">
               Paso {step + 1} de {steps.length}
             </span>
             <div className="flex gap-2">
                <button 
                  onClick={handleClose} 
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Saltar
                </button>
                <button 
                  onClick={handleNext} 
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 hover:-translate-y-0.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  {step === steps.length - 1 ? (
                    <>Comenzar <Check className="w-3 h-3 ml-0.5" /></>
                  ) : (
                    <>Siguiente <ChevronRight className="w-3 h-3" /></>
                  )}
                </button>
             </div>
          </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
