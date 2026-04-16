import express from "express";
import rateLimit from "express-rate-limit";

import { login, logout, signup, updateProfile , checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protect.js";
const router = express.Router();

const updateProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 profile update requests per window
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 signup requests per window
});

router.post("/signup", signupLimiter, signup);

router.post("/login",login);

router.post("/logout", logout);

router.put("/update-profile", updateProfileLimiter, protectRoute, updateProfile);

router.get("/check",protectRoute,checkAuth); 
export default router;