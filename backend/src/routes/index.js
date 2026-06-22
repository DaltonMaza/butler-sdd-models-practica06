import { Router } from 'express';
import categoriesRouter from './categories.js';

export const router = Router();

router.use('/categories', categoriesRouter);
