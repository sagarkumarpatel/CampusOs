import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma';
import { Role } from '@prisma/client';

export const seedPlacementCoordinator = async () => {
  const email = 'placementcord018@gmail.com';
  const password = 'placement@123';

  try {
    const existingPC = await prisma.user.findFirst({
      where: { roles: { has: Role.PLACEMENT_COORDINATOR } },
    });

    if (!existingPC) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            roles: [Role.PLACEMENT_COORDINATOR],
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
            firstName: 'Placement',
            lastName: 'Coordinator',
          },
        });
      });
      console.log('Successfully seeded Placement Coordinator');
    } else {
      console.log('Placement Coordinator already exists');
    }
  } catch (error) {
    console.error('Error seeding Placement Coordinator:', error);
  }
};
