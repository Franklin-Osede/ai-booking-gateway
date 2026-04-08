export type VoiceProfile = {
  id: string;
  name: string;
  fullName: string;
  role: string;
  gender: 'F' | 'M';
  avatarUrl: string;
  elevenLabsId: string;
  tone: string;
  rhythm: string;
  useCase: string;
  isRecommended: boolean;
};

export const CLINIC_VOICES_ES: VoiceProfile[] = [
  // MUJERES (6)
  {
    id: "f_laura",
    name: "Laura",
    fullName: "Laura · Asesora Capilar",
    role: "Asesora Capilar",
    gender: "F",
    avatarUrl: "/avatars/woman_1.webp",
    elevenLabsId: "dNjJKg63Fr5AXwIdkATa", // Rachel (Standard HT)
    tone: "Cálido y empático",
    rhythm: "Medio",
    useCase: "Captación y Cierre",
    isRecommended: true
  },
  {
    id: "f_marta",
    name: "Marta",
    fullName: "Marta · Coordinadora Médica",
    role: "Coordinadora Médica",
    gender: "F",
    avatarUrl: "/avatars/woman_2.webp",
    elevenLabsId: "yiWEefwu5z3DQCM79clN", // Sarah
    tone: "Profesional y seguro",
    rhythm: "Pausado",
    useCase: "Dudas médicas",
    isRecommended: true
  },
  {
    id: "f_sofia",
    name: "Sofía",
    fullName: "Sofía · Atención Preventiva",
    role: "Atención Preventiva",
    gender: "F",
    avatarUrl: "/avatars/woman_3.webp",
    elevenLabsId: "h2cd3gvcqTp3m65Dysk7", // Domi
    tone: "Cercano",
    rhythm: "Medio",
    useCase: "Primer contacto",
    isRecommended: false
  },
  {
    id: "f_elena",
    name: "Elena",
    fullName: "Elena · Recepcionista",
    role: "Recepcionista",
    gender: "F",
    avatarUrl: "/avatars/woman_4.webp",
    elevenLabsId: "ERYLdjEaddaiN9sDjaMX", // Elli
    tone: "Juvenil y alegre",
    rhythm: "Rápido",
    useCase: "Agilidad en soporte",
    isRecommended: false
  },
  {
    id: "f_carmen",
    name: "Carmen",
    fullName: "Carmen · Directora Médica",
    role: "Directora Médica",
    gender: "F",
    avatarUrl: "/avatars/woman_5.webp",
    elevenLabsId: "1eHrpOW5l98cxiSRjbzJ", // Dorothy
    tone: "Maduro y experto",
    rhythm: "Pausado",
    useCase: "Generar autoridad",
    isRecommended: false
  },
  {
    id: "f_lucia",
    name: "Lucía",
    fullName: "Lucía · Postoperatorio",
    role: "Soporte Postoperatorio",
    gender: "F",
    avatarUrl: "/avatars/woman_6.webp",
    elevenLabsId: "gJlzF5JxsCvM5hQAoRyD", // Emily
    tone: "Dulce y paciente",
    rhythm: "Medio",
    useCase: "Seguimiento",
    isRecommended: false
  },

  // HOMBRES (6)
  {
    id: "m_carlos",
    name: "Carlos",
    fullName: "Carlos · Coordinador",
    role: "Coordinador Médico",
    gender: "M",
    avatarUrl: "/avatars/man_1.webp",
    elevenLabsId: "eEyWolF7iBpMA65GbtAm", // Antoni
    tone: "Grave y profesional",
    rhythm: "Pausado",
    useCase: "Dudas técnicas",
    isRecommended: true
  },
  {
    id: "m_andres",
    name: "Andrés",
    fullName: "Andrés · Especialista",
    role: "Especialista Capilar",
    gender: "M",
    avatarUrl: "/avatars/man_2.webp",
    elevenLabsId: "5IDdqnXnlsZ1FCxoOFYg", // Callum
    tone: "Claro y seguro",
    rhythm: "Medio",
    useCase: "Captación B2B",
    isRecommended: false
  },
  {
    id: "m_javier",
    name: "Javier",
    fullName: "Javier · Soporte",
    role: "Soporte Clínico",
    gender: "M",
    avatarUrl: "/avatars/man_3.webp",
    elevenLabsId: "851ejYcv2BoNPjrkw93G", // Charlie
    tone: "Cálido y humano",
    rhythm: "Medio",
    useCase: "Pacientes indecisos",
    isRecommended: false
  },
  {
    id: "m_diego",
    name: "Diego",
    fullName: "Diego · Cirujano Jefe",
    role: "Cirujano Jefe",
    gender: "M",
    avatarUrl: "/avatars/man_4.webp",
    elevenLabsId: "w8u1dIxiWVelUtUQg1MB", // Adam
    tone: "Maduro y rotundo",
    rhythm: "Pausado",
    useCase: "Casos complejos",
    isRecommended: false
  },
  {
    id: "m_marcos",
    name: "Marcos",
    fullName: "Marcos · Asesor Triage",
    role: "Asesor de Triage",
    gender: "M",
    avatarUrl: "/avatars/man_5.webp",
    elevenLabsId: "ePRCLu5JYbpX8LKCF2Wl", // Fin
    tone: "Dinámico",
    rhythm: "Rápido",
    useCase: "Primer filtro ágil",
    isRecommended: false
  },
  {
    id: "m_raul",
    name: "Raúl",
    fullName: "Raúl · Atención Directa",
    role: "Atención Inmediata",
    gender: "M",
    avatarUrl: "/avatars/man_6.webp",
    elevenLabsId: "t9LRTh3y1ioN00e9wsNh", // Patrick
    tone: "Directo y enérgico",
    rhythm: "Rápido",
    useCase: "Respuestas veloces",
    isRecommended: false
  }
];

