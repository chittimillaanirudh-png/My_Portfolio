# Anirudh Chittimilla Portfolio

Welcome to the full-stack professional portfolio application for Anirudh Chittimilla. This portfolio is crafted with an elegant editorial layout, premium vintage paper textures, custom SVG branding, responsive layouts, and a dedicated admin console to edit your information on the fly.

---

## 🎨 Visual Identity & Colors

This portfolio features a high-fidelity editorial print aesthetic pairing a warm paper texture with a rich dark ink tone:

*   **Warm Paper (`#e7d2b5`)**: Serving as the solid background color, overlaid with a custom SVG noise/paper texture that covers the entire website.
*   **Dark Ink (`#1f1e1a`)**: Used for all typography, border lines, icons, and SVG illustrations to replicate a premium print newspaper look.
*   **Ink Texture**: Custom text masking overlay applied automatically to all headings to give them a natural print/paint-textured grain.

---

## 🛠️ Technology Stack

### 1. Frontend
*   **Framework**: React 18+ paired with Vite for rapid building and hot-reloading.
*   **Styling**: Tailwind CSS for atomic utility styling, utilizing transparent layouts to reveal the global paper background.
*   **Animations**: Motion (`framer-motion`) handles seamless page transitions, staggered item fade-ins, and button hover states.
*   **Visual Assets**: High-resolution hand-sketched illustration background and portrait imagery dynamically loaded.
*   **Custom Branding**: Dynamic SVG Logo component drawing a circular monogram logo.

### 2. Backend
*   **Server**: Node.js with Express.js (`server.js`) serving both the REST APIs and static compiled SPA client-side resources.
*   **Database / Persistence**: MongoDB Atlas cloud database with local JSON file fallback (`backend/data/portfolio.json`).
*   **Admin Console**: Fully built-in authorization dashboard (`pages/Admin.jsx`) allowing secure real-time additions and removal of your projects, skills, and copy without touching any code.

---

## ⚙️ Running & Hosting Your Application

### 💻 Local Run (On your Laptop/PC)
Once you export this complete folder, follow these simple steps to run it locally:

1.  **Install Node.js**: Ensure you have Node.js (version 22+) installed on your machine.
2.  **Install Dependencies**: Open your terminal in the root directory and run:
    ```bash
    npm install
    ```
3.  **Run Dev Mode**: Spin up the development environment with:
    ```bash
    npm run dev
    ```
    This starts the Node backend server on port 3000 and the Vite frontend on port 5173!

---

### 🌐 Hosting the Backend & Frontend (e.g., on Render or Vercel)

To make your admin updates work in production on a public URL, you need **backend hosting** to run your Node/Express server and store your portfolio edits:

#### Option A: Hosting with Render (Recommended for full-stack)
Render is an excellent, free-tier-friendly cloud platform that can host full-stack Node.js servers out of the box:
1.  Push your code to a **GitHub Repository**.
2.  Log into [Render.com](https://render.com) and click **New > Web Service**.
3.  Connect your GitHub repository.
4.  Configure the settings:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm run build`
    *   **Start Command**: `npm run start`
5.  Under the **Environment** tab, add your custom variables:
    *   `ADMIN_ID` (Your custom login ID)
    *   `ADMIN_PASSWORD` (Your secure login password)
    *   `MONGODB_URI` (Your MongoDB Atlas connection URI)
6.  Click **Deploy**. Render will host both your backend API and your React frontend together on a single URL!
