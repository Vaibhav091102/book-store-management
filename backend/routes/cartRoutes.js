const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, bookId, quantity } = req.body;

    if (!userId || !productId || !bookId) {
      return res
        .status(400)
        .json({ message: "userId, productId, and bookId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the book is already in the cart
    const existingItem = cart.items.find(
      (item) => item.bookId.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        productId,
        bookId,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Book added to cart", cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
});

router.put("/update/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (quantity === 0) {
      // Remove item if quantity is zero
      cart.items = cart.items.filter(
        (item) => item.bookId.toString() !== bookId
      );
    } else {
      const item = cart.items.find((item) => item.bookId.toString() === bookId);
      if (!item)
        return res.status(404).json({ message: "Item not found in cart" });

      item.quantity = Math.max(1, quantity);
    }

    await cart.save();
    res.status(200).json({ message: "Quantity updated", cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    // Find the user's cart
    const cart = await Cart.findOne({ userId: id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Extract book IDs from cart items
    const bookIds = cart.items.map((item) => item.bookId);

    // Find all products containing these books in a single query
    const products = await Product.find({ "books._id": { $in: bookIds } });

    // Map cart items with book details
    const cartWithBooks = cart.items
      .map((item) => {
        const product = products.find((p) =>
          p.books.some((b) => b._id.toString() === item.bookId.toString())
        );

        if (!product) return null;

        const bookDetails = product.books.find(
          (b) => b._id.toString() === item.bookId.toString()
        );

        return {
          ...item.toObject(),
          book: bookDetails || null, // Ensure bookDetails is not undefined
        };
      })
      .filter(Boolean); // Remove null values

    return res.status(200).json({ cart: cartWithBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// clear all items
router.delete("/clearall/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err });
  }
});

router.delete("/clear/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err });
  }
});

module.exports = router;
