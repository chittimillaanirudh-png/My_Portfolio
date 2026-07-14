/**
 * Centralized API base URL.
 *
 * How it works:
 *  - Local development:  VITE_API_URL is NOT set → API_BASE = ""
 *                        Vite's dev-server proxy (vite.config.js) intercepts every
 *                        "/api/*" request and forwards it to http://localhost:3000.
 *                        No code change is needed between dev and prod.
 *
 *  - Production (Vercel): VITE_API_URL is set in Vercel's Environment Variables to
 *                         the deployed backend URL, e.g.:
 *                           VITE_API_URL=https://my-portfolio-backend.railway.app
 *                         All fetch calls resolve to the correct cross-origin URL.
 *
 * Usage in any page/component:
 *   import API_BASE from '../utils/api';
 *   fetch(`${API_BASE}/api/portfolio`)
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
