import express from "express";

import { login, logout, signup, updateProfile , checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protect.js";
const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.get("/logout", logout);

router.put("/update",protectRoute,updateProfile, (req, res) => {});

router.get("/check",protectRoute,checkAuth); 
export default router;