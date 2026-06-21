const express = require('express');
const requireAuth = require('../Middleware/requireAuth.js')

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../Controllers/product.controller');

const { validateProduct } = require('../Middleware/validate.middleware');
const requireAdmin = require('../Middleware/requireAdmin');

const router = express.Router();

// ─── Route Definitions ────────────────────────────────────────────────────────
//
//  Method   Path               Middleware            Handler
//  ───────  ─────────────────  ────────────────────  ──────────────────
//  POST     /                  validateProduct       createProduct
//  GET      /                  —                     getAllProducts
//  GET      /:id               —                     getProductById
//  PUT      /:id               validateProduct       updateProduct
//  DELETE   /:id               —                     deleteProduct



router
  .route('/')
  .post(requireAuth, requireAdmin, validateProduct, createProduct)
  .get(getAllProducts);

router
  .route('/:id')
  .get(getProductById)
  .put(requireAuth, requireAdmin, validateProduct, updateProduct)
  .delete(requireAuth, requireAdmin, deleteProduct);

module.exports = router;