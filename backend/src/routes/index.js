import { Router } from 'express';
import categoriesRouter from './categories.js';
import productsRouter from './products.js';

export const router = Router();

router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
