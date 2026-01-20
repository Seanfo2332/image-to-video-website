import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });

  console.log(`Admin user created/updated:`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`  Role: ${admin.role}`);

  // Optionally create some test users
  const testUsers = [
    { email: "user1@example.com", name: "Test User 1" },
    { email: "user2@example.com", name: "Test User 2" },
    { email: "user3@example.com", name: "Test User 3" },
  ];

  const testPassword = await bcrypt.hash("TestPassword123!", 12);

  for (const testUser of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        email: testUser.email,
        name: testUser.name,
        password: testPassword,
        role: "user",
        isActive: true,
      },
    });
    console.log(`Test user created: ${user.email}`);
  }

  console.log("\nSeeding completed!");
  console.log("\n--- Login Credentials ---");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Test Users: user1@example.com, user2@example.com, user3@example.com / TestPassword123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
