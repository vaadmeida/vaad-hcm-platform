import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.employee.upsert({
    where: {
      email: "admin@vaadhr.com",
    },

    update: {
      status: "active",
      password_hash: hashedPassword,
    },

    create: {
      first_name: "Super",
      last_name: "Admin",
      email: "admin@vaadhr.com",
      password_hash: hashedPassword,
      role: "admin",
      status: "active",
    },
  });

  console.log("Admin created:", admin.email);
}

async function createOrganization() {
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

  console.log("Organization created:", organization.name);
}

async function main() {
  await createAdmin();
  await createOrganization();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
