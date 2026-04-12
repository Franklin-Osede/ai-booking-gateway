import { prisma } from './src/lib/prisma';
async function main() {
  await prisma.clinic.updateMany({ where: { slug: 'sanlucarhairclinic' }, data: { location: 'Sanlúcar de Barrameda' }});
  await prisma.clinic.updateMany({ where: { slug: 'micropigmentacioncapilarcadiz' }, data: { location: 'Cádiz' }});
  await prisma.clinic.updateMany({ where: { slug: 'drpanno' }, data: { location: 'Marbella' }});
  await prisma.clinic.updateMany({ where: { slug: 'injertocapilarfuejerez' }, data: { location: 'Jerez de la Frontera' }});
  console.log('Fixed locations');
}
main().finally(() => prisma.$disconnect());
