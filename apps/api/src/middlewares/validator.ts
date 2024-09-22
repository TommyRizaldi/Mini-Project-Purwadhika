import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('username').notEmpty().withMessage('username is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().notEmpty().withMessage('Invalid email format!'),
  body('password')
    .isLength({ min: 6 })
    .notEmpty()
    .withMessage('Password is required'),
  body('referralCode').optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({
        status: 'error',
        msg: error.array(),
      });
    }
    next();
  },
];
