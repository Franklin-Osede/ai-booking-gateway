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

export const CLINIC_VOICES: VoiceProfile[] = [
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
