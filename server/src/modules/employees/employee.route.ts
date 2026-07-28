import { Router } from 'express'
import { createEmployeeController, deactivateEmployeeController, getAllEmployeesController, getEmployeeController, updateEmployeeController } from './employee.controller.ts'
import { authenticate } from '../../middlewares/auth.ts'
import { requireRoles } from '../../middlewares/role.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'


const employeeRouter = Router()

employeeRouter.post('/', authenticate , requireRoles('admin', "hr" ), asyncHandler(createEmployeeController))
employeeRouter.get('/', authenticate , requireRoles('admin', "manager" ), asyncHandler(getAllEmployeesController))
employeeRouter.get('/:id', authenticate, requireRoles('admin', "manager" ),asyncHandler(getEmployeeController))
employeeRouter.patch('/:id', authenticate, requireRoles('admin'),asyncHandler(updateEmployeeController))
employeeRouter.patch('/:id/deactivate', authenticate,  requireRoles('admin', "manager" ), asyncHandler(deactivateEmployeeController))

export default employeeRouter