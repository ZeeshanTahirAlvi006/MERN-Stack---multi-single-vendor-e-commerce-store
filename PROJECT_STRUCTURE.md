# Project Folder Structure

```
Final Project/
 ├── client/ # React Frontend
 │ ├── public/
 │ └── src/
 │ ├── api/ # Axios instance + API calls
 │ ├── app/ # Redux store setup
 │ ├── components/ # Reusable UI components
 │ │ ├── common/ # Button, Input, Modal, Spinner
 │ │ ├── layout/ # Navbar, Footer, Sidebar
 │ │ └── product/ # ProductCard, ProductGrid
 │ ├── features/ # Redux slices
 │ │ ├── authSlice.js
 │ │ ├── cartSlice.js
 │ │ └── productSlice.js
 │ ├── pages/ # Route-level page components
 │ │ ├── auth/ # Login, Register
 │ │ ├── customer/ # Home, Product, Cart, Orders
 │ │ ├── vendor/ # Dashboard, AddProduct, Sales
 │ │ └── admin/ # AdminDashboard, UserMgmt
 │ ├── routes/ # ProtectedRoute, RoleRoute
 │ ├── hooks/ # useAuth, useCart custom hooks
 │ └── utils/ # formatCurrency, validators
 │
 └── server/ # Node.js + Express Backend
 ├── config/ # db.js, cloudinary.js, stripe.js
 ├── controllers/ # authController, productController
 ├── middleware/
 │ ├── authMiddleware.js # JWT verify
 │ ├── roleMiddleware.js # Admin / Vendor / Customer guard
 │ └── errorMiddleware.js # Global error handler
 ├── models/ # Mongoose schemas
 │ ├── User.js
 │ ├── Product.js
 │ └── Order.js
 ├── routes/ # Express routers
 │ ├── authRoutes.js
 │ ├── productRoutes.js
 │ ├── orderRoutes.js
 │ └── vendorRoutes.js
 ├── services/ # Business logic layer
 ├── utils/ # generateToken, sendEmail
 └── index.js # Entry point
```
