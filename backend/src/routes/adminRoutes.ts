import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();
const controller = new AdminController();

router.get('/users', authenticate, authorize('admin'), controller.listUsers);

export default router;
