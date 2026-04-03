"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Building2, ChevronRight } from "lucide-react";

type Clinic = {
  id: string;
  name: string;
  industry: string;
  location: string | null;
  createdAt: string;
};

export default function AdminDashboard() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

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

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || clinic.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clínicas</h1>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors">
          <Plus size={18} /> Nueva Clínica
        </button>
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-yellow-500/50 text-white text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 flex-1">
            <button
               onClick={() => setSelectedIndustry("All")}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedIndustry === "All" ? "bg-yellow-500 text-black" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"}`}
            >
              Todos los nichos
            </button>
            {uniqueIndustries.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedIndustry === ind ? "bg-yellow-500 text-black" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"}`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-neutral-500">Cargando clínicas...</div>
        ) : filteredClinics.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <Building2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay clínicas que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClinics.map((clinic) => (
              <Link key={clinic.id} href={`/admin/clinics/${clinic.id}`} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950/50 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-yellow-500">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold">{clinic.name}</h3>
                    <p className="text-sm text-neutral-400">{clinic.industry} {clinic.location && `• ${clinic.location}`}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-500" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
