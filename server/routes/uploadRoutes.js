import express from 'express';
import { getUploadCredentials } from '../controllers/uploadController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();

router.post('/', protectRole, authorizeRoles('vendor'), getUploadCredentials);

export default router;
