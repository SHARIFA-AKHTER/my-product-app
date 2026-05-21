# 🛒 E-Commerce Product Hub (Full-Stack Assessment)

A high-performance, robust, and completely type-safe E-Commerce Product Management System built using **Next.js 15 (App Router)**, **TypeScript**, **MongoDB (Mongoose)**, and **Cloudinary**. 

This project fulfills all the core features of user authentication and product CRUD management, along with advanced industry-standard optimization techniques such as API debouncing, strict server-side validation, and global database connection caching.

---

## 🚀 Core Features & Implementation Architecture

### 1. Robust Architecture & Type Safety
* **Next.js App Router & TypeScript:** Completely structured using declarative routing with 100% type safety across frontend components and backend API route handlers.
* **Atomic Design System:** Fully reusable dynamic form elements (`Input.tsx`, `Button.tsx`) keeping UI consistency in check.
* **Database Optimization:** Implemented global Mongoose cached connection patterns to prevent connection pool exhaustion in serverless Vercel runtime environments.

### 2. Secure Authentication System
* **State-of-the-Art JWT Auth:** Secure user login and registration powered by `jsonwebtoken` and `bcryptjs`.
* **HTTP-Only Cookies:** Tokens are securely dispatched and stored via server-side HTTP-Only cookies, mitigating XSS and CSRF risks.
* **Dynamic Route Guarding:** Conditional layout adjustments based on encrypted browser session tokens.

### 3. Advanced Product Management (CRUD)
* **Multi-Variant Public Feed:** Fully functional, responsive grid rendering catalog fetching dynamic records from MongoDB.
* **Merchant Dashboard:** Streamlined data representation utilizing a customized desktop/mobile responsive data table.
* **Secure Permissions:** Server-side evaluation ensuring users can only edit or delete products they personally created.
* **Negative Bound Checks:** Strict Mongoose validations protecting financial parameters (Price/Stock) against negative integer exploitation.

### 4. High-Performance Bonus Features 🌟
* **Smart Search & Categorization:** Partial string matcher logic using Regex `$options: "i"` ensuring seamless client filter updates.
* **Binary Stream Upload Container:** Direct integration with Cloudinary utilizing Node.js Buffers to stream files securely without maintaining physical filesystem temp directories.
* **API Debouncing Layer:** Implemented a 400ms debounce loop on user query inputs to down-regulate unnecessary database stress queries.

---

## 📁 Scalable Directory Layout

```text
├── src/
│   ├── app/                         # Application Layers & API Routes
│   │   ├── (auth)/                  # Auth Authentication Context
│   │   ├── dashboard/               # Private Merchant Space
│   │   ├── products/                # Public Catalog Endpoint
│   │   ├── api/                     # Type-Safe REST Route Handlers
│   │   ├── layout.tsx               # Root Layout Frame
│   │   └── page.tsx                 # Entry Point Landing Catalog
│   ├── components/                  # High-Fidelity UI Layer
│   │   ├── ui/                      # Base Reusable UI Microelements
│   │   ├── Navbar.tsx               # Responsive Header Navigation 
│   │   ├── ProductCard.tsx          # Dynamic Prop-Injected Cards
│   │   └── DashboardTable.tsx       # Secure Operations Log Table
│   ├── lib/                         # Operational Engine Handlers
│   │   ├── dbConnect.ts             # Global Connection Cacher
│   │   ├── cloudinary.ts            # Binary Buffering Pipeline
│   │   └── getAuthUser.ts           # Stateless Token Parser
│   ├── models/                      # Analytical Schema Schematics
│   └── types/                       # Shared Domain Definitions

🛠️ Tech Stack & Dependencies
Framework: Next.js 16 (App Router)

Language: TypeScript 5.x

Database: MongoDB Atlas (via Mongoose)

Styling Engine: Tailwind CSS

Image Cloud Service: Cloudinary SDK

Security & Encryption: BCryptJS, JSONWebToken

Event Notifications: React Hot Toast

🏁 Environment Variables & Configuration
Create a .env.local file in the root directory of the project and supply the following credentials:

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/product_hub

# JWT Encryption Key
JWT_SECRET=your_super_secure_jwt_secret_token_here

# Cloudinary Storage Configurations
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
🧑‍💻 Local Installation Guide
Follow these simple steps to deploy and audit the pipeline locally:

Clone the repository:

git clone [https://github.com/SHARIFA-AKHTER/my-product-app.git]
cd my-product-app

Install the dependencies:
npm install
Initiate the Development Server:


npm run dev
Open http://localhost:3000 inside your browser to inspect the application ecosystem.

Compile Production Build Test:
npm run build

Live Link: https://my-product-app-virid.vercel.app