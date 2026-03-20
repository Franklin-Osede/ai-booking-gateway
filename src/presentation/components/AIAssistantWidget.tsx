"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CreditCard, CheckCircle2, Activity } from "lucide-react";

function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 6) return '#ffffff';
  // If it's a short hex like #fff
  if (hexcolor.length === 4) {
    hexcolor = '#' + hexcolor[1]+hexcolor[1] + hexcolor[2]+hexcolor[2] + hexcolor[3]+hexcolor[3];
  }
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  // YIQ equation from W3C
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 200) ? '#000000' : '#ffffff'; // Threshold to 200 for intense brights like cyan/yellow
}

import { NICHE_CONFIGS } from "../config/nicheConfig";

export function AIAssistantWidget({ color, niche = "medical" }: { color: string, niche?: string, pos?: string }) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Form states
  const [specialty, setSpecialty] = useState("");
  const [doctor, setDoctor] = useState("");
  const [docImage, setDocImage] = useState("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Step 1 Accordion State
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState<{name: string, image: string} | null>(null);

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const getCategories = () => {
    return NICHE_CONFIGS[niche]?.categories || NICHE_CONFIGS["medical"].categories;
  };

  const [scrapedData, setScrapedData] = useState<{ categories: { name?: string, docs: ({name: string, image?: string} | string)[] }[] } | null>(null);
  const [brandName, setBrandName] = useState('La Clínica');
  const [email, setEmail] = useState('');

  useEffect(() => {
    try {
      const url = new URLSearchParams(window.location.search).get('site');
      if (url) {
        setTimeout(() => setBrandName(new URL(url).hostname.replace('www.', '').split('.')[0]), 0);
      }
    } catch { /* ignored */ }
  }, []);

  useEffect(() => {
    // Body scroll lock entirely bypassed to let users scroll the target website seamlessly.
  }, [isOpen]);

  useEffect(() => {
    try {
      const storedSite = new URLSearchParams(window.location.search).get('site') || localStorage.getItem('onboarding_site_url');
      if (storedSite) {
        fetch('/api/v1/scrape-team?url=' + encodeURIComponent(storedSite) + '&t=' + Date.now())
          .then(res => res.json())
          .then(data => {
            if (data && data.success) {
              setScrapedData(data);
            }
          })
          .catch(e => console.error(e));
      }
    } catch {}
  }, []);

  let categories: { icon: React.ElementType, name: string, docs: (string | {name: string, image?: string})[] }[] = getCategories();
  
  if (scrapedData && scrapedData.categories) {
    categories = categories.map((cat, i) => {
       const scrapedCat = scrapedData.categories[i];
       if (!scrapedCat) return cat;
       return {
          ...cat,
          name: scrapedCat.name || cat.name,
          docs: scrapedCat.docs?.length ? scrapedCat.docs : cat.docs
       };
    });
    // Trim categories to match scraper exactly
    if (scrapedData.categories.length > 0) {
      categories = categories.slice(0, scrapedData.categories.length);
    }
  }

  const times = ["09.30 AM", "09.40 AM", "10.20 AM", "10.30 AM", "10.40 AM", "10.50 AM", "11.00 AM", "11.10 AM", "11.20 AM"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 pointer-events-none!">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none!" />

      <AnimatePresence mode="wait">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 30 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 30 }}
           className="relative w-full max-w-[760px] max-h-[90vh] h-auto min-h-[560px] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 pointer-events-auto"
        >
          <header className="relative px-6 md:px-10 pt-8 md:pt-10 pb-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 md:gap-4">
              {step > 1 && step < 5 ? (
                <button onClick={prevStep} className="p-3 -ml-3 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center" style={{ color: color }}>
                  <ChevronLeft size={28} strokeWidth={3} />
                </button>
              ) : (
                <div className="w-8 md:w-12 h-8 md:h-12 -ml-3" />
              )}
              <h2 className="font-extrabold text-2xl md:text-3xl tracking-tight text-gray-900">
                {step === 1 && (NICHE_CONFIGS[niche]?.title || NICHE_CONFIGS["medical"].title)}
                {step === 2 && "Selecciona fecha y hora"}
                {step === 3 && "Acceso al portal"}
                {step === 4 && "Confirmar Reserva"}
                {step === 5 && "¡Reserva Completada!"}
              </h2>
            </div>
            
            {(step < 5 || step === 5) && (
              <button onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors">Cerrar</button>
            )}

            {/* Progress Line Indicator */}
            {step < 5 && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5">
                <motion.div 
                  className="h-full rounded-r-full shadow-sm"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </header>

          <main className="flex-1 overflow-y-auto px-6 md:px-10 pt-4 pb-12 md:pb-16 bg-transparent">
            <AnimatePresence mode="wait">
              {/* STEP 1: Categories & Embedded Doctor Profiles */}
              {step === 1 && (
                <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                   <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">
                     Encuentra al especialista indicado para tu tratamiento y agenda tu cita en segundos.
                   </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {categories.map((cat, idx) => {
                      const isExpanded = expandedCat === idx;
                      
                      return (
                        <div key={idx} className={`bg-white rounded-[2.5rem] border ${isExpanded ? 'border-gray-300 shadow-xl' : 'border-gray-100 shadow-sm'} transition-all duration-500 overflow-hidden`}>
                          {/* Category Header (Click to expand) */}
                          <button 
                            onClick={() => {
                               setExpandedCat(isExpanded ? null : idx);
                               setSelectedDocDetails(null);
                            }}
                            className="w-full text-left flex items-center justify-between p-4 md:p-6 hover:bg-gray-50/50 transition-colors"
                          >
                             <div className="flex gap-4 w-full">
                               <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform mt-0.5" style={{ backgroundColor: `${color}10`, color: color }}>
                                 <cat.icon size={30} strokeWidth={2.5} />
                               </div>
                               
                               <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                 <h3 className="font-extrabold text-base sm:text-lg text-gray-900 line-clamp-2 leading-tight pr-1 lg:pr-4">{cat.name}</h3>
                                 
                                 <div className="flex items-center justify-between gap-3 mt-3 w-full flex-wrap">
                                   <div className="flex items-center gap-2">
                                     <div className="flex -space-x-3.5 shrink-0 pl-1">
                                       {cat.docs.slice(0, 3).map((docItem, i) => {
                                         const docObj = docItem as unknown as {name: string, image?: string};
                                         const docName = typeof docItem === 'string' ? docItem : docObj.name;
                                         const docImg = docObj.image ? docObj.image : `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${(idx * 10) + i + 20}.jpg`;
                                         return (
                                         <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                                           {/* eslint-disable-next-line @next/next/no-img-element */}
                                           <img alt={docName} title={docName} className="w-full h-full object-cover" src={docImg}/>
                                         </div>
                                         )}
                                       )}
                                     </div>
                                     <span className="text-xs font-bold text-gray-500 whitespace-nowrap tracking-tight shrink-0 flex items-center gap-1.5 ml-0.5">
                                       <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>+{Math.max(1, cat.docs.length)}
                                     </span>
                                   </div>

                                   {/* Bottom Right CTA */}
                                   <div className="flex items-center gap-0.5 bg-gray-50/80 px-2 py-1.5 rounded-lg border border-gray-100 transition-colors shrink-0 mr-1 sm:mr-0">
                                     <span className="text-[10px] sm:text-[11px] font-black text-gray-800 uppercase tracking-widest">Ver Todos</span>
                                     <ChevronRight size={14} className="text-gray-900 group-hover:translate-x-0.5 transition-transform" style={{ color: color }} />
                                   </div>
                                 </div>
                               </div>
                             </div>
                          </button>

                          {/* Expanded Doctors List & Inline Mini Ficha */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: "auto", opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6 bg-white"
                              >
                                <div className="px-4 pb-4 md:px-6 md:pb-6">
                                  <div className="w-full h-px bg-gray-100 mb-4" />
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{NICHE_CONFIGS[niche]?.buttonLabel || "Especialistas"}</h4>
                                  <div className="flex flex-col gap-3">
                                     {cat.docs.map((docItem, i) => {
                                       const docObj = docItem as unknown as {name: string, image?: string};
                                       const docName = typeof docItem === 'string' ? docItem : docObj.name;
                                       const docImg = docObj.image ? docObj.image : `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${(idx * 10) + i + 20}.jpg`;
                                       const isSelected = selectedDocDetails?.name === docName;
                                       
                                       return (
                                         <div key={i} className={`p-4 rounded-2xl border transition-all duration-300 ${isSelected ? 'border-gray-200 shadow-xl bg-white scale-[1.01] ring-1 ring-gray-100/50' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white'}`}>
                                            <button 
                                              onClick={() => setSelectedDocDetails(isSelected ? null : { name: docName, image: docImg })}
                                              className="w-full text-left"
                                            >
                                               <div className="flex items-center gap-4">
                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                                 <img src={docImg} className="w-12 h-12 rounded-full border border-gray-100 object-cover shadow-sm shrink-0 bg-white" alt={docName} />
                                                 <div className="flex-1 min-w-0">
                                                   <h4 className="font-bold text-gray-900 text-sm truncate">{docName}</h4>
                                                   <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5 tracking-wider truncate">{cat.name}</p>
                                                 </div>
                                                 <ChevronRight size={18} className={`text-gray-300 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                                               </div>
                                            </button>

                                            {/* Mini Ficha Popup (Inline Expanded Content) */}
                                            <AnimatePresence>
                                              {isSelected && (
                                                <motion.div 
                                                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                  className="pt-3 mt-3 border-t border-gray-100 overflow-hidden"
                                                >
                                                  <button 
                                                    onClick={() => { 
                                                      setSpecialty(cat.name); 
                                                      setDoctor(docName); 
                                                      setDocImage(docImg); 
                                                      nextStep(); 
                                                    }}
                                                    className="w-full py-3 rounded-xl text-xs font-extrabold shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                    style={{ backgroundColor: color, color: getContrastColor(color) }}
                                                  >
                                                    Agendar Cita <ChevronRight size={14} strokeWidth={3}/>
                                                  </button>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                         </div>
                                       )
                                     })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Calendar & Time (Adapted to large UI) */}
              {step === 2 && (
                <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10 max-w-4xl mx-auto flex flex-col min-[580px]:flex-row gap-8 lg:gap-12">
                  <div className="bg-white/90 border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex-1">
                    <div className="flex flex-col items-center border-b border-gray-100 pb-6 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={docImage} className="w-16 h-16 rounded-full border-2 border-white shadow-md mb-3 object-cover" alt="Dr" />
                      <h4 className="font-extrabold text-gray-900 text-lg">{doctor}</h4>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{specialty}</span>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <ChevronLeft size={20} className="text-gray-400" />
                      <span className="font-extrabold text-lg text-gray-800">Octubre 2026</span>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <div className="grid grid-cols-7 gap-y-6 text-center text-xs font-bold text-gray-400 mb-4 tracking-widest uppercase">
                       <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm font-semibold">
                       {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                         const isRed = [5, 12, 19, 26, 2, 9].includes(d);
                         const isGreen = [14, 15, 21].includes(d);
                         let btnClass = "w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors font-bold ";
                         
                         if (selectedDate === d) btnClass += "text-white shadow-xl scale-110";
                         else if (isRed) btnClass += "text-red-400 bg-red-50/50 line-through opacity-60 cursor-not-allowed";
                         else if (isGreen) btnClass += "text-green-700 bg-green-100 ring-1 ring-green-200 hover:bg-green-200";
                         else btnClass += "hover:bg-gray-100 text-gray-700";

                         return (
                           <button 
                             key={d} 
                             disabled={isRed}
                             onClick={() => setSelectedDate(d)}
                             className={btnClass}
                             style={selectedDate === d ? { backgroundColor: color } : {}}
                           >
                             {d}
                           </button>
                         )
                       })}
                    </div>
                  </div>

                    <div className="flex-1 animate-in fade-in slide-in-from-right-8">
                       {selectedDate ? (
                         <>
                           <h4 className="font-extrabold text-gray-800 text-lg mb-6">Horarios Disponibles</h4>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                             {times.map(time => (
                                <button 
                                  key={time}
                                  onClick={() => {
                                    setSelectedTime(time);
                                    setTimeout(() => nextStep(), 2500);
                                  }}
                                  className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all active:scale-95 ${selectedTime === time ? 'shadow-xl' : 'border-gray-100 bg-white text-gray-600 hover:border-black/10 hover:shadow-md'}`}
                                  style={selectedTime === time ? { backgroundColor: color, borderColor: color, color: getContrastColor(color) } : {}}
                                >
                                  {time}
                                </button>
                             ))}
                           </div>
                         </>
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-3xl p-8 bg-gray-50/50">
                           <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                             <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: color }} />
                           </div>
                           <h4 className="text-gray-400 font-bold mb-2">Sin fecha seleccionada</h4>
                           <p className="text-xs text-gray-400 font-medium">Pulsa sobre un día en el calendario a tu izquierda para ver los horarios del especialista.</p>
                         </div>
                       )}
                    </div>
                </motion.div>
              )}

              {/* STEP 3: Login / Registration */}
              {step === 3 && (
                <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="max-w-md w-full mx-auto my-auto flex flex-col gap-8 bg-white/90 px-8 pt-8 pb-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-4">
                     <button className="flex-1 py-3 font-bold text-sm bg-white rounded-xl shadow-sm text-gray-900 border border-black/5">Nuevo Usuario</button>
                     <button className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 transition-colors">Ya tengo cuenta</button>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Correo electrónico *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 transition-all text-gray-800 font-medium" style={{ '--tw-ring-color': color } as React.CSSProperties} placeholder="tu@email.com" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Contraseña *</label>
                      <input type="password" value="demopassword123" readOnly className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <button 
                    onClick={nextStep}
                    className="w-full mt-8 py-5 rounded-2xl font-extrabold text-white shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg"
                    style={{ backgroundColor: color }}
                  >
                    Continuar al Pago <ChevronRight size={20} strokeWidth={3} />
                  </button>
                </motion.div>
              )}

              {/* STEP 4: Checkout */}
              {step === 4 && (
                <motion.div key="4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="max-w-md w-full mx-auto my-auto flex flex-col gap-6 bg-white/90 px-6 sm:px-8 pt-8 pb-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                   
                   {/* Checkout Header */}
                   <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15`, color: color }}>
                          <Activity size={24} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900">Resumen de Cita</h4>
                          <span className="text-xs font-bold text-gray-400 uppercase">Depósito de Pre-reserva</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">50€</div>
                        <div className="text-xs font-bold text-gray-400">Total</div>
                      </div>
                   </div>

                   {/* Resumen de Doctor y Fecha */}
                   <div className="flex items-center justify-between gap-4 bg-gray-50/80 border border-gray-100 p-4 rounded-2xl">
                     <div className="flex flex-1 items-center gap-3">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={docImage} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Doctor" />
                       <div>
                         <h4 className="font-extrabold text-sm text-gray-900">{doctor}</h4>
                         <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{specialty}</p>
                       </div>
                     </div>
                     <div className="text-right shrink-0">
                       <span className="text-xs font-extrabold text-gray-900 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 inline-block mb-1">{selectedDate} Oct. 2026</span>
                       <span className="text-xs font-bold block" style={{ color: color }}>{selectedTime}</span>
                     </div>
                   </div>

                   {/* Payment Grid */}
                   <div className="flex flex-col gap-4 mt-2">
                     <h3 className="font-extrabold text-gray-400 text-xs uppercase tracking-widest pl-1">Método de pago</h3>
                     <div className="relative">
                        <input type="text" className="w-full p-4 pl-14 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:bg-white transition-all font-medium text-gray-800" style={{ '--tw-ring-color': color } as React.CSSProperties} placeholder="0000 0000 0000 0000" />
                        <CreditCard size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:bg-white transition-all font-medium text-gray-800" style={{ '--tw-ring-color': color } as React.CSSProperties} placeholder="MM/YY" />
                        <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:bg-white transition-all font-medium text-gray-800" style={{ '--tw-ring-color': color } as React.CSSProperties} placeholder="CVC" />
                     </div>
                   </div>

                   <button 
                     onClick={nextStep}
                     className="w-full mt-2 py-5 rounded-2xl font-extrabold shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg"
                     style={{ backgroundColor: color, color: getContrastColor(color) }}
                   >
                     Confirmar Reserva <CheckCircle2 size={24} />
                   </button>
                </motion.div>
              )}

              {/* STEP 5: Success */}
              {step === 5 && (
                <motion.div key="5" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center px-4 pt-4 pb-4">
                   <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] flex items-center justify-center shadow-lg transform rotate-3 mb-6 shrink-0" style={{ backgroundColor: color }}>
                     <CheckCircle2 size={48} className="text-white bg-transparent" />
                   </div>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 shrink-0 tracking-tight">¡Reserva Confirmada!</h2>
                   
                   <div className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 w-full max-w-sm mx-auto mb-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] shrink-0 transition-transform">
                      <div className="flex items-center gap-4 border-b border-gray-200/80 pb-4 mb-4">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={docImage} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Doctor" />
                         <div>
                           <h4 className="font-extrabold text-sm text-gray-900">{doctor}</h4>
                           <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{specialty}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Fecha y Hora</p>
                           <p className="text-sm font-extrabold text-gray-900">{selectedDate} Oct. 2026</p>
                           <p className="text-sm font-extrabold text-gray-900 mt-0.5">{selectedTime}</p>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Centro Médico</p>
                           <p className="text-sm font-extrabold text-gray-900 capitalize">{brandName}</p>
                         </div>
                      </div>
                   </div>

                   <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed mb-6 shrink-0">
                     Hemos procesado tu depósito de 50€. Te hemos enviado los detalles y la factura a <span className="font-bold text-gray-800">{email || 'tu@email.com'}</span>.
                   </p>

                   <button 
                      onClick={() => { setIsOpen(false); setStep(1); }}
                      className="w-full max-w-sm py-4 md:py-5 bg-gray-900 font-extrabold text-white rounded-2xl hover:bg-gray-800 transition-colors shadow-2xl hover:shadow-black/20 hover:-translate-y-1 active:scale-95 shrink-0"
                   >
                     Volver a la web
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
