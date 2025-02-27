const express = require("express");

const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/product.controller");
const upload = require("../middleware/uplode");

const router = express.Router();

router.get("/:id", getProducts);

router.post("/:id", upload.single("image"), createProduct);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

module.exports = router;
