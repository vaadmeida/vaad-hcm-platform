import { Router } from 'express'
import { createEmployeeController, deactivateEmployeeController, getAllEmployeesController, getEmployeeController, getManagersController, getMyProfileController, terminateEmployeeController, updateEmployeeController } from './employee.controller.ts'
import { authenticate } from '../../middlewares/auth.ts'
import { requireRoles } from '../../middlewares/role.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'



const employeeRouter = Router()

employeeRouter.post('/', authenticate , requireRoles('admin', "hr" ), asyncHandler(createEmployeeController))
employeeRouter.get('/', authenticate , requireRoles('admin',"hr", "manager" ), asyncHandler(getAllEmployeesController))
employeeRouter.get('/managers', authenticate, requireRoles('admin', "hr" ), asyncHandler(getManagersController))
employeeRouter.get('/me', authenticate,asyncHandler(getMyProfileController))
employeeRouter.get('/:id', authenticate, requireRoles('admin', "hr","manager" ),asyncHandler(getEmployeeController))
employeeRouter.patch('/:id', authenticate ,asyncHandler(updateEmployeeController))
employeeRouter.patch('/:id/deactivate', authenticate,  requireRoles('admin', "hr" ), asyncHandler(deactivateEmployeeController))
employeeRouter.patch('/:id/terminate', authenticate,  requireRoles('admin', "hr" ), asyncHandler(terminateEmployeeController))

export default employeeRouter