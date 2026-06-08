import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Please enter your name'),
  body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage('Password must include uppercase, lowercase, number, and symbol'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
];

export const loginValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email address'),
  body('password').isString().notEmpty().withMessage('Please enter your password')
];

export const refreshValidator = [body('refreshToken').isString().notEmpty().withMessage('Refresh token is missing')];
