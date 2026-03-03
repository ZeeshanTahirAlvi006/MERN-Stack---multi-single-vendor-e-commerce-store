# Implementation Roadmap (Project Timeline)

## Phase 1: The Skeleton

| Task | Owner | Acceptance Criteria |
| :--- | :--- | :--- |
| Init Git repo (monorepo) client/ and server/ folders | - | committed |
| Create Express server + \`/health\` route | Backend Work | \`GET /api/health\` returns 200 \`{ok: true}\` |
| Connect MongoDB Atlas | Backend Work | \`mongoose.connect()\` succeeds, logged |
| Create User, Product, Order models | Backend Work | Schemas created with all fields |
| Bootstrap React with Vite + Tailwind | Frontend Work | App renders with Tailwind classes |
| Setup react-router-dom | Frontend Work | \`/\`, \`/auth/login\`, \`/auth/register\` routes exist |
| Setup Redux store with cart + auth slices | Frontend Work | Redux WorkTools shows initial state |
| Setup Axios instance with JWT interceptor | Frontend Work | Interceptor adds Authorization header |
| Setup dotenv + STORE_MODE config | Backend Work | Both modes toggle without code change |

## Phase 2: The Engines

| Task | Owner | Acceptance Criteria |
| :--- | :--- | :--- |
| \`POST /auth/register\` and \`/auth/login\` | Backend Work | Returns JWT token, bcrypt password stored |
| authMiddleware + roleMiddleware | Backend Work | Protected route rejects invalid tokens |
| Register & Login React pages | Frontend Work | User can register, login, token stored |
| ProtectedRoute component | Frontend Work | Unauthenticated redirect to \`/auth/login\` |
| CRUD product API routes | Backend Work | All 5 endpoints working with Postman |
| Cloudinary unsigned upload integration | Full Stack | Image URL stored in \`product.images[]\` |
| Vendor Add Product page | Frontend Work | Form submits, product appears in DB |
| Product Grid (Home + \`/products\` page) | Frontend Work | Products load from API, displayed in grid |
| Product Detail page | Frontend Work | Single product displayed, Add to Cart works |

## Phase 3: The Flow

| Task | Owner | Acceptance Criteria |
| :--- | :--- | :--- |
| Cart page with Redux + localStorage sync | Frontend Work | Cart persists on page refresh |
| \`POST /api/orders\` + Stripe session creation | Backend Work | Stripe checkout URL returned |
| Checkout page → Stripe redirect | Frontend Work | Customer lands on Stripe hosted page |
| Stripe webhook → update order status | Backend Work | \`Order.status = 'Paid'\` after payment |
| Order success page | Frontend Work | Confirmation shown postpayment |
| My Orders page (customer) | Frontend Work | Order list with status badges shown |
| Vendor Dashboard stats | Full Stack | Revenue, orders, top products displayed |
| Vendor Sales History page | Full Stack | Itemised sales with commission breakdown |

## Phase 4: Polish & Deploy

| Task | Owner | Acceptance Criteria |
| :--- | :--- | :--- |
| Admin dashboard + user management | Backend + Frontend | Admin can deactivate users/vendors |
| Search + filter on product listing | Frontend Work | Results update in real-time |
| Mobile responsiveness audit | Frontend Work | All key pages pass 375px viewport test |
| Error handling + loading states | Frontend Work | Spinners, empty states, toast notifications |
| Deploy backend to Render | Backend Work | API live at render.com URL |
| Deploy frontend to Vercel | Frontend Work | React app live at Vercel, app URL |
| Configure env vars on both platforms | Team Lead | No hardcoded secrets in codebase |
| End-to-end demo walkthrough | Full Team | Complete buyer and vendor journey works |
