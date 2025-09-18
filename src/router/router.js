import express from "express";
import user from "../controllers/users.js";
import delay from "../middleware/delay.js";
const router = express.Router();

router.use(delay);

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "xin chao he he",
  });
});
router.post("/createUser", user.createUserController);

router.post("/Login", user.User_Login);

export default router;
