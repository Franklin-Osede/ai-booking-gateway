import { prisma } from "@/lib/prisma";
import { getPolicy } from "@/config/followupPolicies";
type ActivityResult = "ANSWERED" | "NO_ANSWER" | "LEFT_MESSAGE" | "COMPLETED";
type ActivityType = "CALL" | "WHATSAPP" | "EMAIL" | "NOTE" | "SYSTEM";
import { addDays } from "date-fns";

export interface RegisterResultInput {
  clinicId: string;
  taskId?: string; // Optional, by default we associate with active task if exist
  type: ActivityType;
  result: ActivityResult;
  notes?: string;
}

export async function processFollowUpResult(input: RegisterResultInput) {
  const { clinicId, taskId, type, result, notes } = input;

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch current task if provided to get attempt num, otherwise assume attempt 1
    let task = null;
    let attemptNum = 1;
    
    if (taskId) {
      task = await tx.followUpTask.findUnique({ where: { id: taskId } });
      if (task) {
        attemptNum = task.attemptNum;
      }
    }

    // 2. Create the immutable ActivityLog (OutreachLog)
    const log = await tx.outreachLog.create({
      data: {
        clinicId,
        type,
        result,
        attemptNum,
        status: result === "ANSWERED" ? "CONTACTED" : "NO_ANSWER", // Legacy status for backward comp
        metadata: notes ? { notes } : {},
      }
    });

    // 3. Complete the current Task
    if (task) {
      await tx.followUpTask.update({
        where: { id: task.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
    }

    // 4. Policy Engine: Decide next step
    if (result === "NO_ANSWER" || result === "LEFT_MESSAGE") {
      const policy = getPolicy("default"); // we could derive policy based on clinic industry
      
      if (attemptNum < policy.maxAttempts) {
        const nextAttemptNum = attemptNum + 1;
        // Interval is 0-indexed in the array for attempt 2 it will use intervalsDays[0]
        const intervalIndex = attemptNum - 1;
        const daysToWait = policy.intervalsDays[intervalIndex] || 1;
        
        const nextDueDate = addDays(new Date(), daysToWait);

        await tx.followUpTask.create({
          data: {
            clinicId,
            dueDate: nextDueDate,
            type: policy.defaultTaskType,
            attemptNum: nextAttemptNum,
            status: "PENDING"
          }
        });
      }
    }

    // 5. Optionally update the Clinic's nextStep or general status for backwards compatibility
    await tx.clinic.update({
      where: { id: clinicId },
      data: {
        updatedAt: new Date()
      }
    });

    return log;
  });
}
