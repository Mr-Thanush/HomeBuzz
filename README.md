# HomeBuzz 🏡🐝

HomeBuzz is a full-stack e-commerce web application dedicated to discovering and purchasing locally sourced, premium homemade food, artisan pickles, and unique handmade crafts. The platform connects verified home-bakers, chefs, and creators directly with consumers looking for authentic, non-mass-produced goods.

---

## ✨ Features

*   **Curated Homepage Discoverability:** 
    *   **Top Sellers:** Dynamic horizontal product tracks filtering items with top review counts and ratings.
    *   **Latest Deals:** Automatically sorted product showcases highlighting the newest platform additions.
    *   **Browse Categories:** Instant dynamic filtering via structured grid navigation tags.
*   **Persistent Liked List (Cart Integration):** 
    *   Responsive, card-based layout featuring left-aligned product thumbnails and right-aligned detail text modules.
    *   Real-time quantity increments/decrements with live local state synchronization and stock safety ceilings.
    *   Granular save-count checkpoints powered by asynchronous Redux backend actions.
*   **Advanced Price Engine:** Automatic computational billing calculations updating **Subtotals, GST (5%), Delivery Fees** (with conditional adjustments like FREE shipping above ₹500), and final overall payable balances instantly.
*   **Fluid Global Shell Layout:** Fixed-position cross-viewport navigation utilities incorporating relative counter notification badges tracking item updates seamlessly.

---

## 🛠️ Technology Stack

### Frontend Architecture
*   **Library:** React (Functional components, custom Hooks, layout effects lifecycle monitoring)
*   **State Management:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux` slicing structures)
*   **Routing System:** React Router DOM (`useNavigate`, `useLocation` route adapters)
*   **Visual Assets / Icons:** React Icons (`react-icons/bs`, `react-icons/fi`, `react-icons/hi2`, `react-icons/fa`)
*   **Alert Broadcast Notification Engine:** React Toastify (`react-toastify`)
*   **Styling Foundation:** Modular CSS Layout Frameworks with Custom Variable CSS-Theming Layer

### Backend & Database (Data Layer)
*   **Database:** MySQL (Relational management tables architecture)
*   **Key Schemas:** 
    *   `users` table: Supports tiered credential structures (`role = 'user'` or `'admin'`) alongside profile tracking schemas.
    *   `products` table: Manages attributes including statistical weights, dimensions, and operational inventory fields.

---

## 🎨 Visual System & UI Specs

The application uses an intentional color palette crafted to reflect organic freshness and culinary quality:

| Property | Value | Description |
| :--- | :--- | :--- |
| `--accent` | `#0f766e` | Rich teal theme highlight accent |
| `--accent-soft` | `#ccfbf1` | Light background tint highlights |
| `--text-primary`| `#1e293b` | Slate black for prominent text headings |
| `--text-muted` | `#64748b` | Mid-slate gray for product descriptions |
| **Theme Gradient** | `linear-gradient(180deg, #f1f8f4, #e8f5e9)` | Soft, organic green background gradient |

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v16.x or higher)
*   **npm** or **yarn**
*   **MySQL Server** (Instance running locally or hosted)

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/Mr-Thanush/HomeBuzz.git](https://github.com/Mr-Thanush/HomeBuzz.git)
   cd HomeBuzz


	1.	Install Frontend dependencies
         npm install

	2.	Database Configuration
          Open your database management client or terminal workspace and initialize your scheme environment variables:
          CREATE DATABASE homebuzz;
          USE homebuzz;

         -- Import database schemas here

	3.	Running the Application
          npm start server
