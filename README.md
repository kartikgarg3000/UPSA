🟢 Unified Payment Status Aggregator (UPSA) 

A real-world payment integration backend · Node.js · Razorpay · MongoDB · Webhooks

UPSA is a backend service that creates payment orders, processes gateway webhooks, and exposes a simple REST API to fetch real-time payment status.
Built exactly like a Payment/Integration Engineer would do in a fintech company.

🚀 Features
🔹 1. Create Payment Orders

REST API to create orders using Razorpay Test Mode

Stores order, amount, provider, and metadata in MongoDB

🔹 2. Webhook Handler

Receives payment.captured webhook events

Parses payload

Updates correct order in MongoDB

Saves raw Razorpay event for audit/troubleshooting

🔹 3. Check Payment Status

Unified API: /api/payments/:orderId

Shows created, paid, or other statuses

Works for any client (mobile/web/backend)

🔹 4. Razorpay Checkout Page (HTML UI)

Includes a beautiful custom checkout.html page with:

Order ID input

Display amount

Auto-filled Razorpay Checkout UI

Payment simulation using test cards/netbanking

Button to check backend payment status

This makes the project fully demo-ready.

🛠️ Tech Stack

Node.js + Express.js

MongoDB + Mongoose

Razorpay Payment Gateway

ngrok for webhook tunneling

HTML + JavaScript for Razorpay Checkout

📁 Project Structure
/src
  /controllers
    paymentController.js
  /services
    razorpayService.js
  /models
    Payment.js
  app.js
checkout.html
package.json

📌 API Endpoints
1️⃣ Health Check
GET /


Response:

{
  "message": "Unified Payment Status Aggregator API Running"
}

2️⃣ Create Payment Order
POST /api/payments/create

Request Body
{
  "amount": 5500,
  "currency": "INR",
  "provider": "razorpay"
}

Success Response
{
  "message": "Order created successfully",
  "orderId": "order_XXXXXXXX",
  "amount": 5500,
  "currency": "INR",
  "provider": "razorpay"
}

3️⃣ Get Payment Status
GET /api/payments/:orderId

Example Response
{
  "orderId": "order_RlCwJDqP72FxmR",
  "status": "paid",
  "provider": "razorpay",
  "amount": 5500,
  "currency": "INR",
  "paymentId": "pay_RlD0vrTz9MrT9I"
}

🧩 Webhook (Razorpay → UPSA)

Razorpay is configured to send events here:

POST /webhooks/razorpay

Supported event:

payment.captured

Webhook Flow

Razorpay sends event

UPSA receives it (via ngrok in local mode)

UPSA updates Payment document in MongoDB

/api/payments/:orderId begins returning paid

💳 Razorpay Checkout (Front-End HTML Demo)

A dedicated checkout.html page allows you to:

Paste Order ID created from backend

Launch Razorpay Checkout

Complete a test payment

Click Check Status to fetch real status via backend API

Supports:

Test Cards

Test NetBanking

Wallets

UPI (Test Mode)

🔧 Environment Variables

Create a .env file:

PORT=5000

MONGO_URI=mongodb://localhost:27017/upsa_db

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyy

WEBHOOK_SECRET=my_webhook_secret


DO NOT upload .env to GitHub.
Use .gitignore.

▶️ Run Locally
1. Install dependencies
npm install

2. Start server with nodemon
npm run dev

3. Start ngrok (for webhooks)
ngrok http 5000


Use the generated URL in Razorpay Dashboard:

https://<ngrok-id>.ngrok-free.app/webhooks/razorpay

🧪 Testing Full Flow
1. Create order (Postman)
POST http://localhost:5000/api/payments/create

2. Use checkout.html to complete payment

Paste orderId → click Pay → success

3. Razorpay sends webhook
4. Check status:
GET http://localhost:5000/api/payments/<orderId>


Status becomes:

"paid"