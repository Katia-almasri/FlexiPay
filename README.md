# 💳 FlexiPay – Custom Payment Gateway

**FlexiPay** is a scalable and secure custom payment gateway built with **Node.js**, **Express**, and **MongoDB**.  
It acts as a central platform to process payments through various providers including **Stripe**, **PayPal**, and digital wallets.

FlexiPay is designed to support **platform-owned payment strategies**, where the system handles incoming payments on behalf of merchants, and redistributes balances on a weekly basis via scheduled payout jobs.

This solution is ideal for **marketplaces, SaaS platforms**, or any product requiring modular and extendable payment integrations.

---

## 📦 Features

- ✅ **Multi-Provider Support** (Stripe, PayPal, digital wallets)
- 🧩 **Modular Payment Method Architecture**
- 🔐 **Credential Management** for Customers & Merchants
- 📑 **Transaction Metadata Logging**
- 🔄 **Webhook Support** (Stripe & PayPal events)
- 🧮 **Scheduled Weekly Payout Job** (via CRON)
- ⚙️ **Extensible** for new gateways (Apple Pay, Google Pay, etc.)
- 🔍 **API Filtering, Pagination, Sorting** for transaction queries

---

## 🗂️ Project Structure

```bash
flexipay/
│
├── abstracts/            # The main interfaces
├── config/               # The basic configuration (database, paypal..)
├── controllers/          # The used controllers using the MVC pattern
├── enums/                # Basic Enumerations in the system
├── errors/               # Main Errors in that catched in the system using the entroalized error handling
├── jobs/                 # The Scheduled jobs used in the system / mainly for the on-prem hosting
├── middleware/           # The basic authentication and authorization rules
├── models/               # Mongoose models (User, Transaction, PaymentMethod)
├── resources/            # To get a unified return types to the endpoint API
├── routes/               # API endpoints (payments, webhooks, merchants)
├── services/             # Logic for Stripe/PayPal integrations, payout job
├── utils/                # Utility functions (pagination, response formatter)
├── validations/          # The input validations throught the post/put requests
├── config/               # Stripe & PayPal credentials/config
└── index.js              # Entry point
```
---

## ⚙️ Setup & Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Katia-almasri/FlexiPay.git
   cd flexipay
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment variables
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   STRIPE_SECRET=your_stripe_key
   PAYPAL_CLIENT_ID=...
   PAYPAL_SECRET=...
   ```
4. Run the server
   ```bash
   npm run start
   npm run dev 
   ```
---

## 🚀 Live Deployment
This project is deployed on Microsoft Azure App Service.
🔗 Live Demo (private) (optional link)

---
## 🔒 Security & Architecture Notes
- Environment-based config for provider credentials
- Modular service structure to allow plug-and-play gateway extensions
- Scheduler job runs via Node-Cron or Azure Timer Trigger (future)
- Compatible with CI/CD pipelines (GitHub Actions ready)

---
## 📫 Author
Katia Almasri
Backend Developer – FinTech | Cloud | APIs
📧 katiaalmasri2@gmail.com
🌐 GitHub | LinkedIn

---
## 📝 License
MIT – Free to use and modify under terms of the license




