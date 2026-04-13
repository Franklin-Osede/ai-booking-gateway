"use client";

import { useEffect, useState, use } from "react";
import { Check, MessageSquare, Briefcase, MapPin, Building2, ExternalLink, Trash2, BarChart3, Save, ArrowLeft, Target, Activity, TrendingDown, Quote, Copy, Edit2, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClinicDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"config" | "metrics" | "outreach">("config");
  const router = useRouter();
  
  // Forms
  const [status, setStatus] = useState("contactado");
  const [nextStep, setNextStep] = useState("");
  const [contactDate, setContactDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingColor, setEditingColor] = useState(false);
  const [tempColor, setTempColor] = useState("#ffffff");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [hasSavedVideo, setHasSavedVideo] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState("right");
  const [savingPosition, setSavingPosition] = useState(false);
  const [hasSavedPosition, setHasSavedPosition] = useState(false);
  const [seoMetrics, setSeoMetrics] = useState({ summary: "", traffic: "", cost: "", topPages: "", competitors: "", socialTraffic: "", insights: "" });
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const fetchClinic = () => {
    fetch(`/api/clinics/${unwrappedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClinic(data.data);
          if (data.data.videoUrl) setVideoUrl(data.data.videoUrl);
          if (data.data.seoMetrics) setSeoMetrics(data.data.seoMetrics);
          if (data.data.widgetPosition) setWidgetPosition(data.data.widgetPosition);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClinic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unwrappedParams.id]);

  const handleAddLog = async () => {
    if (!status) return;
    await fetch(`/api/clinics/${unwrappedParams.id}/outreach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, nextStep, channel: "email", contactDate }),
    });
    setNextStep("");
    fetchClinic();
  };

  const handleSaveColor = async () => {
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primaryColor: tempColor }),
    });
    setEditingColor(false);
    fetchClinic();
  };

  const handleSaveVideo = async () => {
    setSavingVideo(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl }),
    });
    setSavingVideo(false);
    setHasSavedVideo(true);
    setTimeout(() => setHasSavedVideo(false), 3000);
    fetchClinic();
  };

  const handleSavePosition = async () => {
    setSavingPosition(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetPosition }),
    });
    setSavingPosition(false);
    setHasSavedPosition(true);
    setTimeout(() => setHasSavedPosition(false), 3000);
    fetchClinic();
  };

  const handleSaveMetrics = async () => {
    setSavingMetrics(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seoMetrics }),
    });
    setSavingMetrics(false);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 3000);
    fetchClinic();
  };

  const handleDeleteLog = async (logId: string) => {
    await fetch(`/api/outreach/${logId}`, { method: "DELETE" });
    fetchClinic();
  };

  if (loading) return <div className="text-neutral-500 py-10">Cargando detalles de la clínica...</div>;
  if (!clinic) return <div className="text-red-500 py-10">Clínica no encontrada.</div>;

  return (
    <div className="space-y-8">
      {/* Botón Volver */}
      <div>
        <button 
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium text-sm bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={16} /> Volver a Clínicas
        </button>
      </div>

      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sticky top-0 z-10 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-yellow-500 shadow-inner">
               <Building2 size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-bold">{clinic.name}</h1>
               <div className="flex gap-4 mt-2 text-neutral-400 font-medium">
                 <span className="flex items-center gap-1"><Briefcase size={16}/> {clinic.industry}</span>
                 {clinic.location && <span className="flex items-center gap-1"><MapPin size={16}/> {clinic.location}</span>}
                 {clinic.websites?.[0] && (
                   <a href={clinic.websites[0].url} target="_blank" className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300">
                     <ExternalLink size={16}/> Sitio Web
                   </a>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-neutral-800">
          <button 
            onClick={() => setTab("config")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "config" ? "border-yellow-500 text-yellow-500" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Configuración de IA
          </button>
          <button 
            onClick={() => setTab("metrics")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "metrics" ? "border-green-500 text-green-500" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Métricas (Research)
          </button>
          <button 
            onClick={() => setTab("outreach")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "outreach" ? "border-yellow-500 text-yellow-500" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Historial Comercial
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === "metrics" && (
        <div className="bg-neutral-900 border border-green-500/30 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl text-green-500"><BarChart3 size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Dossier Táctico 
                  <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-md uppercase tracking-wider">Sales Intelligence</span>
                </h3>
                <p className="text-neutral-400 text-sm">Inteligencia en tiempo real para tu llamada consultiva.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingMetrics(!isEditingMetrics)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isEditingMetrics ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
            >
              {isEditingMetrics ? <><Check size={16}/> Ver Dossier</> : <><Edit2 size={16}/> Editar Datos</>}
            </button>
          </div>

          {!isEditingMetrics ? (
            <div className="space-y-6">
              {/* Arquetipo Header */}
              <div className="bg-neutral-950 border border-green-500/30 relative overflow-hidden rounded-2xl p-6 shadow-2xl group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-green-500 rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Target size={120}/></div>
                <h4 className="text-green-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-3">
                   <Target size={14}/> Diagnóstico & Arquetipo
                </h4>
                <p className="text-white text-lg md:text-xl leading-relaxed font-medium relative z-10">
                  {seoMetrics.summary || "Sin análisis de arquetipo disponible. Edita los datos para añadirlo."}
                </p>
              </div>

              {/* Grid 2x2 Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 hover:border-yellow-500/30 transition-colors">
                  <h4 className="text-neutral-500 font-bold text-xs uppercase mb-2 flex items-center gap-2"><Activity size={14} className="text-yellow-500"/> Tráfico Orgánico Mensual</h4>
                  <p className="text-neutral-200">{seoMetrics.traffic || "N/A"}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/30 transition-colors">
                   <h4 className="text-neutral-500 font-bold text-xs uppercase mb-2 flex items-center gap-2"><TrendingDown size={14} className="text-red-500"/> Coste de Oportunidad / Fuga</h4>
                   <p className="text-neutral-200">{seoMetrics.cost || "N/A"}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
                   <h4 className="text-neutral-500 font-bold text-xs uppercase mb-2">Top Pages / Fugas Secundarias</h4>
                   <p className="text-neutral-300 text-sm whitespace-pre-wrap">{seoMetrics.topPages || "N/A"}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
                   <h4 className="text-neutral-500 font-bold text-xs uppercase mb-2">Competencia</h4>
                   <p className="text-neutral-300 text-sm whitespace-pre-wrap">{seoMetrics.competitors || "N/A"}</p>
                </div>
              </div>

              {seoMetrics.socialTraffic && (
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-4">
                  <h4 className="text-blue-400 font-bold text-xs uppercase mb-1">Contexto Social (Meta/TikTok)</h4>
                  <p className="text-blue-100/80 text-sm">{seoMetrics.socialTraffic}</p>
                </div>
              )}

              {/* Teleprompter / Sales Pitch */}
              <div className="bg-linear-to-br from-yellow-500/10 to-transparent border border-yellow-500/50 rounded-2xl p-6 md:p-8 mt-8 shadow-inner relative">
                 <div className="absolute -top-3 left-6 bg-neutral-900 border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Quote size={12}/> The Pitch Injector
                 </div>
                 <div className="flex justify-end mb-4">
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(seoMetrics.insights);
                       setCopiedPitch(true);
                       setTimeout(() => setCopiedPitch(false), 2000);
                     }}
                     className="text-neutral-400 hover:text-yellow-500 flex items-center gap-1 text-xs font-bold bg-neutral-950 p-2 rounded-lg border border-neutral-800 transition-colors"
                   >
                     {copiedPitch ? <Check size={14}/> : <Copy size={14}/>}
                     {copiedPitch ? "Copiado" : "Copiar Texto"}
                   </button>
                 </div>
                 <p className="text-yellow-500/90 font-medium text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                   {seoMetrics.insights || "No hay pitch disponible. Edita las métricas para redactar el guion de venta consultiva."}
                 </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
              <div className="md:col-span-2">
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Resumen / Arquetipo (Summary)</label>
                <textarea 
                  placeholder="Ej: El Fantasma Digital. Sin tracción orgánica..."
                  value={seoMetrics.summary}
                  onChange={e => setSeoMetrics({ ...seoMetrics, summary: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Tráfico Orgánico Mensual</label>
                <textarea 
                  placeholder="Ej: 5.000 visitas/mes"
                  value={seoMetrics.traffic}
                  onChange={e => setSeoMetrics({ ...seoMetrics, traffic: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Valor Mensual del Tráfico (VMT / Cost)</label>
                <textarea 
                  placeholder="Ej: $3,500 en Ads"
                  value={seoMetrics.cost}
                  onChange={e => setSeoMetrics({ ...seoMetrics, cost: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Tráfico de Redes Sociales (Instagram/TikTok)</label>
                <textarea 
                  placeholder="Ej: 30% del tráfico viene de Meta. Atención ultra corta."
                  value={seoMetrics.socialTraffic}
                  onChange={e => setSeoMetrics({ ...seoMetrics, socialTraffic: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-base md:text-lg leading-relaxed outline-none focus:border-blue-500/50 min-h-[250px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Páginas o Keywords Top de Fuga</label>
                <textarea 
                  placeholder="Ej: Rankean por 'precio injerto', pero pierden leads ahí."
                  value={seoMetrics.topPages}
                  onChange={e => setSeoMetrics({ ...seoMetrics, topPages: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[400px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Competidores Directos</label>
                <textarea 
                  placeholder="Ej: Insparya y Capilclinic."
                  value={seoMetrics.competitors}
                  onChange={e => setSeoMetrics({ ...seoMetrics, competitors: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[400px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-neutral-400 text-sm mb-1 block font-bold">Insights Estratégicos para la Llamada</label>
                <textarea 
                  placeholder="Ej: Mencionar que el widget IA solucionará sus rebotes nocturnos."
                  value={seoMetrics.insights}
                  onChange={e => setSeoMetrics({ ...seoMetrics, insights: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[600px]"
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4 border-t border-neutral-800 mt-6">
                <button 
                  onClick={handleSaveMetrics}
                  disabled={savingMetrics || hasSaved}
                  className={`font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    hasSaved 
                      ? "bg-emerald-600 text-white" 
                      : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
                >
                  {hasSaved ? <Check size={18} /> : <Save size={18} />} 
                  {savingMetrics ? "Guardando..." : hasSaved ? "¡Guardado!" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "outreach" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="text-yellow-500"/> Historial de Contacto</h3>
            {clinic.outreachLogs?.length === 0 ? (
               <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center text-neutral-500">
                 No hay registros de contacto aún.
               </div>
            ) : (
               <div className="space-y-4">
                 {clinic.outreachLogs?.map((log: { id: string, status: string, createdAt: string | Date, nextStep: string | null }) => (
                   <div key={log.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex items-start justify-between gap-4 group">
                     <div className="flex items-start gap-4">
                       <div className="bg-neutral-800 p-2 rounded-lg text-yellow-500 shrink-0"><Check size={20}/></div>
                       <div>
                         <p className="font-bold text-white capitalize">{log.status} <span className="text-neutral-500 text-sm font-normal ml-2">{new Date(log.createdAt).toLocaleDateString()}</span></p>
                         <p className="text-neutral-400 mt-1">{log.nextStep || 'Sin próximos pasos anotados.'}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => handleDeleteLog(log.id)} 
                       className="text-neutral-600 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 hover:bg-neutral-800 rounded-lg shrink-0"
                       title="Borrar Log"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                 ))}
               </div>
            )}
          </div>
          
          <div>
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl sticky top-48">
              <h3 className="font-bold text-lg mb-4">Añadir Registro</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-neutral-400 text-sm mb-1 block">Fecha del contacto</label>
                  <input 
                    type="date"
                    value={contactDate}
                    onChange={e => setContactDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-yellow-500/50 scheme-dark"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-sm mb-1 block">Estado / Situación</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-yellow-500/50"
                  >
                  <option value="lead_generado">Lead Generado (Demo Enviada)</option>
                  <option value="contactado">Contactado</option>
                  <option value="reunion_agendada">Reunión Agendada</option>
                  <option value="negociando">Negociando</option>
                  <option value="cerrado">Cerrado / Ganado</option>
                  <option value="perdido">Perdido</option>
                </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-sm mb-1 block">¿Qué pasó en el contacto?</label>
                  <textarea 
                     placeholder="Anotaciones, llamadas enviadas, feedback..."
                     value={nextStep}
                     onChange={e => setNextStep(e.target.value)}
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-yellow-500/50 h-24 resize-none"
                  />
                </div>
                <button 
                  onClick={handleAddLog}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors shadow-lg"
                >
                  Guardar Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "config" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-8">
           <div>
             <h3 className="text-xl font-bold mb-3">Enlaces de la Clínica y Demo</h3>
             
             {/* Original URL Display */}
             {clinic.websites?.[0] && (
               <div className="mb-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                   <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">🔗 URL Original de la Clínica</p>
                   <a 
                     href={clinic.websites[0].url}
                     target="_blank"
                     rel="noreferrer"
                     className="block text-white font-mono text-sm opacity-90 truncate hover:text-yellow-500 hover:underline mt-1"
                   >
                     {clinic.websites[0].url}
                   </a>
                 </div>
                 <a 
                   href={clinic.websites[0].url} 
                   target="_blank" 
                   className="bg-neutral-800 text-white hover:bg-neutral-700 font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2 shrink-0"
                 >
                   Visitar Sitio <ExternalLink size={14}/>
                 </a>
               </div>
             )}

             <div className="flex items-center gap-4 bg-black border border-yellow-500/30 rounded-2xl p-4">
                <div className="flex-1 overflow-hidden">
                   <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-wider mb-1">🪄 Enlace Mágico de Demo (Local)</p>
                   <p className="text-yellow-500 font-mono text-sm truncate">{`${typeof window !== 'undefined' ? window.location.origin : ''}/demo/${clinic.slug || clinic.id}`}</p>
                </div>
                <a href={`/demo/${clinic.slug || clinic.id}`} target="_blank" className="bg-white text-black px-4 py-2 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2">
                  <ExternalLink size={16}/> Probar Hub
                </a>
             </div>

             <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                 <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">🌍 URL Real de Producción (Vercel)</p>
                 <a 
                   href={`https://demos.agentminds.io/${clinic.slug || clinic.id}`}
                   target="_blank"
                   rel="noreferrer"
                   className="block text-white font-mono text-sm opacity-90 truncate hover:text-yellow-500 hover:underline mt-1"
                 >
                   https://demos.agentminds.io/{clinic.slug || clinic.id}
                 </a>
               </div>
               <div className="flex items-center gap-2 shrink-0 mt-3 sm:mt-0">
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`https://demos.agentminds.io/${clinic.slug || clinic.id}`);
                     alert("¡URL de Producción copiada!");
                   }}
                   className="bg-neutral-900 border border-neutral-700 text-white hover:text-yellow-500 hover:border-yellow-500/30 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                 >
                   Copiar
                 </button>
                 <a 
                   href={`https://demos.agentminds.io/${clinic.slug || clinic.id}`} 
                   target="_blank" 
                   className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-1"
                 >
                   Visitar <ExternalLink size={14}/>
                 </a>
               </div>
             </div>

             <p className="text-neutral-500 text-xs py-2 mt-2">Este enlace Premium carga el menú &quot;Demo Hub&quot; para elegir entre Modos de IA.</p>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-neutral-800">Configuración de Marca</h3>
             {!editingColor ? (
               <div className="flex items-center justify-between gap-4 bg-neutral-900 border border-neutral-700 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-inner border border-neutral-700 cursor-pointer hover:scale-105 hover:ring-2 hover:ring-yellow-500/50 transition-all" 
                      style={{ backgroundColor: clinic.brandings?.[0]?.primaryColor || "#333" }}
                      onClick={() => {
                        const dbColor = clinic.brandings?.[0]?.primaryColor || "#000000";
                        const match = dbColor.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                        setTempColor(match ? match[0] : dbColor);
                        setEditingColor(true);
                      }}
                      title="Editar Color"
                    />
                    <div>
                       <p className="text-neutral-400 text-sm">Color Principal</p>
                       <code className="text-white font-mono">{clinic.brandings?.[0]?.primaryColor || "N/A"}</code>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const dbColor = clinic.brandings?.[0]?.primaryColor || "#000000";
                      const match = dbColor.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                      setTempColor(match ? match[0] : dbColor);
                      setEditingColor(true);
                    }}
                    className="text-neutral-400 hover:text-white px-4 py-2 border border-neutral-800 rounded-xl transition-colors text-sm font-medium"
                  >
                    Editar
                  </button>
               </div>
             ) : (
               <div className="bg-neutral-950 border border-yellow-500/50 rounded-2xl p-6 space-y-6">
                  <div>
                    <p className="text-yellow-500 text-sm font-bold mb-3">Elige un color predefinido elegante:</p>
                    <div className="flex flex-wrap gap-3">
                      {["#1a4b8c", "#0C344A", "#C0030A", "#047573", "#B8935E", "#E3B39F", "#343434", "#211D18"].map(c => (
                        <button
                           key={c}
                           onClick={() => setTempColor(c)}
                           className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${tempColor.toLowerCase() === c.toLowerCase() ? 'border-yellow-500 scale-110' : 'border-transparent'}`}
                           style={{ backgroundColor: c }}
                           title={c}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-neutral-800 pt-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-neutral-400 text-sm mb-2">O crea un color a medida:</p>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            value={tempColor} 
                            onChange={(e) => setTempColor(e.target.value)} 
                            className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                          />
                          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2 relative">
                            <span className="text-neutral-500 font-bold ml-2">HEX</span>
                            <input 
                              type="text" 
                              value={tempColor} 
                              onChange={(e) => {
                                const match = e.target.value.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                                setTempColor(match ? match[0] : e.target.value);
                              }} 
                              className="bg-transparent text-white font-mono outline-none w-32 sm:w-64 pl-1 truncate" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingColor(false)} 
                        className="text-neutral-400 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors border border-neutral-800 hover:bg-neutral-800 rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSaveColor} 
                        className="bg-yellow-500 text-black px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                      >
                        Guardar Color
                      </button>
                    </div>
                  </div>
               </div>
             )}
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-neutral-800 flex items-center gap-2">
                <Target size={20} className="text-blue-500" /> Posición del Widget (Chat y Voz)
             </h3>
             <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                  <p className="text-neutral-400 text-sm mb-2">Para no solapar con el icono local de WhatsApp de tu cliente si lo tiene:</p>
                  <select 
                    value={widgetPosition} 
                    onChange={e => setWidgetPosition(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full md:w-1/2"
                  >
                    <option value="right">Botón a la Derecha</option>
                    <option value="left">Botón a la Izquierda</option>
                  </select>
               </div>
               <div className="flex justify-end relative z-10">
                 <button 
                   onClick={handleSavePosition} 
                   disabled={savingPosition || hasSavedPosition}
                   className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 border disabled:opacity-80 ${
                     hasSavedPosition 
                       ? "bg-emerald-600 text-white border-emerald-500" 
                       : "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-yellow-500"
                   }`}
                 >
                   {hasSavedPosition ? <Check size={16} /> : <Save size={16} />}
                   {savingPosition ? "Guardando..." : hasSavedPosition ? "¡Guardado!" : "Guardar Posición"}
                 </button>
               </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-neutral-800 flex items-center gap-2">
                <Video size={20} className="text-pink-500" /> Video Demo (Opcional)
             </h3>
             <div className="bg-pink-950/10 border border-pink-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                 <p className="text-neutral-400 text-sm mb-2">URL del vídeo que vas a mostrar (YouTube / Loom / Vimeo)</p>
                 <input 
                   type="url" 
                   value={videoUrl} 
                   onChange={(e) => setVideoUrl(e.target.value)} 
                   placeholder="https://www.youtube.com/embed/..."
                   className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full font-mono text-sm" 
                 />
               </div>
               <div className="flex items-center justify-between relative z-10">
                 {videoUrl && (
                   <a href={videoUrl} target="_blank" rel="noreferrer" className="text-xs text-yellow-500 truncate hover:underline flex items-center gap-1">
                     <ExternalLink size={12}/> Probar Enlace
                   </a>
                 )}
                 {!videoUrl && <span />}
                 <button 
                   onClick={handleSaveVideo} 
                   disabled={savingVideo || hasSavedVideo}
                   className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 border disabled:opacity-80 ${
                     hasSavedVideo 
                       ? "bg-emerald-600 text-white border-emerald-500" 
                       : "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-yellow-500"
                   }`}
                 >
                   {hasSavedVideo ? <Check size={16} /> : <Save size={16} />}
                   {savingVideo ? "Guardando..." : hasSavedVideo ? "¡Guardado!" : "Guardar Video"}
                 </button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
