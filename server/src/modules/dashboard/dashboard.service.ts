import prisma from "../../config/prisma.ts"

export const getAdminStats = async () => {

    const [totalEmployees, totalDepartments, activeEmployees, pendingLeaveRequests,
    ] = await Promise.all([
        prisma.employee.count(),
        prisma.department.count(),
        prisma.employee.count({
            where: {
                status: "active"
            }
        }),
        prisma.leaveRequest.count({
            where: {
                status: "pending"
            }
        })

    ])

    return {
        totalEmployees,
        totalDepartments,
        activeEmployees,
        pendingLeaveRequests
    }

}

export const getHRStats = async () => {
    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
    ] = await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({
            where: {
                status: "active",
            },
        }),
        prisma.employee.count({
            where: {
                status: "inactive",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "pending",
            },
        }),

        prisma.department.count(),
    ]);

    return {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
    };
};

export const getManagerStats = async (managerId: string) => {
    const [
        teamMembers,
        activeTeamMembers,
        pendingLeaveApprovals,
        teamOnLeave,
    ] = await Promise.all([
        prisma.employee.count({
            where: {
                manager_id: managerId,
            },
        }),

        prisma.employee.count({
            where: {
                manager_id: managerId,
                status: "active",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                manager_id: managerId,
                status: "pending",
            },
        }),
        prisma.leaveRequest.count({
            where: {
                manager_id: managerId,
                status: "approved",
                start_date: {
                    lte: new Date(),
                },
                end_date: {
                    gte: new Date(),
                },
            },
        }),
    ]);

    return {
        teamMembers,
        activeTeamMembers,
        pendingLeaveApprovals,
        teamOnLeave,
    };
};

export const getEmployeeStats = async (employeeId: string) => {
  const [
    pendingLeaveRequests,
    approvedLeaveRequests,
    rejectedLeaveRequests,
    totalLeaveTypes,
  ] = await Promise.all([
    prisma.leaveRequest.count({
      where: {
        employee_id: employeeId,
        status: "pending",
      },
    }),

    prisma.leaveRequest.count({
      where: {
        employee_id: employeeId,
        status: "approved",
      },
    }),

    prisma.leaveRequest.count({
      where: {
        employee_id: employeeId,
        status: "rejected",
      },
    }),

    prisma.leaveType.count(),
  ]);

  return {
    pendingLeaveRequests,
    approvedLeaveRequests,
    rejectedLeaveRequests,
    totalLeaveTypes,
  };
  
};