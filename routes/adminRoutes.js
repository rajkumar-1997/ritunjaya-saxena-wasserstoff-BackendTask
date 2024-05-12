import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminController from '../controllers/adminController.js';
const router = express.Router();

router.get(
  '/getPendingList',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  adminController.getPendingList
);

router.post(
  '/updateImageStatus',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  adminController.updateImageStatus
);

router.get(
  '/exportAnnotations',
  authMiddleware.authenticate,
  authMiddleware.isAdmin,
  adminController.exportAnnotations
);

export default router;
