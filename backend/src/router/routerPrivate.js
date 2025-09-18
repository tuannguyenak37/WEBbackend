import express from "express";
import authMiddleware from "../middleware/authJWT.js";
import delay from "../middleware/delay.js";

import getall_User from "../controllers/users.js";
const router = express.Router();
router.use(authMiddleware);
router.use(delay);
router.get("/admin/getall", authMiddleware, getall_User.getAll_User);

export default router;
