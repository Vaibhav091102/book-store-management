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
  try {
    const { id } = req.params;
    const product = req.body;
    let book = await Product.findOne({ user_id: id });

    if (!product.name || !product.price || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields including an image",
      });
    }

    if (!book) {
      book = new Product({ user_id: id, books: [] });
    }

    const newProduct = {
      ...product,
      image: req.file.path,
    };
    book.books.push(newProduct);

    await book.save();
    res.status(201).json({ sucess: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};

//For delete the Product
const deleteProduct = async (req, res) => {
  const { bookId } = req.params;

  try {
    // Find the product that contains the book
    const product = await Product.findOne({ "books._id": bookId });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Filter out the book to be deleted
    product.books = product.books.filter((b) => b._id.toString() !== bookId);

    // If no books left, delete the entire product entry
    if (product.books.length === 0) {
      await Product.findByIdAndDelete(product._id);
      return res.status(200).json({
        success: true,
        message: "Book deleted, and product removed as no books remain",
      });
    }

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//For update the Product

const updateProduct = async (req, res) => {
  const { bookId } = req.params;
  const updatedBook = req.body;

  try {
    const product = await Product.findOne({ "books._id": bookId });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const bookIndex = product.books.findIndex(
      (b) => b._id.toString() === bookId
    );
    if (bookIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });

    // Update book fields
    product.books[bookIndex] = { ...product.books[bookIndex], ...updatedBook };

    await product.save();
    res
      .status(200)
      .json({ success: true, message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getProducts,

  createProduct,
  deleteProduct,
  updateProduct,
};
