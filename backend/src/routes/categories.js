import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminGuard.js';

const router = Router();

const nameValidation = body('name')
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage('Category name must be between 3 and 30 characters')
  .matches(/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/)
  .withMessage('Category name contains invalid characters');

const optionalFields = [
  body('description').optional().trim().default(''),
  body('image_url').optional().trim().default(''),
];

// Public — list active categories
router.get('/', async (req, res, next) => {
  try {
    const includeArchived = req.query.includeArchived === 'true';
    let sql = 'SELECT * FROM categories';
    if (!includeArchived) {
      sql += ' WHERE is_active = true';
    }
    sql += ' ORDER BY name ASC';
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Public — get single category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin — create category
router.post('/',
  // authenticate,
  // requireAdmin,
  nameValidation,
  ...optionalFields,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { name, description, image_url } = req.body;

      const dup = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [name]);
      if (dup.rows.length > 0) {
        return res.status(409).json({ error: 'The category is already registered' });
      }

      const result = await query(
        `INSERT INTO categories (name, description, image_url)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, description || '', image_url || '']
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// Admin — update category
router.patch('/:id',
  authenticate,
  requireAdmin,
  nameValidation.optional(),
  ...optionalFields,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const existing = await query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const { name, description, image_url } = req.body;
      const current = existing.rows[0];

      if (name && name.toLowerCase() !== current.name.toLowerCase()) {
        const dup = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2', [name, req.params.id]);
        if (dup.rows.length > 0) {
          return res.status(409).json({ error: 'The category is already registered' });
        }
      }

      const result = await query(
        `UPDATE categories
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             image_url = COALESCE($3, image_url),
             updated_at = NOW()
         WHERE id = $4 RETURNING *`,
        [name || current.name, description ?? current.description, image_url ?? current.image_url, req.params.id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// Admin — delete category
router.delete('/:id',
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      const existing = await query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // We don't have a products table yet, but check product count when it exists
      const productCount = await query(
        'SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1',
        [req.params.id]
      ).catch(() => ({ rows: [{ count: 0 }] }));

      if (productCount.rows[0].count > 0) {
        return res.status(409).json({
          error: 'Cannot delete the category because it contains active products',
        });
      }

      await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
      res.json({ message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }
);

// Admin — archive category
router.patch('/:id/archive',
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await query(
        `UPDATE categories SET is_active = false, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
