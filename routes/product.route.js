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
const authorize = require("../Middleware/authorize");

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
  .post(requireAuth, authorize("admin"), validateProduct, createProduct) // ADMIN ROLE
  .get(requireAuth, getAllProducts);

router
  .route("/:id")
  .get(requireAuth, getProductById)
  .put(requireAuth, authorize("admin"), validateProduct, updateProduct) // ADMIN ROLE
  .delete(requireAuth, authorize("admin"), deleteProduct); // ADMIN ROLE

module.exports = router;
