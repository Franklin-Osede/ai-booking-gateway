"use client";

import { useEffect, useState, use } from "react";
import { Check, MessageSquare, Briefcase, MapPin, Building2, ExternalLink, Trash2 } from "lucide-react";

export default function ClinicDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"config" | "outreach">("config");
  
  // Forms
  const [status, setStatus] = useState("contactado");
  const [nextStep, setNextStep] = useState("");
  const [contactDate, setContactDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingColor, setEditingColor] = useState(false);
  const [tempColor, setTempColor] = useState("#ffffff");

  const fetchClinic = () => {
    fetch(`/api/clinics/${unwrappedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setClinic(data.data);
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
            onClick={() => setTab("outreach")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "outreach" ? "border-yellow-500 text-yellow-500" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Historial Comercial
          </button>
        </div>
      </div>

      {/* Content */}
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
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-yellow-500/50 [color-scheme:dark]"
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
             <h3 className="text-xl font-bold mb-3">Enlace Mágico Universitario</h3>
             <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
                <div className="flex-1 overflow-hidden">
                   <p className="text-yellow-500 font-mono text-sm truncate">{`${typeof window !== 'undefined' ? window.location.origin : ''}/demo/${clinic.slug || clinic.id}`}</p>
                </div>
                <a href={`/demo/${clinic.slug || clinic.id}`} target="_blank" className="bg-white text-black px-4 py-2 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2">
                  <ExternalLink size={16}/> Probar Hub Completo
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
                      className="w-12 h-12 rounded-xl shadow-inner border border-neutral-700" 
                      style={{ backgroundColor: clinic.brandings?.[0]?.primaryColor || "#333" }}
                    />
                    <div>
                       <p className="text-neutral-400 text-sm">Color Principal</p>
                       <code className="text-white font-mono">{clinic.brandings?.[0]?.primaryColor || "N/A"}</code>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setTempColor(clinic.brandings?.[0]?.primaryColor || "#000000");
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
                              onChange={(e) => setTempColor(e.target.value)} 
                              className="bg-transparent text-white font-mono outline-none w-24 pl-1" 
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
        </div>
      )}
    </div>
  );
}
