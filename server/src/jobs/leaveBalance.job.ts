import cron from "node-cron";
import prisma from "../config/prisma.ts";


//console.log("Leave Balance Job Loaded");

// Main job function
export const leaveBalanceResetJob = async () => {
    console.log("Running leave balance reset for new year...");

    try {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;

        // Fetch all leave types
        const leaveTypes = await prisma.leaveType.findMany();

        // Fetch all active employees
        const employees = await prisma.employee.findMany({
            where: {
                status: "active",
            },
            select: {
                id: true,
            },
        });

        console.log("Employees:", employees);

        // Process each employee
        for (const employee of employees) {
            await prisma.$transaction(async (tx) => {
                for (const leaveType of leaveTypes) {
                    let carryover = 0;

                    // Calculate carryover if allowed
                    if (leaveType.carries_over) {
                        const previousBalance = await tx.leaveBalance.findUnique({
                            where: {
                                employee_id_leave_type_id_year: {
                                    employee_id: employee.id,
                                    leave_type_id: leaveType.id,
                                    year: previousYear,
                                },
                            },
                        });



                        if (previousBalance) {
                            const entitled = previousBalance.entitled_days.toNumber();
                            const used = previousBalance.used_days?.toNumber() ?? 0;
                            const pending = previousBalance.pending_days?.toNumber() ?? 0;

                            const remaining = entitled - used - pending;

                            carryover = Math.min(
                                Math.max(remaining, 0),
                                leaveType.max_carryover_days ?? 0
                            );
                        }
                    }

                    // Create this year's leave balance if it doesn't already exist
                    await tx.leaveBalance.upsert({
                        where: {
                            employee_id_leave_type_id_year: {
                                employee_id: employee.id,
                                leave_type_id: leaveType.id,
                                year: currentYear,
                            },
                        },
                        update: {},
                        create: {
                            employee_id: employee.id,
                            leave_type_id: leaveType.id,
                            year: currentYear,
                            entitled_days:
                                (leaveType.default_days_per_year ?? 0) + carryover,
                            used_days: 0,
                            pending_days: 0,
                        },
                    });
                }
            });
        }

        console.log(
            `✅ Leave balance reset completed successfully for ${employees.length} employee(s).`
        );
    } catch (error) {
        console.error("❌ Leave balance reset job failed:", error);
    }
};

// =======================================================
// CRON SCHEDULE
// =======================================================

// DEVELOPMENT: Runs every minute
//cron.schedule("* * * * *", async () => {
//    await leaveBalanceResetJob();
//});

// =======================================================
// PRODUCTION
// Uncomment this and remove the development schedule
// Runs every January 1st at 12:00 AM
// =======================================================

// cron.schedule("0 0 1 1 *", async () => {
//   await leaveBalanceResetJob();
// });