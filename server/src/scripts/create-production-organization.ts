import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000001",
    },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "VAAD MEDIA LTD",
      industry: "Out-of-Home Advertising",
      email: "",
      company_size: "11-50",
      phone: "",
      website: "",
      street_address: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
  });

  console.log("Organization:", organization);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });