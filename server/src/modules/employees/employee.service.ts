import prisma from "../../config/prisma.ts"
import bcrypt from 'bcrypt'
import { AppError } from "../../errors/appError.ts";
import validator from 'validator'
import { ActivityAction, Prisma } from "@prisma/client";
import { UpdateEmployeeDTO } from "./employee.validator.ts";
import { seedLeaveBalance } from "../leave/leave.service.ts";
import { getPresignedUrl } from "../../config/storage.ts";
import { createNotification } from "../notifications/notification.service.ts";


type UpdateEmployeeInput = {
    id: string;
    data: Partial<UpdateEmployeeDTO>;
    user: User
};

export type User = {
    id: string;
    role: "admin" | "hr" | "manager" | "employee";
};

export type CreateEmployeeType = {
    first_name: string;
    last_name: string;
    email: string;
    role?: "employee" | "admin" | "hr" | "manager";
    phone?: string;
    job_title?: string;
    hire_date?: Date;
    manager_id?: string;
    department_id?: string;
    employment_type?: "full-time" | "part-time" | "contract" | "intern";
};

const softDeactivate = async (id: string) => {
    return prisma.employee.update({
        where: { id },
        data: { status: "inactive" },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            status: true,
        },
    });
};


export const createEmployee = async ({
    first_name,
    last_name,
    email,
    role = "employee",
    phone,
    job_title,
    hire_date,
}: CreateEmployeeType) => {
    return prisma.$transaction(async (tx) => {
        const existingEmployee = await tx.employee.findUnique({
            where: { email },
        });

        if (existingEmployee) {
            throw new AppError(
                "Employee already exists",
                409,
                "EMPLOYEE_ALREADY_EXISTS"
            );
        }

        if (!validator.isEmail(email)) {
            throw new AppError(
                "Invalid email format",
                400,
                "INVALID_EMAIL"
            );
        }

        if (!hire_date) {
            throw new AppError(
                "Hire date is required",
                400,
                "HIRE_DATE_REQUIRED"
            );
        }

        const defaultPassword = "Vaad@123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const totalEmployees = await tx.employee.count();
        const employeeCode = `VAAD-${String(totalEmployees + 1).padStart(4, "0")}`;

        const probationEndDate = new Date(hire_date);
        probationEndDate.setMonth(probationEndDate.getMonth() + 6);

        const employee = await tx.employee.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash: hashedPassword,
                role,
                hire_date,
                phone,
                job_title,
                employee_code: employeeCode,
                probation_end_date: probationEndDate,
            },
        });

        await seedLeaveBalance(tx, employee.id);

        // Notify the new employee.
        await createNotification(
            {
                userId: employee.id,
                title: "Welcome to VAAD!",
                message:
                    `Welcome, ${employee.first_name}! ` +
                    "Your employee account has been created successfully.",
                type: "EMPLOYEE",
            },
            tx
        );

        // Find HR and admin recipients.
        const hrAndAdmins = await tx.employee.findMany({
            where: {
                role: {
                    in: ["hr", "admin"],
                },
                status: "active",
                id: {
                    not: employee.id,
                },
            },
            select: {
                id: true,
            },
        });

        // Notify HR and admins.
        await Promise.all(
            hrAndAdmins.map((recipient) =>
                createNotification(
                    {
                        userId: recipient.id,
                        title: "New Employee Added",
                        message:
                            `A new employee has been added: ` +
                            `${employee.first_name} ${employee.last_name}.`,
                        type: "EMPLOYEE",
                    },
                    tx
                )
            )
        );

        return {
            user: {
                id: employee.id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                hire_date: employee.hire_date,
                phone: employee.phone,
                job_title: employee.job_title,
                employeeCode: employee.employee_code,
                probationEndDate: employee.probation_end_date,
            },
        };
    });
};

