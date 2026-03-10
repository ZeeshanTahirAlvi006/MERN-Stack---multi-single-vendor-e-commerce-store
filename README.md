# BrandStore - Multi-Vendor E-Commerce Platform

A fully featured, full-stack multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides dedicated portals for Customers, Vendors, and Administrators, enabling a complete online marketplace experience.

## Features

- **Multi-Role System:**
  - **Customers:** Browse products, add to cart, secure checkout via Stripe, manage orders and profile.
  - **Vendors:** Dedicated dashboard, manage products (add/edit/delete), handle stock, view sales statistics, and track revenue.
  - **Admins:** Comprehensive dashboard to oversee the entire platform. Manage users (customers & vendors), view all orders, and track platform revenue.
- **Secure Authentication:** JWT-based authentication with role-based access control (RBAC).
- **Payment Processing:** Integrated with Stripe for secure, seamless checkout and payment webhooks.
- **Image Management:** Cloudinary integration for robust product image uploading and hosting.
- **Responsive Design:** Beautiful, mobile-first UI built with Tailwind CSS.
- **State Management:** Managed efficiently using Redux Toolkit.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, Lucide React (Icons).
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.
- **Third-Party Services:** Stripe (Payments), Cloudinary (Image Hosting).

## Directory Structure

```text
e-commerce-project-mern/
├── client/          # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route components for all roles
│   │   ├── redux/      # Redux slices and store configuration
│   │   ├── services/   # Axios API calls
│   │   └── App.jsx
│   └── package.json
└── server/          # Backend Express application
    ├── config/         # DB connection and Cloudinary/Stripe configs
    ├── controllers/    # Route controllers
    ├── middleware/     # Auth and error handling middlewares
    ├── models/         # Mongoose schemas
    ├── routes/         # Express routing definitions
    ├── services/       # Core business logic
    └── index.js        # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Stripe Account (for payments)
- Cloudinary Account (for image hosting)

### Installation

1. Clone the repository and navigate into it:
   ```bash
   git clone <repository-url>
   cd e-commerce-project-mern
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create `.env` files in both the `server` and `client` directories.

**`server/.env`:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:5173
```

**`client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Running the Application

1. Start the Backend Server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the Frontend Development Server:
   ```bash
   cd client
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend will be running on `http://localhost:5000`.

## License
MIT
