import { Stethoscope, HeartPulse, Activity, User, Scissors, Sparkles, Droplet, UserCheck, Home, Key, Building2, Car, Wrench, ShieldCheck } from "lucide-react";

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
      { icon: Stethoscope, name: "Urología", docs: ["Dr. Pérez", "Dra. Gómez", "Dr. Sánchez", "Dr. Castro"] },
      { icon: HeartPulse, name: "Cardiología", docs: ["Dr. Torres", "Dr. Ruiz", "Dr. Núñez"] },
      { icon: Activity, name: "Fisioterapia", docs: ["Dra. Ramírez", "Lic. López", "Lic. Rodrigo"] },
      { icon: User, name: "Ginecología", docs: ["Dra. Muñoz", "Dr. Vargas", "Dra. León"] },
      { icon: User, name: "Psicología", docs: ["Dr. Medina", "Dra. Ríos", "Dr. Molina"] }
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
      { icon: Scissors, name: "Peluquería", docs: ["Ana López", "Carlos Ruiz", "Sofía Martín", "David León"] },
      { icon: Sparkles, name: "Tratamientos Faciales", docs: ["Marta Gómez", "Lucía Torres"] },
      { icon: Droplet, name: "Manicura & Pedicura", docs: ["Elena Ríos", "Carmen Núñez"] },
      { icon: UserCheck, name: "Masajes Relajantes", docs: ["Javier Muñoz", "Raúl Vargas"] }
    ]
  },
  realestate: {
    title: "Selecciona tu asesor",
    subtitle: "Encuentra al agente inmobiliario ideal para guiarte en tu próxima inversión.",
    buttonLabel: "Agentes",
    chatGreeting: "Hola, soy tu asesor inmobiliario virtual. ¿Buscas comprar, alquilar o vender?",
    chatThinking: "Buscando asesores especializados en esa zona...",
    chatOffer: "He encontrado al agente perfecto para ayudarte con esa propiedad. ¿Agendamos una visita o videollamada?",
    chatCta: "Agendar Visita",
    categories: [
      { icon: Home, name: "Venta Residencial", docs: ["Laura Pérez", "Roberto Gómez", "Miguel Sánchez"] },
      { icon: Key, name: "Alquileres", docs: ["Patricia Torres", "Luis Ruiz", "Mónica Núñez"] },
      { icon: Building2, name: "Comercial & Oficinas", docs: ["Andrés Ramírez", "Sofía López"] }
    ]
  },
  automotive: {
    title: "Elige tu asesor comercial",
    subtitle: "Selecciona al experto que te guiará en la prueba o compra de tu próximo vehículo.",
    buttonLabel: "Asesores",
    chatGreeting: "¡Hola! Soy tu asistente de concesionario. ¿En qué modelo de vehículo estás interesado?",
    chatThinking: "Verificando disponibilidad de vehículos y asesores...",
    chatOffer: "Tenemos exactamente lo que buscas disponible. ¿Te gustaría agendar una prueba de conducción?",
    chatCta: "Reservar Prueba",
    categories: [
      { icon: Car, name: "Ventas Nuevos", docs: ["Fernando Castro", "Alberto Ruiz"] },
      { icon: ShieldCheck, name: "Vehículos de Ocasión", docs: ["Javier León", "Sonia Vargas"] },
      { icon: Wrench, name: "Taller & Posventa", docs: ["Carlos Molina", "Pedro Ríos", "Marta Díaz"] }
    ]
  }
};