export const getEmployee = async (id: string, user: User) => {
    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            employee_code: true,
            // Personal Information
            avatar_url: true,
            first_name: true,
            last_name: true,
            middle_name: true,
            email: true,
            gender: true,
            date_of_birth: true,
            nationality: true,
            phone: true,
            alternate_phone: true,
            residential_address: true,
            city: true,
            state_of_residence: true,
            // Emergency Contact
            emergency_contact_name: true,
            emergency_contact_relationship: true,
            emergency_contact_number: true,

            // Next of Kin
            next_of_kin_name: true,
            next_of_kin_relationship: true,
            next_of_kin_phone: true,
            next_of_kin_email: true,
            next_of_kin_address: true,

            // Employment Information
            job_title: true,
            job_description: true,
            role: true,
            status: true,
            employment_type: true,
            hire_date: true,
            probation_end_date: true,
            date_exited: true,
            work_email: true,
            owns_personal_computer: true,
            departments: {
                select: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                },
            },
            // Payroll & Bank
            paye_id: true,
            bank_name: true,
            account_number: true,
            account_name: true,
            created_at: true,
            updated_at: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee not found",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    // Authorization
    const isAdmin = user.role === "admin";
    const isHR = user.role === "hr";
    const isSelf = user.id === id;
    const isManager = user.role === "manager";

    if (!isAdmin && !isHR && !isSelf) {
        if (!isManager || employee.manager?.id !== user.id) {
            throw new AppError(
                "Forbidden",
                403,
                "FORBIDDEN"
            );
        }
    }
    const avatarUrl = employee.avatar_url
        ? await getPresignedUrl(employee.avatar_url)
        : null;

    return {
        id: employee.id,
        employee_code: employee.employee_code,
        full_name: `${employee.first_name} ${employee.middle_name ? `${employee.middle_name} ` : ""}${employee.last_name}`,
        avatar_url: avatarUrl,
        personal: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            middle_name: employee.middle_name,
            email: employee.email,
            gender: employee.gender,
            date_of_birth: employee.date_of_birth,
            nationality: employee.nationality,
            phone: employee.phone,
            alternate_phone: employee.alternate_phone,
            residential_address: employee.residential_address,
            city: employee.city,
            state_of_residence: employee.state_of_residence,
        },
        employment: {
            job_title: employee.job_title,
            job_description: employee.job_description,
            role: employee.role,
            status: employee.status,
            employment_type: employee.employment_type,
            hire_date: employee.hire_date,
            probation_end_date: employee.probation_end_date,
            date_exited: employee.date_exited,
            work_email: employee.work_email,
            owns_personal_computer: employee.owns_personal_computer,

            departments: employee.departments.map((assignment) => ({
                id: assignment.department.id,
                name: assignment.department.name,
            })),

            manager: employee.manager
                ? {
                    id: employee.manager.id,
                    name: `${employee.manager.first_name} ${employee.manager.last_name}`,
                }
                : null,
        },
        emergency_contact: {
            name: employee.emergency_contact_name,
            relationship: employee.emergency_contact_relationship,
            phone: employee.emergency_contact_number,
        },
        next_of_kin: {
            name: employee.next_of_kin_name,
            relationship: employee.next_of_kin_relationship,
            phone: employee.next_of_kin_phone,
            email: employee.next_of_kin_email,
            address: employee.next_of_kin_address,
        },
        payroll: {
            paye_id: employee.paye_id,
            bank_name: employee.bank_name,
            account_number: employee.account_number,
            account_name: employee.account_name,
        },
        created_at: employee.created_at,
        updated_at: employee.updated_at,
    };
};

