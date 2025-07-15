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
├── models/               # Mongoose models (User, Transaction, PaymentMethod)
├── routes/               # API endpoints (payments, webhooks, merchants)
├── services/             # Logic for Stripe/PayPal integrations, payout job
├── utils/                # Utility functions (pagination, response formatter)
├── jobs/                 # Scheduled tasks (weekly payouts)
├── config/               # Stripe & PayPal credentials/config
└── app.js                # Entry point
