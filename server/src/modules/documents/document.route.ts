import express from 'express';
import { authenticate } from '../../middlewares/auth.ts'
import { createDocumentTypeController, getAllEmployeeDocumentsController, getDocumentByIdController, getDocumentDownloadUrlController, getDocumentsStatsController, getDocumentTypesController, getEmployeeDocumentsController, getExpiredDocumentsController, getExpiringDocumentsController, getMyDocumentsController, getMyDocumentStatsController, getRecentDocumentsController, selfUploadDocumentController, uploadEmployeeDocumentController, verifyDocumentController } from './document.controller.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { requireRoles } from '../../middlewares/role.ts';
import upload from '../../middlewares/upload.ts';

const documentRouter = express.Router();

documentRouter.post('/',authenticate, requireRoles('admin', "hr"), asyncHandler(createDocumentTypeController))
documentRouter.get('/', authenticate, requireRoles('admin', 'hr'), asyncHandler(getAllEmployeeDocumentsController))
documentRouter.get('/types', authenticate , asyncHandler(getDocumentTypesController))
documentRouter.get('/stats', authenticate, requireRoles('admin', 'hr'), asyncHandler(getDocumentsStatsController))
documentRouter.get('/my/stats', authenticate, asyncHandler(getMyDocumentStatsController))
documentRouter.get('/my', authenticate, asyncHandler(getMyDocumentsController))
documentRouter.get('/recent', authenticate, requireRoles('admin', 'hr'), asyncHandler(getRecentDocumentsController))
documentRouter.get('/expiring', authenticate, requireRoles('admin', 'hr'), asyncHandler(getExpiringDocumentsController))
documentRouter.get('/expired', authenticate, requireRoles('admin', 'hr'), asyncHandler(getExpiredDocumentsController))
documentRouter.post('/me', authenticate, upload.single('file'), asyncHandler(selfUploadDocumentController))
documentRouter.post('/employee/:employeeId', authenticate, upload.single('file'), asyncHandler(uploadEmployeeDocumentController))
documentRouter.get('/employee/:employeeId', authenticate, asyncHandler(getEmployeeDocumentsController))
documentRouter.get('/:documentId', authenticate, asyncHandler(getDocumentByIdController))
documentRouter.get('/download/:documentId', authenticate, asyncHandler(getDocumentDownloadUrlController))
documentRouter.patch('/verify/:documentId', authenticate, requireRoles("admin","hr"), asyncHandler(verifyDocumentController))
export default documentRouter;