export const getMyProfile = async (user: User) => {
    const employee = await prisma.employee.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            employee_code: true,

            // Personal Information
            avatar_url: true,
            first_name: true,
            last_name: true,
            middle_name: true,
            email: true,
            gender: true,
            date_of_birth: true,
            nationality: true,
            phone: true,
            alternate_phone: true,
            residential_address: true,
            city: true,
            state_of_residence: true,

            // Emergency Contact
            emergency_contact_name: true,
            emergency_contact_relationship: true,
            emergency_contact_number: true,

            // Next of Kin
            next_of_kin_name: true,
            next_of_kin_relationship: true,
            next_of_kin_phone: true,
            next_of_kin_email: true,
            next_of_kin_address: true,

            // Employment Information
            job_title: true,
            job_description: true,
            role: true,
            status: true,
            employment_type: true,
            hire_date: true,
            probation_end_date: true,
            date_exited: true,
            work_email: true,
            owns_personal_computer: true,

            departments: {
                select: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },

            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                },
            },

            // Payroll & Bank
            paye_id: true,
            bank_name: true,
            account_number: true,
            account_name: true,

            created_at: true,
            updated_at: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee profile not found",
            404,
            "EMPLOYEE_PROFILE_NOT_FOUND"
        );
    }

    const avatarUrl = employee.avatar_url
        ? await getPresignedUrl(employee.avatar_url)
        : null;

    return {
        id: employee.id,
        employee_code: employee.employee_code,
        full_name: `${employee.first_name} ${employee.last_name}`,
        avatar_url: avatarUrl,

        personal: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            middle_name: employee.middle_name,
            email: employee.email,
            gender: employee.gender,
            date_of_birth: employee.date_of_birth,
            nationality: employee.nationality,
            phone: employee.phone,
            alternate_phone: employee.alternate_phone,
            residential_address: employee.residential_address,
            city: employee.city,
            state_of_residence: employee.state_of_residence,
        },

        employment: {
            job_title: employee.job_title,
            job_description: employee.job_description,
            role: employee.role,
            status: employee.status,
            employment_type: employee.employment_type,
            hire_date: employee.hire_date,
            probation_end_date: employee.probation_end_date,
            date_exited: employee.date_exited,
            work_email: employee.work_email,
            owns_personal_computer: employee.owns_personal_computer,

            departments: employee.departments.map(
                (assignment) => ({
                    id: assignment.department.id,
                    name: assignment.department.name,
                })
            ),

            manager: employee.manager
                ? {
                    id: employee.manager.id,
                    name: `${employee.manager.first_name} ${employee.manager.last_name}`,
                }
                : null,
        },

        emergency_contact: {
            name: employee.emergency_contact_name,
            relationship: employee.emergency_contact_relationship,
            phone: employee.emergency_contact_number,
        },
        next_of_kin: {
            name: employee.next_of_kin_name,
            relationship: employee.next_of_kin_relationship,
            phone: employee.next_of_kin_phone,
            email: employee.next_of_kin_email,
            address: employee.next_of_kin_address,
        },
        payroll: {
            paye_id: employee.paye_id,
            bank_name: employee.bank_name,
            account_number: employee.account_number,
            account_name: employee.account_name,
        },

        created_at: employee.created_at,
        updated_at: employee.updated_at,
    };
};

