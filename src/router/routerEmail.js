import express from "express";

import authJWT from "../middleware/authJWT.js";
import sendOtpMiddleware from "../middleware/email/send-otp.js";
import verifyOtpMiddleware from "../middleware/email/verifyOtp.js";
const router = express.Router();
router.use(authJWT);
router.post("/send-otp", sendOtpMiddleware);
router.post("/verify-otp", verifyOtpMiddleware);

export default router;
