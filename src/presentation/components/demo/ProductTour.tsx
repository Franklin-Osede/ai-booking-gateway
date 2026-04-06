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
    { targetId: 'center', title: '¡Bienvenido a tu demo!', text: 'Te enseño cómo probar tu infraestructura de Inteligencia Artificial en 30 segundos.' },
    { targetId: 'tour-video-intro', title: 'Vídeo Intro', text: 'Aquí encontrarás una breve explicación en vídeo sobre cómo funciona la arquitectura.' },
    { targetId: 'tour-agendar', title: 'Agendar Llamada', text: 'Si esta operativa os ahorra tiempo de filtrado, agenda una reunión corta desde aquí para verlo a fondo.' },
    { targetId: 'tour-asistentes-hub', title: 'La Magia de la Inteligencia Artificial', text: 'Haz clic en la "Voz Guiada" e interactúa con el micrófono simulando ser un paciente.' }
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

  // Determine popover position relatively to target
  let popoverStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  let arrowClass = "hidden";

  if (targetRect) {
    if (currentStepInfo.targetId === 'tour-video-intro' || currentStepInfo.targetId === 'tour-agendar') {
      // Place below
      popoverStyle = {
        top: targetRect.top + targetRect.height + 15 + 'px',
        left: targetRect.left + (targetRect.width / 2) + 'px',
        transform: 'translateX(-50%)'
      };
      arrowClass = "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100";
    } else {
      // Place below but might need adjustment
      popoverStyle = {
        top: targetRect.top + targetRect.height + 15 + 'px',
        left: targetRect.left + (targetRect.width / 2) + 'px',
        transform: 'translateX(-50%)'
      };
      arrowClass = "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100";
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        
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
            onClick={handleClose}
          />
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
          style={popoverStyle}
          className="absolute z-[9999] pointer-events-auto bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-5 shadow-2xl w-[320px]"
        >
          <div className={arrowClass} />
          
          <div className="flex justify-between items-start mb-3">
             <h4 className="font-bold text-gray-900 text-base">{currentStepInfo.title}</h4>
             <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
               <X className="w-4 h-4" />
             </button>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
             {currentStepInfo.text}
          </p>
          
          <div className="flex items-center justify-between">
             <span className="text-xs font-semibold text-gray-400">
               Paso {step + 1} de {steps.length}
             </span>
             <div className="flex gap-2">
                <button 
                  onClick={handleClose} 
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
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
    </AnimatePresence>
  );
}
