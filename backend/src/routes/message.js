import express from 'express';
import rateLimit from 'express-rate-limit';
import { protectRoute } from '../middleware/protect.js';
import { getUsersForSIdebar,getMessage,sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

const sendMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 send attempts per minute
});

router.get("/users",protectRoute,getUsersForSIdebar);
router.get("/users/:id",protectRoute,getMessage);

router.post("/send/:id",protectRoute,sendMessageLimiter,sendMessage);
export default router;