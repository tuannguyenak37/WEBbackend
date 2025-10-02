import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authJWT.js";
import delay from "../middleware/delay.js";
import authAdmin from "../middleware/authAdmin.js";
import getall_User from "../controllers/users.js";
import sanPham_controllers from "../controllers/sanPham.js";
import Kho_controlers from "../controllers/kho.js";
import shop from "../controllers/client/shop.js";
const router = express.Router();
router.use(authMiddleware, authAdmin);
router.use(delay);
router.get("/admin/getall", getall_User.getAll_User);
router.post(
  "/addsanpham",
  upload.single("url_sanpham"),
  sanPham_controllers.addSan_PhamController
);
router.delete(
  "/deletesanpham/:sanpham_id",
  sanPham_controllers.delete_San_PhamController
);
router.get("/xemsanpham", sanPham_controllers.xem_SanPham_Controller);
router.post("/addkho", Kho_controlers.addKho_Controller);
router.put("/suakho/:kho_id", Kho_controlers.suaKho);
router.get("/xemkho", Kho_controlers.xem_kho);
router.get("/xemthongtinkho", Kho_controlers.xem_thongtin_kho_controller);
router.put("/nhapkho", Kho_controlers.nhap_kho_controller);
router.post("/shop", shop);
export default router;
