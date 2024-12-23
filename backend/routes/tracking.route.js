import { Router } from "express";
import {
  getTrackings,
  getTrackingById,
} from "../controllers/tracking.controller.js";

const router = Router();

router.get("/all", getTrackings);
router.get("/:id", getTrackingById);

export default router;