export const CLINIC_VOICES_EN: VoiceProfile[] = [
   // FEMALES (6) - UK
   {
     id: "f_emma",
     name: "Emma",
     fullName: "Emma · Clinical Advisor",
     role: "Clinical Advisor",
     gender: "F",
     avatarUrl: "/avatars/woman_1.webp",
     elevenLabsId: "ZF6FPAbjXT4488VcRRnw", 
     tone: "Warm and empathetic",
     rhythm: "Medium",
     useCase: "Lead Capture & Booking",
     isRecommended: true
   },
   {
     id: "f_victoria",
     name: "Victoria",
     fullName: "Victoria · Medical Coordinator",
     role: "Medical Coordinator",
     gender: "F",
     avatarUrl: "/avatars/woman_2.webp",
     elevenLabsId: "dAlhI9qAHVIjXuVppzhW", 
     tone: "Professional and confident",
     rhythm: "Slow",
     useCase: "Medical Doubts",
     isRecommended: true
   },
   {
     id: "f_sophie",
     name: "Sophie",
     fullName: "Sophie · Preventive Care",
     role: "Preventive Care",
     gender: "F",
     avatarUrl: "/avatars/woman_3.webp",
     elevenLabsId: "CpGtoGY8SdJ5zkY4HAjX", 
     tone: "Approachable",
     rhythm: "Medium",
     useCase: "First Contact",
     isRecommended: false
   },
   {
     id: "f_charlotte",
     name: "Charlotte",
     fullName: "Charlotte · Receptionist",
     role: "Receptionist",
     gender: "F",
     avatarUrl: "/avatars/woman_4.webp",
     elevenLabsId: "sIak7pFapfSLCfctxdOu", 
     tone: "Youthful and cheerful",
     rhythm: "Fast",
     useCase: "Agile Support",
     isRecommended: false
   },
   {
     id: "f_eleanor",
     name: "Eleanor",
     fullName: "Eleanor · Medical Director",
     role: "Medical Director",
     gender: "F",
     avatarUrl: "/avatars/woman_5.webp",
     elevenLabsId: "rfkTsdZrVWEVhDycUYn9", 
     tone: "Mature and expert",
     rhythm: "Slow",
     useCase: "Authority Building",
     isRecommended: false
   },
   {
     id: "f_olivia",
     name: "Olivia",
     fullName: "Olivia · Post-op Support",
     role: "Post-operative Support",
     gender: "F",
     avatarUrl: "/avatars/woman_6.webp",
     elevenLabsId: "19STyYD15bswVz51nqLf", 
     tone: "Sweet and patient",
     rhythm: "Medium",
     useCase: "Follow-up",
     isRecommended: false
   },
 
   // MALES (6) - UK
   {
     id: "m_james",
     name: "James",
     fullName: "James · Coordinator",
     role: "Medical Coordinator",
     gender: "M",
     avatarUrl: "/avatars/man_1.webp",
     elevenLabsId: "Fahco4VZzobUeiPqni1S", 
     tone: "Deep and professional",
     rhythm: "Slow",
     useCase: "Technical Doubts",
     isRecommended: true
   },
   {
     id: "m_william",
     name: "William",
     fullName: "William · Specialist",
     role: "Clinical Specialist",
     gender: "M",
     avatarUrl: "/avatars/man_2.webp",
     elevenLabsId: "bDTlr4ICxntY9qVWyL0o", 
     tone: "Clear and confident",
     rhythm: "Medium",
     useCase: "B2B Capture",
     isRecommended: false
   },
   {
     id: "m_thomas",
     name: "Thomas",
     fullName: "Thomas · Support",
     role: "Clinical Support",
     gender: "M",
     avatarUrl: "/avatars/man_3.webp",
     elevenLabsId: "pYDLV125o4CgqP8i49Lg", 
     tone: "Warm and human",
     rhythm: "Medium",
     useCase: "Undecided Patients",
     isRecommended: false
   },
   {
     id: "m_arthur",
     name: "Arthur",
     fullName: "Arthur · Head Surgeon",
     role: "Head Surgeon",
     gender: "M",
     avatarUrl: "/avatars/man_4.webp",
     elevenLabsId: "lUTamkMw7gOzZbFIwmq4", 
     tone: "Mature and definitive",
     rhythm: "Slow",
     useCase: "Complex Cases",
     isRecommended: false
   },
   {
     id: "m_harry",
     name: "Harry",
     fullName: "Harry · Triage Advisor",
     role: "Triage Advisor",
     gender: "M",
     avatarUrl: "/avatars/man_5.webp",
     elevenLabsId: "UaYTS0wayjmO9KD1LR4R", 
     tone: "Dynamic",
     rhythm: "Fast",
     useCase: "Agile Filtering",
     isRecommended: false
   },
   {
     id: "m_george",
     name: "George",
     fullName: "George · Direct Care",
     role: "Immediate Care",
     gender: "M",
     avatarUrl: "/avatars/man_6.webp",
     elevenLabsId: "ZCtBm65V5P2WRgHF7fKI", 
     tone: "Direct and energetic",
     rhythm: "Fast",
     useCase: "Quick Responses",
     isRecommended: false
   }
 ];

 export function getVoices(lang: string = 'es'): VoiceProfile[] {
    if (lang.toLowerCase().startsWith('en')) {
       return CLINIC_VOICES_EN;
    }
    return CLINIC_VOICES_ES;
 }

 export const CLINIC_VOICES = CLINIC_VOICES_ES; // Legacy support
