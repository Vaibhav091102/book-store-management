const Product = require("../models/Product");
const mongoose = require("mongoose");

// For retrive the all Product

const getProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ user_id: id });
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ sucess: true, data: products });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};

// For create the new Product

const createProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  if (!product.name || !product.price) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields including an image",
    });
  }

  const newProduct = new Product({
    ...product,
    image: req.file.path,
    user_id: id,
  });

  try {
    await newProduct.save();
    res.status(201).json({ sucess: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};

//For delete the Product

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ sucess: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};

//For update the Product

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ sucess: false, message: "Invalid Product id" });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ sucess: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};

module.exports = {
  getProducts,

  createProduct,
  deleteProduct,
  updateProduct,
};
