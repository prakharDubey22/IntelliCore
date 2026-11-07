const bcrypt = require("bcryptjs");
const User = require("../models/user");
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);

    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
  name,
  phone,
  location,
  bio,
  targetRole,
  careerArea,
  education,
} = req.body;

    const updates = {};

    if (typeof name === "string") {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      updates.name = name.trim();
    }

    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }

    if (typeof location === "string") {
      updates.location = location.trim();
    }

    if (typeof bio === "string") {
      updates.bio = bio.trim();
    }
    if (typeof targetRole === "string") {
  updates.targetRole = targetRole.trim();
}

if (typeof careerArea === "string") {
  updates.careerArea = careerArea.trim();
}

if (Array.isArray(education)) {
  updates.education = education;
}

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};