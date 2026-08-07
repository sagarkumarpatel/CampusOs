const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database records...');

  // Truncate tables with cascade or in order of dependencies
  // Order: UserDsaProblem -> DsaProblem -> Profile -> RefreshToken -> MentorshipRequest -> MentorProfile -> User -> DsaCategory
  await prisma.userDsaProblem.deleteMany({});
  await prisma.dsaProblem.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.mentorshipRequest.deleteMany({});
  await prisma.mentorProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.dsaCategory.deleteMany({});

  console.log('Database records cleared successfully.');

  // Re-seed category templates
  console.log('Seeding DSA categories...');
  const dsaCategories = [
    { name: 'Arrays', description: 'Consecutive memory blocks, prefix sums, sliding windows' },
    { name: 'Strings', description: 'Text processing, substrings, matching patterns' },
    { name: 'Linked Lists', description: 'Pointers, node traversals, list reversals' },
    { name: 'Stack', description: 'Last-In-First-Out processing, monotonic stacks' },
    { name: 'Queue', description: 'First-In-First-Out, breadth-first traversals' },
    { name: 'Binary Search', description: 'Divide and conquer search spaces' },
    { name: 'Trees', description: 'Hierarchical nodes, BSTs, traversals' },
    { name: 'Heap', description: 'Priority queues, top-K problems' },
    { name: 'Graphs', description: 'Networked vertices, BFS, DFS, shortest path' },
    { name: 'Dynamic Programming', description: 'Memoization, tabulation, subproblem optimizations' }
  ];

  for (const cat of dsaCategories) {
    await prisma.dsaCategory.create({
      data: { name: cat.name, description: cat.description }
    });
  }

  console.log('DSA categories re-seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
