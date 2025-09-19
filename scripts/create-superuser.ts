#!/usr/bin/env tsx

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import readlineSync from "readline-sync";

const prisma = new PrismaClient();

function question(query: string): string {
  return readlineSync.question(query);
}

function questionHidden(query: string): string {
  return readlineSync.question(query, {
    hideEchoBack: true,
    mask: "*"
  });
}

async function createSuperUser() {
  try {
    console.log("🚀 Creating Super Admin User\n");

    // Get user input
    const name = question("Enter full name: ");
    const email = question("Enter email address: ");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\n❌ User with email ${email} already exists!`);

      const updateRole = question("Would you like to update their role to SUPER_ADMIN? (y/N): ");

      if (updateRole.toLowerCase() === "y" || updateRole.toLowerCase() === "yes") {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { role: UserRole.SUPER_ADMIN },
        });

        console.log(`\n✅ Successfully updated ${updatedUser.email} to SUPER_ADMIN role!`);
      } else {
        console.log("\n❌ Operation cancelled.");
      }

      return;
    }

    const password = questionHidden("Enter password (min 8 characters): ");
    if (password.length < 8) {
      console.log("\n❌ Password must be at least 8 characters long!");
      return;
    }

    const confirmPassword = questionHidden("Confirm password: ");
    if (password !== confirmPassword) {
      console.log("\n❌ Passwords do not match!");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        emailVerified: new Date(),
      },
    });

    console.log(`\n✅ Super Admin user created successfully!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log(`\n🎉 You can now sign in at: /admin/auth/signin`);
  } catch (error) {
    console.error("\n❌ Error creating super user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🚀 Create Super Admin User Script

Usage: npm run create-superuser

This script will prompt you to enter:
- Full name
- Email address  
- Password (minimum 8 characters)

The user will be created with SUPER_ADMIN role and can access the admin dashboard.

Options:
  --help, -h    Show this help message
  `);
  process.exit(0);
}

createSuperUser().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
