const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo users...');

  const demoUsers = [
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'ADMIN',
    },
    {
      name: 'CSR User', 
      email: 'csr@demo.com',
      role: 'CSR',
    },
    {
      name: 'Printer User',
      email: 'printer@demo.com', 
      role: 'PRINTER',
    }
  ];

  const hashedPassword = await bcrypt.hash('demo123', 12);

  for (const user of demoUsers) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          ...user,
          hashedPassword,
          isActive: true,
        }
      });
      console.log(`✅ Created ${user.role} user: ${user.email}`);
    } else {
      console.log(`⚠️  User already exists: ${user.email}`);
    }
  }

  console.log('🎉 Demo users seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });