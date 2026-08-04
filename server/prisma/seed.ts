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

createAdmin()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });