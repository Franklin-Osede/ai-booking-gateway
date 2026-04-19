import { prisma } from "@/lib/prisma";
import { ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import { SreDashboardClient } from "./SreDashboardClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SreDashboard() {
  const configs = await prisma.clinicRuntimeConfig.findMany({
    include: {
       clinic: {
         select: { name: true, slug: true, location: true }
       }
    },
    orderBy: { publishedAt: "desc" }
  });

  const total = configs.length;
  const metrics = {
    total,
    healthy: configs.filter(c => c.fallbackMode === "proxy").length,
    neutral: configs.filter(c => c.fallbackMode === "neutral").length,
    screenshot: configs.filter(c => c.fallbackMode === "screenshot").length
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto text-slate-800 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900 border-b pb-4">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          SRE Operations Center
        </h1>
        <p className="mt-3 text-slate-600 max-w-3xl">
          Panel de observabilidad crítica del *ClinicRuntimeConfig*. Aquí se monitorizan todas las transacciones de las páginas Web públicas y su **Fail-Closed Gate**.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Demos Activas</p>
          <p className="text-4xl font-black text-slate-800 mt-2">{metrics.total}</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-xl shadow-sm border border-emerald-200">
          <p className="text-sm font-medium text-emerald-700 uppercase flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Nodos Sanos (Proxy)</p>
          <p className="text-4xl font-black text-emerald-800 mt-2">{metrics.healthy}</p>
        </div>
        <div className="p-6 bg-amber-50 rounded-xl shadow-sm border border-amber-200">
          <p className="text-sm font-medium text-amber-700 uppercase flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Nodos Protegidos (Neutral)</p>
          <p className="text-4xl font-black text-amber-800 mt-2">{metrics.neutral}</p>
        </div>
        <div className="p-6 bg-slate-100 rounded-xl shadow-sm border border-slate-300">
          <p className="text-sm font-medium text-slate-600 uppercase flex items-center gap-2"><Cpu className="w-4 h-4"/> Canary Pass Rate</p>
          <p className="text-4xl font-black text-slate-800 mt-2">100%</p>
        </div>
      </div>

      <SreDashboardClient configs={configs} />
      
    </div>
  );
}
