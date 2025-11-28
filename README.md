Unified Payment Status Aggregator (UPSA)

A lightweight Node.js service that creates Razorpay payment orders, processes webhooks, and provides an API to fetch real-time payment status.

🚀 Features

Create Razorpay payment orders via REST API

1. Store transactions in MongoDB

2. Process payment.captured webhooks

3. Retrieve payment status using orderId

4. Simple test payment UI (checkout.html) using Razorpay Checkout

5. Clean, extensible architecture for adding more payment providers

📌 Tech Stack

Node.js, Express

MongoDB, Mongoose

Razorpay Payment Gateway

Webhooks

HTML + Razorpay Checkout

🔗 API Endpoints

Create Payment Order:
POST /api/payments/create

{
  "amount": 5500,
  "currency": "INR",
  "provider": "razorpay"
}

Get Payment Status:
GET /api/payments/:orderId


Example response:

{
  "orderId": "order_xxx",
  "status": "paid",
  "amount": 5500,
  "provider": "razorpay",
  "paymentId": "pay_xxx"
}

🧪 Testing Payments

Use checkout.html:

Create order via API

Open checkout.html in browser

Paste orderId

Complete test payment

Status updates automatically via webhook

⚙️ Environment Variables

Create .env:

MONGO_URI=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
WEBHOOK_SECRET=
PORT=5000

▶️ Run Locally
npm install
npm run dev


Server runs at http://localhost:5000