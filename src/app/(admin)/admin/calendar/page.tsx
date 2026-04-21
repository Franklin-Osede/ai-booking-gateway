"use client";

import { useEffect, useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft, PhoneCall, PhoneForwarded, MessageCircle, Trash2 } from "lucide-react";

interface ClinicStub { id: string; name: string; createdAt?: string; outreachLogs?: {createdAt: string}[]; }
interface TaskItem { id: string; clinicId: string; dueDate: string; createdAt: string; type: string; status: string; attemptNum: number; clinic?: ClinicStub; }
interface TimelineLog { id: string; createdAt: string; result?: string; status?: string; type?: string; attemptNum?: number; metadata?: { notes?: string }; channel?: string; }

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Tasks (the new events)
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  // Timeline Data
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [timelineData, setTimelineData] = useState<{timeline: TimelineLog[], pendingTasks: TaskItem[]}>({timeline: [], pendingTasks: []});
  const [isRegistering, setIsRegistering] = useState(false);
  const [notes, setNotes] = useState("");

  // Add Form State
  const [clinics, setClinics] = useState<ClinicStub[]>([]);
  const [searchClinic, setSearchClinic] = useState("");
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [newEventClinicId, setNewEventClinicId] = useState("");
  const [newEventFeedback, setNewEventFeedback] = useState("");
  const [newEventAction, setNewEventAction] = useState("");
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  useEffect(() => {
    fetch("/api/clinics").then(r => r.json()).then(d => setClinics(d?.data || []));
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventClinicId) return alert("Selecciona una clínica");
    setIsSubmittingEvent(true);
    try {
      const res = await fetch("/api/followup/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: newEventClinicId,
          dueDate: selectedDate.toISOString(),
          feedback: newEventFeedback,
          nextAction: newEventAction
        })
      });
      if (res.ok) {
        setNewEventFeedback("");
        setNewEventAction("");
        setNewEventClinicId("");
        setSearchClinic("");
        fetchTasks();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const start = startOfMonth(currentMonth).toISOString();
      const end = endOfMonth(currentMonth).toISOString();
      // Phase B endpoint
      const res = await fetch(`/api/followup/tasks?start=${start}&end=${end}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const fetchTimeline = async (clinicId: string) => {
    try {
      const res = await fetch(`/api/clinics/${clinicId}/timeline`);
      if (res.ok) {
        setTimelineData(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedTask) {
      fetchTimeline(selectedTask.clinicId);
    }
  }, [selectedTask]);

  const handleRegisterResult = async (type: string, result: string) => {
    if (!selectedTask) return;
    setIsRegistering(true);
    try {
      const payload = {
        clinicId: selectedTask.clinicId,
        taskId: selectedTask.id,
        type,
        result,
        notes
      };
      
      const res = await fetch("/api/followup/register-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setNotes("");
        // Refresh Timeline
        await fetchTimeline(selectedTask.clinicId);
        // Refresh Calendar Tasks
        await fetchTasks();
        // optionally return to day view
        setSelectedTask(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('¿Seguro que quieres eliminar este registro del historial?')) return;
    try {
      const res = await fetch(`/api/followup/logs/${logId}`, { method: 'DELETE' });
      if (res.ok) {
        setTimelineData(prev => ({
          ...prev,
          timeline: prev.timeline.filter(l => l.id !== logId)
        }));
      }
    } catch(e) {
      console.error(e);
    }
  };

  // derived data
  const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), selectedDate));

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="text-yellow-500" size={32} />
          Calendario de Seguimiento CRM ({format(currentMonth, 'yyyy')})
        </h1>
      </div>
      
      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        {/* Lado izquierdo: Calendario */}
        <div className="w-full md:w-2/3 p-6 border-b md:border-b-0 md:border-r border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="text-yellow-500" />
              Vista Mensual
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-muted rounded-full transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold text-lg capitalize w-32 text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-muted rounded-full transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-muted rounded-2xl overflow-hidden border border-border">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="bg-muted p-3 text-center text-xs font-bold text-muted-foreground">
                {day}
              </div>
            ))}
            
            {eachDayOfInterval({ start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }) }).map(date => {
               const isSelected = isSameDay(date, selectedDate);
               const isCurrentMonth = isSameMonth(date, currentMonth);
               const daysEvents = tasks.filter(t => isSameDay(new Date(t.dueDate), date));
               
               return (
                 <div 
                   key={date.toString()}
                   onClick={() => {
                     setSelectedDate(date);
                     setSelectedTask(null); // return to day view on clicking a day
                   }}
                   className={`bg-card min-h-[100px] p-2 cursor-pointer transition-colors relative group
                     ${!isCurrentMonth ? 'opacity-30' : 'hover:bg-muted'}
                     ${isSelected ? 'ring-2 ring-inset ring-yellow-500 bg-muted' : ''}
                   `}
                 >
                   <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isSelected ? 'bg-yellow-500 text-background' : 'text-muted-foreground'}`}>
                     {format(date, 'd')}
                   </span>
                   {daysEvents.length > 0 && (
                     <div className="mt-1 flex flex-col gap-1">
                       {daysEvents.slice(0, 3).map((t, idx) => (
                         <div key={idx} className={`text-[11px] font-medium leading-tight px-1.5 py-0.5 mb-1 truncate rounded ${t.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : (t.attemptNum > 2 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400')}`} title={t.clinic?.name}>
                           {t.clinic?.name || 'Clínica'} ({t.attemptNum}º)
                         </div>
                       ))}
                       {daysEvents.length > 3 && <span className="text-[10px] text-muted-foreground ml-1">+{daysEvents.length-3}</span>}
                     </div>
                   )}
                 </div>
               );
            })}
          </div>
        </div>

        {/* Lado derecho: Timeline o Tareas del Día */}
        <div className="w-full md:w-1/3 p-6 bg-muted flex flex-col">
          
          {!selectedTask ? (
            /* VISTA DE TAREAS DEL DÍA */
            <>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground border-b border-border pb-4">
                 <span>Tareas: {format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
               </h3>

               <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                 {dayTasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm">No hay seguimientos hoy.</p>
                    </div>
                 ) : (
                    dayTasks.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTask(t)}
                        className={`border cursor-pointer p-4 rounded-xl relative transition-all ${t.status === 'COMPLETED' ? 'bg-card border-border hover:border-green-500' : 'bg-card border-border hover:border-yellow-500'}`}
                      >
                         <div className="flex justify-between items-start mb-1">
                           <p className="font-bold text-sm text-foreground">{t.clinic?.name || "Clínica"}</p>
                           <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5 rounded-full">{t.type}</span>
                         </div>
                         <p className={`text-xs mb-1 ${t.status === 'COMPLETED' ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                           Intento #{t.attemptNum} - Estado: {t.status}
                         </p>

                      </div>
                    ))
                 )}
               </div>

               {/* Formulario Añadir */}
               <div className="bg-card border border-border p-5 rounded-xl mt-auto">
                  <h4 className="font-bold text-sm mb-4 border-b border-border pb-2">Registrar Nuevo Seguimiento</h4>
                  <form onSubmit={handleAddEvent} className="space-y-3 flex flex-col">
                    <div className="relative z-50">
                      <input
                        type="text"
                        value={searchClinic}
                        onChange={(e) => {
                          setSearchClinic(e.target.value);
                          setIsClinicDropdownOpen(true);
                          if (newEventClinicId) setNewEventClinicId(""); 
                        }}
                        onFocus={() => setIsClinicDropdownOpen(true)}
                        placeholder="Buscar clínica..."
                        className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-yellow-500 transition-colors"
                      />
                      {isClinicDropdownOpen && searchClinic.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-lg shadow-2xl">
                          {clinics.filter(c => c.name.toLowerCase().includes(searchClinic.toLowerCase())).length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">No hay coincidencias</div>
                          ) : (
                            clinics.filter(c => c.name.toLowerCase().includes(searchClinic.toLowerCase())).map(c => (
                              <div 
                                key={c.id} 
                                onClick={() => {
                                  setNewEventClinicId(c.id);
                                  setSearchClinic(c.name);
                                  setIsClinicDropdownOpen(false);
                                }}
                                className={`p-3 text-sm cursor-pointer hover:bg-muted transition-colors ${newEventClinicId === c.id ? 'bg-muted text-yellow-500 font-bold' : 'text-muted-foreground'}`}
                              >
                                {c.name}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {isClinicDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsClinicDropdownOpen(false)} />}
                    </div>

                    <textarea 
                      value={newEventFeedback}
                      onChange={e => setNewEventFeedback(e.target.value)}
                      placeholder="Notas pasadas de la clínica (opcional)..."
                      className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm text-foreground outline-none resize-none min-h-[60px] relative z-10"
                    />
                    <input 
                      type="text"
                      value={newEventAction}
                      onChange={e => setNewEventAction(e.target.value)}
                      placeholder="Siguiente paso (ej. Llamar el martes)"
                      className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm text-foreground outline-none relative z-10"
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmittingEvent || !newEventClinicId}
                      className="w-full bg-foreground text-background font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-2 relative z-10"
                    >
                      {isSubmittingEvent ? "Programando..." : "Programar Seguimiento"}
                    </button>
                  </form>
               </div>
            </>
          ) : (
            /* VISTA DETALLE Y TIMELINE DEL CONTACTO */
            <div className="flex flex-col h-full overflow-hidden">
               <button 
                 onClick={() => setSelectedTask(null)}
                 className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
               >
                 <ArrowLeft size={16}/> Volver al día
               </button>
               
               <div className="bg-card border border-border p-4 rounded-xl mb-4">
                 <h3 className="text-lg font-bold text-foreground line-clamp-1">{selectedTask.clinic?.name}</h3>
                 <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                   <span className="bg-muted px-2 py-1 rounded">Intento actual: #{selectedTask.attemptNum}</span>
                   {(() => {
                      const lastLog = selectedTask.clinic?.outreachLogs?.[0];
                      const refDate = lastLog ? new Date(lastLog.createdAt) : new Date(selectedTask.createdAt);
                      const diff = differenceInCalendarDays(new Date(), refDate);
                      const prefix = lastLog ? "Últ. contacto:" : "Lead de:";
                      return (
                        <span className="bg-muted px-2 py-1 rounded">
                          {prefix} {diff === 0 ? "Hoy" : `hace ${diff} día${diff === 1 ? '' : 's'}`}
                        </span>
                      );
                   })()}
                 </div>
               </div>

               {/* Timeline (ActivityLog) */}
               <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4">
                 <h4 className="text-sm font-bold border-b border-border pb-2 sticky top-0 bg-muted z-10">Historial Inmutable</h4>
                 {timelineData.timeline.length === 0 && (
                   <p className="text-xs text-muted-foreground italic">Sin contactos previos.</p>
                 )}
                 {timelineData.timeline.map((log) => {
                   let badgeColor = "bg-neutral-500/20 text-neutral-400";
                   if (log.result === "ANSWERED") badgeColor = "bg-green-500/20 text-green-500";
                   if (log.result === "NO_ANSWER") badgeColor = "bg-red-500/20 text-red-500";
                   
                   return (
                     <div key={log.id} className="relative pl-4 border-l-2 border-border ml-2 group">
                       <div className="absolute w-3 h-3 bg-card border-2 border-yellow-500 rounded-full -left-[7px] top-1"></div>
                       <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground w-full">
                         <span className="font-bold text-foreground">{format(new Date(log.createdAt), "dd MMM HH:mm", {locale:es})}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteLog(log.id); }} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar"><Trash2 size={14} /></button>
                       </div>
                       <div className="bg-card p-3 rounded-lg border border-border text-sm">
                         <div className="flex gap-2 mb-1">
                           <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${badgeColor}`}>{log.result || log.status}</span>
                           <span className="text-[11px] px-2 py-0.5 bg-muted rounded font-bold">{log.type || "LEGACY"}</span>
                           {log.attemptNum && <span className="text-[11px] px-2 py-0.5 bg-muted rounded">Intento #{log.attemptNum}</span>}
                         </div>
                         {log.metadata?.notes && (
                           <p className="text-sm text-foreground/90 mt-2 italic leading-relaxed">
                             {'"'}{log.metadata.notes.replace(/^\[Log Guardado\]\s*/i, '')}{'"'}
                           </p>
                         )}
                         {/* Legacy feedback fallback */}
                         {!log.metadata?.notes && log.channel && (
                            <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{log.channel} - {log.status}</p>
                         )}
                       </div>
                     </div>
                   );
                 })}
               </div>

               {/* Acciones Rápidas (Solo si no está completada) */}
               {selectedTask.status === "PENDING" && (
                 <div className="bg-card border border-border p-4 rounded-xl mt-auto">
                   <h4 className="font-bold text-sm mb-3">Registrar Acción Rápida</h4>
                   <textarea
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                     className="w-full bg-muted border border-border p-2 rounded-lg text-sm mb-3 resize-none outline-none focus:border-yellow-500"
                     placeholder="Notas de la llamada..."
                     rows={2}
                   />
                   <div className="grid grid-cols-2 gap-2">
                     <button 
                       disabled={isRegistering}
                       onClick={() => handleRegisterResult("CALL", "ANSWERED")}
                       className="flex items-center justify-center gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                     >
                       <PhoneCall size={14}/> Contestó
                     </button>
                     <button 
                       disabled={isRegistering}
                       onClick={() => handleRegisterResult("CALL", "NO_ANSWER")}
                       className="flex items-center justify-center gap-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                     >
                       <PhoneForwarded size={14}/> No contestó
                     </button>
                     <button 
                       disabled={isRegistering}
                       onClick={() => handleRegisterResult("WHATSAPP", "LEFT_MESSAGE")}
                       className="col-span-2 flex items-center justify-center gap-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                     >
                       <MessageCircle size={14}/> Envio WhatsApp
                     </button>
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