export const getAllEmployees = async (
    user: User,
    filters: {
        search?: string;
        department?: string;
        status?: string;
        page?: number;
        limit?: number;
    }
) => {
    const { search, department, status } = filters;

    const page = Math.max(
        1,
        Math.floor(Number(filters.page) || 1)
    );

    const limit = Math.min(
        100,
        Math.max(1, Math.floor(Number(filters.limit) || 7))
    );

    const skip = (page - 1) * limit;

    const isManager = user.role?.toLowerCase() === "manager";

    const whereClause: Prisma.EmployeeWhereInput = {};

    if (status && status !== "all") {
        whereClause.status = status;
    } else {
        whereClause.status = {
            notIn: ["terminated", "dismissed", "resigned"],
        };
    }
    // Managers can only see employees who report directly to them.
    if (isManager) {
        whereClause.manager_id = user.id;
    }
    // Search employee details and all assigned department names.
    if (search) {
        whereClause.OR = [
            {
                first_name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                last_name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                email: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                employee_code: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                departments: {
                    some: {
                        department: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            },
        ];
    }

    // Filter employees belonging to the selected department.
    // The department filter expects a department ID.
    if (department && department !== "all") {
        whereClause.departments = {
            some: {
                department_id: department,
            },
        };
    }

    const [employees, total] = await prisma.$transaction([
        prisma.employee.findMany({
            where: whereClause,
            skip,
            take: limit,

            select: {
                id: true,
                first_name: true,
                last_name: true,
                middle_name: true,
                email: true,
                phone: true,
                role: true,
                avatar_url: true,
                status: true,
                job_title: true,
                employment_type: true,
                hire_date: true,
                created_at: true,

                departments: {
                    select: {
                        department: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },

                manager: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        middle_name: true,
                    },
                },
            },

            orderBy: [
                { first_name: "asc" },
                { last_name: "asc" },
                { id: "asc" },
            ],
        }),

        prisma.employee.count({
            where: whereClause,
        }),
    ]);

    const employeesWithAvatar = await Promise.all(
        employees.map(async (emp) => ({
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            middle_name: emp.middle_name,

            avatar_url: emp.avatar_url
                ? await getPresignedUrl(emp.avatar_url)
                : null,

            email: emp.email,
            phone: emp.phone,
            role: emp.role,
            status: emp.status,
            job_title: emp.job_title,
            employment_type: emp.employment_type,
            hire_date: emp.hire_date,
            created_at: emp.created_at,

            departments: emp.departments.map(
                (assignment) => ({
                    id: assignment.department.id,
                    name: assignment.department.name,
                })
            ),

            manager: emp.manager
                ? {
                    id: emp.manager.id,
                    name: [
                        emp.manager.first_name,
                        emp.manager.last_name,
                    ]
                        .filter(Boolean)
                        .join(" "),
                }
                : null,
        }))
    );

    const totalPages = Math.ceil(total / limit);

    return {
        data: employeesWithAvatar,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };

};

export const updateEmployee = async ({
    id,
    data,
    user,
}: UpdateEmployeeInput) => {

    // 1. Find the employee being updated.
    const employee = await prisma.employee.findUnique({
        where: { id },
    });

    if (!employee) {
        throw new AppError(
            "Employee not found",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    // 2. Determine the user's permissions.
    const isAdmin = user.role === "admin";
    const isHR = user.role === "hr";
    const isSelf = user.id === id;

    // Fields that HR and Admin users can update.
    const employeeFields = [
        "first_name",
        "last_name",
        "middle_name",
        "gender",
        "date_of_birth",
        "nationality",
        "phone",
        "alternate_phone",
        "email",
        "residential_address",
        "city",
        "state_of_residence",
        "emergency_contact_name",
        "emergency_contact_relationship",
        "emergency_contact_number",
        "next_of_kin_name",
        "next_of_kin_relationship",
        "next_of_kin_phone",
        "next_of_kin_email",
        "next_of_kin_address",
        "role",
        "job_title",
        "job_description",
        "department_ids",
        "manager_id",
        "work_email",
        "status",
        "employment_type",
        "hire_date",
        "probation_end_date",
        "date_exited",
        "owns_personal_computer",
        "paye_id",
        "bank_name",
        "account_number",
        "account_name",
    ];

    // Fields an employee can update on their own profile.
    const selfAllowedFields = [
        "avatar_url",
        "phone",
        "alternate_phone",
        "residential_address",
        "city",
        "state_of_residence",
        "emergency_contact_name",
        "emergency_contact_relationship",
        "emergency_contact_number",
    ];

    // Reject users who are neither HR/Admin nor the employee themselves.
    if (!isAdmin && !isHR && !isSelf) {
        throw new AppError(
            "You are not allowed to update this employee",
            403,
            "FORBIDDEN"
        );
    }

    // Validate the fields the current user is allowed to update.
    const allowedFields =
        isAdmin || isHR ? employeeFields : selfAllowedFields;

    const invalidFields = Object.keys(data).filter(
        (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `You are not allowed to update: ${invalidFields.join(", ")}`,
            403,
            "FORBIDDEN_FIELDS"
        );
    }

    // 3. Validate employee exit status and exit date.
    const exitStatuses = [
        "resigned",
        "terminated",
        "dismissed",
    ] as const;

    const nextStatus = data.status ?? employee.status;

    const isExitStatus = exitStatuses.includes(
        nextStatus as (typeof exitStatuses)[number]
    );

    const nextExitDate =
        data.date_exited !== undefined
            ? data.date_exited
            : employee.date_exited;

    // Require an exit date for exit statuses.
    if (isExitStatus && !nextExitDate) {
        throw new AppError(
            "An exit date is required for resigned, terminated, or dismissed employees",
            400,
            "EXIT_DATE_REQUIRED"
        );
    }

    // Reject a newly supplied exit date for non-exit statuses.
    if (!isExitStatus && data.date_exited) {
        throw new AppError(
            "An exit date can only be set for resigned, terminated, or dismissed employees",
            400,
            "INVALID_EXIT_DATE"
        );
    }
    // Track whether the employee's status is changing.
    const statusChanged =
        data.status !== undefined &&
        data.status !== employee.status;

    // Separate department assignments from ordinary employee fields.
    const { department_ids, ...employeeData } = data;


    // Clear the exit date when reactivating an inactive employee.
    if (
        data.status === "active" &&
        employee.status === "inactive"
    ) {
        employeeData.date_exited = null;
    }

    // Track whether the reporting manager is changing.
    const isManagerChange =
        data.manager_id !== undefined &&
        data.manager_id !== employee.manager_id;

    // 4. Perform all database updates and related records in one transaction.
    const result = await prisma.$transaction(async (tx) => {
        // Load the employee's existing department assignments.
        const existingAssignments =
            await tx.employeeDepartment.findMany({
                where: { employee_id: id },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

        const previousDepartmentIds = existingAssignments.map(
            (assignment) => assignment.department_id
        );

        let assignedDepartmentNames: string[] = [];
        let removedDepartmentNames: string[] = [];

        // Update the employee's ordinary fields.
        const updatedEmployee = await tx.employee.update({
            where: { id },
            data: employeeData,
        });

        // 5. Update department assignments when department_ids is provided.
        if (department_ids !== undefined) {
            // Remove duplicate department IDs.
            const uniqueDepartmentIds = [...new Set(department_ids)];

            // Verify that every requested department exists.
            const departments = await tx.department.findMany({
                where: {
                    id: { in: uniqueDepartmentIds },
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            if (departments.length !== uniqueDepartmentIds.length) {
                throw new AppError(
                    "One or more departments do not exist",
                    400,
                    "INVALID_DEPARTMENTS"
                );
            }

            // Compare old and new assignments to identify changes.
            const previousIdSet = new Set(previousDepartmentIds);
            const nextIdSet = new Set(uniqueDepartmentIds);

            assignedDepartmentNames = departments
                .filter(
                    (department) => !previousIdSet.has(department.id)
                )
                .map((department) => department.name);

            removedDepartmentNames = existingAssignments
                .filter(
                    (assignment) =>
                        !nextIdSet.has(assignment.department_id)
                )
                .map((assignment) => assignment.department.name);

            // Replace existing assignments with the new assignments.
            await tx.employeeDepartment.deleteMany({
                where: { employee_id: id },
            });

            if (uniqueDepartmentIds.length > 0) {
                await tx.employeeDepartment.createMany({
                    data: uniqueDepartmentIds.map((department_id) => ({
                        employee_id: id,
                        department_id,
                    })),
                });
            }
        }

        // 6. Prepare the activity log.
        let action: ActivityAction = "UPDATED";

        let description =
            `Employee ${updatedEmployee.first_name} ` +
            `${updatedEmployee.last_name} was updated`;

        // Retrieve the name of the person performing the update.
        const performer = await tx.employee.findUnique({
            where: { id: user.id },
            select: {
                first_name: true,
                last_name: true,
            },
        });

        const performerName =
            `${performer?.first_name ?? "Unknown"} ` +
            `${performer?.last_name ?? "User"}`;

        // Record department assignments or removals in the activity log.
        if (assignedDepartmentNames.length > 0) {
            action = "DEPARTMENT_ASSIGNED";

            description =
                `${performerName} assigned ` +
                `${updatedEmployee.first_name} ${updatedEmployee.last_name} ` +
                `to ${assignedDepartmentNames.join(", ")}`;
        } else if (removedDepartmentNames.length > 0) {
            action = "DEPARTMENT_REMOVED";

            description =
                `${performerName} removed ` +
                `${updatedEmployee.first_name} ${updatedEmployee.last_name} ` +
                `from ${removedDepartmentNames.join(", ")}`;
        }

        // 7. Prepare specific notifications for resignation and dismissal.
        // These notifications are used only when the status actually changes.
        const exitNotificationConfig = {
            resigned: {
                title: "Employee Resignation Recorded",
                message:
                    `${updatedEmployee.first_name} ` +
                    `${updatedEmployee.last_name} has been marked as resigned.`,
            },
            dismissed: {
                title: "Employee Dismissed",
                message:
                    `${updatedEmployee.first_name} ` +
                    `${updatedEmployee.last_name} has been dismissed.`,
            },
        } as const;

        const exitNotification =
            statusChanged &&
                (updatedEmployee.status === "resigned" ||
                    updatedEmployee.status === "dismissed")
                ? exitNotificationConfig[
                updatedEmployee.status as "resigned" | "dismissed"
                ]
                : null;

        // Use specific exit notifications or fall back to generic updates.
        const notificationTitle =
            exitNotification?.title ?? "Employee Profile Updated";

        const employeeNotificationMessage =
            exitNotification?.message ??
            "Your employee profile has been updated.";

        const hrNotificationMessage =
            exitNotification?.message ??
            `${updatedEmployee.first_name} ${updatedEmployee.last_name}'s profile has been updated.`;

        // 8. Notify the employee whose profile was updated.
        await createNotification(
            {
                userId: updatedEmployee.id,
                title: notificationTitle,
                message: employeeNotificationMessage,
                type: "EMPLOYEE",
            },
            tx
        );

        // 9. Notify all active HR/Admin users except the affected employee.
        const hrAndAdmins = await tx.employee.findMany({
            where: {
                role: { in: ["hr", "admin"] },
                status: "active",
                id: { not: updatedEmployee.id },
            },
            select: { id: true },
        });

        await Promise.all(
            hrAndAdmins.map((recipient) =>
                createNotification(
                    {
                        userId: recipient.id,
                        title: notificationTitle,
                        message: hrNotificationMessage,
                        type: "EMPLOYEE",
                    },
                    tx
                )
            )
        );

        // 10. Notify the new manager when the reporting manager changes.
        if (
            isManagerChange &&
            updatedEmployee.manager_id &&
            updatedEmployee.manager_id !== updatedEmployee.id
        ) {
            await createNotification(
                {
                    userId: updatedEmployee.manager_id,
                    title: "Employee Assigned to You",
                    message:
                        `${updatedEmployee.first_name} ` +
                        `${updatedEmployee.last_name} has been assigned to you.`,
                    type: "EMPLOYEE",
                },
                tx
            );
        }

        // 11. Create an activity log entry.
        // ActivityLog still uses department_id, so use the first assigned
        // department or null when the employee has no department.
        const currentDepartmentIds =
            department_ids !== undefined
                ? [...new Set(department_ids)]
                : previousDepartmentIds;

        await tx.activityLog.create({
            data: {
                action,
                entity_type: "EMPLOYEE",
                entity_id: updatedEmployee.id,
                description,
                performed_by: user.id,
                department_id: currentDepartmentIds[0] ?? null,
            },
        });

        // 12. Fetch the updated employee with their department details.
        // 12. Fetch the updated employee with minimal department details.
        const employeeWithDepartments = await tx.employee.findUnique({
            where: { id },
            include: {
                departments: {
                    select: {
                        department: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!employeeWithDepartments) {
            throw new AppError(
                "Employee not found",
                404,
                "EMPLOYEE_NOT_FOUND"
            );
        }

        // Return only the department fields needed by the client.
        return {
            ...employeeWithDepartments,
            departments: employeeWithDepartments.departments.map(
                (assignment) => assignment.department
            ),
        };

    });

    // 13. Remove sensitive data before returning the employee.
    const { password_hash, ...safeEmployee } = result;

    return safeEmployee;
};

export const deactivateEmployee = async (id: string, user: User) => {
    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            manager_id: true,
            status: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee not found",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    if (employee.status === "inactive") {
        throw new AppError(
            "Already inactive",
            400,
            "ALREADY_INACTIVE"
        );
    }

    const isAdmin = user.role === "admin";
    const isHR = user.role === "hr";
    const isManager = user.role === "manager";

    // Authorization must happen before deactivation.
    if (isManager && employee.manager_id !== user.id) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    if (!isAdmin && !isHR && !isManager) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    // Deactivate only after authorization succeeds.
    const result = await softDeactivate(id);


    // Notify the deactivated employee.
    const notificationTasks: Promise<unknown>[] = [
        createNotification({
            userId: employee.id,
            title: "Account Deactivated",
            message:
                "Your VAAD account has been deactivated. " +
                "Please contact HR if you believe this is a mistake.",
            type: "EMPLOYEE",
        }),
    ];

    // Exclude the affected employee to avoid duplicate notifications.
    const hrAndAdmins = await prisma.employee.findMany({
        where: {
            role: { in: ["hr", "admin"] },
            status: "active",
            id: { not: employee.id },
        },
        select: { id: true },
    });

    for (const recipient of hrAndAdmins) {
        notificationTasks.push(
            createNotification({
                userId: recipient.id,
                title: "Employee Deactivated",
                message:
                    `${employee.first_name} ${employee.last_name}'s ` +
                    "account has been deactivated.",
                type: "EMPLOYEE",
            })
        );
    }

    const results = await Promise.allSettled(notificationTasks);

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                `Deactivation notification ${index} failed:`,
                result.reason
            );
        }
    });

    return result;
};



export const terminateEmployee = async (id: string, user: User) => {
    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            manager_id: true,
            status: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee not found",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    if (employee.status === "terminated") {
        throw new AppError(
            "Employee already terminated",
            400,
            "ALREADY_TERMINATED"
        );
    }

    const isAdmin = user.role === "admin";
    const isHR = user.role === "hr";
    const isManager = user.role === "manager";

    // Check permissions before making changes.
    if (isManager && employee.manager_id !== user.id) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    if (!isAdmin && !isHR && !isManager) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    // Terminate the employee.
    const result = await prisma.employee.update({
        where: { id },
        data: {
            status: "terminated",
        },
    });


    // Notify the terminated employee.
    const notificationTasks: Promise<unknown>[] = [
        createNotification({
            userId: employee.id,
            title: "Employment Terminated",
            message:
                "Your employment status at VAAD has been marked as terminated. " +
                "Please contact HR if you have questions.",
            type: "EMPLOYEE",
        }),
    ];

    // Notify all active HR/Admin employees, including the actor.
    // Exclude the affected employee to avoid duplicate notifications.
    const hrAndAdmins = await prisma.employee.findMany({
        where: {
            role: { in: ["hr", "admin"] },
            status: "active",
            id: { not: employee.id },
        },
        select: { id: true },
    });

    for (const recipient of hrAndAdmins) {
        notificationTasks.push(
            createNotification({
                userId: recipient.id,
                title: "Employee Terminated",
                message:
                    `${employee.first_name} ${employee.last_name}'s ` +
                    "employment status has been marked as terminated.",
                type: "EMPLOYEE",
            })
        );
    }

    const results = await Promise.allSettled(notificationTasks);

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                `Termination notification ${index} failed:`,
                result.reason
            );
        }
    });


    return result;
};

export const getManagers = async (user: User) => {
    if (user.role !== "admin" && user.role !== "hr") {
        throw new AppError(
            "You do not have permission to access this resource.",
            403,
            "FORBIDDEN"
        );
    }

    const managers = await prisma.employee.findMany({
        where: {
            role: {
                in: ["manager", "hr"],
            },
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            job_title: true,
            role: true,
        },
    });

    return managers;
};