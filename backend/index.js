const express = require("express");
const connectDB = require("./confic/db");

const router = require("./routes/product.route");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profile = require("./routes/profile");
const Product = require("./models/Product");
const Seller = require("./models/seller");
const User = require("./models/User");
const cartRoutes = require("./routes/cartRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.use("/api/singleproduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById({ _id: id });
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ sucess: true, data: products });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
});

app.get("/api/product", async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ sucess: true, data: products });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
});

// Fetch books only when a search query is provided
app.get("/api/books", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    if (!searchQuery) return res.json([]); // Return empty array if no query

    const books = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search
        { author: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

app.use("/api/products", router);

app.use("/api/profile", profile);

app.use("/api/cart", cartRoutes);

app.put("/api/profile/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;
  try {
    // Update user basic information
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    // If the user is a seller, update seller information
    let updatedSeller = null;
    if (updatedUser.role === "seller") {
      updatedSeller = await Seller.findOneAndUpdate(
        { user_id: id },
        { address, phone },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      sellerInfo: updatedSeller,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.listen(5000, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
