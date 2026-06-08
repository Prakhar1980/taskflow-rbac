import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { loginValidator, refreshValidator, registerValidator } from '../validators/authValidator';

const router = Router();
const controller = new AuthController();

router.post('/register', registerValidator, validateRequest, controller.register);
router.post('/login', loginValidator, validateRequest, controller.login);
router.post('/refresh', refreshValidator, validateRequest, controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

export default router;
