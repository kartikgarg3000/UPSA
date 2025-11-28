import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // ensure .env is loaded here as well

console.log("🔍 RAZORPAY_KEY_ID in service:", process.env.RAZORPAY_KEY_ID ? "FOUND" : "NOT FOUND");

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("❌ Missing Razorpay env vars:", {
      key_id,
      key_secret_present: !!key_secret,
    });
    throw new Error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

export const createRazorpayOrder = async ({ amount, currency }) => {
  const razorpay = getRazorpayInstance();

  const options = {
    amount: amount * 100, // in paise
    currency: currency || "INR",
  };

  const order = await razorpay.orders.create(options);
  return order;
};
