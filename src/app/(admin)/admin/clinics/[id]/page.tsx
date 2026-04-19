"use client";

import { useEffect, useState, use } from "react";
import { Check, MessageSquare, Briefcase, MapPin, Building2, ExternalLink, Trash2, BarChart3, Save, ArrowLeft, Target, Activity, TrendingDown, Quote, Copy, Edit2, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClinicDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"config" | "metrics" | "outreach" | "tech">("config");
  const router = useRouter();
  
  // Forms
  const [status, setStatus] = useState("contactado");
  const [channel, setChannel] = useState("email");
  const [nextStep, setNextStep] = useState("");
  const [contactDate, setContactDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingColor, setEditingColor] = useState(false);
  const [tempColor, setTempColor] = useState("#ffffff");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [hasSavedVideo, setHasSavedVideo] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [savingSiteUrl, setSavingSiteUrl] = useState(false);
  const [hasSavedSiteUrl, setHasSavedSiteUrl] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState("right");
  const [savingPosition, setSavingPosition] = useState(false);
  const [hasSavedPosition, setHasSavedPosition] = useState(false);
  
  const [language, setLanguage] = useState("es-ES");
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [hasSavedLanguage, setHasSavedLanguage] = useState(false);

  // Publish Demo Snapshot State
  const [publishingDemo, setPublishingDemo] = useState(false);
  const [hasPublishedDemo, setHasPublishedDemo] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [seoMetrics, setSeoMetrics] = useState({ summary: "", traffic: "", cost: "", topPages: "", competitors: "", socialTraffic: "", insights: "" });
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [isSavingLog, setIsSavingLog] = useState(false);
  
  // Tech Metrics Form
  const [techMetrics, setTechMetrics] = useState({ pageSpeedStatus: "", frogErrors: "", techPitch: "" });
  const [savingTechMetrics, setSavingTechMetrics] = useState(false);
  const [hasSavedTech, setHasSavedTech] = useState(false);
  const [isEditingTechMetrics, setIsEditingTechMetrics] = useState(false);

  const fetchClinic = () => {
    fetch(`/api/clinics/${unwrappedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClinic(data.data);
          setSiteUrl(data.data.websites?.[0]?.url || "");
          if (data.data.videoUrl) setVideoUrl(data.data.videoUrl);
          if (data.data.seoMetrics) setSeoMetrics(data.data.seoMetrics);
          if (data.data.techMetrics) setTechMetrics(data.data.techMetrics);
          if (data.data.widgetPosition) setWidgetPosition(data.data.widgetPosition);
          if (data.data.countryCode) {
            const cc = String(data.data.countryCode).toLowerCase();
            if (cc === "en" || cc.startsWith("en-") || cc === "gb" || cc === "uk" || cc === "us") {
              setLanguage((cc === "en-us" || cc === "us") ? "en-US" : "en-GB");
            } else {
              setLanguage("es-ES");
            }
          }
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClinic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unwrappedParams.id]);

  const handleAddLog = async () => {
    if (!status || isSavingLog) return;
    setIsSavingLog(true);
    await fetch(`/api/clinics/${unwrappedParams.id}/outreach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, nextStep, channel, contactDate }),
    });
    setNextStep("");
    setIsSavingLog(false);
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

  const handleSaveSiteUrl = async () => {
    if (!siteUrl || savingSiteUrl) return;
    setSavingSiteUrl(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteUrl }),
    });
    setSavingSiteUrl(false);
    setHasSavedSiteUrl(true);
    setTimeout(() => setHasSavedSiteUrl(false), 3000);
    fetchClinic();
  };

  const handlePublishDemo = async () => {
    if (publishingDemo) return;
    setPublishingDemo(true);
    setPublishError("");
    try {
      const res = await fetch(`/api/clinics/${unwrappedParams.id}/publish`, {
        method: "POST"
      });
      const data = await res.json();
      if (!data.success) {
        setPublishError(data.error || "Error desconocido al publicar.");
      } else {
        setHasPublishedDemo(true);
        setTimeout(() => setHasPublishedDemo(false), 3000);
      }
    } catch {
      setPublishError("Fallo de red al intentar publicar.");
    } finally {
      setPublishingDemo(false);
    }
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

  const handleSaveLanguage = async () => {
    setSavingLanguage(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode: language }),
    });
    setSavingLanguage(false);
    setHasSavedLanguage(true);
    setTimeout(() => setHasSavedLanguage(false), 3000);
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

  const handleSaveTechMetrics = async () => {
    setSavingTechMetrics(true);
    await fetch(`/api/clinics/${unwrappedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ techMetrics }),
    });
    setSavingTechMetrics(false);
    setHasSavedTech(true);
    setTimeout(() => setHasSavedTech(false), 3000);
    fetchClinic();
  };

  const handleDeleteLog = async (logId: string) => {
    await fetch(`/api/outreach/${logId}`, { method: "DELETE" });
    fetchClinic();
  };

  if (loading) return <div className="text-muted-foreground py-10">Cargando detalles de la clínica...</div>;
  if (!clinic) return <div className="text-red-500 py-10">Clínica no encontrada.</div>;

  return (
    <div className="space-y-8">
      {/* Botón Volver */}
      <div>
        <button 
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm bg-card border border-border px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={16} /> Volver a Clínicas
        </button>
      </div>

      {/* Header */}
      <div className="bg-card border border-border rounded-3xl p-8 sticky top-0 z-10 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-yellow-500 shadow-inner">
               <Building2 size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-bold">{clinic.name}</h1>
               <div className="flex gap-4 mt-2 text-muted-foreground font-medium">
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
        <div className="flex gap-6 mt-8 border-b border-border">
          <button 
            onClick={() => setTab("config")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "config" ? "border-yellow-500 text-yellow-500" : "border-transparent text-muted-foreground hover:text-muted-foreground"}`}
          >
            Configuración de IA
          </button>
          <button 
            onClick={() => setTab("metrics")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "metrics" ? "border-green-500 text-green-500" : "border-transparent text-muted-foreground hover:text-muted-foreground"}`}
          >
            Métricas (Research)
          </button>
          <button 
            onClick={() => setTab("tech")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "tech" ? "border-blue-500 text-blue-500" : "border-transparent text-muted-foreground hover:text-muted-foreground"}`}
          >
            Tech & CRO (Frog)
          </button>
          <button 
            onClick={() => setTab("outreach")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${tab === "outreach" ? "border-yellow-500 text-yellow-500" : "border-transparent text-muted-foreground hover:text-muted-foreground"}`}
          >
            Historial Comercial
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === "metrics" && (
        <div className="bg-card border border-green-500/30 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl text-green-500"><BarChart3 size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Dossier Táctico 
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md uppercase tracking-wider">Sales Intelligence</span>
                </h3>
                <p className="text-muted-foreground text-sm">Inteligencia en tiempo real para tu llamada consultiva.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingMetrics(!isEditingMetrics)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isEditingMetrics ? 'bg-muted border-border text-foreground' : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {isEditingMetrics ? <><Check size={16}/> Ver Dossier</> : <><Edit2 size={16}/> Editar Datos</>}
            </button>
          </div>

          {!isEditingMetrics ? (
            <div className="space-y-6">
              {/* Arquetipo Header */}
              <div className="bg-muted border border-green-500/30 relative overflow-hidden rounded-2xl p-6 shadow-2xl group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-green-500 rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Target size={120}/></div>
                <h4 className="text-green-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-3">
                   <Target size={14}/> Diagnóstico & Arquetipo
                </h4>
                <p className="text-foreground text-lg md:text-xl leading-relaxed font-medium relative z-10">
                  {seoMetrics.summary || "Sin análisis de arquetipo disponible. Edita los datos para añadirlo."}
                </p>
              </div>

              {/* Grid 2x2 Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6 hover:border-yellow-500/30 transition-colors">
                  <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3 flex items-center gap-2"><Activity size={16} className="text-yellow-500"/> Tráfico Orgánico Mensual</h4>
                  <p className="text-foreground text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">{seoMetrics.traffic || "N/A"}</p>
                </div>
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                   <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3 flex items-center gap-2"><TrendingDown size={16} className="text-red-500"/> Coste de Oportunidad / Fuga</h4>
                   <p className="text-foreground text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">{seoMetrics.cost || "N/A"}</p>
                </div>
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6">
                   <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3">Top Pages / Fugas Secundarias</h4>
                   <p className="text-foreground/90 font-medium text-base md:text-lg whitespace-pre-wrap leading-relaxed">{seoMetrics.topPages || "N/A"}</p>
                </div>
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6">
                   <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3">Competencia</h4>
                   <p className="text-foreground/90 font-medium text-base md:text-lg whitespace-pre-wrap leading-relaxed">{seoMetrics.competitors || "N/A"}</p>
                </div>
              </div>

              {seoMetrics.socialTraffic && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                  <h4 className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Contexto Social (Meta/TikTok)</h4>
                  <p className="text-foreground text-sm">{seoMetrics.socialTraffic}</p>
                </div>
              )}

              {/* Teleprompter / Sales Pitch */}
              <div className="bg-linear-to-br from-yellow-500/10 to-transparent border border-yellow-500/50 rounded-2xl p-6 md:p-8 mt-8 shadow-inner relative">
                 <div className="absolute -top-3 left-6 bg-card border border-yellow-500/50 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Quote size={12}/> The Pitch Injector
                 </div>
                 <div className="flex justify-end mb-4">
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(seoMetrics.insights);
                       setCopiedPitch(true);
                       setTimeout(() => setCopiedPitch(false), 2000);
                     }}
                     className="text-muted-foreground hover:text-yellow-500 flex items-center gap-1 text-xs font-bold bg-muted p-2 rounded-lg border border-border transition-colors"
                   >
                     {copiedPitch ? <Check size={14}/> : <Copy size={14}/>}
                     {copiedPitch ? "Copiado" : "Copiar Texto"}
                   </button>
                 </div>
                 <p className="text-yellow-600 dark:text-yellow-500/90 font-medium text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                   {seoMetrics.insights || "No hay pitch disponible. Edita las métricas para redactar el guion de venta consultiva."}
                 </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
              <div className="md:col-span-2">
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Resumen / Arquetipo (Summary)</label>
                <textarea 
                  placeholder="Ej: El Fantasma Digital. Sin tracción orgánica..."
                  value={seoMetrics.summary}
                  onChange={e => setSeoMetrics({ ...seoMetrics, summary: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Tráfico Orgánico Mensual</label>
                <textarea 
                  placeholder="Ej: 5.000 visitas/mes"
                  value={seoMetrics.traffic}
                  onChange={e => setSeoMetrics({ ...seoMetrics, traffic: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Valor Mensual del Tráfico (VMT / Cost)</label>
                <textarea 
                  placeholder="Ej: $3,500 en Ads"
                  value={seoMetrics.cost}
                  onChange={e => setSeoMetrics({ ...seoMetrics, cost: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-green-500/50 min-h-[300px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Tráfico de Redes Sociales (Instagram/TikTok)</label>
                <textarea 
                  placeholder="Ej: 30% del tráfico viene de Meta. Atención ultra corta."
                  value={seoMetrics.socialTraffic}
                  onChange={e => setSeoMetrics({ ...seoMetrics, socialTraffic: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-blue-500/50 min-h-[250px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Páginas o Keywords Top de Fuga</label>
                <textarea 
                  placeholder="Ej: Rankean por 'precio injerto', pero pierden leads ahí."
                  value={seoMetrics.topPages}
                  onChange={e => setSeoMetrics({ ...seoMetrics, topPages: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground outline-none focus:border-green-500/50 min-h-[400px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Competidores Directos</label>
                <textarea 
                  placeholder="Ej: Insparya y Capilclinic."
                  value={seoMetrics.competitors}
                  onChange={e => setSeoMetrics({ ...seoMetrics, competitors: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground outline-none focus:border-green-500/50 min-h-[400px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Insights Estratégicos para la Llamada</label>
                <textarea 
                  placeholder="Ej: Mencionar que el widget IA solucionará sus rebotes nocturnos."
                  value={seoMetrics.insights}
                  onChange={e => setSeoMetrics({ ...seoMetrics, insights: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground outline-none focus:border-green-500/50 min-h-[600px]"
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4 border-t border-border mt-6">
                <button 
                  onClick={handleSaveMetrics}
                  disabled={savingMetrics || hasSaved}
                  className={`font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    hasSaved 
                      ? "bg-emerald-600 text-foreground" 
                      : "bg-green-600 hover:bg-green-500 text-foreground"
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

      {tab === "tech" && (
        <div className="bg-card border border-blue-500/30 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500"><Activity size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Auditoría de Fricción 
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md uppercase tracking-wider">Tech & CRO</span>
                </h3>
                <p className="text-muted-foreground text-sm">Resumen de Screaming Frog y PageSpeed Insights.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingTechMetrics(!isEditingTechMetrics)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isEditingTechMetrics ? 'bg-muted border-border text-foreground' : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {isEditingTechMetrics ? <><Check size={16}/> Ver Informe</> : <><Edit2 size={16}/> Editar Datos</>}
            </button>
          </div>

          {!isEditingTechMetrics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6">
                  <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> PageSpeed & Carga Móvil</h4>
                  <p className="text-foreground text-base md:text-lg whitespace-pre-wrap leading-relaxed">{techMetrics.pageSpeedStatus || "N/A"}</p>
                </div>
                <div className="bg-muted shadow-sm border border-border rounded-2xl p-6">
                   <h4 className="text-muted-foreground font-bold text-sm uppercase mb-3 flex items-center gap-2"><Target size={16} className="text-red-500"/> Alertas Screaming Frog (404s/Lentitud)</h4>
                   <p className="text-foreground text-base md:text-lg whitespace-pre-wrap leading-relaxed">{techMetrics.frogErrors || "N/A"}</p>
                </div>
              </div>

              {/* Pitch */}
              <div className="bg-linear-to-br from-blue-500/10 to-transparent border border-blue-500/50 rounded-2xl p-6 md:p-8 mt-8 shadow-inner relative">
                 <div className="absolute -top-3 left-6 bg-card border border-blue-500/50 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Quote size={12}/> The Tech Closer Pitch
                 </div>
                 <p className="text-blue-600 dark:text-blue-400 font-medium text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                   {techMetrics.techPitch || "Sube datos técnicos para generar el pitch de fricción comercial."}
                 </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-4">
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Estado de PageSpeed Insights (Móvil)</label>
                <textarea 
                  placeholder="Ej: LCP de 5s. La mitad de los pacientes se van antes de ver la web."
                  value={techMetrics.pageSpeedStatus}
                  onChange={e => setTechMetrics({ ...techMetrics, pageSpeedStatus: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-blue-500/50 min-h-[150px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Alertas de Screaming Frog</label>
                <textarea 
                  placeholder="Ej: La URL de Implantes sufre cadenas de redirecciones, ralentizando la conversión."
                  value={techMetrics.frogErrors}
                  onChange={e => setTechMetrics({ ...techMetrics, frogErrors: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-blue-500/50 min-h-[150px]"
                />
              </div>
              <div>
                <label className="text-muted-foreground text-sm mb-1 block font-bold">Traducción Comercial a Ventas (Pitch)</label>
                <textarea 
                  placeholder="Ej: Tu web es un Ferrari con el freno puesto, necesitas la IA saltando casi de inmediato para retenerlos..."
                  value={techMetrics.techPitch}
                  onChange={e => setTechMetrics({ ...techMetrics, techPitch: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-foreground text-base md:text-lg leading-relaxed outline-none focus:border-blue-500/50 min-h-[250px]"
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border mt-6">
                <button 
                  onClick={handleSaveTechMetrics}
                  disabled={savingTechMetrics || hasSavedTech}
                  className={`font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    hasSavedTech 
                      ? "bg-emerald-600 text-foreground" 
                      : "bg-blue-600 hover:bg-blue-500 text-foreground"
                  }`}
                >
                  {hasSavedTech ? <Check size={18} /> : <Save size={18} />} 
                  {savingTechMetrics ? "Guardando..." : hasSavedTech ? "¡Guardado!" : "Guardar Ficha Tech"}
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
               <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">
                 No hay registros de contacto aún.
               </div>
            ) : (
               <div className="space-y-4">
                 {clinic.outreachLogs?.map((log: { id: string, status: string, channel: string | null, createdAt: string | Date, nextStep: string | null }) => (
                   <div key={log.id} className="bg-card border border-border p-5 rounded-2xl flex items-start justify-between gap-4 group">
                     <div className="flex items-start gap-4">
                       <div className="bg-muted p-2 rounded-lg text-yellow-500 shrink-0"><Check size={20}/></div>
                       <div>
                         <p className="font-bold text-foreground capitalize">
                           {log.status} 
                           {log.channel && <span className="text-yellow-500 ml-2">[{log.channel}]</span>}
                           <span className="text-muted-foreground text-sm font-normal ml-2">{new Date(log.createdAt).toLocaleDateString()}</span>
                         </p>
                         <p className="text-muted-foreground mt-1">{log.nextStep || 'Sin próximos pasos anotados.'}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => handleDeleteLog(log.id)} 
                       className="text-muted-foreground hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 hover:bg-muted rounded-lg shrink-0"
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
            <div className="bg-card border border-border p-6 rounded-3xl sticky top-48">
              <h3 className="font-bold text-lg mb-4">Añadir Registro</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Fecha del contacto</label>
                  <input 
                    type="date"
                    value={contactDate}
                    onChange={e => setContactDate(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl p-3 text-foreground outline-none focus:border-yellow-500/50 scheme-dark"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Estado / Situación</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl p-3 text-foreground outline-none focus:border-yellow-500/50"
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
                  <label className="text-muted-foreground text-sm mb-1 block">Canal de Contacto</label>
                  <select 
                    value={channel} 
                    onChange={e => setChannel(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl p-3 text-foreground outline-none focus:border-yellow-500/50"
                  >
                  <option value="email">Email</option>
                  <option value="telefono">Teléfono</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram / RRSS</option>
                </select>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">¿Qué pasó en el contacto?</label>
                  <textarea 
                     placeholder="Anotaciones, llamadas enviadas, feedback..."
                     value={nextStep}
                     onChange={e => setNextStep(e.target.value)}
                     className="w-full bg-muted border border-border rounded-xl p-3 text-foreground outline-none focus:border-yellow-500/50 h-24 resize-none"
                  />
                </div>
                <button 
                  onClick={handleAddLog}
                  disabled={isSavingLog || !status}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-background font-bold py-3 rounded-xl transition-colors shadow-lg"
                >
                  {isSavingLog ? "Guardando..." : "Guardar Log"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "config" && (
        <div className="bg-card border border-border rounded-3xl p-8 space-y-8">
           <div>
             <h3 className="text-xl font-bold mb-3">Enlaces de la Clínica y Demo</h3>
             
             <div className="mb-4 bg-muted border border-border rounded-2xl p-4 space-y-3">
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">🔗 URL Original de la Clínica</p>
               <div className="flex flex-col sm:flex-row gap-3">
                 <input
                   type="url"
                   value={siteUrl}
                   onChange={(e) => setSiteUrl(e.target.value)}
                   placeholder="https://wmglondon.com"
                   className="flex-1 bg-card border border-border text-foreground p-3 rounded-xl outline-none focus:border-yellow-500/50 font-mono text-sm"
                 />
                 <button
                   onClick={handleSaveSiteUrl}
                   disabled={savingSiteUrl || hasSavedSiteUrl || !siteUrl}
                   className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 border disabled:opacity-80 ${
                     hasSavedSiteUrl
                       ? "bg-emerald-600 text-foreground border-emerald-500"
                       : "bg-muted text-foreground border-border hover:bg-muted hover:text-yellow-500"
                   }`}
                 >
                   {hasSavedSiteUrl ? <Check size={16} /> : <Save size={16} />}
                   {savingSiteUrl ? "Guardando..." : hasSavedSiteUrl ? "¡Guardado!" : "Guardar URL"}
                 </button>
                 {siteUrl && (
                   <a
                     href={siteUrl}
                     target="_blank"
                     rel="noreferrer"
                     className="bg-muted text-foreground hover:bg-muted font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2 justify-center shrink-0"
                   >
                     Visitar Sitio <ExternalLink size={14}/>
                   </a>
                 )}
               </div>
             </div>

             <div className="flex items-center gap-4 bg-background border border-yellow-500/30 rounded-2xl p-4">
                <div className="flex-1 overflow-hidden">
                   <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-wider mb-1">🪄 Enlace Mágico de Demo (Local)</p>
                   <p className="text-yellow-500 font-mono text-sm truncate">{`${typeof window !== 'undefined' ? window.location.origin : ''}/demo/${clinic.slug || clinic.id}`}</p>
                </div>
                <a href={`/demo/${clinic.slug || clinic.id}`} target="_blank" className="bg-foreground text-background px-4 py-2 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2">
                  <ExternalLink size={16}/> Probar Hub
                </a>
             </div>

             <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">🌍 URL Real de Producción (Vercel)</p>
                 <a 
                   href={`https://demos.agentminds.io/${clinic.slug || clinic.id}`}
                   target="_blank"
                   rel="noreferrer"
                   className="block text-foreground font-mono text-sm opacity-90 truncate hover:text-yellow-500 hover:underline mt-1"
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
                   className="bg-card border border-border text-foreground hover:text-yellow-500 hover:border-yellow-500/30 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                 >
                   Copiar
                 </button>
                 <a 
                   href={`https://demos.agentminds.io/${clinic.slug || clinic.id}`} 
                   target="_blank" 
                   className="bg-yellow-500 text-background hover:bg-yellow-400 font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-1"
                 >
                   Visitar <ExternalLink size={14}/>
                 </a>
               </div>
             </div>

             <p className="text-muted-foreground text-xs py-2 mt-2">Este enlace Premium carga el menú &quot;Demo Hub&quot; para elegir entre Modos de IA.</p>
             
             {/* Boton de Publicar Snapshot */}
             <div className="bg-linear-to-r from-emerald-950/20 to-transparent border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden mt-6">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                 <Activity size={100} />
               </div>
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
                      <Save size={18}/> Actualizar Demo en Producción
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                      Guarda y publica instantáneamente todos tus cambios (Color, Dominio, Idioma) en el entorno público inmutable. 
                      Si falla el dominio, se degradará al Modo Seguro.
                    </p>
                  </div>
                  <button
                    onClick={handlePublishDemo}
                    disabled={publishingDemo}
                    className="bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 shrink-0"
                  >
                    {publishingDemo ? "Publicando..." : (hasPublishedDemo ? "¡Publicado!" : "Publicar Versión Demo")}
                  </button>
               </div>
               {publishError && <p className="text-red-500 text-sm font-semibold mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{publishError}</p>}
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-border">Configuración de Marca</h3>
             {!editingColor ? (
               <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-inner border border-border cursor-pointer hover:scale-105 hover:ring-2 hover:ring-yellow-500/50 transition-all" 
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
                       <p className="text-muted-foreground text-sm">Color Principal</p>
                       <code className="text-foreground font-mono">{clinic.brandings?.[0]?.primaryColor || "N/A"}</code>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const dbColor = clinic.brandings?.[0]?.primaryColor || "#000000";
                      const match = dbColor.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                      setTempColor(match ? match[0] : dbColor);
                      setEditingColor(true);
                    }}
                    className="text-muted-foreground hover:text-foreground px-4 py-2 border border-border rounded-xl transition-colors text-sm font-medium"
                  >
                    Editar
                  </button>
               </div>
             ) : (
               <div className="bg-muted border border-yellow-500/50 rounded-2xl p-6 space-y-6">
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

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-border pt-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">O crea un color a medida:</p>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            value={tempColor} 
                            onChange={(e) => setTempColor(e.target.value)} 
                            className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                          />
                          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2 relative">
                            <span className="text-muted-foreground font-bold ml-2">HEX</span>
                            <input 
                              type="text" 
                              value={tempColor} 
                              onChange={(e) => {
                                const match = e.target.value.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
                                setTempColor(match ? match[0] : e.target.value);
                              }} 
                              className="bg-transparent text-foreground font-mono outline-none w-32 sm:w-64 pl-1 truncate" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingColor(false)} 
                        className="text-muted-foreground hover:text-foreground px-5 py-2.5 text-sm font-medium transition-colors border border-border hover:bg-muted rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSaveColor} 
                        className="bg-yellow-500 text-background px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                      >
                        Guardar Color
                      </button>
                    </div>
                  </div>
               </div>
             )}
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-border flex items-center gap-2">
                <Target size={20} className="text-blue-500" /> Posición del Widget (Chat y Voz)
             </h3>
             <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                  <p className="text-muted-foreground text-sm mb-2">Para no solapar con el icono local de WhatsApp de tu cliente si lo tiene:</p>
                  <select 
                    value={widgetPosition} 
                    onChange={e => setWidgetPosition(e.target.value)}
                    className="bg-card border border-border text-foreground p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full md:w-1/2"
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
                       ? "bg-emerald-600 text-foreground border-emerald-500" 
                       : "bg-muted text-foreground border-border hover:bg-muted hover:text-yellow-500"
                   }`}
                 >
                   {hasSavedPosition ? <Check size={16} /> : <Save size={16} />}
                   {savingPosition ? "Guardando..." : hasSavedPosition ? "¡Guardado!" : "Guardar Posición"}
                 </button>
               </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-border flex items-center gap-2">
                <MessageSquare size={20} className="text-green-500" /> Idioma / Locale Principal (Widget)
             </h3>
             <div className="bg-green-950/20 border border-green-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                  <p className="text-muted-foreground text-sm mb-2">Selecciona el locale oficial para Voz y Chat:</p>
                  <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                    className="bg-card border border-border text-foreground p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full md:w-1/2"
                  >
                    <option value="es-ES">Español (España)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="en-US">English (United States)</option>
                  </select>
               </div>
               <div className="flex justify-end relative z-10">
                 <button 
                   onClick={handleSaveLanguage} 
                   disabled={savingLanguage || hasSavedLanguage}
                   className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 border disabled:opacity-80 ${
                     hasSavedLanguage 
                       ? "bg-emerald-600 text-foreground border-emerald-500" 
                       : "bg-muted text-foreground border-border hover:bg-muted hover:text-yellow-500"
                   }`}
                 >
                   {hasSavedLanguage ? <Check size={16} /> : <Save size={16} />}
                   {savingLanguage ? "Guardando..." : hasSavedLanguage ? "¡Guardado!" : "Guardar Idioma"}
                 </button>
               </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 pt-6 border-t border-border flex items-center gap-2">
                <Video size={20} className="text-red-500" /> Video Demo (Opcional)
             </h3>
             <div className="bg-red-950/10 border border-red-500/30 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                 <p className="text-muted-foreground text-sm mb-2">URL del vídeo que vas a mostrar (YouTube / Loom / Vimeo)</p>
                 <input 
                   type="url" 
                   value={videoUrl} 
                   onChange={(e) => setVideoUrl(e.target.value)} 
                   placeholder="https://www.youtube.com/embed/..."
                   className="bg-card border border-border text-foreground p-3 rounded-xl outline-none focus:border-yellow-500/50 w-full font-mono text-sm" 
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
                       ? "bg-emerald-600 text-foreground border-emerald-500" 
                       : "bg-muted text-foreground border-border hover:bg-muted hover:text-yellow-500"
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
