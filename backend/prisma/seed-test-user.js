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

  // --- Phase 2.4: Events Test Data ---
  const EVENT_TITLE = 'Playwright E2E Test Hackathon';
  
  // Clean up existing test events
  await prisma.event.deleteMany({
    where: { title: EVENT_TITLE }
  });

  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const deadlineDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  await prisma.event.create({
    data: {
      title: EVENT_TITLE,
      description: 'This is an automated test event created for Playwright E2E testing.',
      bannerImageUrl: 'https://via.placeholder.com/800x400.png?text=Playwright+Event',
      category: 'HACKATHON',
      organizer: 'E2E Testing Team',
      date: futureDate,
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      location: 'Virtual',
      registrationDeadline: deadlineDate,
      maximumParticipants: 100,
      registrationLink: 'https://playwright.dev/test-event',
      createdBy: user.id
    }
  });

  console.log(`Test user ${email} seeded successfully with Events test data`);

  // --- Phase 2.5: Resources Test Data ---
  const RESOURCE_PREFIX = 'Playwright E2E';

  // Clean up existing test resources
  await prisma.resourceCoreSubjectNote.deleteMany({
    where: { subjectName: { startsWith: RESOURCE_PREFIX } }
  });
  await prisma.resourcePreviousYearQuestion.deleteMany({
    where: { subjectName: { startsWith: RESOURCE_PREFIX } }
  });
  await prisma.resourceInterviewNote.deleteMany({
    where: { topicName: { startsWith: RESOURCE_PREFIX } }
  });
  await prisma.resourceCheatSheet.deleteMany({
    where: { name: { startsWith: RESOURCE_PREFIX } }
  });

  // Seed test resources
  await prisma.resourceCoreSubjectNote.create({
    data: {
      subjectName: `${RESOURCE_PREFIX} Subject Note`,
      resourceLink: 'https://playwright.dev/note'
    }
  });

  await prisma.resourcePreviousYearQuestion.create({
    data: {
      subjectName: `${RESOURCE_PREFIX} PYQ`,
      year: 2026,
      semester: 8,
      questionPaperLink: 'https://playwright.dev/pyq'
    }
  });

  await prisma.resourceInterviewNote.create({
    data: {
      topicName: `${RESOURCE_PREFIX} Interview`,
      interviewNotesLink: 'https://playwright.dev/interview'
    }
  });

  await prisma.resourceCheatSheet.create({
    data: {
      name: `${RESOURCE_PREFIX} Cheat Sheet`,
      imageUrl: 'https://via.placeholder.com/800x400.png?text=Playwright+Cheat+Sheet'
    }
  });

  console.log(`Test user ${email} seeded successfully with Resources test data`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
