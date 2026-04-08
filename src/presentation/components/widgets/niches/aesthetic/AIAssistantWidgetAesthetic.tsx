import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetShell } from "../../base/WidgetShell";
import { BookingCheckoutStep, SuccessStep } from "../../base/shared-steps";
import { Check, Sparkles, Droplet, Activity, ScanFace } from "lucide-react";

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

export function AIAssistantWidgetAesthetic({ color, isOpen, setIsOpen }: { color: string, isOpen: boolean, setIsOpen: (b: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [urgency, setUrgency] = useState("");
  const [quadrant, setQuadrant] = useState("");
  const [tailored2, setTailored2] = useState("");
  const [priority, setPriority] = useState("");
  
  const TOTAL_STEPS = 6; 

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    setStep(s => s - 1);
  };
  const contrastText = getContrastColor(color);

  const sharedProps = {
     color, contrastText, nextStep, totalSteps: TOTAL_STEPS
  };

  const handleUrgencySelect = (val: string) => {
     setUrgency(val);
     setQuadrant("");
     setTailored2("");
     setPriority("");
     nextStep();
  };

  return (
    <WidgetShell 
      isOpen={isOpen} 
      step={step} 
      totalSteps={TOTAL_STEPS} 
      color={color} 
      onPrev={prevStep}
      hideBackButtonOnSteps={[6]}
    >
      
      {/* STEP 1: Main Category */}
      {step === 1 && (
        <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                 Paso 1 de {TOTAL_STEPS}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">¿Qué te gustaría mejorar?</h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base mb-6">Selecciona el tratamiento principal en el que estás interesada/o.</p>
              
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handleUrgencySelect("Armonización Facial")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <ScanFace className="text-purple-500" />
                     <span className="font-bold text-gray-800">Armonización Facial (Volúmenes)</span>
                   </div>
                   <Check className={`text-purple-500 transition-opacity ${urgency === "Armonización Facial" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Inyectables")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Droplet className="text-blue-500" />
                     <span className="font-bold text-gray-800">Inyectables (Botox / Ácido Hialurónico)</span>
                   </div>
                   <Check className={`text-blue-500 transition-opacity ${urgency === "Inyectables" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Láser y Calidad")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Sparkles className="text-amber-500" />
                     <span className="font-bold text-gray-800">Láser Médico y Calidad de Piel</span>
                   </div>
                   <Check className={`text-amber-500 transition-opacity ${urgency === "Láser y Calidad" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Corporal")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Activity className="text-emerald-500" />
                     <span className="font-bold text-gray-800">Tratamientos Corporales</span>
                   </div>
                   <Check className={`text-emerald-500 transition-opacity ${urgency === "Corporal" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>
              </div>
           </div>
        </motion.div>
      )}

      {/* STEP 2: Tailored Questions 1 */}
      {step === 2 && (
        <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 2 de {TOTAL_STEPS}
              </div>

              {urgency === "Armonización Facial" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Estructura Facial</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿En qué zona sientes que necesitas mayor soporte o definición?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Pómulos y hundimiento de ojeras', 'Definición del óvalo y línea mandibular', 'Aumento o hidratación de Labios'].map((q) => (
                      <button 
                        key={q} onClick={() => setQuadrant(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${quadrant === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={quadrant === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {urgency === "Inyectables" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Neuromoduladores y Rellenos</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Cuál es tu principal objetivo estético con nosotros?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Suavizar arrugas al gesticular (Frente, Patas de gallo)', 'Tratar arrugas profundas y surco nasogeniano', 'Prevenir la flacidez con inductores de colágeno (Radiesse/Sculptra)'].map((q) => (
                      <button 
                        key={q} onClick={() => setQuadrant(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${quadrant === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={quadrant === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {urgency === "Láser y Calidad" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Dermatología Estética</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Contamos con tecnología láser avanzada. ¿Qué alteraciones presenta tu piel?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Manchas oscuras, melasma o daño solar', 'Marcas de acné o poros muy dilatados', 'Rojeces, rosácea o capilares dilatados'].map((q) => (
                      <button 
                        key={q} onClick={() => setQuadrant(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${quadrant === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={quadrant === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {urgency === "Corporal" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Medicina Corporal</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Indícanos cuál es tu principal prioridad a nivel corporal:</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Celulitis y retención de líquidos', 'Grasa localizada rebelde', 'Flacidez corporal intensa (Abdomen/Brazos)'].map((q) => (
                      <button 
                        key={q} onClick={() => setQuadrant(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${quadrant === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={quadrant === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

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

      {/* STEP 3: Tailored Questions 2 - Viability */}
      {step === 3 && (
        <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 3 de {TOTAL_STEPS}
              </div>

              {urgency === "Armonización Facial" || urgency === "Inyectables" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Historial Médico Estético</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para garantizar tu seguridad y evitar interacciones, ¿te has realizado infiltraciones faciales en los últimos meses?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Es mi primera vez, nunca me he inyectado', 'Sí, llevo rellenos o toxina de hace menos de 1 año', 'Tengo procedimientos de hace más de 2 años'].map((q) => (
                      <button 
                        key={q} onClick={() => setTailored2(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${tailored2 === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={tailored2 === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              ) : urgency === "Láser y Calidad" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Estado Base de tu Piel</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">El láser interactúa con los pigmentos. ¿Tienes actualmente un bronceado muy reciente o has tomado isotretinoína (Roacután)?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['No, mi piel no está bronceada ni tomo medicación', 'Sí, he tomado sol o rayos UVA hace menos de 1 mes', 'He tomado medicación fuerte contra el acné este año'].map((q) => (
                      <button 
                        key={q} onClick={() => setTailored2(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${tailored2 === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={tailored2 === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Evolución del Problema</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Acompañas esta situación con algún plan de ejercicio o dieta actualmente?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Hago dieta y ejercicio, pero esa zona no mejora', 'No tengo un plan específico de dieta/ejercicio', 'Acabo de ser mamá o tuve una gran pérdida de peso'].map((q) => (
                      <button 
                        key={q} onClick={() => setTailored2(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${tailored2 === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={tailored2 === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button 
                 disabled={!tailored2}
                 onClick={nextStep}
                 className={`w-full py-4 rounded-xl font-bold transition-opacity ${tailored2 ? 'text-white hover:opacity-90 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                 style={tailored2 ? { backgroundColor: color, color: contrastText } : {}}
              >
                  Continuar
              </button>
           </div>
        </motion.div>
      )}

      {/* STEP 4: Prepay Ecography (NEW) */}
      {step === 4 && (
        <motion.div key="4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 4 de {TOTAL_STEPS}
              </div>

              {urgency === "Armonización Facial" || urgency === "Inyectables" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Diagnóstico Avanzado</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Nuestros médicos emplean Ecografía Facial para infiltrar de forma 100% segura. Evita riesgos y reserva tu consulta médica hoy.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Abonar 50€ por Consulta Médica (Reembolsable en Tto)', 'Agendar solo valoración visual general (Gratuita)'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all relative ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("Abonar") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase rounded-full shadow-sm">Seguridad Médica</span>}
                        <span className="block pr-4">{q}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : urgency === "Láser y Calidad" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Estudio Dermo-Epidérmico 3D</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">El éxito del láser depende de ver lo que el ojo no capta. Realizamos un escáner facial VISIA para analizar pigmentos internos y rojeces ocultas.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Reservar Escáner Facial VISIA 3D (30€ a descontar)', 'Agendar valoración clínica estándar gratuita'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all relative ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("Escáner") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-amber-400 text-amber-900 text-[9px] font-black uppercase rounded-full shadow-sm">Más Precisión</span>}
                        <span className="block pr-4">{q}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Análisis Tisular Corporal</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para definir el protocolo (onda de choque, criolipólisis, maderoterapia) medimos tu grasa visceral y retención líquida con Bioimpedancia InBody.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Bloquear Diagnóstico InBody Medical (Prepago 20€)', 'Solo acudir a primera consulta para presupuesto'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all relative ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("InBody") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-emerald-400 text-emerald-900 text-[9px] font-black uppercase rounded-full shadow-sm">Clínico</span>}
                        <span className="block pr-4">{q}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button 
                 disabled={!priority}
                 onClick={nextStep}
                 className={`w-full py-4 rounded-xl font-bold transition-opacity ${priority ? 'text-white hover:opacity-90 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                 style={priority ? { backgroundColor: color, color: contrastText } : {}}
              >
                  Acceder a Agenda
              </button>
           </div>
        </motion.div>
      )}

      {/* STEP 5: Booking Checkout */}
      {step === 5 && <BookingCheckoutStep {...sharedProps} />}

      {/* STEP 6: Success */}
      {step === 6 && <SuccessStep doctorName="nuestro médico estético" onClose={() => setIsOpen(false)} />}
      
    </WidgetShell>
  );
}
