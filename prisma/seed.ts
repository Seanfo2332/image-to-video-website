import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed default credit configs
  const defaults = [
    { workflowType: "lip-sync", cost: 2, label: "Lip Sync Video" },
    { workflowType: "image", cost: 1, label: "Image Generation" },
    { workflowType: "video", cost: 3, label: "Video Generation" },
  ];

  for (const config of defaults) {
    await prisma.creditConfig.upsert({
      where: { workflowType: config.workflowType },
      update: {},
      create: config,
    });
  }

  console.log("Seeded credit configs:", defaults.map((d) => `${d.workflowType}=${d.cost}`).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
