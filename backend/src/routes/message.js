import express from 'express';
import { protectRoute } from '../middleware/protect.js';
import { getUsersForSIdebar,getMessage,sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users",protectRoute,getUsersForSIdebar);
router.get("/users/:id",protectRoute,getMessage);

router.post("send/:id",protectRoute,sendMessage);
export default router;