import express from "express";
import {
  createPaymentOrder,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/create
router.post("/create", createPaymentOrder);

// GET /api/payments/:orderId
router.get("/:orderId", getPaymentStatus);

export default router;
