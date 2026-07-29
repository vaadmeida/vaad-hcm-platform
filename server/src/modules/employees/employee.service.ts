import prisma from "../../config/prisma.ts"
import bcrypt from 'bcrypt'
import { AppError } from "../../errors/appError.ts";
import validator from 'validator'
import { Prisma } from "@prisma/client";
import { UpdateEmployeeDTO } from "./employee.validator.ts";
import { seedLeaveBalance } from "../leave/leave.service.ts";

type UpdateEmployeeInput = {
    id: string;
    data: Partial<UpdateEmployeeDTO>;
    user: {
        id: string;
        role: string;
    };
};

type User = {
    id: string;
    role: string;
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
    role = 'employee',
    phone,
    job_title,
    hire_date,
}: CreateEmployeeType) => {


    return prisma.$transaction(async (tx) => {

        const existingEmployee = await tx.employee.findUnique({
            where: { email }
        })

        if (existingEmployee) {
            throw new AppError(
                "Employee already exists",
                409,
                "EMPLOYEE_ALREADY_EXISTS"
            );
        }

        if (!validator.isEmail(email)) {
            throw new AppError("Invalid email format", 400, "INVALID_EMAIL");
        }

        const defaultPassword = "Vaad@123";

        const hashedpassword = await bcrypt.hash(defaultPassword, 10);

        const totalEmployees = await prisma.employee.count();

        const employeeCode = `VAAD-${String(totalEmployees + 1).padStart(4, "0")}`;

        if (!hire_date) {
            throw new AppError(
                "Hire date is required",
                400,
                "HIRE_DATE_REQUIRED"
            );
        }

        const probationEndDate = new Date(hire_date);

        probationEndDate.setMonth(probationEndDate.getMonth() + 6)

        const employee = await tx.employee.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash: hashedpassword,
                role,
                hire_date: hire_date || new Date(),
                phone,
                job_title,
                employee_code: employeeCode,
                probation_end_date: probationEndDate
            },
        });

        await seedLeaveBalance(tx, employee.id)

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
                probationEndDate: employee.probation_end_date
            }
        }
    })

}


export const getEmployee = async (id: string, user: User) => {
    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            employee_code: true,
            // Personal Information
            first_name: true,
            last_name: true,
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
    return {
        id: employee.id,
        employee_code: employee.employee_code,
        full_name: `${employee.first_name} ${employee.last_name}`,

        personal: {
            first_name: employee.first_name,
            last_name: employee.last_name,
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
            email: true,
            phone: true,
            role: true,
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
                },
            },
        },

        orderBy: {
            first_name: "asc",
        },
    });

    return employees.map((emp) => ({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
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
    }));
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
    const isManager = user.role === "manager";
    const isSelf = user.id === id;

    // ─── Authorization ──────────────────────────────────

    if (!isAdmin && !isHR && !isSelf) {
        if (!isManager || employee.manager_id !== user.id) {
            throw new AppError(
                "You are not allowed to update this employee",
                403,
                "FORBIDDEN"
            );
        }
    }

    // ─── Allowed fields ─────────────────────────────────

    const employeeFields = [
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "nationality",
        "phone",
        "alternate_phone",
        "email",
        "residential_address",
        "city",
        "state_of_residence",

        // Emergency contact
        "emergency_contact_name",
        "emergency_contact_relationship",
        "emergency_contact_number",

        // Employment
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

        // Payroll
        "paye_id",
        "bank_name",
        "account_number",
        "account_name",
    ];

    const selfAllowedFields = [
        "phone",
        "alternate_phone",
        "residential_address",
        "city",
        "state_of_residence",
        "emergency_contact_name",
        "emergency_contact_relationship",
        "emergency_contact_number",
    ];

    const allowedFields =
        isAdmin || isHR
            ? employeeFields
            : selfAllowedFields;

    // ─── Validate fields ─────────────────────────────────

    const inputKeys = Object.keys(data);

    const invalidFields = inputKeys.filter(
        (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
        throw new AppError(
            `You are not allowed to update: ${invalidFields.join(", ")}`,
            403,
            "FORBIDDEN_FIELDS"
        );
    }

    // ─── Update ──────────────────────────────────────────
    const updatedEmployee = await prisma.employee.update({
        where: { id },
        data,
    });

    const { password_hash, ...safeEmployee } = updatedEmployee;

    return safeEmployee;
};


export const deactivateEmployee = async (id: string, user: User) => {

    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            manager_id: true,
            status: true
        }
    })

    if (!employee) {
        throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
    }

    if (employee.status === "inactive") {
        throw new AppError("Already inactive", 400, "ALREADY_INACTIVE");
    }

    const isAdmin = user.role = 'admin'
    const isManager = user.role = 'manager'

    if (isAdmin) {
        return await softDeactivate(id)
    }

    if (isManager) {
        if (employee.manager_id !== user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }
        return await softDeactivate(id)
    }

    throw new AppError("Forbidden", 403, "FORBIDDEN");
}


