import express from "express";
import {
  signup,
  login,
  verifyToken,
} from "../Controllers/AuthController.js";

const router = express.Router();
console.log("auth route is working");


router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyToken);

export default router;