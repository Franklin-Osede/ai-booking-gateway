"use client";

import { useState } from "react";
import { Copy, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function InjectorDashboard() {
  const [siteUrl, setSiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [widgetType, setWidgetType] = useState("voice");
  const [niche, setNiche] = useState("hair_transplant");
  const [brandColor, setBrandColor] = useState("#FFD700");
  const [pos, setPos] = useState("left");
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs");
  const [demoLanguage, setDemoLanguage] = useState("es-ES");
  const [demoUrl, setDemoUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    if (!siteUrl) return;
    try {
      setLoading(true);
      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName || siteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', ''),
          industry: niche,
          siteUrl: siteUrl,
          brandColor: brandColor.startsWith('#') ? brandColor : `#${brandColor}`
        })
      });
      const data = await res.json();
      
      const url = new URL(window.location.href);
      if (data.success && data.data?.id) {
         url.search = `?c=${data.data.id}&widget=${widgetType}&pos=${pos}&voice=${voiceProvider}&lang=${encodeURIComponent(demoLanguage)}`;
      } else {
         // Fallback if DB insert fails
         url.search = `?site=${encodeURIComponent(siteUrl)}&widget=${widgetType}&niche=${encodeURIComponent(niche)}&color=${brandColor.replace("#", "")}&pos=${pos}&voice=${voiceProvider}&lang=${encodeURIComponent(demoLanguage)}`;
      }
      setDemoUrl(url.toString());
      setLoading(false);
    } catch { 
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(demoUrl);
  };

  const launchLink = () => {
    window.open(demoUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-neutral-900 rounded-4xl p-8 shadow-2xl border border-neutral-800"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-neutral-800 rounded-2xl text-yellow-500 shadow-lg">
               <Sparkles size={28} />
             </div>
             <div>
               <h1 className="text-3xl font-bold tracking-tight">Widget Injector Panel</h1>
               <p className="text-neutral-400 mt-1">Genera URLs mágicas de demostración para tus prospectos.</p>
             </div>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 border border-neutral-700 whitespace-nowrap">
            Abrir Admin
          </Link>
        </div>

        <div className="space-y-8">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">1. URL del Prospecto (Clínica/Empresa)</label>
            <input 
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://su-web.com"
              className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-neutral-500 transition-shadow text-lg"
            />
          </div>

          {/* Brand Name Input */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">1b. Nombre Exacto de la Marca (Para la Voz IA)</label>
            <input 
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ej. Imas Salud Capilar"
              className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-neutral-500 transition-shadow text-lg"
            />
          </div>

          {/* Niche Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">2. Sector del Prospecto (Especializa la IA)</label>
            <div className="relative">
              <select 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white text-lg cursor-pointer appearance-none px-5"
              >
                <option value="hair_transplant">Clínica Capilar (Especialistas)</option>
                <option value="regenerative">Medicina Regenerativa / Stem Cells</option>
                <option value="medical">Clínica Médica / Especialista</option>
                <option value="dental">Clínica Dental</option>
                <option value="legal">Despacho de Abogados / Asesoría</option>
                <option value="beauty">Centro de Estética / Spa</option>
                <option value="auto">Concesionario Automotriz / Taller</option>
                <option value="b2b">Agencia B2B / Software SaaS</option>
                <option value="default">Otro sector (Genérico)</option>
              </select>
            </div>
          </div>

          {/* Widget Type */}
          <div>
             <label className="block text-sm font-semibold text-neutral-300 mb-3">3. Elige el Upgrade Tecnológico</label>
             <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
               {[
                 { id: "voice", title: "Agente de Voz", desc: "Flujo guiado con opciones (Chips)" },
                 { id: "voice-free", title: "Agente de Consulta (Libre)", desc: "Conversación abierta al micrófono" },
                 { id: "capilar", title: "Formulario Capilar IA", desc: "Triage Clínico + Escáner (10 Pasos)" },
                 { id: "dual-voice", title: "Demo Doble Voz", desc: "Muestra Libre (Izq) y Guiada (Der)" },
                 { id: "form", title: "Formulario Consulta", desc: "Flujo Visual Multi-Paso" },
                 { id: "chat", title: "Chat de IA", desc: "Agente Conversacional Texto" },
                 { id: "phone", title: "Llamada Simulada ⭐️", desc: "UI App Teléfono (Estilo iOS)" },
                 { id: "both", title: "Ambos 🚀", desc: "Formulario + Agente Voz" },
               ].map(w => (
                 <button
                   key={w.id}
                   onClick={() => setWidgetType(w.id)}
                   className={`p-4 rounded-2xl text-left border-2 transition-all ${widgetType === w.id ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-neutral-800 border-neutral-800 text-neutral-300 hover:border-neutral-700'}`}
                 >
                    <p className="font-bold">{w.title}</p>
                    <p className="text-xs opacity-70 mt-1">{w.desc}</p>
                 </button>
               ))}
             </div>
          </div>

          {/* Brand Color Setup */}
          <div>
             <label className="block text-sm font-semibold text-neutral-300 mb-3">4. Configura el Brand Color de su Marca</label>
             <div className="flex items-center gap-4">
               <input 
                 type="color"
                 value={brandColor}
                 onChange={(e) => setBrandColor(e.target.value)}
                 className="w-16 h-16 rounded-2xl cursor-pointer bg-neutral-800 border-none p-1"
               />
               <input 
                 type="text"
                 value={brandColor}
                 onChange={(e) => {
                    const match = e.target.value.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                    setBrandColor(match ? match[0] : e.target.value);
                 }}
                 className="flex-1 bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white font-mono text-lg uppercase"
               />
             </div>
          </div>

          {/* Position Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">5. Posición del Widget</label>
            <div className="relative">
              <select 
                value={pos}
                onChange={(e) => setPos(e.target.value)}
                className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white text-lg cursor-pointer appearance-none px-5"
              >
                <option value="left">Abajo a la Izquierda (Recomendado)</option>
                <option value="right">Abajo a la Derecha</option>
              </select>
            </div>
          </div>

          {/* Voice Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">6. Proveedor de Voz IA</label>
            <div className="relative">
              <select 
                value={voiceProvider}
                onChange={(e) => setVoiceProvider(e.target.value)}
                className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white text-lg cursor-pointer appearance-none px-5"
              >
                <option value="elevenlabs">ElevenLabs (Premium, Ultra-realista)</option>
                <option value="polly">AWS Polly (Estándar, Muy rápido)</option>
              </select>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">7. Idioma de la Demo IA</label>
            <div className="relative">
              <select
                value={demoLanguage}
                onChange={(e) => setDemoLanguage(e.target.value)}
                className="w-full bg-neutral-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-white text-lg cursor-pointer appearance-none px-5"
              >
                <option value="es-ES">Español (España)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="en-US">English (United States)</option>
              </select>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Cambia textos y voces automáticamente para la demo.
            </p>
          </div>

          <button 
             onClick={generateLink}
             disabled={loading}
             className="w-full bg-white text-black font-extrabold text-xl py-5 rounded-2xl hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] mt-4 disabled:opacity-50"
          >
            {loading ? "Creando lead en Base de Datos..." : "Generar Enlace Mágico DB"}
          </button>

          {/* Result */}
          <AnimatePresence>
            {demoUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                className="pt-8 border-t border-neutral-800 mt-8"
              >
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-green-400 font-bold flex items-center gap-2">
                    <Sparkles size={16} /> ¡Enlace listo para sorprender al cliente!
                  </p>
                  <div className="flex items-center gap-2 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 font-mono text-sm text-neutral-300 overflow-x-auto whitespace-nowrap">
                    {demoUrl}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={copyLink}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold transition-colors"
                    >
                      <Copy size={20} /> Copiar URL
                    </button>
                    <button 
                      onClick={launchLink}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl font-bold transition-colors shadow-lg"
                    >
                      <ExternalLink size={20} /> Abrir y Grabar Demo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
