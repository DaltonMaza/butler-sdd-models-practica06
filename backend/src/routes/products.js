import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminGuard.js';

const router = Router();

const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('description').optional().trim().default(''),
  body('image_url').optional().trim().default(''),
];

router.get('/', async (req, res, next) => {
  try {
    // Usamos LEFT JOIN para traer el nombre de la categoría si existe
    const result = await query(
      `SELECT p.*, c.name AS category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, c.name AS category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/',
  // authenticate,
  // requireAdmin,
  ...productValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { name, description, price, stock, image_url, category_id } = req.body;

      if (!category_id) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }

      const cat = await query(
        'SELECT id FROM categories WHERE id = $1 AND is_active = true',
        [category_id]
      );
      if (cat.rows.length === 0) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }

      const result = await query(
        `INSERT INTO products (name, description, price, stock, image_url, category_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description || '', price, stock, image_url || '', category_id]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
