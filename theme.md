# 🌑 Project "The Bleed": E-Commerce Theme Specification
**Visual Identity:** Stranger Things Season 5 (Hawkins x Upside Down)
**Core Aesthetic:** Industrial Apocalypse, 1987 Grit, and Organic Decay.

---

## 🎨 1. Global Color Palette
These colors should be mapped to your `tailwind.config.js` or CSS variables.

| Name             | Hex Code   | Usage                                     |
| :--------------- | :--------- | :---------------------------------------- |
| **The Void** | `#050505`  | Deepest background, page body             |
| **Ash Grey** | `#2D3139`  | Secondary surfaces, card backgrounds      |
| **Rift Red** | `#E61E2A`  | CTAs, primary buttons, price highlights   |
| **Necrotic Vine**| `#1A0A1F`  | Dark purple gradients for hover effects   |
| **Signal White** | `#E5E7EB`  | Main body text (slightly muted)           |
| **Warning Amber**| `#FFB800`  | Critical alerts, stock warnings           |

---

## 🖼️ 2. Typography
* **Headings:** `ITC Benguiat` (or `Serif` fallbacks). 
    * *Style:* High letter-spacing, slight outer glow on H1.
* **Body:** `Inter` or `Roboto Mono`.
    * *Style:* Clean, sans-serif for high readability in e-commerce contexts.
* **Labels/Tags:** `JetBrains Mono`.
    * *Style:* Small, all-caps, looks like a 1980s computer printout.

---

## ✨ 3. Signature Animations

### A. The "Flicker" Entry
**Trigger:** On page load or component mount.
* **Behavior:** Elements don't just fade in; they "power on." 
* **Sequence:** Opacity shifts: `0% -> 100% -> 30% -> 100% -> 80% -> 100%`.
* **Duration:** 0.6s.

### B. The "Rift" Hover Effect
**Trigger:** Hovering over Product Cards or Buttons.
* **Behavior:** A `box-shadow` expands outward in `Rift Red` with a blur radius of 15px.
* **Movement:** The button/card shifts +2px upwards.

### C. The "Ash" Background (Particle System)
**Trigger:** Persistent Global Background.
* **Behavior:** Small, low-opacity white/grey particles (`spores`) drifting slowly downwards.
* **Logic:** `opacity: 0.2`, `transform: translateY(100vh)`.

---

## ⏳ 4. Loading States & Screens

### Initial App Loader: "The Clock"
* **Visual:** Silhouette of the Grandfather Clock.
* **Animation:** The clock hands spin rapidly in a blurred motion. Every 1 second, the screen flashes a dim red light (the heartbeat).
* **Text:** "Connecting to the Rift..."

### Section Loaders: "The Pulse"
* **Visual:** A horizontal line (like an EKG monitor).
* **Animation:** A red pulse travels across the line from left to right as data is fetched.

---

## 📂 5. Page-Specific Theme Details

### 🏠 Home Page
* **Hero Section:** High-contrast image with a "Glitch" effect on the text.
* **Scrolling:** Implement "Parallax" on background vines so they move slower than the products.

### 📦 Product Listing (The Scavenge)
* **Filters:** Side navigation uses "Metal Toggle" UI.
* **Cards:** `Glassmorphism` effect (Dark grey background, 10% opacity) with a thin red border.

### 👤 Vendor Dashboard (The Lab)
* **Atmosphere:** CRT Monitor effect (Scanlines).
* **Scanlines:** Overlay a semi-transparent PNG of horizontal lines over the dashboard container.
* **Data:** Graphs should use sharp, glowing neon green lines.

### 🛒 Checkout (The Gateway)
* **Progress Bar:** A "growing vine" that starts at 'Shipping' and reaches 'Payment'.
* **Success Page:** A sudden transition from dark mode to a "Morning in Hawkins" (lighter grey) to signify a successful escape/purchase.

---

## 🛠️ 6. Implementation Snippets (CSS/Tailwind)

### The Glitch Keyframe
```css
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

Ash partical style
.ash-particle {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
  position: fixed;
  animation: fall linear infinite;
}