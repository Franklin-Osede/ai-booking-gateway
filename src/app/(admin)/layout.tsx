import Link from "next/link";
import { Sparkles, LayoutDashboard, Database, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-yellow-500">
          <Sparkles />
          <span className="font-bold text-xl text-white">Clinic Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
            <Database size={18} />
            <span>Clínicas</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors mt-auto absolute bottom-6">
            <ArrowLeft size={18} />
            <span>Volver al Injector</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
