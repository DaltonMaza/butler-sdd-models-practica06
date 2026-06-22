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
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Product name must be between 3 and 50 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('description').optional().trim().default('')
    .isLength({ max: 200 })
    .withMessage('Description must be 200 characters or fewer'),
  body('image_url').optional().trim().default(''),
];

router.get('/', async (req, res, next) => {
  try {
    const { search, categoryId } = req.query;

    let sql = `SELECT p.*, c.name AS category_name,
       CASE 
         WHEN p.stock = 0 THEN 'agotado'
         WHEN p.stock BETWEEN 1 AND 5 THEN 'bajo'
         ELSE NULL
       END AS stock_alert
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id`;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (categoryId) {
      conditions.push(`p.category_id = $${params.length + 1}`);
      params.push(categoryId);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY p.id DESC';

    const result = await query(sql, params);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, c.name AS category_name,
       CASE
         WHEN p.stock = 0 THEN 'agotado'
         WHEN p.stock BETWEEN 1 AND 5 THEN 'bajo'
         ELSE NULL
       END AS stock_alert
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

router.put('/:id',
  ...productValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { id } = req.params;
      const { name, description, price, stock, image_url, category_id } = req.body;

      const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (!category_id) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }

      const cat = await query('SELECT id FROM categories WHERE id = $1 AND is_active = true', [category_id]);
      if (cat.rows.length === 0) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }

      const result = await query(
        `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category_id = $6
         WHERE id = $7 RETURNING *`,
        [name, description || '', price, stock, image_url || '', category_id, id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
});

export default router;
