import express from 'express';
import { authenticate } from '../../middlewares/auth.ts'
import { createDocumentTypeController, getAllEmployeeDocumentsController, getDocumentDownloadUrlController, getDocumentsStatsController, getEmployeeDocumentsController, getExpiringDocumentsController, getRecentDocumentsController, uploadDocumentController, verifyDocumentController } from './document.controller.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { requireRoles } from '../../middlewares/role.ts';
import upload from '../../middlewares/upload.ts';

const documentRouter = express.Router();

documentRouter.post('/',authenticate, requireRoles('admin'), asyncHandler(createDocumentTypeController))
documentRouter.post('/upload', authenticate, upload.single('file'), asyncHandler(uploadDocumentController))
documentRouter.get('/', authenticate, requireRoles('admin', 'hr'), asyncHandler(getAllEmployeeDocumentsController))
documentRouter.get('/stats', authenticate, requireRoles('admin', 'hr'), asyncHandler(getDocumentsStatsController))
documentRouter.get('/employee/:employeeId', authenticate, asyncHandler(getEmployeeDocumentsController))
documentRouter.get('/download/:documentId', authenticate, asyncHandler(getDocumentDownloadUrlController))
documentRouter.patch('/verify/:documentId', authenticate, requireRoles('admin'), asyncHandler(verifyDocumentController))
documentRouter.get('/recent', authenticate, requireRoles('admin', 'hr'), asyncHandler(getRecentDocumentsController))
documentRouter.get('/expiring', authenticate, requireRoles('admin', 'hr'), asyncHandler(getExpiringDocumentsController))

export default documentRouter;