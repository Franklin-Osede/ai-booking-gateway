"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Upload, UserCircle2, ShieldCheck, Calendar as CalendarIcon, Check, Shield, MessageCircle } from "lucide-react";
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

export function AIAssistantWidgetCapilar({ color }: { color: string, pos?: string }) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  
  // Triage Data
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [genetics, setGenetics] = useState("");
  const [norwoodPattern, setNorwoodPattern] = useState("");
  const [medication, setMedication] = useState("");
  
  // Step 5
  const [donorArea, setDonorArea] = useState("");
  const [medFlagHT, setMedFlagHT] = useState(false);
  const [medFlagSmoke, setMedFlagSmoke] = useState(false);
  const [medFlagDisease, setMedFlagDisease] = useState(false);
  const [systemicDetails, setSystemicDetails] = useState('');

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Booking Data
  const [doctor] = useState("Dr. Rafael Moreno");
  const [docImage] = useState("https://randomuser.me/api/portraits/men/32.jpg");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setBrandName] = useState('HairAI PRO');

  const contrastText = getContrastColor(color);
  const TOTAL_STEPS = 11;
  const blobTrackerRef = useRef<string[]>([]);

  useEffect(() => {
    const urlsToClean = blobTrackerRef.current;
    return () => {
      urlsToClean.forEach((url: string) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    try {
      const url = new URLSearchParams(window.location.search).get('site');
      if (url) {
        setTimeout(() => setBrandName(new URL(url).hostname.replace('www.', '').split('.')[0]), 0);
      }
    } catch { /* ignored */ }
  }, []);

  const nextStep = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const startAnalysis = () => {
    setStep(7);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 8) + 2;
      if (prog > 100) prog = 100;
      setAnalysisProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
           setStep(8);
        }, 800);
      }
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUrls = Array.from(e.target.files).map(f => {
        const url = URL.createObjectURL(f);
        blobTrackerRef.current.push(url);
        return url;
      });
      setUploadedPhotos(prev => [...prev, ...newUrls].slice(0, 3));
    }
  };

  const times = ["10:00 AM", "11:30 AM", "13:00 PM", "16:00 PM", "17:30 PM", "18:45 PM"];

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 pointer-events-none`}>
      <div className="fixed inset-0 bg-black/20 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 30 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 30 }}
           className={`relative w-full max-w-[400px] sm:max-w-[460px] ${step === 11 ? 'min-h-[360px]' : 'min-h-[380px] sm:min-h-[520px]'} max-h-[85vh] h-auto bg-[#f8fafc] rounded-4xl sm:rounded-[2.5rem] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5 flex flex-col overflow-hidden pointer-events-auto font-sans antialiased text-gray-900`}
        >
          
          {/* Top Header: Progress Bar purely based on images */}
          <header className="px-6 sm:px-8 pt-7 sm:pt-8 pb-3 sm:pb-4 shrink-0 bg-[#f8fafc] flex flex-col gap-3">
             <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
               <div className="flex items-center gap-3">
                  {step > 1 && step < 10 && step !== 7 && step !== 8 ? (
                    <button onClick={prevStep} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                      <ChevronLeft size={16} strokeWidth={3} /> Atrás
                    </button>
                  ) : (
                    <span className="opacity-0 cursor-default">Atrás</span>
                  )}
               </div>
               {step <= TOTAL_STEPS && (
                 <div className="flex items-center gap-1">
                   <span className="text-gray-400 font-extrabold text-xl tracking-tighter" style={{color}}>{step}</span> 
                   <span className="text-gray-400 font-bold text-sm">/ {TOTAL_STEPS}</span>
                 </div>
               )}
             </div>

             {/* Progress Line */}
             {step <= TOTAL_STEPS && (
               <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full rounded-full"
                   style={{ backgroundColor: color }}
                   initial={{ width: 0 }}
                   animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                 />
               </div>
             )}
          </header>

          <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 sm:pb-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: GENDER & AGE */}
              {step === 1 && (
                <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5 sm:space-y-8">
                   
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                         Paso 1 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Háblanos de ti</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">Lo usaremos para personalizar tu evaluación capilar&nbsp;clínica.</p>
                      
                      {/* Gender */}
                      <div className="mb-5 sm:mb-8">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">SELECCIONA TU SEXO</label>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {['Hombre', 'Mujer'].map((g) => (
                            <button 
                              key={g} onClick={() => setGender(g)}
                              className={`relative p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${gender === g ? 'bg-gray-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                              style={gender === g ? { borderColor: color } : {}}
                            >
                              {gender === g && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color }}>
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                              <UserCircle2 size={48} strokeWidth={1.5} className={gender === g ? 'text-gray-800' : 'text-gray-400'} />
                              <span className={`font-bold text-sm sm:text-base ${gender === g ? 'text-gray-900' : 'text-gray-500'}`}>{g}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">RANGO DE EDAD</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Menor de 25', sub: 'INICIO TEMPRANO' },
                            { label: '25–35', sub: 'MÁS COMÚN' },
                            { label: '36–50', sub: 'PATRÓN MADURO' },
                            { label: '50+', sub: 'AVANZADO' },
                          ].map(a => (
                            <button
                              key={a.label} onClick={() => setAgeGroup(a.label)}
                              className={`p-4 rounded-xl border-2 text-left transition-all relative ${ageGroup === a.label ? 'bg-gray-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                              style={ageGroup === a.label ? { borderColor: color } : {}}
                            >
                              {ageGroup === a.label && (
                                <div className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color }}>
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                              <div className={`font-bold text-sm sm:text-base ${ageGroup === a.label ? 'text-gray-900' : 'text-gray-700'}`}>{a.label}</div>
                              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{a.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (gender && ageGroup) nextStep();
                        }} 
                        className={`w-full mt-8 py-4 rounded-xl font-bold transition-opacity ${gender && ageGroup ? 'text-white hover:opacity-90 active:scale-95' : 'text-gray-400'}`}
                        style={{ backgroundColor: (gender && ageGroup) ? color : '#E5E7EB', color: (gender && ageGroup) ? contrastText : '#9CA3AF', cursor: (gender && ageGroup) ? 'pointer' : 'not-allowed' }}
                      >
                        Continuar
                      </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 2: GENETIC HISTORY */}
              {step === 2 && (
                <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 2 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Historial Genético</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">¿Cómo ha sido la evolución de la alopecia en tu familia directa?</p>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'light', title: 'Ligera', desc: 'Pérdida muy leve o indetectable.', img: '/images/triage/ligera.webp' },
                          { id: 'mod', title: 'Moderada', desc: 'Despoblación visible en entradas o coronilla.', img: '/images/triage/moderada.webp' },
                          { id: 'severe', title: 'Calvicie Severa', desc: 'Pérdida de densidad notable en la mayor parte del cráneo.', img: '/images/triage/severa.webp' }
                        ].map(g => (
                          <button
                            key={g.id} onClick={() => setGenetics(g.id)}
                            className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${genetics === g.id ? 'bg-gray-50' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5'}`}
                            style={genetics === g.id ? { borderColor: color } : {}}
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0 relative">
                               {/* eslint-disable-next-line @next/next/no-img-element */}
                               <img src={g.img} alt={g.title} className="w-full h-full object-cover" />
                               {genetics === g.id && (
                                 <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color }}>
                                   <Check size={12} strokeWidth={3} />
                                 </div>
                               )}
                            </div>
                            <div>
                               <h4 className={`font-bold text-base sm:text-lg ${genetics === g.id ? 'text-gray-900' : 'text-gray-800'}`}>{g.title}</h4>
                               <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed">{g.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          if (genetics) nextStep();
                        }} 
                        className={`w-full mt-8 py-4 rounded-xl font-bold transition-opacity ${genetics ? 'text-white hover:opacity-90 active:scale-95' : 'text-gray-400'}`}
                        style={{ backgroundColor: genetics ? color : '#E5E7EB', color: genetics ? contrastText : '#9CA3AF', cursor: genetics ? 'pointer' : 'not-allowed' }}
                      >
                        Continuar
                      </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 3: NORWOOD PATTERN */}
              {step === 3 && (
                <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 3 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Identifica tu Patrón</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">¿Qué situación gráfica se parece más a tu alopecia actual?</p>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                          { id: 'entradas', title: 'Entradas', desc: 'Retraso línea frontal', img: '/images/triage/step3_entradas.webp' },
                          { id: 'coronilla', title: 'Coronilla', desc: 'Despoblación superior', img: '/images/triage/step3_coronilla.webp' },
                          { id: 'difusa', title: 'Pérdida Difusa', desc: 'Falta general de densidad', img: '/images/triage/step3_difusa.webp' },
                          { id: 'avanzada', title: 'Avanzada', desc: 'Norwood V-VII', img: '/images/triage/step3_avanzada.webp' }
                        ].map(p => (
                          <button
                            key={p.id} onClick={() => setNorwoodPattern(p.title)}
                            className={`p-3 sm:p-4 rounded-2xl border-2 text-center transition-all group ${norwoodPattern === p.title ? 'bg-gray-50 border-gray-400 shadow-inner' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
                            style={norwoodPattern === p.title ? { borderColor: color } : {}}
                          >
                            <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative">
                               {/* eslint-disable-next-line @next/next/no-img-element */}
                               <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                               {norwoodPattern === p.title && (
                                 <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color }}>
                                   <Check size={12} strokeWidth={3} />
                                 </div>
                               )}
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 mb-0.5">{p.title}</h4>
                            <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide leading-tight">{p.desc}</p>
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          if (norwoodPattern) nextStep();
                        }} 
                        className={`w-full mt-8 py-4 rounded-xl font-bold transition-opacity ${norwoodPattern ? 'text-white hover:opacity-90 active:scale-95' : 'text-gray-400'}`}
                        style={{ backgroundColor: norwoodPattern ? color : '#E5E7EB', color: norwoodPattern ? contrastText : '#9CA3AF', cursor: norwoodPattern ? 'pointer' : 'not-allowed' }}
                      >
                        Continuar
                      </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 4: MEDICATION */}
              {step === 4 && (
                <motion.div key="4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 4 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Historial de Medicación</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">¿Estás tomando inhibidores para estabilizar la caída del cabello?</p>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'fin', title: 'Finasteride / Dudasteride', desc: 'Bloqueador oral DHT — con receta', tag: 'Rx' },
                          { id: 'minox', title: 'Minoxidil', desc: 'Vasodilatador tópico u oral', tag: 'OTC' },
                          { id: 'both', title: 'Ambos', desc: 'Protocolo combinado activo', tag: '' },
                          { id: 'none', title: 'Ninguno', desc: 'No tomo ninguna medicación', tag: '' }
                        ].map(m => (
                          <button
                            key={m.id} onClick={() => setMedication(m.title)}
                            className={`w-full p-5 sm:p-6 rounded-2xl border-2 text-left flex items-center gap-5 transition-all group ${medication === m.title ? 'bg-gray-50' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5'}`}
                            style={medication === m.title ? { borderColor: color } : {}}
                          >
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0" style={medication === m.title ? { borderColor: color } : {}}>
                               {medication === m.title && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-3">
                                 <h4 className={`font-bold text-sm sm:text-base ${medication === m.title ? 'text-gray-900' : 'text-gray-800'}`}>{m.title}</h4>
                                 {m.tag && (
                                   <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest text-white uppercase" style={{ backgroundColor: m.tag === 'Rx' ? '#3B82F6' : '#10B981' }}>{m.tag}</span>
                                 )}
                               </div>
                               <p className="text-xs text-gray-500 font-medium mt-1">{m.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          if (medication) nextStep();
                        }} 
                        className={`w-full mt-8 py-4 rounded-xl font-bold transition-opacity ${medication ? 'text-white hover:opacity-90 active:scale-95' : 'text-gray-400'}`}
                        style={{ backgroundColor: medication ? color : '#E5E7EB', color: medication ? contrastText : '#9CA3AF', cursor: medication ? 'pointer' : 'not-allowed' }}
                      >
                        Continuar
                      </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 5: DONOR AREA & MEDICAL FLAGS */}
              {step === 5 && (
                <motion.div key="5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 5 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Zona Donante & Salud</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">¿Cómo es la densidad de pelo en tu nuca y laterales?</p>
                      
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8">
                        {[
                          { id: 'thick', title: 'Grosa', desc: 'Mucha densidad', dots: 3 },
                          { id: 'norm', title: 'Normal', desc: 'Promedio', dots: 2 },
                          { id: 'thin', title: 'Fina', desc: 'Baja densidad', dots: 1 }
                        ].map(d => (
                          <button
                            key={d.id} onClick={() => setDonorArea(d.title)}
                            className={`p-4 sm:p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-3 ${donorArea === d.title ? 'bg-gray-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                            style={donorArea === d.title ? { borderColor: color } : {}}
                          >
                            <div className="flex items-center gap-1.5 h-6">
                               {Array.from({length: d.dots}).map((_, i) => (
                                 <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300" style={donorArea === d.title ? { backgroundColor: color } : {}} />
                               ))}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{d.title}</h4>
                              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{d.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">HISTORIAL QUIRÚRGICO</label>
                       <div className="space-y-3">
                         {/* Togles */}
                         {[
                           { title: '¿Trasplantes Capilares Previos?', desc: 'Has tenido procedimientos en el pasado', val: medFlagHT, setter: setMedFlagHT },
                           { title: '¿Fumador (>10 al día)?', desc: 'Afecta salvajemente a la cicatrización', val: medFlagSmoke, setter: setMedFlagSmoke },
                           { title: '¿Enfermedades Sistémicas?', desc: 'Diabetes, Hipertensión o corazón', val: medFlagDisease, setter: setMedFlagDisease },
                         ].map(flag => (
                           <div key={flag.title} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                              <div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900">{flag.title}</h4>
                                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{flag.desc}</p>
                              </div>
                              <button 
                                onClick={() => flag.setter(!flag.val)}
                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${flag.val ? '' : 'bg-gray-200'}`}
                                style={flag.val ? { backgroundColor: color } : {}}
                              >
                                <motion.div className="w-4 h-4 rounded-full bg-white shadow-sm absolute" animate={{ left: flag.val ? '26px' : '4px' }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                              </button>
                           </div>
                         ))}
                         
                         <AnimatePresence>
                           {medFlagDisease && (
                             <motion.div
                               initial={{ opacity: 0, height: 0, marginTop: 0 }}
                               animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                               exit={{ opacity: 0, height: 0, marginTop: 0 }}
                               className="overflow-hidden"
                             >
                               <textarea 
                                 placeholder="Por favor, nombra brevemente tu afección..."
                                 value={systemicDetails}
                                 onChange={(e) => setSystemicDetails(e.target.value)}
                                 className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base resize-none bg-white shadow-inner text-gray-800"
                                 rows={2}
                               />
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>

                      <button 
                        onClick={() => donorArea ? nextStep() : alert("Por favor selecciona tu densidad de zona donante")} 
                        className="w-full mt-6 py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 active:scale-95" 
                        style={{ backgroundColor: donorArea ? color : '#E5E7EB', color: donorArea ? contrastText : '#9CA3AF', cursor: donorArea ? 'pointer' : 'not-allowed' }}
                      >
                        Continuar
                      </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 6: PHOTO UPLOAD */}
              {step === 6 && (
                <motion.div key="6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 6 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Sube tus fotos</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">Nuestra IA necesita 3 fotos (Frontal, Coronilla y Nuca) para darte un presupuesto exacto en milisegundos.</p>
                      
                      {uploadedPhotos.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 sm:p-10 mb-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative group">
                          <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
                          
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Upload size={28} style={{ color }} />
                          </div>
                          <h4 className="font-extrabold text-lg text-gray-900 mb-1">Arrastra tus fotos aquí</h4>
                          <p className="text-sm font-medium text-gray-500">o toca para abrir galería (hasta 3 fotos)</p>
                        </div>
                      ) : (
                        <div className="mb-6 flex gap-3 h-[100px]">
                          {uploadedPhotos.map((src, idx) => (
                            <div key={idx} className="w-[100px] h-[100px] rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm shrink-0 bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} className="w-full h-full object-cover" alt="Uploaded preview" />
                            </div>
                          ))}
                          {uploadedPhotos.length < 3 && (
                            <label className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shrink-0">
                              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                              <Upload size={24} className="text-gray-400 mb-1" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Añadir</span>
                            </label>
                          )}
                        </div>
                      )}

                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shrink-0">
                          <ShieldCheck size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">100% Confidencial y Seguro</h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">Cumplimos estrictamente la RGPD Europea. Tus fotos no se almacenan ni se comparten nunca.</p>
                        </div>
                      </div>

                      {uploadedPhotos.length > 0 ? (
                        <button onClick={() => startAnalysis()} className="w-full mt-2 py-4 rounded-xl font-extrabold text-white transition-opacity hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: color, color: contrastText }}>
                          <Check size={18} strokeWidth={3} /> Imágenes listas. Continuar
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button disabled className="w-full py-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 border-dashed">
                            Esperando fotos...
                          </button>
                          <button onClick={() => setUploadedPhotos(['/images/triage/step3_difusa.webp'])} className="w-full py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                            Cargar fotos demo
                          </button>
                        </div>
                      )}
                   </div>
                </motion.div>
              )}

              {/* STEP 7: AI SCANNER ALGORITHM */}
              {step === 7 && (
                <motion.div key="7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[400px] flex flex-col items-center justify-center text-center px-4">
                   <div className="relative w-40 h-40 mb-5 sm:mb-8 mx-auto">
                     {/* Outer Ring */}
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-full h-full rounded-full border border-dashed border-gray-300 absolute inset-0" />
                     {/* Scanner Cone */}
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full border-t-4 rounded-full absolute inset-0 opacity-50" style={{ borderTopColor: color }} />
                     {/* Inner Core */}
                     <div className="absolute inset-4 rounded-full bg-gray-50 border-2 border-gray-100 shadow-inner flex items-center justify-center">
                        <motion.div initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-12 h-12 rounded-full blur-md" style={{ backgroundColor: color }} />
                        <UserCircle2 size={40} className="absolute text-gray-400" />
                     </div>
                   </div>

                   <div className="flex items-end justify-center gap-4 w-full mb-3">
                     <p className="text-[10px] font-black tracking-widest uppercase text-gray-500">ANALIZANDO TU PERFIL CAPILAR...</p>
                     <p className="font-extrabold text-3xl tabular-nums leading-none tracking-tighter text-gray-900">{analysisProgress}%</p>
                   </div>
                   
                   <div className="w-64 h-2 bg-gray-100 rounded-full mx-auto overflow-hidden mb-6 relative">
                     <motion.div className="h-full rounded-full bg-gray-800" style={{ width: `${analysisProgress}%` }} transition={{ ease: "easeOut" }} />
                   </div>

                   <div className="inline-block px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200">
                     <p className="text-xs font-bold text-gray-600 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-gray-400" />
                       {analysisProgress < 30 ? 'Mapeando superficie receptora...' : analysisProgress < 70 ? 'Calculando ratio de densidad donante...' : 'Generando presupuesto folicular FUE...'}
                     </p>
                   </div>
                </motion.div>
              )}

              {/* STEP 8: DIAGNOSIS & DOCTOR MATCH */}
              {step === 8 && (
                <motion.div key="8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* Diagnosis Card */}
                  <div className="bg-white rounded-4xl p-5 sm:p-6 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                     <div className="flex items-center gap-4 mb-5 sm:mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                          <Check size={24} className="text-green-600" />
                       </div>
                       <div>
                         <h3 className="text-xl font-extrabold text-gray-900">Análisis Completado</h3>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                           Confianza de la IA: <span className="text-green-600">96.4%</span>
                         </p>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                       <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100">
                         <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Escala Norwood</p>
                         <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tighter">III</p>
                         <p className="text-[10px] sm:text-[11px] font-bold mt-1 text-gray-600">Recesión Moderada</p>
                       </div>
                       <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100">
                         <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Grafts Est. (UFs)</p>
                         <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tighter">2.5<span className="text-lg">k</span></p>
                         <p className="text-[10px] sm:text-[11px] font-bold mt-1 text-gray-500">A 3,200 Folículos</p>
                       </div>
                     </div>
                     
                     <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Técnica Recomendada</p>
                        <p className="text-sm sm:text-base font-extrabold text-gray-900">FUE — Follicular Unit Extraction</p>
                        <div className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-200 text-gray-700">
                          Mejor Técnica Opciones
                        </div>
                     </div>
                  </div>

                  {/* Doctor Match Card */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">TU CIRUJANO O CIRUJANA RECOMENDADO</h4>
                    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                       <div className="flex items-start gap-4 mb-4">
                         <div className="relative">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={docImage} className="w-16 h-16 rounded-2xl object-cover border border-gray-200" alt="Doctor" />
                           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                             <Check size={10} color="white" strokeWidth={4} />
                           </div>
                         </div>
                         <div className="flex-1 pt-1">
                           <div className="flex items-center flex-wrap gap-2 mb-1">
                             <h4 className="font-extrabold text-gray-900 text-lg">{doctor}</h4>
                             <span className="px-1.5 py-0.5 rounded text-[8px] font-black text-white uppercase bg-green-600 tracking-widest">Verificado</span>
                           </div>
                           <p className="text-[11px] font-medium text-gray-500 leading-tight">12+ años especializándose en diseños FUE ultra-densos. Especialista en primeras líneas.</p>
                         </div>
                       </div>
                       
                       <div className="flex gap-2 text-[10px] font-black text-gray-500 uppercase tracking-wider overflow-x-auto pb-1 mb-5">
                         <span className="px-3 py-1 rounded-full bg-gray-100 shrink-0">FUE</span>
                         <span className="px-3 py-1 rounded-full bg-gray-100 shrink-0">DHI</span>
                         <span className="px-3 py-1 rounded-full bg-gray-100 shrink-0">Mesoterapia</span>
                         <span className="px-3 py-1 rounded-full bg-gray-100 shrink-0">BBAA</span>
                       </div>

                       <button 
                         onClick={nextStep}
                         className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-extrabold text-white transition-transform active:scale-95 shadow-xl hover:shadow-2xl hover:opacity-90 leading-none text-sm sm:text-base"
                         style={{ backgroundColor: color, color: contrastText }}
                       >
                         Reservar Valoración Clínica <ChevronRight size={18} strokeWidth={3} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 9: CALENDAR */}
              {step === 9 && (
                <motion.div key="9" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-4xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 9 de {TOTAL_STEPS}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Elige tu Cita</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">Selecciona la mejor fecha para tu consulta oficial por videollamada.</p>
                      
                      {/* Full Month Calendar */}
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
                            // Available if not weekend and pseudo-random pattern (e.g., skip multiples of 3 except some)
                            const isAvailable = !isWeekend && (d % 4 !== 0 || d === 12);
                            const isSelected = selectedDate === d;
                            return (
                              <button
                                key={d}
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelectedDate(d);
                                    setSelectedTime(""); // Reset time when date changes
                                  }
                                }}
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
                      </div>

                      {/* Time Slots */}
                      <AnimatePresence mode="wait">
                        {selectedDate ? (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-gray-100 pt-6">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">HORARIOS DISPONIBLES</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {times.map(t => (
                                  <button 
                                    key={t} onClick={() => setSelectedTime(t)}
                                    className={`py-3.5 rounded-xl border text-sm font-bold transition-all ${selectedTime === t ? 'border-transparent text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                                    style={selectedTime === t ? { backgroundColor: color, color: contrastText } : {}}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                              <button 
                                onClick={() => {
                                  if (selectedTime) nextStep();
                                }} 
                                className={`w-full mt-6 py-4 rounded-xl font-bold transition-opacity ${selectedTime ? 'text-white hover:opacity-90 active:scale-95' : 'text-gray-400'}`}
                                style={{ backgroundColor: selectedTime ? color : '#E5E7EB', color: selectedTime ? contrastText : '#9CA3AF', cursor: selectedTime ? 'pointer' : 'not-allowed' }}
                              >
                                Continuar
                              </button>
                           </motion.div>
                        ) : (
                          <div className="border-t border-gray-100 pt-6 text-center text-sm font-bold text-gray-400 pb-2">
                             Elige un día para ver las horas
                          </div>
                        )}
                      </AnimatePresence>
                   </div>
                </motion.div>
              )}

              {/* STEP 10: CHECKOUT */}
              {step === 10 && (
                <motion.div key="10" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                   <div className="bg-white rounded-4xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso Final
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Confirma tu Plaza</h2>
                      <p className="text-gray-500 font-medium text-sm sm:text-base mb-5 sm:mb-8">Reserva tu consulta clínica con un depósito de evaluación reembolsable.</p>
                      
                      {/* Appointment Card */}
                      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4 mb-5 sm:mb-8">
                         <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center shrink-0">
                           <CalendarIcon size={24} style={{ color }} />
                         </div>
                         <div>
                           <p className="font-extrabold text-gray-900 text-sm sm:text-base">Sábado {selectedDate} Abr a las {selectedTime}</p>
                           <p className="text-[11px] font-bold text-gray-500 mt-0.5">{doctor} — Consulta Capilar Oficial</p>
                         </div>
                      </div>

                      {/* Checkout Form - Stripe Simulated */}
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                             <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">NOMBRE</label>
                             <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="Nombre completo" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                           </div>
                           <div>
                             <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">TELÉFONO</label>
                             <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="+34 600 000 000" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                           </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CORREO ELECTRÓNICO</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition-all placeholder-gray-400" placeholder="tu@email.com" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                        </div>
                        
                        <div className="pt-2">
                           <label className="flex text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 items-center justify-between">
                             PAGO SEGURO STRIPE
                             <div className="flex gap-1">
                               <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                               <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                             </div>
                           </label>
                           <div className="relative">
                             <input type="text" className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 font-medium text-sm rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 transition-all placeholder-gray-400" placeholder="0000 0000 0000 0000" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                             <Shield size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                           </div>
                           <div className="grid grid-cols-2 gap-3 mt-3">
                             <input type="text" maxLength={5} onChange={(e) => {
                               let v = e.target.value.replace(/\D/g, '');
                               if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                               e.target.value = v;
                             }} className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all placeholder-gray-400" placeholder="MM/AA" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                             <input type="text" className="w-full bg-white border border-gray-200 shadow-sm text-gray-900 font-medium text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all placeholder-gray-400" placeholder="CVC" style={{ '--tw-ring-color': color } as React.CSSProperties} />
                           </div>
                        </div>
                      </div>

                      {/* Security Badge */}
                      <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3 mb-6">
                        <div className="mt-0.5">
                          <ShieldCheck size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Transacción 100% Cifrada</h4>
                          <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-0.5 leading-relaxed">Depósito reembolsable de 50€ vía Stripe.</p>
                        </div>
                      </div>

                      <button 
                        disabled={isProcessing}
                        onClick={() => {
                          if (email) {
                            setIsProcessing(true);
                            setTimeout(() => {
                              setIsProcessing(false);
                              setStep(11);
                            }, 1500);
                          } else alert("Por favor introduce un email válido para continuar");
                        }}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-extrabold text-white transition-all shadow-lg text-base ${isProcessing ? 'opacity-80 cursor-wait' : 'hover:shadow-xl hover:opacity-90 active:scale-95'}`}
                        style={{ backgroundColor: color, color: contrastText }}
                      >
                         {isProcessing ? (
                           <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                         ) : (
                           <Shield size={18} strokeWidth={2.5} />
                         )}
                         {isProcessing ? 'Procesando pago seguro...' : 'Confirmar Reserva — 50€'}
                      </button>
                    </div>
                </motion.div>
              )}

              {/* STEP 11: SUCCESS CONFIRMATION */}
              {step === 11 && (
                <motion.div key="11" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center justify-center text-center pt-8 pb-4">
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
                     Hemos recibido tu pago y agendado tu valoración clínica con {doctor} para el <strong className="text-gray-900">el día {selectedDate} a las {selectedTime}</strong>.
                   </p>

                   <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-5 sm:mb-8 text-left">
                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Resumen de la IA</p>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-gray-700">Patrón Estimado</span>
                        <span className="text-sm font-black text-gray-900">{norwoodPattern || 'Detectado'}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">Estado</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Aprobado</span>
                      </div>
                      <div className="h-px w-full bg-gray-100 my-3"></div>
                      <p className="text-[11px] text-gray-500 font-medium tracking-tight">Recibirás un email confirmando los detalles y el enlace a la videollamada.</p>
                   </div>

                   <button 
                     onClick={() => {
                        const msg = encodeURIComponent(`Hola, acabo de reservar mi consulta capilar con ${doctor} el ${selectedDate} de Abril a las ${selectedTime}.`);
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
                     onClick={() => setIsOpen(false)}
                     className="px-8 py-3.5 rounded-full font-bold transition-all text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                   >
                     Cerrar ventana
                   </button>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
