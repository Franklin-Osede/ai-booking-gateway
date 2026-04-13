"use client";

import { motion } from "framer-motion";
import { Mic, PhoneCall, MessageCircle, Stethoscope, Sparkles, ChevronRight } from "lucide-react";

interface DemoSelectorHubProps {
  color: string;
  niche?: string;
  lang?: string;
  onSelect: (mode: "hub" | "triage" | "text" | "voice" | "voice-free" | "phone") => void;
}

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

export function DemoSelectorHub({ color, niche, onSelect }: DemoSelectorHubProps) {
  const contrast = getContrastColor(color);
  const normalizedNiche = (niche || "").toLowerCase();
  const isDental = normalizedNiche.includes("dental") || normalizedNiche.includes("dentist") || normalizedNiche.includes("odont");
  const isAesthetic = normalizedNiche.includes("aesthetic") || normalizedNiche.includes("estetica") || normalizedNiche.includes("estética");

  const modules = [
    {
      id: "triage" as const,
      title: isDental ? "Escáner Dental" : isAesthetic ? "Estudio Facial Quirúrgico" : "Escáner Triage",
      tag: "Interactivo",
      desc: isDental 
        ? "Formulario interactivo para captar urgencias y evaluar restauraciones dentales."
        : isAesthetic
        ? "Diagnóstico interactivo para pre-evaluar inyectables, bótox y calidad de la piel."
        : "Formulario gamificado con subida de fotos y un simulador folicular visual.",
      icon: <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />,
      highlight: false
    },
    {
      id: "voice" as const,
      title: "Voz Guiada",
      tag: "Estructurado",
      desc: "Lleva al usuario paso a paso por una entrevista clínica para captar sus datos.",
      icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6" />,
      highlight: false
    },
    {
      id: "voice-free" as const,
      title: "Asistente de Recepción IA",
      tag: "Conversacional",
      desc: "El apoyo perfecto para tu equipo. Atiende llamadas perdidas o fuera de horario, resuelve dudas y agenda citas 24/7.",
      icon: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />,
      highlight: false
    },
    {
      id: "text" as const,
      title: "Chat Inteligente",
      tag: "Lead Gen",
      desc: "Captación rápida en texto con flujos sutiles para empujar a dejar el contacto.",
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      highlight: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center p-3 pb-6 sm:p-6 font-sans antialiased">
      {/* Subtle backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-4xl shadow-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[calc(100dvh-135px)] sm:max-h-[95vh]"
      >
        <div className="px-4 py-8 sm:px-12 sm:py-8 flex flex-col items-center text-center overflow-y-auto flex-1">
          <div 
             className="hidden sm:flex w-16 h-16 rounded-3xl mb-4 items-center justify-center shadow-inner relative shrink-0"
             style={{ backgroundColor: `${color}15`, color }}
          >
             <div className="absolute top-0 left-0 w-full h-full rounded-3xl border-2 opacity-20" style={{ borderColor: color }} />
             <Sparkles className="w-10 h-10" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border" style={{ backgroundColor: `${color}10`, borderColor: `${color}20`, color }}>
             <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
             Entorno de Pruebas (Sandbox)
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-3 mt-0">
             Sistemas de Automatización
          </h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mb-6 sm:mb-8 leading-relaxed">
             Simulación segura y en tiempo real. Explora cómo interactuarían estos agentes predictivos sobre tu web actual sin alterar tu código original.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {modules.map((mod) => (
              <button
                key={mod.id}
                id={`tour-mod-${mod.id}`}
                onClick={() => onSelect(mod.id)}
                className={`group text-left p-4 sm:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between h-full bg-white hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${mod.highlight ? 'border-transparent' : 'border-gray-100/80 hover:border-gray-200'}`}
                style={mod.highlight ? { borderColor: color, boxShadow: `0 10px 30px -10px ${color}40` } : {}}
              >
                {/* Decorative blob for highlighted block */}
                {mod.highlight && (
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: color }} />
                )}

                <div>
                   <div className="flex items-center justify-between mb-3 sm:mb-4">
                     <div 
                       className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                       style={{ backgroundColor: mod.highlight ? color : '#f3f4f6', color: mod.highlight ? contrast : '#4b5563' }}
                     >
                       {mod.icon}
                     </div>
                     <span 
                       className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                       style={{ backgroundColor: mod.highlight ? `${color}15` : '#f9fafb', color: mod.highlight ? color : '#6b7280', borderColor: mod.highlight ? `${color}30` : '#e5e7eb' }}
                     >
                       {mod.tag}
                     </span>
                   </div>
                   
                   <h3 className="text-lg font-extrabold text-gray-900 mb-1">{mod.title}</h3>
                   <p className="text-[11px] sm:text-sm text-gray-500 font-medium leading-relaxed">{mod.desc}</p>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-end">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
