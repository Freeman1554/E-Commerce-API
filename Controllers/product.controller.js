const mongoose = require('mongoose');
const Product = require('../Models/product.model');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the supplied string is a valid MongoDB ObjectId.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── Create Product ───────────────────────────────────────────────────────────

/**
 * POST /api/products
 * Body has already been validated by validateProduct middleware.
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while creating product',
    });
  }
};

// ─── Get All Products (search · sort · paginate) ──────────────────────────────

/**
 * GET /api/products
 * Query params:
 *   ?name=    | ?search=   – partial, case-insensitive name search (regex)
 *   ?page=    – page number  (default: 1)
 *   ?limit=   – items/page  (default: 10)
 *   ?sort=    – e.g. "price" (asc) or "-price" (desc); multi-field: "category,-price"
 */
const getAllProducts = async (req, res) => {
  try {
    const { name, search, page, limit, sort } = req.query;

    // ── Build filter ────────────────────────────────────────────────────────
    const filter = {};
    const searchTerm = name || search;
    if (searchTerm) {
      // Regex gives partial, case-insensitive matching on the name field
      filter.name = { $regex: searchTerm, $options: 'i' };
    }

    // ── Pagination ──────────────────────────────────────────────────────────
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit   = Math.max(1, parseInt(limit, 10) || 10);
    const skip        = (currentPage - 1) * pageLimit;

    // ── Sort ────────────────────────────────────────────────────────────────
    // Express delivers "sort" as a comma-separated string.
    // Mongoose accepts an object like { price: 1, name: -1 }.
    let sortObj = { createdAt: -1 }; // sensible default: newest first
    if (sort) {
      sortObj = sort.split(',').reduce((acc, field) => {
        const trimmed = field.trim();
        if (trimmed.startsWith('-')) {
          acc[trimmed.slice(1)] = -1;
        } else {
          acc[trimmed] = 1;
        }
        return acc;
      }, {});
    }

    // ── Execute query ────────────────────────────────────────────────────────
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(pageLimit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      meta: {
        total,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while fetching products',
    });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while fetching product',
    });
  }
};

// ─── Update Product ───────────────────────────────────────────────────────────

/**
 * PUT /api/products/:id
 * Body has already been validated by validateProduct middleware.
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,          // return the updated document
        runValidators: true, // re-run schema validators on update
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while updating product',
    });
  }
};

// ─── Delete Product ───────────────────────────────────────────────────────────

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id "${id}"`,
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while deleting product',
    });
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};