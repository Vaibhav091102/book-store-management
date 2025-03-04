const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/seller");

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role, bookstore_name, address, phone } =
    req.body;
  if (role === "seller" && !bookstore_name) {
    return res
      .status(400)
      .json({ message: "Bookstore name is required for seller" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await user.save();

    if (role === "seller") {
      if (!bookstore_name || !address || !phone) {
        return res.status(400).json({ message: "Seller details are required" });
      }
      const newSeller = new Seller({
        user_id: savedUser._id,
        bookstore_name,
        address,
        phone,
      });
      await newSeller.save();
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    let sellerDetails = null;
    if (user.role === "seller") {
      sellerDetails = await Seller.findOne({ user_id: user._id }); // Excluding unnecessary fields
    }

    res.status(200).json({ token, user, sellerDetails });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//forget password
router.post("/forget-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passswords do not match" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
