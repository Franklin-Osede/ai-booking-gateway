"use client";

import { useState } from "react";
import { ExternalLink, RefreshCw, AlertTriangle, Search } from "lucide-react";

type ClinicRuntimeConfig = {
  id: string;
  clinicId: string;
  clinic: { name: string; slug: string; location: string | null };
  publishedWebsiteUrl: string;
  publishedBrandColor: string;
  publishedNiche: string;
  publishedLocale: string;
  fallbackMode: string;
  version: number;
  publishedAt: Date;
};

export function SreDashboardClient({ configs }: { configs: ClinicRuntimeConfig[] }) {
  const [search, setSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const filtered = configs.filter(c => 
    c.clinic.name.toLowerCase().includes(search.toLowerCase()) || 
    c.clinic.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.publishedWebsiteUrl.toLowerCase().includes(search.toLowerCase())
  );

  const handleRetest = async (clinicId: string) => {
    setLoadingIds(prev => ({ ...prev, [clinicId]: true }));
    try {
      // Intentar publicar simulando un retest
      const res = await fetch(`/api/clinics/${clinicId}/publish`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        alert("💥 Error de Validación Estricta: " + data.error);
      } else {
        alert("✅ Nodo recuperado y reconstruido con éxito.");
        window.location.reload();
      }
    } catch {
      alert("Fallo de red al interactuar con el endpoint.");
    } finally {
      setLoadingIds(prev => ({ ...prev, [clinicId]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 shadow-sm">
      <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl flex items-center justify-between">
        <h2 className="font-semibold text-lg">Estado Operativo de Nodos</h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar nodo, dominio o slug..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border dark:border-slate-700 rounded-lg w-80 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:outline-none bg-white dark:bg-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Clínica Nodo</th>
              <th className="px-6 py-4">Contrato Locale</th>
              <th className="px-6 py-4">Rutas & Enlaces</th>
              <th className="px-6 py-4">Version / Updated</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  {c.fallbackMode === "proxy" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Proxy Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                      <AlertTriangle className="w-3 h-3" /> Neutral / Aislado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{c.clinic.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{c.clinic.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs rounded">
                    {c.publishedLocale}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <a href={`/demo/${c.clinic.slug}`} target="_blank" className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-mono text-sm font-semibold max-w-[200px] md:max-w-xs truncate" title="Probar Demo en AgentMinds">
                      /demo/{c.clinic.slug} <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                    <a href={c.publishedWebsiteUrl} target="_blank" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-mono text-xs max-w-[200px] md:max-w-xs truncate" title={`Destino: ${c.publishedWebsiteUrl}`}>
                      {c.publishedWebsiteUrl} <span className="text-[10px] uppercase font-bold">DNS</span>
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  <div>v{c.version}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{new Date(c.publishedAt).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleRetest(c.clinicId)}
                    disabled={loadingIds[c.clinicId]}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-semibold rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingIds[c.clinicId] ? 'animate-spin' : ''}`} />
                    Retest Fallback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No se encontraron nodos coincidentes en Producción.
          </div>
        )}
      </div>
    </div>
  );
}
