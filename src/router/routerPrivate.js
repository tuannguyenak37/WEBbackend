import express from "express";
import authMiddleware from "../middleware/authJWT.js";
import delay from "../middleware/delay.js";
import authAdmin from "../middleware/authAdmin.js";
import getall_User from "../controllers/users.js";
import sanPham_controllers from "../controllers/sanPham.js";
import Kho_controlers from "../controllers/kho.js";
const router = express.Router();
router.use(authMiddleware, authAdmin);
router.use(delay);
router.get("/admin/getall", getall_User.getAll_User);
router.post("/admin/addSanpham", sanPham_controllers.addSan_PhamController);
router.delete(
  "/admin/deletesanpham/:sanpham_id",
  sanPham_controllers.delete_San_PhamController
);
router.get("/admin/xemsanpham", sanPham_controllers.xem_SanPham_Controller);
router.post("/admin/addkho", Kho_controlers.addKho_Controller);
router.put("/admin/suakho/:kho_id", Kho_controlers.suaKho);
export default router;
