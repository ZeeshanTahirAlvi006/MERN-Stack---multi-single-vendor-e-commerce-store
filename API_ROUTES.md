# API Routes Specification

All routes are prefixed with `/api`.

## AUTH ROUTES (`/auth`)
| Method | Path        | Description              | Guard       |
|--------|-------------|--------------------------|-------------|
| POST   | /register   | Register user (role in body) | Public      |
| POST   | /login      | Returns JWT token        | Public      |
| GET    | /profile    | Get current user         | JWT         |
| PUT    | /profile    | Update name/password     | JWT         |

## PRODUCT ROUTES (`/products`)
| Method | Path         | Description              | Guard            |
|--------|-------------|--------------------------|------------------|
| GET    | /            | All active products      | Public           |
| GET    | /:id         | Single product           | Public           |
| POST   | /            | Create product           | Vendor/Admin     |
| PUT    | /:id         | Update product           | Owner Vendor     |
| DELETE | /:id         | Soft delete              | Owner Vendor/Admin|
| GET    | /vendor/mine | Vendor's own products    | Vendor           |

## ORDER ROUTES (`/orders`)
| Method | Path            | Description                    | Guard        |
|--------|-----------------|--------------------------------|--------------|
| POST   | /               | Create order + Stripe session  | Customer     |
| GET    | /mine           | Customer's orders              | Customer     |
| GET    | /vendor/sales   | Vendor's received orders       | Vendor       |
| GET    | /               | All orders                     | Admin        |
| GET    | /:id            | Single order                   | Owner/Admin  |
| PUT    | /:id/status     | Update order status            | Vendor/Admin |

## VENDOR ROUTES (`/vendors`)
| Method | Path   | Description              | Guard         |
|--------|--------|--------------------------|---------------|
| GET    | /      | List all vendors         | Admin/Public  |
| GET    | /:id   | Vendor public profile    | Public        |

## ADMIN ROUTES (`/admin`)
| Method | Path         | Description                  | Guard |
|--------|-------------|------------------------------|-------|
| GET    | /stats       | Platform overview stats      | Admin |
| GET    | /users       | All users                    | Admin |
| PUT    | /users/:id   | Toggle user active status    | Admin |
| GET    | /commission  | Commission summary           | Admin |

## UPLOAD ROUTES (`/upload`)
| Method | Path | Description              | Guard  |
|--------|------|--------------------------|--------|
| POST   | /    | Get Cloudinary signed URL| Vendor |
STRIPE WEBHOOK (/stripe/webhook)
 └── POST / → Handle payment confirmation