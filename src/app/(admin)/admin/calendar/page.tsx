"use client";

import { useEffect, useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from "lucide-react";

export default function CalendarPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clinics, setClinics] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  
  const [newEventClinicId, setNewEventClinicId] = useState("");
  const [newEventFeedback, setNewEventFeedback] = useState("");
  const [newEventAction, setNewEventAction] = useState("");
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  useEffect(() => {
    fetch("/api/clinics").then(r => r.json()).then(d => setClinics(d?.data || []));
  }, []);

  const fetchEvents = async () => {
    try {
      const start = startOfMonth(currentMonth).toISOString();
      const end = endOfMonth(currentMonth).toISOString();
      const res = await fetch(`/api/clinic-events?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventClinicId) return alert("Selecciona una clínica");
    setIsSubmittingEvent(true);
    try {
      const res = await fetch("/api/clinic-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: newEventClinicId,
          eventDate: selectedDate.toISOString(),
          feedback: newEventFeedback,
          nextAction: newEventAction
        })
      });
      if (res.ok) {
        setNewEventFeedback("");
        setNewEventAction("");
        setNewEventClinicId("");
        fetchEvents();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if(!confirm("¿Eliminar evento?")) return;
    try {
      await fetch(`/api/clinic-events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="text-yellow-500" size={32} />
          Calendario de Contactos (2026)
        </h1>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        {/* Lado izquierdo: Calendario */}
        <div className="w-full md:w-2/3 p-6 border-b md:border-b-0 md:border-r border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="text-yellow-500" />
              Vista Mensual
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold text-lg capitalize w-32 text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-800">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="bg-neutral-950 p-3 text-center text-xs font-bold text-neutral-500">
                {day}
              </div>
            ))}
            
            {eachDayOfInterval({ start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }) }).map(date => {
               const isSelected = isSameDay(date, selectedDate);
               const isCurrentMonth = isSameMonth(date, currentMonth);
               const dayEvents = events.filter(e => isSameDay(new Date(e.eventDate), date));
               
               return (
                 <div 
                   key={date.toString()}
                   onClick={() => setSelectedDate(date)}
                   className={`bg-neutral-900 min-h-[100px] p-2 cursor-pointer transition-colors relative group
                     ${!isCurrentMonth ? 'opacity-30' : 'hover:bg-neutral-800'}
                     ${isSelected ? 'ring-2 ring-inset ring-yellow-500 bg-neutral-800' : ''}
                   `}
                 >
                   <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isSelected ? 'bg-yellow-500 text-black' : 'text-neutral-400'}`}>
                     {format(date, 'd')}
                   </span>
                   {dayEvents.length > 0 && (
                     <div className="mt-1 flex flex-wrap gap-1">
                       {dayEvents.slice(0, 3).map((e, idx) => (
                         <div key={idx} className="w-2 h-2 rounded-full bg-blue-500" title={e.clinic?.name}></div>
                       ))}
                       {dayEvents.length > 3 && <span className="text-[10px] text-neutral-500 ml-1">+{dayEvents.length-3}</span>}
                     </div>
                   )}
                 </div>
               );
            })}
          </div>
        </div>

        {/* Lado derecho: Eventos del día */}
        <div className="w-full md:w-1/3 p-6 bg-neutral-950 flex flex-col">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white border-b border-neutral-800 pb-4">
             <span>Eventos del {format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
           </h3>

           <div className="flex-1 overflow-y-auto space-y-3 mb-6" style={{ maxHeight: '400px' }}>
             {events.filter(e => isSameDay(new Date(e.eventDate), selectedDate)).length === 0 ? (
                <div className="text-center py-12 text-neutral-600">
                  <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No hay eventos este día.</p>
                </div>
             ) : (
                events.filter(e => isSameDay(new Date(e.eventDate), selectedDate)).map(e => (
                  <div key={e.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl relative group">
                     <button onClick={() => handleDeleteEvent(e.id)} className="absolute top-3 right-3 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={16} />
                     </button>
                     <p className="font-bold text-sm text-yellow-500 mb-1">{e.clinic?.name || "Clínica borrada"}</p>
                     {e.feedback && <p className="text-sm text-neutral-300 mb-2 whitespace-pre-wrap"><MessageSquare size={12} className="inline mr-1 text-neutral-500"/> {e.feedback}</p>}
                     {e.nextAction && (
                       <div className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1.5 rounded-lg border border-blue-500/20 font-medium mt-2">
                         Acción: {e.nextAction}
                       </div>
                     )}
                  </div>
                ))
             )}
           </div>

           {/* Formulario Añadir */}
           <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
              <h4 className="font-bold text-sm mb-4 border-b border-neutral-800 pb-2">Registrar Nuevo Seguimiento</h4>
              <form onSubmit={handleAddEvent} className="space-y-3 flex flex-col">
                <select 
                  value={newEventClinicId}
                  onChange={e => setNewEventClinicId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white outline-none"
                  required
                >
                  <option value="" disabled>Selecciona clínica destino...</option>
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <textarea 
                  value={newEventFeedback}
                  onChange={e => setNewEventFeedback(e.target.value)}
                  placeholder="Feedback de la reunión o llamada..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white outline-none min-h-[80px]"
                />
                <input 
                  type="text"
                  value={newEventAction}
                  onChange={e => setNewEventAction(e.target.value)}
                  placeholder="Siguiente paso (ej. Llamarle mañana)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isSubmittingEvent}
                  className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-2"
                >
                  {isSubmittingEvent ? "Guardando..." : "Programar Evento"}
                </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
