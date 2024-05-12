import express from 'express';
import imageController from '../controllers/imageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import fileMiddleware from '../middlewares/fileMiddleware.js';

const router = express.Router();
router.post(
  '/uploadImage',
  authMiddleware.authenticate,
  fileMiddleware.upload.single('file'),
  imageController.uploadImage
);
router.post(
  '/submitAnnotations',
  authMiddleware.authenticate,
  imageController.submitAnnotations
);

export default router;
