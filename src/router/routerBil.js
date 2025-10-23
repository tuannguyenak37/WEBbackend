import express from "express";
import delay from "../middleware/delay.js";
import authJWT from "../middleware/authJWT.js";
import bill_Controller from "../controllers/bill/hoadon.js";
import authAdmin from "../middleware/authAdmin.js";
import getBillDetail from "../controllers/bill/getBillDetail.js";
import uploadlist from "../middleware/upload_list.js";
import feedback from "../controllers/bill/feedback.js";
import checkbill from "../service/utils/checkbill.js";
const router = express.Router();
router.get("/getallbill", authJWT, bill_Controller.getallBill);
router.get("/getallbillshop", authJWT, bill_Controller.getallBill_shopid);
router.put("/updatebill", authJWT, authAdmin, bill_Controller.updateBillStatus);
router.put("/updateBillRefunded", authJWT, bill_Controller.updateBillRefunded);
router.get("/getBillDetail/:hoadon_id", authJWT, getBillDetail.getBillDetail);
router.post(
  "/newfeedback",
  authJWT,
  uploadlist.array("image_url", 5),
  feedback.newfeedback_controller
);
router.get("/checkfeedback", authJWT, checkbill.check_feedback);
router.get("/getfeedback", authJWT, feedback.get_feedback_controller);
router.get("/feedbackofshop/:shop_id", feedback.feedback_of_shop_controller);

router.get(
  "/averagerating/:sanpham_id",
  feedback.get_average_rating_controller
);
export default router;
