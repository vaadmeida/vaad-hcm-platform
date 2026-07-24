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


type CreateEmployeeType = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: string;
    hire_date?: Date;
    manager_id?: string
    department_id?: string;
    phone?: string;
    job_title?: string;
    employment_type?: string;
    employeeCode?: string
}

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
    password,
    role = 'employee',
    phone,
    job_title,
    hire_date,
    manager_id,
    department_id,
    employment_type,
    employeeCode,
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

        const hashedpassword = await bcrypt.hash(password, 10);

        const totalEmployees = await prisma.employee.count();

        const employeeCode = `VAAD-${String(totalEmployees + 1).padStart(4, "0")}`;

        const employee = await tx.employee.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash: hashedpassword,
                role,
                hire_date: hire_date || new Date(),
                manager_id: manager_id || null,
                phone,
                department_id,
                job_title,
                employment_type,
                employeeCode
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
                role: employee.role,
                manager_id: employee.manager_id,
                phone: employee.phone,
                department_id: employee.department_id,
                job_title: employee.job_title,
                employment_type: employee.employment_type,
                employeeCode: employee.employee_code
            }
        }
    })

}


export const getEmployee = async (id: string, user: { id: string; role: string }) => {

    const employee = await prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            job_title: true,
            role: true,
            status: true,
            hire_date: true,
            department_id: true,
            manager_id: true,
            created_at: true,
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
        },
    });

    if (!employee) {
        throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
    }

    const isAdmin = user.role === "admin";
    const isSelf = user.id === id;
    const isManager = user.role === "manager";

    if (!isAdmin && !isSelf) {

        if (isManager && employee.manager_id !== user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        if (!isManager) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }
    }

    const manager = employee.manager
        ? {
            id: employee.manager.id,
            name: `${employee.manager.first_name} ${employee.manager.last_name}`,
        }
        : null;

    const department = employee.department
        ? {
            id: employee.department.id,
            name: employee.department.name,
        }
        : null
    return {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        status: employee.status,
        job_title: employee.job_title,
        hire_date: employee.hire_date,
        created_at: employee.created_at,
        department,
        manager
    };
}

export const getAllEmployees = async (user: { id: string; role: string }) => {

    const isManager = user.role?.toLowerCase() === "manager";

    const whereClause: Prisma.EmployeeWhereInput = {
        status: {
            not: "terminated",
        },
    };


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

export const updateEmployee = async ({ id, data, user }: UpdateEmployeeInput) => {

    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND")

    const allowedByEmployee = ["phone"];

    const allowedByAdmin = [
        "phone",
        "first_name",
        "last_name",
        "role",
        "job_title",
        "job_description",
        "department_id",
        "manager_id",
        "work_email",
        "status",
        "employment_type",
        "hire_date",
        "owns_personal_computer",
    ];

    const allowed = user.role === "admin" ? allowedByAdmin : allowedByEmployee;

    const inputKeys = Object.keys(data);

    const invalidFields = inputKeys.filter((key) => !allowed.includes(key));

    if (invalidFields.length > 0) {
        throw new AppError(
            `You are not allowed to update: ${invalidFields.join(", ")}`,
            403,
            "FORBIDDEN_FIELDS"
        );
    }

    if (user.role !== "admin" && user.id !== id) {
        throw new AppError(
            "You can only update your own profile",
            403,
            "FORBIDDEN"
        );
    }

    const filteredData = Object.fromEntries(Object.entries(data));

    const updated = await prisma.employee.update({ where: { id }, data: filteredData });

    return updated;
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


