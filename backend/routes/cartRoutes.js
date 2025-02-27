const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing userId or bookId" });
    }

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.bookId == bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ bookId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
});

router.put("/update/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const { quantity } = req.body; // Get the new quantity

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.bookId.toString() === bookId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
});

// Get cart items
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from params

    // Check if ID is valid
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the cart and populate book details
    const cart = await Cart.findOne({ userId: id }).populate({
      path: "items.bookId",
      select: "name price image quality",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: {} } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err });
  }
});

module.exports = router;
