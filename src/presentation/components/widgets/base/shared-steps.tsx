"use client";

import { motion } from "framer-motion";
import { Shield, Calendar as CalendarIcon, Check, ShieldCheck, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SharedProps {
  color: string;
  contrastText: string;
  nextStep: () => void;
  stepName?: string;
  totalSteps?: number;
}

// --------------------------------------------------------
// Booking & Checkout Step
// --------------------------------------------------------
export function BookingCheckoutStep({ color, contrastText, nextStep, stepName, totalSteps }: SharedProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const doctor = "Dr. Especialista";
  const times = ["10:00 AM", "11:30 AM", "13:00 PM", "16:00 PM", "17:30 PM", "18:45 PM"];

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
       <div className="bg-white rounded-4xl sm:rounded-[2.5rem] p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso Final
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Confirma tu Plaza</h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">Reserva tu consulta clínica con un depósito de evaluación reembolsable.</p>
          
          {/* Calendar Picker inline */}
          {!selectedTime ? (
             <div className="mb-6">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-extrabold text-gray-900 text-lg sm:text-xl">Abril 2026</h4>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 bg-white transition-colors shadow-sm"><ChevronRight size={16} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black tracking-widest text-gray-400">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {Array.from({length: 2}).map((_, i) => <div key={`empty-${i}`} className="p-2" />)}
                  {Array.from({length: 30}).map((_, i) => {
                    const d = i + 1;
                    const dayIndex = (2 + i) % 7;
                    const isWeekend = dayIndex === 5 || dayIndex === 6;
                    const isAvailable = !isWeekend && (d % 3 !== 0 || d === 12);
                    const isSelected = selectedDate === d;
                    return (
                      <button
                        key={d}
                        onClick={() => { if (isAvailable) { setSelectedDate(d); setSelectedTime(""); } }}
                        disabled={!isAvailable}
                        className={`h-10 sm:h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 border-2 ${
                          isSelected ? 'shadow-md text-white border-transparent scale-105' : 
                          isAvailable ? 'bg-green-50 border-green-200 text-green-900 hover:border-green-300 hover:bg-green-100 hover:shadow-sm' : 
                          isWeekend ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' :
                          'bg-red-50 border-red-100 text-red-400 cursor-not-allowed'
                        }`}
                        style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-gray-100 pt-6 mt-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">HORARIOS DISPONIBLES</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {times.map(t => (
                          <button 
                            key={t} onClick={() => setSelectedTime(t)}
                            className="py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-bold text-sm transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                  </motion.div>
                )}
             </div>
          ) : (
            <>
              {/* Appointment Card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4 mb-5 sm:mb-8 relative overflow-hidden">
                 <button onClick={() => setSelectedTime("")} className="absolute right-4 top-4 text-xs font-bold text-gray-400 hover:text-gray-900">Cambiar</button>
                 <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center shrink-0">
                   <CalendarIcon size={24} style={{ color }} />
                 </div>
                 <div>
                   <p className="font-extrabold text-gray-900 text-sm sm:text-base">Abr {selectedDate} a las {selectedTime}</p>
                   <p className="text-[11px] font-bold text-gray-500 mt-0.5">Consulta Oficial Especialista</p>
                 </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">NOMBRE</label>
                     <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="Nombre completo" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                   </div>
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">TELÉFONO</label>
                     <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="+34 600..." style={{ '--tw-ring-color': color } as React.CSSProperties} />
                   </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CORREO ELECTRÓNICO</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="tu@email.com" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                </div>
                
                <div className="pt-2">
                   <label className="flex text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 items-center justify-between">
                     PAGO SEGURO STRIPE
                   </label>
                   <div className="relative">
                     <input type="text" className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 font-medium text-sm rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 transition-all" placeholder="0000 0000 0000 0000" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                     <Shield size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                   </div>
                   <div className="grid grid-cols-2 gap-3 mt-3">
                     <input type="text" placeholder="MM/AA" className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 text-sm rounded-xl px-4 py-3 outline-none" />
                     <input type="text" placeholder="CVC" className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 text-sm rounded-xl px-4 py-3 outline-none" />
                   </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3 mb-6">
                <ShieldCheck size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Transacción Cifrada</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Depósito reembolsable de 50€ vía Stripe.</p>
                </div>
              </div>

              <button 
                disabled={isProcessing}
                onClick={() => {
                  if (email) {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setIsProcessing(false);
                      nextStep();
                    }, 1500);
                  } else alert("Valid email required");
                }}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-extrabold text-white transition-all shadow-lg text-base ${isProcessing ? 'opacity-80' : 'hover:shadow-xl active:scale-95'}`}
                style={{ backgroundColor: color, color: contrastText }}
              >
                  {isProcessing ? "Procesando..." : "Confirmar Reserva — 50€"}
              </button>
            </>
          )}
        </div>
    </motion.div>
  )
}

// --------------------------------------------------------
// Success Step
// --------------------------------------------------------
export function SuccessStep({ doctorName = "el especialista", onClose }: { doctorName?: string, onClose: () => void }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center justify-center text-center pt-8 pb-4">
       <motion.div 
         initial={{ scale: 0 }} 
         animate={{ scale: 1 }} 
         transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
         className="w-24 h-24 rounded-full bg-green-100 border-4 border-white shadow-xl flex items-center justify-center mb-6"
       >
         <Check size={48} className="text-green-500" strokeWidth={3} />
       </motion.div>
       
       <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">¡Reserva Confirmada!</h2>
       <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-8 max-w-sm">
         Hemos recibido tu pago y agendado tu valoración clínica con {doctorName}.
       </p>

       <button 
         onClick={() => {
            const msg = encodeURIComponent(`Hola, acabo de reservar mi consulta con ${doctorName}.`);
            window.open(`https://wa.me/?text=${msg}`, '_blank');
         }}
         className="w-full max-w-sm mb-4 py-4 px-4 rounded-xl font-bold text-white transition-all text-sm flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 shadow-md relative overflow-hidden"
         style={{ backgroundColor: '#25D366' }}
       >
         <span className="shrink-0 flex items-center justify-center">
           <MessageCircle size={20} strokeWidth={2.5} />
         </span>
         <span>Compartir reserva por WhatsApp</span>
       </button>

       <button 
         onClick={onClose}
         className="px-8 py-3.5 rounded-full font-bold transition-all text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
       >
         Cerrar ventana
       </button>
    </motion.div>
  );
}
