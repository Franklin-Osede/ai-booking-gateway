type TaskType = "CALL" | "WHATSAPP" | "EMAIL" | "MEETING";

export interface PolicyRule {
  intervalsDays: number[]; // Días a esperar entre cada intento
  maxAttempts: number;     // Número máximo de veces que insistimos
  defaultTaskType: TaskType;
}

export const FOLLOWUP_POLICIES: Record<string, PolicyRule> = {
  default: {
    intervalsDays: [1, 3, 7], // Intento 2 en 1 día, Intento 3 en 3 días
    maxAttempts: 3,
    defaultTaskType: "CALL"
  },
  aggressive: {
    intervalsDays: [1, 1, 2, 3],
    maxAttempts: 4,
    defaultTaskType: "CALL"
  },
  relaxed: {
    intervalsDays: [2, 5, 10],
    maxAttempts: 3,
    defaultTaskType: "EMAIL"
  }
};

export function getPolicy(policyName: string = "default"): PolicyRule {
  return FOLLOWUP_POLICIES[policyName] || FOLLOWUP_POLICIES["default"];
}
