import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createTaskValidator, listTaskValidator, taskIdValidator, updateTaskValidator } from '../validators/taskValidator';

const router = Router();
const controller = new TaskController();

router.use(authenticate);
router.post('/', createTaskValidator, validateRequest, controller.create);
router.get('/', listTaskValidator, validateRequest, controller.findAll);
router.get('/:id', taskIdValidator, validateRequest, controller.findById);
router.put('/:id', updateTaskValidator, validateRequest, controller.update);
router.delete('/:id', taskIdValidator, validateRequest, controller.delete);

export default router;
