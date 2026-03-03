# Page Inventory

| Page / Route | Access | Mode | Key Components |
|---|---|---|---|
| `/` (Home) | Public | Both | Hero banner, Featured products grid, Category filter bar |
| `/products` | Public | Both | Product Grid with search, filter by category/price, pagination |
| `/products/:id` | Public | Both | Product detail, image gallery, Add to Cart, vendor info |
| `/cart` | Customer | Both | Cart items, qty controls, subtotal, Checkout button |
| `/checkout` | Customer | Both | Shipping address form → redirect to Stripe |
| `/order-success` | Customer | Both | Order confirmation + order ID |
| `/my-orders` | Customer | Both | List of past orders with status badges |
| `/auth/login` | Guest | Both | Email + password form, link to register |
| `/auth/register` | Guest | Both | Name, email, password, role dropdown (multi: Buyer/Seller) |
| `/vendor/dashboard` | Vendor | Both | Stats cards, recent orders, stock alerts |
| `/vendor/products` | Vendor | Both | Product table with edit/delete actions |
| `/vendor/products/add` | Vendor | Both | Add product form + Cloudinary upload |
| `/vendor/sales` | Vendor | Both | Sales history, revenue breakdown, commission display |
| `/admin/dashboard` | Admin | Both | Platform stats: users, orders, revenue, commission |
| `/admin/users` | Admin | Multi | User table with role, active status toggle |
| `/vendors/:id` | Public | Multi | Vendor public store page with their products |
