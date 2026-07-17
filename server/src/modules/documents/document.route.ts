import express from 'express';
import { authenticate } from '../../middlewares/auth.ts'
import { createDocumentTypeController, getDocumentDownloadUrlController, getEmployeeDocumentsController, getExpiredDocumentsController, uploadDocumentController, verifyDocumentController } from './document.controller.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { requireRoles } from '../../middlewares/role.ts';
import upload from '../../middlewares/upload.ts';

const documentRouter = express.Router();

documentRouter.post('/',authenticate, requireRoles('admin'), asyncHandler(createDocumentTypeController))
documentRouter.post('/upload', authenticate, upload.single('file'), asyncHandler(uploadDocumentController))
documentRouter.get('/employee/:employeeId', authenticate, asyncHandler(getEmployeeDocumentsController))
documentRouter.get('/download/:documentId', authenticate, asyncHandler(getDocumentDownloadUrlController))
documentRouter.patch('/verify/:documentId', authenticate, requireRoles('admin'), asyncHandler(verifyDocumentController))
documentRouter.get('/expired', authenticate, requireRoles('admin'), asyncHandler(getExpiredDocumentsController))


export default documentRouter;