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

  const user = await prisma.user.upsert({
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

  // Ensure "Arrays" category exists
  const arraysCategory = await prisma.dsaCategory.upsert({
    where: { name: 'Arrays' },
    update: {},
    create: { name: 'Arrays', description: 'Consecutive memory blocks, prefix sums, sliding windows' }
  });

  // Clean up any existing DSA problems for this test user in Arrays to ensure a fresh state
  await prisma.dsaProblem.deleteMany({
    where: {
      userId: user.id,
      categoryId: arraysCategory.id,
    }
  });

  const twoSum = await prisma.dsaProblem.create({
    data: {
      userId: user.id,
      categoryId: arraysCategory.id,
      problemName: 'Two Sum',
      problemLink: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'EASY',
    }
  });

  const threeSum = await prisma.dsaProblem.create({
    data: {
      userId: user.id,
      categoryId: arraysCategory.id,
      problemName: '3Sum',
      problemLink: 'https://leetcode.com/problems/3sum/',
      difficulty: 'MEDIUM',
    }
  });

  // Ensure completion status is false initially
  await prisma.userDsaProblem.upsert({
    where: { userId_problemId: { userId: user.id, problemId: twoSum.id } },
    update: { completed: false },
    create: { userId: user.id, problemId: twoSum.id, completed: false }
  });

  await prisma.userDsaProblem.upsert({
    where: { userId_problemId: { userId: user.id, problemId: threeSum.id } },
    update: { completed: false },
    create: { userId: user.id, problemId: threeSum.id, completed: false }
  });

  console.log(`Test user ${email} seeded successfully with DSA test data`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
