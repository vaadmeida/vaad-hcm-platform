import bcrypt from "bcrypt";
import prisma from "../config/prisma.ts";

async function createUser() {

  try {
    // 1. hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 2. create employee
    const user = await prisma.employee.create({
      data: {
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com",
        password_hash: hashedPassword,
        hire_date: new Date("2026-01-01"),
        role: "employee",
      },
    });

    console.log("User created successfully:", user);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();