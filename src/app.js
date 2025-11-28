import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes.js";
import connectDB from "./config/db.js";
import { razorpayWebhookHandler } from "./controllers/paymentController.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Webhook route FIRST with raw body
app.post(
  "/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler
);

// Other middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Unified Payment Status Aggregator API Running" });
});

// Routes
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
