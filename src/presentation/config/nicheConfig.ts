import { Stethoscope, HeartPulse, Activity, User, Scissors, Sparkles, Droplet, UserCheck, Car, Wrench, ShieldCheck, Briefcase, Scale, FileText, Monitor, Server, Zap, Smile } from "lucide-react";

export type NicheConfig = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  chatGreeting: string;
  chatThinking: string;
  chatOffer: string;
  chatCta: string;
  categories: {
    icon: React.ElementType;
    name: string;
    docs: (string | { name: string; image?: string })[];
  }[];
};

export const NICHE_CONFIGS: Record<string, NicheConfig> = {
  medical: {
    title: "Selecciona tu profesional",
    subtitle: "Encuentra al especialista indicado para tu tratamiento y agenda tu cita en segundos.",
    buttonLabel: "Médicos",
    chatGreeting: "Hola, soy tu conserje médico. ¿En qué especialidad necesitas ayuda hoy?",
    chatThinking: "Revisando disponibilidades médicas...",
    chatOffer: "Perfecto. Tengo espacios disponibles con nuestros mejores especialistas. ¿Quieres que bloqueemos una cita?",
    chatCta: "Agendar Cita Médica",
    categories: [
      { icon: Stethoscope, name: "Urología", docs: ["Especialista en Urología", "Cirujano Principal", "Médico de Guardia"] },
      { icon: HeartPulse, name: "Cardiología", docs: ["Especialista Titular", "Cardiólogo Principal", "Equipo Médico"] },
      { icon: Activity, name: "Fisioterapia", docs: ["Fisioterapeuta Jefe", "Rehabilitador", "Especialista"] },
      { icon: User, name: "Ginecología", docs: ["Ginecólogo/a Titular", "Especialista de Guardia"] },
      { icon: User, name: "Psicología", docs: ["Psicólogo/a Clínico", "Terapeuta", "Especialista"] }
    ]
  },
  dental: {
    title: "Elige tu tratamiento ideal",
    subtitle: "Selecciona tu odontólogo especialista y agenda tu cita en menos de un minuto.",
    buttonLabel: "Odontólogos",
    chatGreeting: "Hola, soy tu conserje dental. ¿En qué tratamiento o especialidad necesitas ayuda hoy?",
    chatThinking: "Revisando disponibilidades en la clínica dental...",
    chatOffer: "Perfecto. Tengo espacios disponibles con nuestros mejores especialistas. ¿Quieres que bloqueemos una cita?",
    chatCta: "Agendar Cita Dental",
    categories: [
      { icon: Smile, name: "Ortodoncia", docs: ["Ortodoncista Principal", "Especialista Clínico", "Equipo Dental"] },
      { icon: Sparkles, name: "Blanqueamiento Dental", docs: ["Odontólogo Estético", "Higienista Dental"] },
      { icon: Activity, name: "Implantología", docs: ["Cirujano Maxilofacial", "Implantólogo Titular"] },
      { icon: ShieldCheck, name: "Odontopediatría", docs: ["Odontopediatra", "Especialista Infantil"] }
    ]
  },
  beauty: {
    title: "Elige tu estilista",
    subtitle: "Descubre nuestros servicios premium y reserva tu sesión de belleza en segundos.",
    buttonLabel: "Estilistas",
    chatGreeting: "¡Hola! Soy tu asesor de belleza. ¿Qué servicio te gustaría realizarte hoy?",
    chatThinking: "Buscando huecos en nuestra agenda de belleza...",
    chatOffer: "¡Genial! Tengo un hueco perfecto para ti con nuestros mejores estilistas. ¿Reservamos?",
    chatCta: "Reservar Sesión",
    categories: [
      { icon: Scissors, name: "Peluquería", docs: ["Estilista Principal", "Director Creativo", "Colorista Experto"] },
      { icon: Sparkles, name: "Tratamientos Faciales", docs: ["Especialista Facial", "Cosmetóloga Titular"] },
      { icon: Droplet, name: "Manicura & Pedicura", docs: ["Técnico de Uñas", "Especialista Manicura"] },
      { icon: UserCheck, name: "Masajes Relajantes", docs: ["Masajista Terapeuta", "Especialista Spa"] }
    ]
  },
  legal: {
    title: "Selecciona tu área legal",
    subtitle: "Encuentra al abogado especializado para resolver tu caso y agenda tu primera consulta.",
    buttonLabel: "Abogados",
    chatGreeting: "Hola, soy tu asistente legal virtual. ¿En qué área del derecho necesitas asesoramiento hoy?",
    chatThinking: "Buscando abogados especializados...",
    chatOffer: "Perfecto. Tengo espacios disponibles con nuestros abogados especialistas. ¿Agendamos tu primera consulta?",
    chatCta: "Agendar Consulta Legal",
    categories: [
      { icon: Scale, name: "Derecho Laboral", docs: ["Socio Principal Laboral", "Abogado Senior", "Asesor Jurídico"] },
      { icon: Briefcase, name: "Derecho Mercantil", docs: ["Asesor Legal Corporativo", "Socio Mercantil"] },
      { icon: FileText, name: "Derecho Civil", docs: ["Abogado Especialista", "Socio Titular"] }
    ]
  },
  auto: {
    title: "Elige tu asesor comercial",
    subtitle: "Selecciona al experto que te guiará en la prueba o compra de tu próximo vehículo.",
    buttonLabel: "Asesores",
    chatGreeting: "¡Hola! Soy tu asistente de concesionario. ¿En qué modelo o servicio estás interesado?",
    chatThinking: "Verificando disponibilidad de vehículos y asesores...",
    chatOffer: "Tenemos exactamente lo que buscas disponible. ¿Te gustaría agendar una prueba o inspección?",
    chatCta: "Reservar Cita",
    categories: [
      { icon: Car, name: "Ventas Vehículos Nuevos", docs: ["Asesor Comercial Senior", "Jefe de Ventas"] },
      { icon: ShieldCheck, name: "Vehículos de Ocasión", docs: ["Especialista en Ocasión", "Asesor de Ventas"] },
      { icon: Wrench, name: "Taller & Mantenimiento", docs: ["Jefe de Taller", "Mecánico Principal", "Recepción Taller"] }
    ]
  },
  b2b: {
    title: "Planes y Soluciones",
    subtitle: "Habla con uno de nuestros ejecutivos de cuentas para encontrar la mejor solución de software para tu empresa.",
    buttonLabel: "Ejecutivos",
    chatGreeting: "¡Hola! Soy tu Account Executive virtual. ¿Para qué área de tu empresa buscas software hoy?",
    chatThinking: "Conectando con un especialista comercial...",
    chatOffer: "Genial. He encontrado al consultor perfecto para tu empresa. ¿Agendamos una demo?",
    chatCta: "Agendar Demo",
    categories: [
      { icon: Monitor, name: "Ventas y CRM", docs: ["Andrés Ramírez", "Laura Pérez"] },
      { icon: Server, name: "Infraestructura Cloud", docs: ["Miguel Sánchez", "Roberto Gómez"] },
      { icon: Zap, name: "Automatización & IA", docs: ["Sofía López", "Luis Ruiz", "Patricia Torres"] }
    ]
  },
  default: {
    title: "Contacta con nuestro equipo",
    subtitle: "Selecciona el departamento con el que deseas hablar y agenda tu reunión.",
    buttonLabel: "Equipo",
    chatGreeting: "¡Hola! Soy el asistente virtual de la empresa. ¿Con qué departamento deseas comunicarte hoy?",
    chatThinking: "Buscando consultores disponibles...",
    chatOffer: "Estupendo. Tengo a un profesional listo para atenderte. ¿Quieres bloquear una reunión en la agenda?",
    chatCta: "Agendar Reunión",
    categories: [
      { icon: User, name: "Atención al Cliente", docs: ["Soporte L1", "Soporte L2", "Atención Premium"] },
      { icon: Briefcase, name: "Ventas y Comercial", docs: ["Ejecutivo Junior", "Director Comercial"] },
      { icon: FileText, name: "Administración / Facturación", docs: ["Dpto. Cobros", "Contabilidad"] }
    ]
  },
  hair_transplant: {
    title: "Especialistas Capilares",
    subtitle: "Resuelve tus dudas sobre el injerto capilar y reserva tu valoración gratuita sin compromiso.",
    buttonLabel: "Valoración",
    chatGreeting: "Hola, soy tu asesora de recuperación capilar. Sé que dar el paso genera muchas dudas. ¿Qué te gustaría saber hoy?",
    chatThinking: "Analizando especialistas capilares disponibles...",
    chatOffer: "Entiendo perfectamente tus dudas. Tengo espacios disponibles para que un doctor experto analice tu caso particular. ¿Reservamos una valoración gratuita?",
    chatCta: "Agendar Valoración Capilar",
    categories: [
      { icon: User, name: "Técnica FUE / DHI", docs: ["Médico Cirujano Capilar", "Especialista FUE"] },
      { icon: Sparkles, name: "Tratamientos Preventivos", docs: ["Dermatólogo Tricólogo", "Especialista PRP"] },
      { icon: HeartPulse, name: "Seguimiento Postoperatorio", docs: ["Equipo Médico Seguimiento", "Asesor Post-Cirugía"] }
    ]
  }
};
