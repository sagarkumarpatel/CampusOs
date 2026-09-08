require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    console.error('TEST_EMAIL or TEST_PASSWORD missing in env vars');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, roles: ['STUDENT'] },
    create: {
      email,
      passwordHash,
      roles: ['STUDENT'],
      profile: {
        create: {
          firstName: 'Playwright',
          lastName: 'Tester',
        }
      }
    }
  });

  console.log(`Test user ${email} seeded successfully`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
