const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/product.controller");

const { validateProduct } = require("../Middleware/validate.middleware");
const requireAuth = require("../Middleware/requireAuth");

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
  .route("/")
  .post(requireAuth, validateProduct, createProduct)
  .get(requireAuth, getAllProducts);

router
  .route("/:id")
  .get(requireAuth, getProductById)
  .put(requireAuth, validateProduct, updateProduct)
  .delete(requireAuth, deleteProduct);

module.exports = router;
