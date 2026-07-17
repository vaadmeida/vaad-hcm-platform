
import cron from "node-cron";
import prisma from "../config/prisma.ts";
import { getExpiredDocuments } from "../modules/documents/document.service.ts";
// import { sendEmail } from "../config/mailer";

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running document expiry check...");

  try {
    // Get expiring documents
    const docs = await getExpiredDocuments();

    if (docs.length === 0) {
      console.log("No documents expiring within the next 30 days.");
      return;
    }

    // Get active admins
    const admins = await prisma.employee.findMany({
      where: {
        role: "admin",
        status: "active",
      },
      select: {
        email: true,
        firstName: true,
      },
    });

    console.log(`Found ${docs.length} expiring document(s).`);
    console.log(`Found ${admins.length} active admin(s).`);

    // TODO: Send email to each admin
    for (const admin of admins) {
      console.log(`Preparing notification for ${admin.email}`);

      // await sendEmail({
      //   to: admin.email,
      //   subject: "Documents Expiring Soon",
      //   text: `There are ${docs.length} document(s) expiring within the next 30 days.`,
      // });
    }

    console.log("Document expiry check completed successfully.");
  } catch (error) {
    console.error("Document expiry job failed:", error);
  }
});

