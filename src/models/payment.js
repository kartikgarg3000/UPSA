import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["razorpay"], // later: ["razorpay", "stripe", "paypal"]
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed"],
      default: "created",
    },
    rawData: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
