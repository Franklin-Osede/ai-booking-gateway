"use client";

import { useEffect, useState, use } from "react";
import { Check, MessageSquare, Briefcase, MapPin, Building2, ExternalLink, Trash2, BarChart3, Save } from "lucide-react";

export default function ClinicDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"config" | "metrics" | "outreach">("config");
  
  // Forms
  const [status, setStatus] = useState("contactado");
  const [nextStep, setNextStep] = useState("");
  const [contactDate, setContactDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingColor, setEditingColor] = useState(false);
  const [tempColor, setTempColor] = useState("#ffffff");
  const [videoUrl, setVideoUrl] = useState("");
  const [editingVideo, setEditingVideo] = useState(false);
  const [seoMetrics, setSeoMetrics] = useState({ traffic: "", cost: "", topPages: "", competitors: "", socialTraffic: "", insights: "" });
  const [savingMetrics, setSavingMetrics] = useState(false);

  const fetchClinic = () => {
    fetch(`/api/clinics/${unwrappedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClinic(data.data);
          if (data.data.videoUrl) setVideoUrl(data.data.videoUrl);
          if (data.data.seoMetrics) setSeoMetrics(data.data.seoMetrics);
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
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl }),
    });
    setEditingVideo(false);
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
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/20 p-3 rounded-xl text-green-500"><BarChart3 size={24} /></div>
            <div>
              <h3 className="text-xl font-bold">Investigación & Métricas (Ahrefs/SEMrush)</h3>
              <p className="text-neutral-400 text-sm">Recoge datos clave aquí para deslumbrar en la llamada de ventas.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Tráfico Orgánico Mensual</label>
              <input 
                type="text" 
                placeholder="Ej: 5.000 visitas/mes"
                value={seoMetrics.traffic}
                onChange={e => setSeoMetrics({ ...seoMetrics, traffic: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Valor Mensual del Tráfico (VMT / Cost)</label>
              <input 
                type="text" 
                placeholder="Ej: $3,500 en Ads"
                value={seoMetrics.cost}
                onChange={e => setSeoMetrics({ ...seoMetrics, cost: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-green-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Tráfico de Redes Sociales (Instagram/TikTok)</label>
              <input 
                type="text" 
                placeholder="Ej: 30% del tráfico viene de Meta. Atención ultra corta."
                value={seoMetrics.socialTraffic}
                onChange={e => setSeoMetrics({ ...seoMetrics, socialTraffic: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Páginas o Keywords Top de Fuga</label>
              <textarea 
                placeholder="Ej: Rankean por 'precio injerto', pero pierden leads ahí."
                value={seoMetrics.topPages}
                onChange={e => setSeoMetrics({ ...seoMetrics, topPages: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[160px]"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Competidores Directos</label>
              <textarea 
                placeholder="Ej: Insparya y Capilclinic."
                value={seoMetrics.competitors}
                onChange={e => setSeoMetrics({ ...seoMetrics, competitors: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[160px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-neutral-400 text-sm mb-1 block font-bold">Insights Estratégicos para la Llamada</label>
              <textarea 
                placeholder="Ej: Mencionar que el widget IA solucionará sus rebotes nocturnos."
                value={seoMetrics.insights}
                onChange={e => setSeoMetrics({ ...seoMetrics, insights: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-green-500/50 min-h-[220px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-800 mt-6">
            <button 
              onClick={handleSaveMetrics}
              disabled={savingMetrics}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg flex items-center gap-2"
            >
              <Save size={18} /> {savingMetrics ? "Guardando..." : "Guardar Métricas"}
            </button>
          </div>
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
               <div className="flex items-center justify-between gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
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
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-neutral-800">Video Demo (Opcional)</h3>
             {!editingVideo ? (
               <div className="flex items-center justify-between gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
                  <div className="flex flex-col gap-1 overflow-hidden">
                     <p className="text-neutral-400 text-sm">URL Unlisted (YouTube/Loom/etc)</p>
                     <a href={clinic.videoUrl || "#"} target="_blank" className="text-white font-mono text-xs truncate hover:text-yellow-500">{clinic.videoUrl || "Sin video configurado"}</a>
                  </div>
                  <button 
                    onClick={() => {
                      setVideoUrl(clinic.videoUrl || "");
                      setEditingVideo(true);
                    }}
                    className="text-neutral-400 hover:text-white px-4 py-2 border border-neutral-800 rounded-xl transition-colors text-sm font-medium shrink-0"
                  >
                    Editar
                  </button>
               </div>
             ) : (
               <div className="bg-neutral-950 border border-yellow-500/50 rounded-2xl p-6 space-y-6">
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">Pega la URL del vídeo a pantalla completa que quieres mostrar en The Pitch Modal:</p>
                    <input 
                      type="url" 
                      value={videoUrl} 
                      onChange={(e) => setVideoUrl(e.target.value)} 
                      placeholder="https://www.youtube.com/embed/..."
                      className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full" 
                    />
                  </div>
                  <div className="flex gap-3 justify-end border-t border-neutral-800 pt-6">
                    <button 
                      onClick={() => setEditingVideo(false)} 
                      className="text-neutral-400 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors border border-neutral-800 hover:bg-neutral-800 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSaveVideo} 
                      className="bg-yellow-500 text-black px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                      Guardar Video
                    </button>
                  </div>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
