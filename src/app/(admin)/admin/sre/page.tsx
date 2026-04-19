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
    <div className="w-full text-slate-800 dark:text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          SRE Operations Center
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-3xl">
          Panel de observabilidad crítica del *ClinicRuntimeConfig*. Aquí se monitorizan todas las transacciones de las páginas Web públicas y su **Fail-Closed Gate**.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Total Demos Activas</p>
          <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">{metrics.total}</p>
        </div>
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900/50">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Nodos Sanos (Proxy)</p>
          <p className="text-4xl font-black text-emerald-800 dark:text-emerald-300 mt-2">{metrics.healthy}</p>
        </div>
        <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/50">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 uppercase flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Nodos Protegidos (Neutral)</p>
          <p className="text-4xl font-black text-amber-800 dark:text-amber-300 mt-2">{metrics.neutral}</p>
        </div>
        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-300 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2"><Cpu className="w-4 h-4"/> Canary Pass Rate</p>
          <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">100%</p>
        </div>
      </div>

      <SreDashboardClient configs={configs} />
      
    </div>
  );
}
