"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface WidgetShellProps {
  isOpen: boolean;
  step: number;
  totalSteps: number;
  color: string;
  onPrev: () => void;
  children: React.ReactNode;
  hideBackButtonOnSteps?: number[];
}

export function WidgetShell({
  isOpen,
  step,
  totalSteps,
  color,
  onPrev,
  children,
  hideBackButtonOnSteps = []
}: WidgetShellProps) {

  if (!isOpen) return null;

  const showBackButton = step > 1 && step < totalSteps && !hideBackButtonOnSteps.includes(step);

  return (
    <div className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 pointer-events-none`}>
      <div className="fixed inset-0 bg-black/20 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 30 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 30 }}
           className={`relative w-[95vw] md:w-full max-w-[420px] md:max-w-[480px] min-h-[400px] md:min-h-[500px] max-h-[85vh] md:max-h-[80vh] bg-[#f8fafc] rounded-4xl md:rounded-[2.5rem] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5 flex flex-col overflow-hidden pointer-events-auto font-sans antialiased text-gray-900`}
        >
          {/* Top Header: Progress Bar */}
          <header className="px-6 sm:px-8 pt-7 sm:pt-8 pb-3 sm:pb-4 shrink-0 bg-[#f8fafc] flex flex-col gap-3">
             <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
               <div className="flex items-center gap-3">
                  {showBackButton ? (
                    <button onClick={onPrev} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                      <ChevronLeft size={16} strokeWidth={3} /> Atrás
                    </button>
                  ) : (
                    <span className="opacity-0 cursor-default">Atrás</span>
                  )}
               </div>
               {step <= totalSteps && (
                 <div className="flex items-center gap-1">
                   <span className="text-gray-400 font-extrabold text-xl tracking-tighter" style={{color}}>{step}</span> 
                   <span className="text-gray-400 font-bold text-sm">/ {totalSteps}</span>
                 </div>
               )}
             </div>

             {/* Progress Line */}
             {step <= totalSteps && (
               <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full rounded-full"
                   style={{ backgroundColor: color }}
                   initial={{ width: 0 }}
                   animate={{ width: `${(step / totalSteps) * 100}%` }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                 />
               </div>
             )}
          </header>

          <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 sm:pb-8">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
