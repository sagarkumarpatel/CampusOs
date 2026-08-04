const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const seedData = [
    {
      name: 'Data Structures & Algorithms',
      description: 'Master core computational thinking and coding interview patterns.',
      icon: '📦',
      color: '#6366f1',
      topics: [
        { title: 'Arrays', difficulty: 'EASY' },
        { title: 'Strings', difficulty: 'EASY' },
        { title: 'Linked Lists', difficulty: 'MEDIUM' },
        { title: 'Stack', difficulty: 'EASY' },
        { title: 'Queue', difficulty: 'EASY' },
        { title: 'Trees', difficulty: 'MEDIUM' },
        { title: 'Graphs', difficulty: 'HARD' },
        { title: 'Dynamic Programming', difficulty: 'HARD' },
      ],
    },
    {
      name: 'Core Computer Science',
      description: 'Syllabus and fundamental concepts for engineering interviews.',
      icon: '🖥️',
      color: '#3b82f6',
      topics: [
        { title: 'DBMS', difficulty: 'MEDIUM' },
        { title: 'Operating Systems', difficulty: 'MEDIUM' },
        { title: 'Computer Networks', difficulty: 'MEDIUM' },
        { title: 'OOP', difficulty: 'EASY' },
        { title: 'System Design', difficulty: 'HARD' },
      ],
    },
    {
      name: 'Development',
      description: 'Practical engineering and system building credentials.',
      icon: '🚀',
      color: '#10b981',
      topics: [
        { title: 'Frontend', difficulty: 'MEDIUM' },
        { title: 'Backend', difficulty: 'MEDIUM' },
        { title: 'Databases', difficulty: 'MEDIUM' },
        { title: 'DevOps', difficulty: 'HARD' },
        { title: 'Cloud', difficulty: 'MEDIUM' },
      ],
    },
    {
      name: 'Other Skills',
      description: 'Soft skills, profile writing, and behavioral readiness.',
      icon: '💡',
      color: '#f59e0b',
      topics: [
        { title: 'Aptitude', difficulty: 'MEDIUM' },
        { title: 'Communication', difficulty: 'EASY' },
        { title: 'Resume', difficulty: 'EASY' },
        { title: 'Interview Preparation', difficulty: 'MEDIUM' },
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
