import { PrismaClient } from '@prisma/client';

console.log('seed start');
const prisma = new PrismaClient();

async function main() {
  console.log('start main');
  // create two dummy articles
  const user1 = await prisma.user.upsert({
    where: { login: 'Prisma' },
    update: {},
    create: {
      login: 'Prisma',
      password:
        'Support for MongoDB has been one of the most requested features since the initial release of...',
    },
  });
  console.log(user1);

  const favorites1 = await prisma.favorites.upsert({
    where: { id: 'b124f0d9-5736-4b1d-bc3e-87881f1870b1' },
    update: {},
    create: {
      id: 'b124f0d9-5736-4b1d-bc3e-87881f1870b1',
    },
  });

  const artist = await prisma.artist.upsert({
    where: { id: 'bfe34f8e-6ded-4071-82cc-0c01a6a6af84' },
    update: {},
    create: {
      name: 'Art1',
      grammy: true,
      favsId: favorites1.id,
    },
  });

  console.log(favorites1);
}
// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

// await prisma.$disconnect();
