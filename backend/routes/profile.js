const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Seller = require("../models/seller");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let sellerInfo = null;
    if (user.role === "seller") {
      sellerInfo = await Seller.findOne({ user_id: id }).lean();
    }

    res.status(200).json({
      success: true,
      user,
      sellerInfo,
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.put("/update/:id", async (req, res) => {
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

module.exports = router;
