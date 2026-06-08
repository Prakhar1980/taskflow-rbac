import { body, param, query } from 'express-validator';

export const taskIdValidator = [param('id').isMongoId().withMessage('Task id is not valid')];

export const createTaskValidator = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Task title should be 2 to 120 characters long'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description is too long'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Choose a valid task status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Choose a valid priority')
];

export const updateTaskValidator = [
  ...taskIdValidator,
  body('title').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Task title should be 2 to 120 characters long'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description is too long'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Choose a valid task status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Choose a valid priority')
];

export const listTaskValidator = [
  query('page').optional().toInt().isInt({ min: 1 }).withMessage('Page number should be 1 or greater'),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('Limit should be between 1 and 100'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search text is too long'),
  query('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Choose a valid task status'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Choose a valid priority')
];
