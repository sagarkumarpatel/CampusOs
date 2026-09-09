const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'playwright@example.com' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const problems = await prisma.dsaProblem.findMany({ where: { userId: user.id } });
  console.log(`User ${user.email} has ${problems.length} problems.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
