import prisma from "../../config/prisma.ts"
import bcrypt from 'bcrypt'
import { AppError } from "../../errors/appError.ts";
import validator from 'validator'
import { ActivityAction, Prisma } from "@prisma/client";
import { UpdateEmployeeDTO } from "./employee.validator.ts";
import { seedLeaveBalance } from "../leave/leave.service.ts";
import { getPresignedUrl } from "../../config/storage.ts";
import { createNotification } from "../notifications/notification.service.ts";
import { promise } from "zod/v4/mini";

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

            department: {
                select: {
                    id: true,
                    name: true,
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
            department: employee.department
                ? {
                    id: employee.department.id,
                    name: employee.department.name,
                }
                : null,
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

            department: {
                select: {
                    id: true,
                    name: true,
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

            department: employee.department
                ? {
                    id: employee.department.id,
                    name: employee.department.name,
                }
                : null,

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
    }) => {

    const { search, department, status } = filters;

    const isManager = user.role?.toLowerCase() === "manager";

    const whereClause: Prisma.EmployeeWhereInput = {
        status: {
            not: "terminated",
        },
    };

    if (isManager) {
        whereClause.manager_id = user.id;
    }

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
                employee_code: {
                    contains: search,
                    mode: "insensitive",
                },

            },
            {
                department: {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            },
        ];
    }

    if (department && department !== "all") {
        whereClause.department_id = department;
    }

    if (status && status !== "all") {
        whereClause.status = status;
    }

    if (isManager) {
        whereClause.manager_id = user.id;
    }

    const employees = await prisma.employee.findMany({
        where: whereClause,
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
            department: {
                select: {
                    name: true,
                    id: true
                },
            },
            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    middle_name: true
                },
            },
        },

        orderBy: {
            first_name: "asc",
        },
    });

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

            department: emp.department
                ? {
                    id: emp.department.id,
                    name: emp.department.name,
                }
                : null,
            manager: emp.manager
                ? {
                    id: emp.manager.id,
                    name: `${emp.manager.first_name} ${emp.manager.last_name}`,
                }
                : null,
        }))
    );

    return employeesWithAvatar;
};

export const updateEmployee = async ({
    id,
    data,
    user,
}: UpdateEmployeeInput) => {
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

    const isAdmin = user.role === "admin";
    const isHR = user.role === "hr";
    const isSelf = user.id === id;

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
        "role",
        "job_title",
        "job_description",
        "department_id",
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

    // Authorization
    if (!isAdmin && !isHR && !isSelf) {
        throw new AppError(
            "You are not allowed to update this employee",
            403,
            "FORBIDDEN"
        );
    }

    const allowedFields = isAdmin || isHR ? employeeFields : selfAllowedFields;

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

    const isDepartmentChange =
        data.department_id !== undefined &&
        data.department_id !== employee.department_id;

    const isDepartmentRemoved =
        employee.department_id != null &&
        data.department_id === null;

    const isManagerChange =
        data.manager_id !== undefined &&
        data.manager_id !== employee.manager_id;

    const result = await prisma.$transaction(async (tx) => {
        const updatedEmployee = await tx.employee.update({
            where: { id },
            data,
        });

        let action: ActivityAction = "UPDATED";

        let description =
            `Employee ${updatedEmployee.first_name} ` +
            `${updatedEmployee.last_name} was updated`;

        const performer = await tx.employee.findUnique({
            where: { id: user.id },
            select: {
                first_name: true,
                last_name: true,
            },
        });

        // Department assigned
        if (isDepartmentChange && updatedEmployee.department_id) {
            const department = await tx.department.findUnique({
                where: { id: updatedEmployee.department_id },
                select: { name: true },
            });

            action = "DEPARTMENT_ASSIGNED";

            description =
                `${performer?.first_name} ${performer?.last_name} assigned ` +
                `${updatedEmployee.first_name} ${updatedEmployee.last_name} ` +
                `to ${department?.name ?? "a department"}`;
        }

        // Department removed
        if (isDepartmentRemoved) {
            action = "DEPARTMENT_REMOVED";

            description =
                `${performer?.first_name} ${performer?.last_name} removed ` +
                `${updatedEmployee.first_name} ${updatedEmployee.last_name} ` +
                `from their department`;
        }

        // Notify the affected employee when someone else updates their profile
        if (!isSelf) {
            await createNotification(
                {
                    userId: updatedEmployee.id,
                    title: "Employee Profile Updated",
                    message: "Your employee profile has been updated.",
                    type: "EMPLOYEE",
                },

            );
        }

        // Notify HR and Admin when an employee updates their own profile
        if (isSelf) {
            const hrAndAdmins = await tx.employee.findMany({
                where: {
                    role: { in: ["hr", "admin"] },
                    id: { not: user.id },
                },
                select: { id: true },
            });

            await Promise.all(
                hrAndAdmins.map((recipient) =>
                    createNotification(
                        {
                            userId: recipient.id,
                            title: "Employee Profile Updated",
                            message:
                                `${updatedEmployee.first_name} ` +
                                `${updatedEmployee.last_name} updated their profile.`,
                            type: "EMPLOYEE",
                        },

                    )
                )
            );
        }

        // Notify the new manager when the manager assignment changes
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
            );
        }

        // Activity log
        await tx.activityLog.create({
            data: {
                action,
                entity_type: "EMPLOYEE",
                entity_id: updatedEmployee.id,
                description,
                performed_by: user.id,
                department_id: updatedEmployee.department_id,
            },
        });

        return updatedEmployee;
    });

    // Remove sensitive data
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

    // Notify active HR staff and admins, excluding the actor.
    const hrAndAdmins = await prisma.employee.findMany({
        where: {
            role: { in: ["hr", "admin"] },
            status: "active",
            id: { not: user.id },
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

    // Notification failures won't undo the deactivation.
    await Promise.allSettled(notificationTasks);

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

    // Notify active HR staff and admins, excluding the actor.
    const hrAndAdmins = await prisma.employee.findMany({
        where: {
            role: { in: ["hr", "admin"] },
            status: "active",
            id: { not: user.id },
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

    // A notification failure should not undo termination.
    await Promise.allSettled(notificationTasks);

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