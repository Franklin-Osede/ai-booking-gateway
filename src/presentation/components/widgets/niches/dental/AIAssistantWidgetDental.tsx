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

export function AIAssistantWidgetDental({ color, isOpen, setIsOpen, lang = "es" }: { color: string, isOpen: boolean, setIsOpen: (b: boolean) => void, lang?: string }) {
  const [step, setStep] = useState(1);
  const [urgency, setUrgency] = useState("");
  const [quadrant, setQuadrant] = useState("");
  const [tailored2, setTailored2] = useState("");
  const [priority, setPriority] = useState("");
  
  const TOTAL_STEPS = 6; // Urgency, Tailored1, Tailored2, Priority/Scanner, Booking, Success

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 5 && (urgency === "Dolor Agudo / Urgencia" || urgency === "Revisión General / Limpieza")) {
      setStep(1);
    } else {
      setStep(s => s - 1);
    }
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
     if (val === "Dolor Agudo / Urgencia" || val === "Revisión General / Limpieza") {
       // Skip follow-up picking if it's an urgency or a simple revision
       setStep(5); 
     } else {
       // Go to tailored questions
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
      hideBackButtonOnSteps={[6]}
    >
      
      {/* STEP 1: Urgency / Main Pain */}
      {step === 1 && (
        <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
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
                   <Check className={`text-blue-500 transition-opacity ${urgency === "Estética Dental" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Ortodoncia")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Smile className="text-emerald-500" />
                     <span className="font-bold text-gray-800">Ortodoncia Invisible o Brackets</span>
                   </div>
                   <Check className={`text-emerald-500 transition-opacity ${urgency === "Ortodoncia" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Implantes Dentales")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Info className="text-orange-500" />
                     <span className="font-bold text-gray-800">Implantes Dentales</span>
                   </div>
                   <Check className={`text-orange-500 transition-opacity ${urgency === "Implantes Dentales" ? 'opacity-100' : 'opacity-0'}`} />
                 </button>

                 <button 
                   onClick={() => handleUrgencySelect("Revisión General / Limpieza")}
                   className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 text-left transition-colors flex items-center justify-between"
                 >
                   <div className="flex items-center gap-3">
                     <Check className="text-gray-400" />
                     <span className="font-bold text-gray-800">Revisión General / Limpieza</span>
                   </div>
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

              {urgency === "Estética Dental" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Diseño de Sonrisa</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Qué aspecto te gustaría mejorar principalmente?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Diseño de sonrisa completo', 'Mejorar dientes rotos o muy manchados', 'Solo Blanqueamiento Dental'].map((q) => (
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

              {urgency === "Ortodoncia" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Ortodoncia y Alineación</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Has llevado ortodoncia en el pasado?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['No, sería mi primera vez', 'Sí, pero se me han movido los dientes (recidiva)', 'Quiero continuar un tratamiento empezado'].map((q) => (
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

              {urgency === "Implantes Dentales" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Implantología y Cirugía</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para ofrecerte la mejor solución quirúrgica, indícanos tu situación actual:</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Me falta un solo diente', 'Me faltan varios dientes consecutivos', 'Llevo dentadura postiza y quiero algo fijo', 'Tengo un diente muy dañado y necesito extraerlo'].map((q) => (
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

      {/* STEP 3: Tailored Questions 2 */}
      {step === 3 && (
        <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 3 de {TOTAL_STEPS}
              </div>

              {urgency === "Estética Dental" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Evaluación Estructural</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Aprietas mucho los dientes o tienes fundas antiguas que quieras cambiar?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Sí, aprieto los dientes por la noche (Bruxismo)', 'Tengo coronas / fundas antiguas y oscurecidas', 'No, mis dientes están sanos pero no me gusta la forma/color'].map((q) => (
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

              {urgency === "Ortodoncia" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Análisis de tu Sonrisa</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">¿Qué es lo que más notas que necesitas corregir?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Tengo los dientes muy montados (Apiñamiento)', 'Mi mordida no encaja bien (Sobremordida / Abierta)', 'Tengo huecos entre los dientes (Diastemas)'].map((q) => (
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

              {urgency === "Implantes Dentales" && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Estado del Hueso Maxilar</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para colocar el implante, necesitamos estimar el nivel de &quot;atrofia ósea&quot; (la cantidad de hueso). ¿Cuánto tiempo llevas sin el diente?</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Llevo más de un año sin él (Puede haber pérdida de hueso)', 'Es una pérdida muy reciente o a punto de caerse', 'Tengo los dientes con mucha movilidad o infección activa'].map((q) => (
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

      {/* STEP 4: Priority & Scanner & Preparo (NEW) */}
      {step === 4 && (
        <motion.div key="4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
           <div className="bg-white rounded-4xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl opacity-50" style={{ borderColor: color }} />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Paso 4 de {TOTAL_STEPS}
              </div>

              {urgency === "Implantes Dentales" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Estudio Quirúrgico (TAC 3D)</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para operar con máxima seguridad y precisión milimétrica requerimos un TAC 3D Maxilofacial preliminar en tu primera visita clínica.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Abonar 80€ por TAC 3D y Reserva Prioritaria Quirófano', 'Agendar solo una primera exploración y presupuesto visual'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all relative ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("Abonar") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase rounded-full shadow-sm">Fast-Track</span>}
                        <span className="block pr-4">{q}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : urgency === "Ortodoncia" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Planificación Digital 3D</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para ver cómo quedará tu sonrisa en ordenador (ClinCheck Predictivo) usamos un Escáner Intraoral iTero de altísima precisión antes de la decisión del tratamiento.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Abonar 45€ por Estudio Digital 3D (Reembolsable si inicias)', 'Agendar solo consulta de valoración gratuita visual'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all relative ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("Abonar") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-blue-400 text-blue-900 text-[9px] font-black uppercase rounded-full shadow-sm">Paso Clínico Necesario</span>}
                        <span className="block pr-4">{q}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Salud de tus Encías (Periodonto)</h2>
                  <p className="text-gray-500 font-medium text-sm mb-6">Para que la estética (Mock-up funcional) quede perfecta, las encías deben estar sanas como lienzo libre de placa basal.</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {['Tengo encías bastante sanas y no sangran', 'Me sangran un poco al cepillar o están mínimamente retraídas', 'No lo sé, prefiero que me evalúe primero el especialista periodoncista'].map((q) => (
                      <button 
                        key={q} onClick={() => setPriority(q)}
                        className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${priority === q ? 'border-transparent text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        style={priority === q ? { backgroundColor: color, color: contrastText } : {}}
                      >
                        {q.includes("especialista periodoncista") && <span className="absolute -top-3 -right-2 px-2 py-1 bg-indigo-400 text-indigo-900 text-[9px] font-black uppercase rounded-full shadow-sm">Recomendado</span>}
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
      {step === 6 && <SuccessStep doctorName="el equipo clínico" onClose={() => setIsOpen(false)} />}
      
    </WidgetShell>
  );
}
