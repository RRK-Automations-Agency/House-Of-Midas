# Shopify Webhook Receiver (example)

This folder contains an example Express webhook receiver that you can deploy to a small server (Heroku, Vercel Serverless Function, Render, or your own host) to receive Shopify webhooks (orders/create, products/update, inventory_levels/update, etc.).

IMPORTANT: Do not put your Shopify Admin API credentials in the client. Use environment variables on the server.

Quick start
1. Create a Node.js process on a server with the following environment variables:
   - SHOPIFY_SHARED_SECRET (your webhook shared secret)
2. Install dependencies and run:
   npm install express body-parser
   node index.js
3. Register the webhook in Shopify Admin (Settings → Notifications → Webhooks) or use the Shopify CLI / Admin API to register the webhook endpoint.

Security
- Verify webhooks using HMAC SHA256 with the SHOPIFY_SHARED_SECRET as shown in index.js.
- Respond with HTTP 200 quickly; process heavy work asynchronously.

This is an example only. Adapt to your infrastructure and use HTTPS in production.
