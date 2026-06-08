import { Router } from 'express';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);

export default router;
