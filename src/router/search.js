import express from "express";

import search_controller from "../controllers/search/search.js";
const router = express.Router();

router.get("/search",search_controller.search_controller); 
export default router;
