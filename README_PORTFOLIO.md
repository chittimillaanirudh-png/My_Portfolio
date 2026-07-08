# Anirudh Chittimilla Portfolio

Welcome to the full-stack professional portfolio application for Anirudh Chittimilla. This portfolio is crafted with elegant, ultra-fluid animations, interactive cosmic backgrounds, responsive layouts, and a dedicated admin console to edit your information on the fly.

---

## 🎨 Visual Identity & Colors

This portfolio features a high-contrast, eye-safe space aesthetic pairing deep pitch-black backdrops with two signature high-fidelity neon accent colors:

*   **Neo Green (`#c0ee91`)**: Representing growth and tech-forward energy. Used for glowing hover particles, subheaders, active links, and border highlights.
*   **Peach Orange (`#ff8a7a`)**: Representing warmth and dynamic micro-interactions. Used for primary typography gradients, typing loading screens, buttons, and progress indicators.

---

## 🛠️ Technology Stack

### 1. Frontend
*   **Framework**: React 18+ paired with Vite for rapid building and hot-reloading.
*   **Styling**: Tailwind CSS for atomic utility styling, paired with custom background gradients and modern glassmorphic overlays.
*   **Animations**: Motion (`framer-motion`) handles seamless page transitions, staggered item fade-ins, and button hover states.
*   **Interactive Background**: Custom 2D HTML5 Canvas Particle Engine (`ParticleBg.jsx`) delivering slow, elegant, orbital cosmic physics with a non-laggy cursor gravity-pull effect.
*   **Icons**: Lucide React.

### 2. Backend
*   **Server**: Node.js with Express.js (`server.js`) serving both the REST APIs and static compiled SPA client-side resources.
*   **Database / Persistence**: File-system-based structured persistence using local JSON databases (`src/data/portfolio.json`). This ensures full control and dynamic portability.
*   **Admin Console**: Fully built-in authorization dashboard (`pages/Admin.jsx`) allowing secure real-time additions and removal of your projects, skills, and copy without touching any code.

---

## ⚙️ Running & Hosting Your Application

### 💻 Local Run (On your Laptop/PC)
Once you export this complete zip file and unpack it, follow these simple steps to run it locally:

1.  **Install Node.js**: Ensure you have Node.js installed on your machine.
2.  **Install Dependencies**: Open your terminal in the extracted folder and run:
    ```bash
    npm install
    ```
3.  **Run Dev Mode**: Spin up the full-stack development server with:
    ```bash
    npm run dev
    ```
    This starts the Express backend and the Vite frontend on [http://localhost:3000](http://localhost:3000)!

---

### 🌐 Hosting the Backend & Frontend (e.g., on Render or Vercel)

Yes! To make your admin updates work in production on a public URL, you need **backend hosting** to run your Node/Express server and store your portfolio edits:

#### Option A: Hosting with Render (Recommended for full-stack)
Render is an excellent, free-tier-friendly cloud platform that can host full-stack Node.js servers out of the box:
1.  Push your code to a private or public **GitHub Repository**.
2.  Log into [Render.com](https://render.com) and click **New > Web Service**.
3.  Connect your GitHub repository.
4.  Configure the settings:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm run build`
    *   **Start Command**: `npm run start`
5.  Under the **Environment** tab, add your custom variables:
    *   `ADMIN_ID` (Your custom login ID)
    *   `ADMIN_PASSWORD` (Your secure login password)
6.  Click **Deploy**. Render will host both your backend API and your beautiful React frontend together on a single URL!

#### Option B: Serverless (Frontend on Vercel + Backend on Render/Railway)
*   **Frontend**: You can deploy the static frontend separately to Vercel/Netlify for super-fast global loading.
*   **Backend**: Run the Express server on Render to handle admin storage, and update your React frontend's API calls to target the Render backend URL.
