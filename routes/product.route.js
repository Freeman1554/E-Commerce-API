const express = require('express');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../Controllers/product.controller');

const { validateProduct } = require('../Middleware/validate.middleware');

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
  .post(validateProduct, createProduct)
  .get(getAllProducts);

router
  .route('/:id')
  .get(getProductById)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = router;