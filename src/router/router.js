import express from "express";
import user from "../controllers/users.js";
import delay from "../middleware/delay.js";
import SP_client_controller from "../controllers/client/sanpham.js";
import authJWT from "../middleware/authJWT.js";
import khachhangcontroller from "../controllers/client/khachhang.js";
import diachi_controller from "../controllers/client/diachi.js";
import checkout_controller from "../controllers/client/checkout.js";
import upload from "../middleware/upload.js";
import shop from "../controllers/client/shop.js";
import sendOtpMiddleware from "../middleware/email/send-otp.js";
const router = express.Router();

router.use(delay);

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "xin chao backend đây",
  });
});
router.post("/createUser", user.createUserController);
router.post("/Login", user.User_Login);
router.get("/profile", authJWT, user.profile_User);
router.get("/SP", SP_client_controller.xemSP_client_controller);
router.get("/SPCT/:sanpham_id", SP_client_controller.xemCTSP_client_controller);
router.post("/newkhachhang", authJWT, khachhangcontroller.newKHcontroller);
router.post(
  "/newdiachi",
  authJWT, // middleware xác thực token
  diachi_controller.new_diachi_controller // controller
);
router.post(
  "/checkout",
  authJWT, // middleware xác thực token
  sendOtpMiddleware,
  checkout_controller.new_checkout_controller // controller
);
router.get("/xemkh", authJWT, khachhangcontroller.xemKHcontroller);
router.get("/bestseller", SP_client_controller.seller_client_controller);
router.get("/sp20", SP_client_controller.seller_client_controller_random);

router.post("/newshop", authJWT, upload.single("url_shop"), shop.newshop);
export default router;
