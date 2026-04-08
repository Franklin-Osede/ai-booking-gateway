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
  voice_scripts?: {
    ask_service_intro: string;
    ask_service_options: Record<string, string>;
    deep_dive_chips?: Record<string, string[]>;
    deep_dive_scripts?: Record<string, string>;
    ask_service_fallback: string;
    confirm_booking: string;
  };
};

export const ES_DICTIONARY: Record<string, NicheConfig> = {
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
    ],
    voice_scripts: {
      ask_service_intro: "En tu primera visita gratuita realizaremos un diseño y diagnóstico clínico completo.",
      ask_service_options: {
         "Ortodoncia": "Alinearemos tu sonrisa con tecnología 3D... Para enfocar mejor tu primera visita, ¿qué valoras más: la invisibilidad o la rapidez?",
         "Blanqueamiento Dental": "Recuperaremos el blanco natural de tus dientes cuidando el esmalte. Cuéntame, ¿sientes que tus dientes tienen manchas, o simplemente han perdido su color original?",
         "Implantología": "Utilizamos implantes de titanio de altísima gama. Para enfocar tu diagnóstico, ¿estás buscando reemplazar un solo diente o una arcada completa?",
         "Odontopediatría": "Cuidaremos la sonrisa de los más pequeños con el máximo mimo... ¿Estás buscando una primera revisión general, o hay algún dolor específico?"
      },
      deep_dive_chips: {
         "Ortodoncia": ["Estética Invisible", "Máxima Rapidez", "Ver Especialistas"],
         "Blanqueamiento Dental": ["Tengo Manchas", "Pérdida de Color", "Ver Especialistas"],
         "Implantología": ["Un solo diente", "Arcada Completa", "Ver Especialistas"],
         "Odontopediatría": ["Revisión General", "Dolor Específico", "Ver Especialistas"]
      },
      deep_dive_scripts: {
         "Estética Invisible": "Excelente. Contamos con alineadores invisibles de primer nivel... Nadie notará que los llevas puestos.",
         "Máxima Rapidez": "Entendido. Con nuestro sistema de brackets Damon, reducimos el tiempo de tratamiento a la mitad... consiguiendo resultados mucho más rápidos.",
         "Tengo Manchas": "Comprendo. Nuestro blanqueamiento clínico avanzado, elimina hasta las manchas más profundas desde la primera sesión.",
         "Pérdida de Color": "Perfecto. Revitalizaremos tu esmalte, devolviéndole su brillo y blanco natural... de manera indolora.",
         "Un solo diente": "Estupendo. Realizaremos un TAC gratuito en 3D para medir tu hueso... y así podremos insertar el implante en el mismo día.",
         "Arcada Completa": "Comprendo. Con la técnica All-on-four, recuperarás toda tu sonrisa en apenas 24 horas... y con sedación consciente.",
         "Revisión General": "Genial. Haremos una limpieza profunda, y te enseñaremos técnicas de prevención para evitar cualquier caries invisible.",
         "Dolor Específico": "No te preocupes. Haremos una radiografía focalizada, para detectar exactamente el foco del dolor... y poder aliviarte al momento."
      },
      ask_service_fallback: "TEXT_INTRO ¿Te gustaría que agendemos una cita de valoración... o prefieres que te dé más información de los tratamientos?",
      confirm_booking: "¡Estupendo! Tu reserva con DR_NAME para el día SELECTED_DATE a las SPOKEN_TIME ha quedado confirmada."
    }
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
    ],
    voice_scripts: {
      ask_service_intro: "Analizaremos tus necesidades en profundidad para ofrecerte el mejor resultado.",
      ask_service_options: {
         "Peluquería": "Nuestros estilistas son expertos en colorimetría y diseño de corte. ¿Estás buscando un cambio de look radical o simplemente retocar tu estilo habitual?",
         "Tratamientos Faciales": "Nuestros tratamientos faciales te devolverán la luz y firmeza natural... Cuéntame, ¿te preocupan más las líneas de expresión o la falta de luminosidad?",
         "Manicura & Pedicura": "Usamos esmaltes orgánicos de ultra-duración. ¿Prefieres una manicura semipermanente clásica o atreverte con Nail Art y extensiones?",
         "Masajes Relajantes": "Conseguiremos que desconectes al 100%. ¿Sientes mucha tensión muscular acumulada, o buscas pura relajación antiestrés?"
      },
      deep_dive_chips: {
         "Peluquería": ["Cambio Radical", "Retoque", "Ver Especialistas"],
         "Tratamientos Faciales": ["Líneas de expresión", "Falta de luz", "Ver Especialistas"],
         "Manicura & Pedicura": ["Semipermanente", "Nail Art", "Ver Especialistas"],
         "Masajes Relajantes": ["Tensión Muscular", "Relajación Pura", "Ver Especialistas"]
      },
      deep_dive_scripts: {
         "Cambio Radical": "¡Me encanta la idea! Estudiaremos tus facciones para diseñar el corte y tono que más te realce.",
         "Retoque": "Genial, mantendremos la esencia de tu estilo asegurándonos de que tu cabello luzca perfecto y sano.",
         "Líneas de expresión": "Perfecto, tenemos protocolos con Radiofrecuencia e hidratación profunda que alisan la piel desde la primera sesión.",
         "Falta de luz": "Reactivaremos la circulación y renovaremos la capa superficial de tu piel para un efecto 'glow' inmediato.",
         "Semipermanente": "Nuestra manicura semipermanente cuida la uña natural y te garantizará un brillo impecable por semanas.",
         "Nail Art": "¡Qué divertido! Nuestras técnicas en esculpido y diseño crearán resultados únicos en tus manos.",
         "Tensión Muscular": "Aplicaremos un masaje descontracturante profundo en espalda y cuello para liberar cargas.",
         "Relajación Pura": "Usaremos aromaterapia y pases lentos sedativos para que tu mente y tu cuerpo fluyan absolutamente."
      },
      ask_service_fallback: "TEXT_INTRO ¿Buscamos un hueco en nuestra agenda para que vengas a cuidarte?",
      confirm_booking: "¡Estupendo! Tu sesión para el día SELECTED_DATE a las SPOKEN_TIME ha quedado súper confirmada."
    }
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
    ],
    voice_scripts: {
      ask_service_intro: "En tu valoración médica analizaremos tu caso particular sin compromiso.",
      ask_service_options: {
         "Técnica FUE / DHI": "La técnica F-U-E trasplanta pelo a pelo sin dolor... Cuéntame brevemente, ¿Notas más pérdida en la zona de las entradas, o en la coronilla?",
         "Tratamientos Preventivos": "Nuestros tratamientos estimulan el crecimiento... ¿Estás notando simplemente un pelo más fino y débil, o una caída abundante de más de 100 pelos diarios?",
         "Seguimiento Postoperatorio": "El correcto seguimiento es clave... ¿Te operaste recientemente y quieres revisión, o sientes molestias tras la cirugía?"
      },
      deep_dive_chips: {
         "Técnica FUE / DHI": ["En las Entradas", "En la Coronilla", "Ambas zonas"],
         "Tratamientos Preventivos": ["Pelo fino y débil", "Caída abundante", "Hablar con Asesor"],
         "Seguimiento Postoperatorio": ["Revisión Mensual", "Tengo molestias", "Hablar con Asesor"]
      },
      deep_dive_scripts: {
         "En las Entradas": "Comprendo. Reconstruir la zona de las entradas requiere de un diseño muy detallado y gran precisión para que el resultado sea completamente indetectable.",
         "En la Coronilla": "Entendido. La coronilla requiere mayor número de unidades foliculares y paciencia porque el riego sanguíneo allí es diferente.",
         "Ambas zonas": "Perfecto. Necesitaremos realizar un diseño integral que redensifique ambas áreas conservando una zona donante sana.",
         "Pelo fino y débil": "Para ese adelgazamiento miniaturizado, la mesoterapia con vitaminas da un chute de energía directo al folículo logrando engrosarlo rápidamente.",
         "Caída abundante": "Esa caída en fase telógena la frenamos radicalmente combinando fármacos orales y PRP directamente en el cuero cabelludo.",
         "Revisión Mensual": "Llevar un control fotográfico mensual es fundamental para comprobar que los folículos han arraigado bien y están creciendo.",
         "Tengo molestias": "No te preocupes en absoluto, es totalmente normal en la fase de cicatrización; nuestro equipo médico te recetará lo adecuado."
      },
      ask_service_fallback: "TEXT_INTRO ¿Te gustaría ver nuestro calendario para agendar tu consulta particular?",
      confirm_booking: "¡Estupendo! Tu reserva de valoración capilar con DR_NAME ha quedado confirmada. Te esperamos."
    }
  },
  regenerative: {
    title: "Medicina Regenerativa",
    subtitle: "Rejuvenece tu cuerpo a nivel celular y agenda tu valoración con especialistas en Stem Cells.",
    buttonLabel: "Valoración",
    chatGreeting: "Hola, soy tu asesora en medicina regenerativa. ¿Sobre qué tratamiento con células madre o terapia avanzada te gustaría informarte?",
    chatThinking: "Revisando el equipo especializado en terapias avanzadas...",
    chatOffer: "Perfecto. Te puedo agendar una consultoría rápida con nuestro especialista en regeneración celular para que analice tu caso. ¿Te viene bien?",
    chatCta: "Agendar Valoración",
    categories: [
      { icon: HeartPulse, name: "Terapia de Células Madre", docs: ["Dr. Especialista Stem Cells", "Biólogo Clínico"] },
      { icon: Activity, name: "Plasma Rico en Plaquetas (PRP)", docs: ["Especialista PRP", "Dermatólogo"] },
      { icon: Sparkles, name: "Rejuvenecimiento Celular", docs: ["Medicina Antiaging", "Médico Estético"] }
    ],
    voice_scripts: {
      ask_service_intro: "Evaluaremos tu estado celular para personalizar tu terapia.",
      ask_service_options: {
         "Terapia de Células Madre": "Extraemos células madre mesenquimales puras... ¿Buscas aplicarlo para tratar desgaste articular, o como terapia antienvejecimiento intravenosa?",
         "Plasma Rico en Plaquetas (PRP)": "El PRP utiliza los factores de crecimiento de tu propio cuerpo... ¿Estás buscando este tratamiento para regeneración capilar o para antienvejecimiento facial?",
         "Rejuvenecimiento Celular": "Reduciremos tu edad biológica... ¿Te sientes crónicamente fatigado últimamente, o buscas mejorar tu estética y longevidad?"
      },
      deep_dive_chips: {
         "Terapia de Células Madre": ["Desgaste Articular", "Terapia Intravenosa", "Ver Especialistas"],
         "Plasma Rico en Plaquetas (PRP)": ["Regeneración Capilar", "Rejuvenecimiento Facial", "Ver Especialistas"],
         "Rejuvenecimiento Celular": ["Fatiga Crónica", "Longevidad Estética", "Ver Especialistas"]
      },
      deep_dive_scripts: {
         "Desgaste Articular": "Excelente, inyectar células madre en articulaciones como la rodilla regenera el cartílago evitando cirugías invasivas.",
         "Terapia Intravenosa": "Genial, la inyección intravenosa reparte las células por todo el torrente sanguíneo reparando órganos internos y mejorando tu vitalidad general.",
         "Regeneración Capilar": "El plasma nutrirá tus folículos inactivos, acelerando el crecimiento y frenando la caída del pelo de manera 100% natural.",
         "Rejuvenecimiento Facial": "Aplicaremos tu plasma en rostro y cuello induciendo la creación de colágeno nuevo para borrar líneas finas y ganar muchísima luminosidad.",
         "Fatiga Crónica": "Reactivaremos la eficiencia de tus mitocondrias con sueroterapia especializada para devolverte los niveles de energía de hace 10 años.",
         "Longevidad Estética": "Sincronizaremos tu edad biológica con terapias ortomoleculares y exosomas para lograr un bienestar estético que se note desde el interior."
      },
      ask_service_fallback: "Perfecto. TEXT_INTRO Es uno de los procedimientos más vanguardistas que existen. ¿Quieres bloquear una primera cita para analizar tu idoneidad?",
      confirm_booking: "¡Estupendo! Tu sesión de valoración con DR_NAME para el día SELECTED_DATE a las SPOKEN_TIME ha quedado confirmada."
    }
  },
  aesthetic: {
    title: "Medicina Estética Avanzada",
    subtitle: "Realza tu belleza natural con tratamientos médicos mínimamente invasivos y aparatología de última generación.",
    buttonLabel: "Valoración",
    chatGreeting: "Hola, soy tu asesora clínica. ¿Qué aspecto de tu rostro o cuerpo te gustaría mejorar hoy?",
    chatThinking: "Revisando la agenda de la clínica estética...",
    chatOffer: "Genial. Tengo huecos libres con nuestro equipo médico especialista para analizar tu piel. ¿Deseas agendar una valoración facial?",
    chatCta: "Agendar Valoración Médica",
    categories: [
      { icon: Sparkles, name: "Armonización Facial", docs: ["Dr. Cirujano Plástico", "Médico Estético"] },
      { icon: HeartPulse, name: "Inyectables y Calidad", docs: ["Dermatólogica Quirúrgica", "Especialista Inyectables"] },
      { icon: Activity, name: "Láser Médico", docs: ["Medicina Láser", "Técnico Láser Avanzado"] }
    ],
    voice_scripts: {
      ask_service_intro: "En nuestra clínica priorizamos resultados elegantes y muy naturales.",
      ask_service_options: {
         "Armonización Facial": "Un rejuvenecimiento facial integral recupera tus volúmenes perdidos... ¿Sientes que necesitas más soporte en pómulos y ojeras, o prefieres definir la línea de la mandíbula?",
         "Inyectables y Calidad": "Nuestra toxina botulínica y biostimuladores consiguen una piel de porcelana... ¿A simple vista, te preocupan más las arrugas al gesticular, o prefieres hidratar tus labios?",
         "Láser Médico": "Contamos con tecnología puntera como Morpheus 8 y luz pulsada... ¿Buscas eliminar manchas y rojeces, o tratar marcas de acné profundas?"
      },
      deep_dive_chips: {
         "Armonización Facial": ["Ojeras y Pómulos", "Línea Mandibular", "Ver Especialistas"],
         "Inyectables y Calidad": ["Arrugas de Expresión", "Volumen en Labios", "Ver Especialistas"],
         "Láser Médico": ["Manchas y Rojeces", "Marcas Módulo Acné", "Ver Especialistas"]
      },
      deep_dive_scripts: {
         "Ojeras y Pómulos": "Excelente. Rellenaremos de forma muy sutil con ácido hialurónico el 'valle de lágrimas'... eliminando por completo ese aspecto de cara cansada.",
         "Línea Mandibular": "Perfecto. Con Radiesse o inductores de colágeno, marcaremos ese óvalo facial y tensaremos sutilmente el cuello... aportando mucha juventud.",
         "Arrugas de Expresión": "Totalmente de acuerdo. Con unas unidades de toxina en la frente o patas de gallo... despejaremos la mirada manteniéndola súper expresiva.",
         "Volumen en Labios": "Genial. Emplearemos ácido hialurónico ultra-elástico para darte un volumen jugoso o simplemente hidratar, siempre con un diseño Russian Lips si lo deseas.",
         "Manchas y Rojeces": "Comprendo. Utilizaremos Láser CO2 combinado con luz pulsada intensa, para unificar todo tu tono y barrer el melasma o daño solar.",
         "Marcas Módulo Acné": "Estupendo. Radiofrecuencia fraccionada como Morpheus 8 romperá el tejido cicatrizal... generando una piel completamente lisa y sin poros."
      },
      ask_service_fallback: "TEXT_INTRO ¿Te gustaría agendar una primera visita de evaluación médica... o prefieres detalles sobre los precios?",
      confirm_booking: "¡Sensacional! Tus cita para valoración con DR_NAME para el dıa SELECTED_DATE a las SPOKEN_TIME ha quedado confirmada al cien por cien."
    }
  },
  hair_salon: {
    title: "Encuentra tu Estilista",
    subtitle: "Reserva con los mejores profesionales en peluquería, colorimetría y diseño de corte.",
    buttonLabel: "Estilistas",
    chatGreeting: "¡Hola! Soy tu asistente virtual de peluquería. ¿Qué cambio de look te apetece hoy?",
    chatThinking: "Buscando sillones disponibles en la peluquería...",
    chatOffer: "Perfecto. Veo hueco con nuestros mejores estilistas. ¿Reservamos de una vez tu sesión?",
    chatCta: "Reservar Cita",
    categories: [
      { icon: Scissors, name: "Corte y Peinado", docs: ["Director Creativo", "Estilista Senior"] },
      { icon: Sparkles, name: "Color y Mechas", docs: ["Experto Colorista", "Estilista Titular"] },
      { icon: Droplet, name: "Tratamientos Capilares", docs: ["Especialista en Keratina", "Técnico Capilar"] }
    ],
    voice_scripts: {
      ask_service_intro: "Nuestros estilistas evaluarán tu tipo de cabello antes de empezar.",
      ask_service_options: {
         "Corte y Peinado": "Diseñaremos el corte que mejor favorezca a tus facciones... ¿Estás pensando en mantener el largo saneando puntas, o quieres un corte radical?",
         "Color y Mechas": "Utilizamos tintes sin amoniaco fantásticos. ¿Te apetece probar unas mechas Balayage naturales, o un baño de color uniforme?",
         "Tratamientos Capilares": "Cuidar la salud del cabello es clave. ¿Sientes el cabello muy encrespado, o demasiado seco y quebradizo?"
      },
      deep_dive_chips: {
         "Corte y Peinado": ["Sanear Puntas", "Corte Radical", "Ver Estilistas"],
         "Color y Mechas": ["Balayage", "Baño de Color", "Ver Coloristas"],
         "Tratamientos Capilares": ["Pelo Encrespado", "Pelo Quebradizo", "Ver Especialistas"]
      },
      deep_dive_scripts: {
         "Sanear Puntas": "Perfecto, aplicaremos un corte técnico que eliminará las puntas abiertas sin robarte ni un solo centímetro de largura que no quieras perder.",
         "Corte Radical": "¡Me encanta tu valentía! Estudiaremos la forma de tu rostro ovalado o cuadrado para dar con el estilo rompedor perfecto.",
         "Balayage": "Genial. Nuestros coloristas dominarán la técnica a mano alzada para dejarte un degradado superluminoso y nada artificial.",
         "Baño de Color": "Fantástico, el baño de color aportará una uniformidad increíble y un brillo espejo espectacular a toda tu melena.",
         "Pelo Encrespado": "Para ese encrespamiento indomable te irá genial nuestra Taninoplastia. Alisa y relaja la onda dejándote un pelo brillante a prueba de humedad.",
         "Pelo Quebradizo": "En ese caso, nuestra cauterización con ácido hialurónico sellará tu cutícula de inmediato frenando la rotura."
      },
      ask_service_fallback: "TEXT_INTRO ¿Vamos revisando el calendario para reservar un hueco y dejarte espectacular?",
      confirm_booking: "¡Genial! Tu cita con DR_NAME para el día SELECTED_DATE a las SPOKEN_TIME está confirmadísima."
    }
  }
};
