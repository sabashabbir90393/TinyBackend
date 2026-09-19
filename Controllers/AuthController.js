import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";

//ye bi login sign up ka controller hai jo ki user ke liye hai
// ==================== SIGNUP ====================

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty fields
    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: "Username and password are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check existing username
    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({
      ok: true,
      message: "Account created successfully",
      token,
      username: newUser.username,
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Something went wrong during signup",
    });
  }
};


// ==================== LOGIN ====================

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty fields
    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      username: username.trim(),
    });

    // User does not exist
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid username or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Invalid username or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      username: user.username,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Something went wrong during login",
    });
  }
};


// ==================== VERIFY TOKEN ====================

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Token is valid",
      user,
    });

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};