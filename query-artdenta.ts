import { prisma } from './src/lib/prisma';
async function main() {
  const clinic = await prisma.clinic.findFirst({
    where: { name: { contains: 'Artdenta', mode: 'insensitive' } }
  });
  if (!clinic) return console.log("not found");
  const logs = await prisma.outreachLog.findMany({ where: { clinicId: clinic.id } });
  console.log("LOGS:", logs.length);
  const tasks = await prisma.followUpTask.findMany({ where: { clinicId: clinic.id } });
  console.log("TASKS:", tasks.length);
}
main().catch(console.error).finally(() => process.exit(0));
