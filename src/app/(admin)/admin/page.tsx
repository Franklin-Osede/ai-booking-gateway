"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Search, Building2, ChevronRight, X, Copy, ExternalLink, CheckCircle, MapPin, FileSpreadsheet, Trash2, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseExcelBuffer, ParsedClinic } from "@/lib/excel-parser";

type Clinic = {
  id: string;
  name: string;
  industry: string;
  location: string | null;
  countryCode?: string | null;
  createdAt: string;
  updatedAt?: string;
  websites?: { url: string }[];
  seoMetrics?: Record<string, unknown>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("updated");

  // Bulk Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processState, setProcessState] = useState<"idle" | "processing" | "results">("idle");
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkNiche, setBulkNiche] = useState("Clínica Capilar");
  const [bulkCountry, setBulkCountry] = useState("ES");
  const [results, setResults] = useState<{name: string; id: string; url:string}[]>([]);

  // Excel Bulk State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [pendingExcelClinics, setPendingExcelClinics] = useState<ParsedClinic[]>([]);
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [excelResult, setExcelResult] = useState<{added: number, skipped: number} | null>(null);


  const extractNameFromUrl = (url: string) => {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      return u.hostname.replace('www.', '').split('.')[0];
    } catch {
      return url.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', '');
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkUrls.trim()) return;
    setProcessState("processing");
    const lines = bulkUrls.split('\n').map(u => u.trim()).filter(Boolean);
    const newResults: {name: string, id: string, url: string}[] = [];

    for (const line of lines) {
      // Split by tab (Excel copy-paste) or comma
      const parts = line.split(/[\t,]/).map(p => p.trim()).filter(Boolean);
      const urlRaw = parts[0] || "";
      
      let nameRaw = "";
      let locationRaw = "";

      if (parts.length === 2) {
        locationRaw = parts[1]; // User pasted [URL, City]
      } else if (parts.length >= 3) {
        nameRaw = parts[1];
        locationRaw = parts[2];
      }

      const name = nameRaw || extractNameFromUrl(urlRaw);
      const siteUrl = urlRaw.startsWith('http') ? urlRaw : `https://${urlRaw}`;

      try {
        const res = await fetch("/api/clinics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             name: name || "Clínica Desconocida",
             industry: bulkNiche,
             location: locationRaw || undefined,
             countryCode: bulkCountry,
             siteUrl: siteUrl,
             brandColor: "#FFD700"
          })
        });
        const data = await res.json();
        if (data.success && data.data?.id) {
           newResults.push({ name, id: data.data.id, url: siteUrl });
        }
      } catch (e) {
        console.error("Error inserting", urlRaw, e);
      }
    }
    
    setResults(newResults);
    setProcessState("results");
    
    // Auto-refresh the list
    fetch("/api/clinics")
      .then((res) => res.json())
      .then((data) => setClinics(data?.data || []));
  };


  useEffect(() => {
    fetch("/api/clinics")
      .then((res) => res.json())
      .then((data) => {
        setClinics(data?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueIndustries = Array.from(new Set(clinics.map(c => c.industry))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(clinics.map(c => c.location))).filter(Boolean) as string[];

  const filteredClinics = clinics.filter(clinic => {
    const s = searchQuery.toLowerCase();
    const urlMatch = clinic.websites?.some(w => w.url.toLowerCase().includes(s)) || false;
    const matchesSearch = clinic.name.toLowerCase().includes(s) || 
                          clinic.industry.toLowerCase().includes(s) ||
                          urlMatch;
    const matchesIndustry = selectedIndustry === "All" || clinic.industry === selectedIndustry;
    const matchesLocation = selectedLocation === "All" || (selectedLocation === "SinEspecificar" && !clinic.location) || clinic.location === selectedLocation;
    const matchesCountry = selectedCountry === "All" || (clinic.countryCode || 'ES') === selectedCountry;
    return matchesSearch && matchesIndustry && matchesLocation && matchesCountry;
  });

  const sortedClinics = [...filteredClinics].sort((a, b) => {
    if (sortBy === "updated") {
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    } else if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clínicas</h1>
        <div className="flex items-center gap-3">
          <input 
             type="file" 
             accept=".xlsx, .xls, .csv" 
             hidden 
             ref={fileInputRef} 
             onChange={async (e) => {
               const file = e.target.files?.[0];
               if (!file) return;

               setIsExcelUploading(true);
               try {
                 const arrayBuffer = await file.arrayBuffer();
                 const clinicsToUpload = parseExcelBuffer(arrayBuffer);

                 if (clinicsToUpload.length === 0) {
                   alert("No se detectaron clínicas válidas en el archivo.");
                   setIsExcelUploading(false);
                   return;
                 }

                 setPendingExcelClinics(clinicsToUpload);
                 setIsExcelPreviewOpen(true);
                 setIsExcelUploading(false);
                 if (fileInputRef.current) fileInputRef.current.value = "";
               } catch (err: unknown) {
                 const errMsg = err instanceof Error ? err.message : String(err);
                 alert("Error leyendo el archivo: " + errMsg);
                 setIsExcelUploading(false);
                 if (fileInputRef.current) fileInputRef.current.value = "";
               }
             }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isExcelUploading}
            className="hidden sm:flex bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-xl font-bold items-center gap-2 hover:border-yellow-500 hover:text-yellow-500 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet size={18} /> {isExcelUploading ? "Cargando..." : "Subir Excel"}
          </button>
          
          <button 
            onClick={() => { setIsModalOpen(true); setProcessState("idle"); setBulkUrls(""); setResults([]); }}
            className="bg-white text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            <Plus size={18} /> Nueva Clínica
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-neutral-500/50 text-white text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 w-full">
            <div className="w-full">
               <select 
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 outline-none focus:border-neutral-500/50 text-white text-sm font-bold cursor-pointer"
               >
                  <option value="All">Todos los nichos / Categorías</option>
                  {uniqueIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
               </select>
            </div>

            <div className="w-full">
               <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 outline-none focus:border-neutral-500/50 text-white text-sm font-bold cursor-pointer"
               >
                  <option value="All">Todas las Ubicaciones</option>
                  <option value="SinEspecificar">📍 Sin especificar</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
               </select>
            </div>

            <div className="w-full">
               <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 outline-none focus:border-neutral-500/50 text-white text-sm font-bold cursor-pointer"
               >
                  <option value="All">🌍 Todos los Países</option>
                  <option value="ES">🇪🇸 España</option>
                  <option value="EN">🇬🇧 Reino Unido</option>
               </select>
            </div>

            <div className="w-full">
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 outline-none focus:border-yellow-500/50 text-yellow-500 text-sm font-bold cursor-pointer"
               >
                  <option value="updated">⏱️ Recién Editadas</option>
                  <option value="created">🆕 Añadidas Recientemente</option>
                  <option value="name">🔤 Alfabético (A-Z)</option>
               </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-neutral-500">Cargando clínicas...</div>
        ) : sortedClinics.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium text-lg text-white mb-1">Sin resultados</p>
            <p>No hemos encontrado clínicas en ese nicho o ubicación.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 text-xs tracking-widest uppercase">
                  <th className="font-bold py-4 px-4">CLÍNICA Y NICHO</th>
                  <th className="font-bold py-4 px-4 w-40">UBICACIÓN</th>
                  <th className="font-bold py-4 px-4 w-40 text-right">AÑADIDO EL</th>
                </tr>
              </thead>
              <tbody>
                {sortedClinics.map((clinic) => {
                   return (
                     <tr 
                       key={clinic.id} 
                       onClick={() => router.push(`/admin/clinics/${clinic.id}`)}
                       className="border-b border-neutral-800/40 hover:bg-neutral-900 cursor-pointer transition-colors group"
                     >
                       <td className="py-4 px-4 font-bold flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                           <Building2 size={18} />
                         </div>
                         <div>
                            <span className="text-white capitalize text-base flex flex-wrap items-center gap-2 font-bold tracking-tight">
                                {clinic.name}
                                {clinic.seoMetrics && (
                                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                    <Brain size={12} /> Datos Inyectados
                                  </span>
                                )}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">{clinic.industry}</span>
                         </div>
                       </td>
                       <td className="py-4 px-4">
                          {clinic.location ? (
                            <div className="flex items-center gap-2 text-neutral-300 text-sm font-medium">
                              <MapPin size={16} className="text-neutral-500"/> {clinic.location}
                            </div>
                          ) : (
                            <span className="text-neutral-600 text-sm italic">Sin especificar</span>
                          )}
                       </td>
                       <td className="py-4 px-4 text-sm text-neutral-400 font-mono tracking-tight text-right flex items-center justify-end gap-4">
                         {new Date(clinic.createdAt).toLocaleDateString()}
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (confirm(`¿Estás seguro de que deseas eliminar la clínica "${clinic.name}"?`)) {
                               fetch(`/api/clinics/${clinic.id}`, { method: 'DELETE' })
                                 .then((res) => {
                                    if (res.ok) setClinics((prev) => prev.filter(c => c.id !== clinic.id));
                                    else alert("Error al eliminar la clínica");
                                 });
                             }
                           }}
                           className="p-2 hover:bg-red-500/10 text-neutral-600 hover:text-red-500 rounded-lg transition-colors"
                         >
                           <Trash2 size={18} />
                         </button>
                         <ChevronRight size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
                       </td>
                     </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* MODAL CREADOR MASIVO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-2">Creador de Clínicas Mágico</h2>
            <p className="text-neutral-400 mb-6 font-medium text-sm">Pega las URLs de tus prospectos y generaré todos los enlaces con base de datos en 1 clic.</p>

            {processState === "idle" && (
              <div className="space-y-6 overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-bold text-neutral-300 mb-2">Pega desde Excel (URL, Nombre, Ciudad) o 1 URL por línea</label>
                  <textarea 
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    placeholder={`ej. https://clinicadental.com\tMi Clínica\tMadrid\nej. https://imassalud.es`}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 min-h-[200px] outline-none focus:border-neutral-500/50 text-white font-mono text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-300 mb-2">Nicho / Sector Aplicado (Para todas)</label>
                  <select 
                    value={bulkNiche}
                    onChange={(e) => setBulkNiche(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 outline-none focus:border-neutral-500/50 text-white cursor-pointer appearance-none"
                  >
                    <option value="Clínica Capilar">Clínica Capilar (Especialistas)</option>
                    <option value="Medicina Regenerativa">Medicina Regenerativa / Stem Cells</option>
                    <option value="Clínica Médica">Clínica Médica / Especialista</option>
                    <option value="Clínica Dental">Clínica Dental</option>
                    <option value="Despacho Legal">Despacho Legal / Abogados</option>
                    <option value="Centro de Estética">Centro de Estética / Spa</option>
                    <option value="Automotriz">Concesionario Automotriz</option>
                    <option value="SaaS B2B">Agencia B2B / Software SaaS</option>
                    <option value="Sector General">Otro sector (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-300 mb-2">País Destino / Mercado</label>
                  <select 
                    value={bulkCountry}
                    onChange={(e) => setBulkCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 outline-none focus:border-neutral-500/50 text-white cursor-pointer appearance-none"
                  >
                    <option value="ES">🇪🇸 España (ES)</option>
                    <option value="EN">🇬🇧 Reino Unido (EN)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleBulkSubmit}
                    disabled={!bulkUrls.trim()}
                    className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Procesar y Crear Clínicas
                  </button>
                </div>
              </div>
            )}

            {processState === "processing" && (
              <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-6"></div>
                 <h3 className="text-xl font-bold animate-pulse">Escaneando y Construyendo...</h3>
                 <p className="text-neutral-500 mt-2">Agregando tus leads a Supabase</p>
              </div>
            )}

            {processState === "results" && (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-3 mb-6 bg-green-500/10 text-green-400 p-4 rounded-2xl border border-green-500/20">
                  <CheckCircle size={24} />
                  <p className="font-bold">¡Se han importado {results.length} clínicas exitosamente!</p>
                </div>

                <div className="overflow-y-auto space-y-4 pr-2 flex-1">
                  {results.map((r, idx) => {
                    const localLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/demo/${r.id}`;
                    const prodLink = `https://app.tudominio.com/demo/${r.id}`; // Cambia esto por tu dominio Vercel
                    
                    return (
                      <div key={idx} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-3">
                          <h4 className="font-bold text-lg text-white capitalize">{r.name}</h4>
                          <span className="text-xs text-neutral-500 font-mono">{r.url}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-xs text-neutral-500 font-bold shrink-0">LOCAL</span>
                            <input readOnly value={localLink} className="flex-1 bg-neutral-900 text-xs font-mono text-neutral-300 p-2 rounded-lg border-none outline-none" />
                            <button onClick={() => { navigator.clipboard.writeText(localLink); alert("Copiado"); }} className="p-2 hover:bg-neutral-800 text-yellow-500 rounded-lg">
                              <Copy size={16} />
                            </button>
                            <a href={localLink} target="_blank" className="p-2 hover:bg-neutral-800 text-yellow-500 rounded-lg"><ExternalLink size={16}/></a>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-16 text-xs text-green-500/80 font-bold shrink-0">VERCEL</span>
                            <input readOnly value={prodLink} className="flex-1 bg-neutral-900 text-xs font-mono text-neutral-300 p-2 rounded-lg border-none outline-none" />
                            <button onClick={() => { navigator.clipboard.writeText(prodLink); alert("Copiado"); }} className="p-2 hover:bg-neutral-800 text-yellow-500 rounded-lg">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-6 mt-2">
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="w-full bg-neutral-800 text-white hover:bg-neutral-700 py-4 rounded-xl font-bold transition-colors"
                   >
                     Cerrar y ver en el Dashboard
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isExcelPreviewOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileSpreadsheet className="text-yellow-500" /> Previsualización del Excel
                </h2>
                <p className="text-neutral-400 text-sm mt-1">Se han detectado {pendingExcelClinics.length} filas válidas.</p>
              </div>
              <button onClick={() => setIsExcelPreviewOpen(false)} className="text-neutral-500 hover:text-white transition-colors bg-neutral-800 rounded-full p-2">
                <X size={20} />
              </button>
            </div>
            
            {excelResult ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 bg-neutral-900/50 flex-1">
                 <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                   <CheckCircle size={40} className="text-green-500" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-white mb-2">¡Inyección Completada!</h2>
                   <p className="text-neutral-400">Las clínicas han sido añadidas a la base de datos B2B.</p>
                 </div>
                 <div className="flex gap-6 mt-4 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 w-full max-w-sm">
                    <div className="flex flex-col items-center flex-1">
                       <span className="text-4xl font-bold text-white">{excelResult.added}</span>
                       <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-2">Añadidas</span>
                    </div>
                    <div className="w-px bg-neutral-800"></div>
                    <div className="flex flex-col items-center flex-1">
                       <span className="text-4xl font-bold text-neutral-600">{excelResult.skipped}</span>
                       <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-2">Omitidas</span>
                    </div>
                 </div>
                 <div className="pt-6 w-full max-w-sm">
                   <button 
                     onClick={() => { setIsExcelPreviewOpen(false); setExcelResult(null); }}
                     className="w-full bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                     >
                     Volver al Dashboard
                   </button>
                 </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 bg-neutral-900/50">
                  <table className="w-full text-left">
                    <thead className="text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
                      <tr>
                        <th className="pb-3 pr-4">Nombre (Cliente)</th>
                        <th className="pb-3 pr-4">URL</th>
                        <th className="pb-3 pr-4">Ubicación</th>
                        <th className="pb-3 text-right">Pestaña (Nicho)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50 text-sm">
                      {pendingExcelClinics.map((clinic, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                          <td className="py-3 pr-4 font-bold text-white">{clinic.name}</td>
                          <td className="py-3 pr-4 text-neutral-400 truncate max-w-[200px]">{clinic.url || '-'}</td>
                          <td className="py-3 pr-4 text-neutral-400">{clinic.location || '-'}</td>
                          <td className="py-3 text-right text-yellow-500 font-bold text-xs">{clinic.industry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center">
                   <button 
                     onClick={() => setIsExcelPreviewOpen(false)}
                     className="px-6 py-3 font-bold text-neutral-400 hover:text-white transition-colors"
                   >
                     Cancelar
                   </button>
                   <button 
                     disabled={isExcelUploading}
                     onClick={async () => {
                        setIsExcelUploading(true);
                        try {
                          const res = await fetch("/api/clinics/bulk", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ clinics: pendingExcelClinics })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setExcelResult({ added: data.added, skipped: data.skipped });
                            fetch("/api/clinics").then((r) => r.json()).then((d) => setClinics(d?.data || []));
                          } else {
                            alert(`Error al guardar: ${data.error}`);
                          }
                        } catch {
                          alert("Error de conexión");
                        } finally {
                          setIsExcelUploading(false);
                        }
                     }}
                     className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                   >
                     {isExcelUploading ? "Inyectando Base de Datos..." : "Confirmar Inyección Segura"}
                   </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
