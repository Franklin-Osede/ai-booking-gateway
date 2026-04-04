"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetShell } from "../../base/WidgetShell";
import { BookingCheckoutStep, SuccessStep } from "../../base/shared-steps";
import { Check, ShieldAlert, Sparkles, Smile, Info } from "lucide-react";

function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 6) return '#ffffff';
  if (hexcolor.length === 4) {
    hexcolor = '#' + hexcolor[1]+hexcolor[1] + hexcolor[2]+hexcolor[2] + hexcolor[3]+hexcolor[3];
  }
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 200) ? '#000000' : '#ffffff';
}

export function AIAssistantWidgetDental({ color, isOpen, setIsOpen }: { color: string, isOpen: boolean, setIsOpen: (b: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [urgency, setUrgency] = useState("");
  const [quadrant, setQuadrant] = useState("");
  
  const TOTAL_STEPS = 4; // Urgency, Quadrant, Booking, Success

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const contrastText = getContrastColor(color);

  const sharedProps = {
     color, contrastText, nextStep, totalSteps: TOTAL_STEPS
  };

  const handleUrgencySelect = (val: string) => {
     setUrgency(val);
     if (val === "Dolor Agudo / Urgencia") {
       // Skip quadrant picking if urgency
       setStep(3); 
     } else {
       // Go to quadrant picker
       nextStep();
     }
  };

  return (
    <WidgetShell 
      isOpen={isOpen} 
      step={step} 
      totalSteps={TOTAL_STEPS} 
      color={color} 
      onPrev={prevStep}
      hideBackButtonOnSteps={[4]}
    >
      
      {/* STEP 1: Urgency / Main Pain */}
      {step === 1 && (
        <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-[2rem] p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                 Paso 1 de {TOTAL_STEPS}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">¿En qué podemos ayudarte?</h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base mb-6">Selecciona el motivo principal de tu consulta hoy.</p>
              
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handleUrgencySelect("Dolor Agudo / Urgencia")}
                   className="p-4 rounded-xl border-2 border-red-100 bg-red-50 hover:bg-red-100 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <ShieldAlert className="text-red-500" />
                     <span className="font-bold text-red-900">Dolor agudo / Urgencia médica</span>
                   </div>
                   <Check className={`text-red-500 transition-opacity ${urgency === "Dolor Agudo / Urgencia" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Estética Dental")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Sparkles className="text-blue-500" />
                     <span className="font-bold text-gray-800">Estética / Carillas / Blanqueamiento</span>
                   </div>
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Ortodoncia")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Smile className="text-emerald-500" />
                     <span className="font-bold text-gray-800">Ortodoncia Invisible o Brackets</span>
                   </div>
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Implantes/Revisión")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Info className="text-gray-500" />
                     <span className="font-bold text-gray-800">Implantes o Revisión General</span>
                   </div>
                 </button>
              </div>
           </div>
        </motion.div>
      )}

      {/* STEP 2: Quadrant selector */}
      {step === 2 && (
        <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-[2rem] p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 2 de {TOTAL_STEPS}
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Zona de Interés</h2>
              <p className="text-gray-500 font-medium text-sm mb-6">Si corresponde, indícanos qué zona te gustaría tratar o restaurar.</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Dientes Superiores', 'Dientes Inferiores', 'Sector Posterior (Muelas)', 'Revisión Completa'].map((q) => (
                  <button 
                    key={q}
                    onClick={() => setQuadrant(q)}
                    className={`p-4 rounded-xl border-2 font-bold text-sm text-center flex flex-col items-center justify-center min-h-[100px] transition-all ${quadrant === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    style={quadrant === q ? { backgroundColor: color, color: contrastText } : {}}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button 
                 disabled={!quadrant}
                 onClick={nextStep}
                 className={`w-full py-4 rounded-xl font-bold transition-opacity ${quadrant ? 'text-white hover:opacity-90 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                 style={quadrant ? { backgroundColor: color, color: contrastText } : {}}
              >
                  Continuar
              </button>
           </div>
        </motion.div>
      )}

      {/* STEP 3: Booking Checkout */}
      {step === 3 && <BookingCheckoutStep {...sharedProps} />}

      {/* STEP 4: Success */}
      {step === 4 && <SuccessStep doctorName="el equipo clínico" onClose={() => setIsOpen(false)} />}
      
    </WidgetShell>
  );
}
