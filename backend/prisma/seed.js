const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

async function main() {
  console.log('Seeding DSA categories...');
  for (const cat of dsaCategories) {
    await prisma.dsaCategory.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: { name: cat.name, description: cat.description }
    });
  }
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
