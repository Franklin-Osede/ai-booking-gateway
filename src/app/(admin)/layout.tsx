import Link from "next/link";
import { Sparkles, Database, ArrowLeft, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col transition-colors duration-200 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 text-amber-500">
          <Sparkles />
          <span className="font-bold text-xl text-foreground">Clinic Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2 relative">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <Database size={18} />
            <span>Clínicas</span>
          </Link>
          <Link href="/admin/calendar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <Calendar size={18} />
            <span>Calendario</span>
          </Link>
          
          <div className="px-4 py-2 mt-4 border-t border-border pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Apariencia</p>
            <ThemeToggle />
          </div>

          <div className="absolute bottom-6 w-full flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span>Volver al Injector</span>
            </Link>
          </div>
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
