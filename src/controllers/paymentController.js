import Payment from "../models/payment.js";
import { createRazorpayOrder } from "../services/razorpayService.js";
import crypto from "crypto";

// Create payment order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency, provider } = req.body;

    if (!amount || !provider) {
      return res
        .status(400)
        .json({ message: "Amount and provider are required" });
    }

    if (provider !== "razorpay") {
      return res
        .status(400)
        .json({ message: "Only Razorpay supported in current version" });
    }

    const order = await createRazorpayOrder({ amount, currency });

    const payment = await Payment.create({
      provider,
      orderId: order.id,
      amount,
      currency: currency || "INR",
      status: "created",
      rawData: order,
    });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: order.id,
      amount: payment.amount,
      currency: payment.currency,
      provider,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.json({
      orderId: payment.orderId,
      status: payment.status,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
      paymentId: payment.paymentId || null,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Razorpay webhook handler
export const razorpayWebhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const bodyBuffer = req.body; // Buffer, because of express.raw
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyBuffer)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(bodyBuffer.toString());

    // Handle payment captured event
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      await Payment.findOneAndUpdate(
        { orderId },
        {
          status: "paid",
          paymentId,
          rawData: paymentEntity,
        }
      );
    }

    // TODO: handle other events like payment.failed, refund, etc

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
