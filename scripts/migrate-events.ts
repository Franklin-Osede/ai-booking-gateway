import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Iniciando migración de datos (Fase D)...");

  // 1. Obtener todos los eventos antiguos
  const oldEvents = await prisma.clinicEvent.findMany();
  console.log(`Se encontraron ${oldEvents.length} ClinicEvent(s) antiguos para migrar.`);

  let migratedTasks = 0;
  let generatedLogs = 0;

  for (const event of oldEvents) {
    // 2. Si el evento tenía un feedback, lo guardamos como un ActivityLog inmutable completado
    if (event.feedback) {
      await prisma.outreachLog.create({
        data: {
          clinicId: event.clinicId,
          status: "CONTACTED",
          type: "NOTE",
          result: "COMPLETED",
          attemptNum: 1,
          metadata: {
            notes: event.feedback,
            migration: "from_clinic_event"
          },
          createdAt: event.createdAt
        }
      });
      generatedLogs++;
    }

    // 3. Crear el FollowUpTask correspondiente (si la fecha es futura, lo dejamos PENDING, si es pasada, COMPLETED)
    const isPast = new Date(event.eventDate).getTime() < new Date().getTime();
    
    await prisma.followUpTask.create({
      data: {
        clinicId: event.clinicId,
        dueDate: event.eventDate,
        type: "CALL", // Valor por defecto
        status: isPast ? "COMPLETED" : "PENDING",
        attemptNum: 1,
        createdAt: event.createdAt,
        completedAt: isPast ? event.eventDate : null
      }
    });
    migratedTasks++;
  }

  // Opcional: Cuando estés seguro, puedes descomentar la siguiente línea para purgar los viejos
  // await prisma.clinicEvent.deleteMany();

  console.log("Migración completada con éxito.");
  console.log(`- Tareas creadas: ${migratedTasks}`);
  console.log(`- Logs inmutables generados a partir de feedback: ${generatedLogs}`);
}

main()
  .catch((e) => {
    console.error("Error durante la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
