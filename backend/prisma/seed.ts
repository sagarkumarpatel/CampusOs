import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seedData = [
    {
      name: 'Data Structures & Algorithms',
      description: 'Master core computational thinking and coding interview patterns.',
      icon: '📦',
      color: '#6366f1',
      topics: [
        { title: 'Arrays', difficulty: Difficulty.EASY },
        { title: 'Strings', difficulty: Difficulty.EASY },
        { title: 'Linked Lists', difficulty: Difficulty.MEDIUM },
        { title: 'Stack', difficulty: Difficulty.EASY },
        { title: 'Queue', difficulty: Difficulty.EASY },
        { title: 'Trees', difficulty: Difficulty.MEDIUM },
        { title: 'Graphs', difficulty: Difficulty.HARD },
        { title: 'Dynamic Programming', difficulty: Difficulty.HARD },
      ],
    },
    {
      name: 'Core Computer Science',
      description: 'Syllabus and fundamental concepts for engineering interviews.',
      icon: '🖥️',
      color: '#3b82f6',
      topics: [
        { title: 'DBMS', difficulty: Difficulty.MEDIUM },
        { title: 'Operating Systems', difficulty: Difficulty.MEDIUM },
        { title: 'Computer Networks', difficulty: Difficulty.MEDIUM },
        { title: 'OOP', difficulty: Difficulty.EASY },
        { title: 'System Design', difficulty: Difficulty.HARD },
      ],
    },
    {
      name: 'Development',
      description: 'Practical engineering and system building credentials.',
      icon: '🚀',
      color: '#10b981',
      topics: [
        { title: 'Frontend', difficulty: Difficulty.MEDIUM },
        { title: 'Backend', difficulty: Difficulty.MEDIUM },
        { title: 'Databases', difficulty: Difficulty.MEDIUM },
        { title: 'DevOps', difficulty: Difficulty.HARD },
        { title: 'Cloud', difficulty: Difficulty.MEDIUM },
      ],
    },
    {
      name: 'Other Skills',
      description: 'Soft skills, profile writing, and behavioral readiness.',
      icon: '💡',
      color: '#f59e0b',
      topics: [
        { title: 'Aptitude', difficulty: Difficulty.MEDIUM },
        { title: 'Communication', difficulty: Difficulty.EASY },
        { title: 'Resume', difficulty: Difficulty.EASY },
        { title: 'Interview Preparation', difficulty: Difficulty.MEDIUM },
      ],
    },
  ];

  console.log('Seeding placement categories and topics...');

  for (const item of seedData) {
    const category = await prisma.preparationCategory.upsert({
      where: { name: item.name },
      update: {
        description: item.description,
        icon: item.icon,
        color: item.color,
      },
      create: {
        name: item.name,
        description: item.description,
        icon: item.icon,
        color: item.color,
      },
    });

    for (const t of item.topics) {
      // Find if topic already exists in this category
      const existingTopic = await prisma.preparationTopic.findFirst({
        where: {
          title: t.title,
          categoryId: category.id,
        },
      });

      if (!existingTopic) {
        await prisma.preparationTopic.create({
          data: {
            title: t.title,
            difficulty: t.difficulty,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
