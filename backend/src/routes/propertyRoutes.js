import express from "express";
import { addProperty, getProperties } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addProperty);
router.get("/", getProperties);

export default router;