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
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.use("/api/single-product-details/:bookId", async (req, res) => {
  const { bookId } = req.params;
  try {
    const product = await Product.findOne({ "books._id": bookId });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const book = product.books.find((b) => b._id.toString() === bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({
      success: true,
      data: {
        ...book.toObject(),
        sellerId: product.user_id, // Return seller ID
        productId: product._id,
      },
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
});

app.get("/api/get-all-product", authenticateToken, async (req, res) => {
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
app.get("/api/get-books-by-search", async (req, res) => {
  try {
    const searchQuery = req.query.search?.trim() || "";
    let books = [];

    if (searchQuery) {
      // Search for books by name or author inside the products collection
      const products = await Product.find({
        $or: [
          { "books.name": { $regex: searchQuery, $options: "i" } },
          { "books.author": { $regex: searchQuery, $options: "i" } },
        ],
      });

      // Extract and filter matching books
      books = products.flatMap((product) =>
        product.books.filter(
          (book) =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      // If no search query, fetch all books
      const products = await Product.find({});
      books = products.flatMap((product) => product.books);
    }

    res.json({ success: true, data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.use("/api/products", router);

app.get("/api/books-by-author/:authorName", async (req, res) => {
  try {
    const authorName = decodeURIComponent(req.params.authorName);

    // Fetch books from all products where books array contains this author
    const products = await Product.find({
      "books.author": authorName,
    });

    // Extract books that match the author
    let booksByAuthor = [];
    products.forEach((product) => {
      const matchingBooks = product.books.filter(
        (book) => book.author === authorName
      );
      booksByAuthor.push(...matchingBooks);
    });

    if (booksByAuthor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No books found by this author." });
    }

    res.json({ success: true, books: booksByAuthor });
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.use("/api/profile", profile);

app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.listen(5000, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
