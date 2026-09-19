const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanPlaywrightData() {
  console.log('Cleaning Playwright E2E test data...');

  // 1. Delete users and all their cascaded data
  const usersToDelete = await prisma.user.findMany({
    where: {
      email: {
        in: ['playwright@example.com', 'student-test@example.com', 'playwright-mentor@example.com']
      }
    }
  });

  if (usersToDelete.length > 0) {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['playwright@example.com', 'student-test@example.com', 'playwright-mentor@example.com']
        }
      }
    });
    console.log(`Deleted ${usersToDelete.length} test users and their cascaded records (events, careers, mentorships, etc).`);
  }

  // 2. Delete Resources which are not tied to User and won't cascade
  const delSubNotes = await prisma.resourceCoreSubjectNote.deleteMany({
    where: { subjectName: { startsWith: 'Playwright E2E' } }
  });
  console.log(`Deleted ${delSubNotes.count} Playwright E2E Subject Notes.`);

  const delPYQ = await prisma.resourcePreviousYearQuestion.deleteMany({
    where: { subjectName: { startsWith: 'Playwright E2E' } }
  });
  console.log(`Deleted ${delPYQ.count} Playwright E2E PYQs.`);

  const delIntNotes = await prisma.resourceInterviewNote.deleteMany({
    where: { topicName: { startsWith: 'Playwright E2E' } }
  });
  console.log(`Deleted ${delIntNotes.count} Playwright E2E Interview Notes.`);

  const delCheatSheets = await prisma.resourceCheatSheet.deleteMany({
    where: { name: { startsWith: 'Playwright E2E' } }
  });
  console.log(`Deleted ${delCheatSheets.count} Playwright E2E Cheat Sheets.`);

  console.log('Cleanup complete.');
}

cleanPlaywrightData()
  .catch((e) => {
    console.error('Error cleaning Playwright data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
